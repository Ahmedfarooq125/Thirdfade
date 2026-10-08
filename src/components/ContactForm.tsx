import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, ShieldCheck, RefreshCw } from 'lucide-react';

type Config = { siteKey: string; preview: boolean; email?: string; phone?: string; ready: boolean };
type TurnstileAPI = { render: (node: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void; reset: (id: string) => void };
declare global { interface Window { turnstile?: TurnstileAPI } }

export function ContactForm() {
  const [config, setConfig] = useState<Config | null>(null);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [retry, setRetry] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const sending = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/contact-config', { signal: controller.signal }).then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(setConfig).catch(e => { if (e.name !== 'AbortError') setMessage('The form is temporarily unavailable. Please try again later.'); });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!config?.siteKey || !container.current) return;
    let canceled = false;
    setCaptchaError(''); setToken('');
    const mount = () => {
      if (canceled || !container.current || !window.turnstile || widget.current) return;
      widget.current = window.turnstile.render(container.current, {
        sitekey: config.siteKey, theme: 'light', size: 'flexible', action: 'contact',
        callback: (value: string) => { setToken(value); setCaptchaError(''); },
        'expired-callback': () => setToken(''),
        'error-callback': () => { setToken(''); setCaptchaError('Verification could not load. Please retry.'); },
      });
    };
    let script = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
    if (!script) {
      script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.dataset.turnstile = 'true'; document.head.appendChild(script);
    }
    const fail = () => setCaptchaError('Verification could not load. Check your connection and retry.');
    script.addEventListener('load', mount); script.addEventListener('error', fail); mount();
    const timeout = window.setTimeout(() => { if (!widget.current) fail(); }, 15000);
    return () => { canceled = true; clearTimeout(timeout); script?.removeEventListener('load', mount); script?.removeEventListener('error', fail); if (widget.current) window.turnstile?.remove(widget.current); widget.current = null; };
  }, [config, retry]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    if (!token) { setMessage('Complete the verification before sending.'); return; }
    const form = event.currentTarget;
    sending.current = true; setBusy(true); setMessage('');
    try {
      const values = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, token }), signal: AbortSignal.timeout(35000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Your message could not be sent. Please try again.');
      setMessage(result.preview ? 'Preview checked successfully. No message was sent.' : result.emailQueued ? 'Thank you. Your enquiry has been received. Our team will review it shortly.' : 'Thank you. Your project enquiry has been received.');
      if (!result.preview) form.reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Please try again.'); }
    finally { sending.current = false; setBusy(false); setToken(''); if (widget.current) window.turnstile?.reset(widget.current); }
  }
  return <div className="contact-form-wrap">
    {config?.email && <a className="contact-address" href={`mailto:${config.email}`}>{config.email} <ArrowUpRight size={18}/></a>}
    {config?.phone && <p>{config.phone}</p>}
    <form className="project-form" onSubmit={submit}>
      <div className="form-row"><label>Your name <span>*</span><input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Alex Morgan" /></label><label>Email address <span>*</span><input name="email" autoComplete="email" type="email" required maxLength={254} placeholder="alex@company.com" /></label></div>
      <div className="form-row"><label>Phone number <span className="optional">optional</span><input name="phone" autoComplete="tel" type="tel" maxLength={40} placeholder="Include your country code" /></label><label>What do you need?<select name="service" defaultValue="Brand identity"><option>Brand identity</option><option>Website design</option><option>Mobile app</option><option>E-commerce</option><option>SEO & growth</option><option>Something else</option></select></label></div>
      <label>Tell us about your project <span>*</span><textarea name="message" required minLength={20} maxLength={5000} rows={4} placeholder="Your idea, what you want to achieve, and when you’d like to start…" /></label>
      <label className="form-honeypot" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="form-consent"><input name="consent" type="checkbox" required />I agree to be contacted about this enquiry.</label>
      <div className="captcha-area"><div className="captcha-label"><ShieldCheck size={17}/> A quick human check</div><div ref={container} />{captchaError && <div role="alert">{captchaError} <button type="button" className="text-button" onClick={() => { const script = document.querySelector('script[data-turnstile]'); if (!window.turnstile) script?.remove(); setRetry(v => v + 1); }}><RefreshCw size={14}/>Retry</button></div>}</div>
      {config?.preview && <p className="form-note">Preview mode · CAPTCHA uses a test key. Messages are not sent.</p>}
      {config && !config.ready && !config.preview && <p className="form-note">Contact form coming soon.</p>}
      <button className="chrome-button chrome-button-primary submit-project" disabled={busy || !config?.ready || !token} type="submit">{busy ? 'Sending…' : config?.preview ? 'Test enquiry' : 'Send enquiry'} <ArrowUpRight size={18}/></button>
      <p role="status" aria-live="polite" className="form-status">{message}</p>
    </form>
  </div>;
}
