import { randomUUID } from 'node:crypto';
import { saveEnquiry } from './enquiries.mjs';
const TEST_SITE = '1x00000000000000000000AA';
const TEST_SECRET = '1x0000000000000000000000000000000AA';
const attempts = new Map();
const json = (res, status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(data)); };
function settings(req) {
  const hostname = (req.headers.host || '').split(':')[0];
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(hostname) && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
  const preview = (local || process.env.CONTACT_PREVIEW_MODE === 'true') && !process.env.TURNSTILE_SITE_KEY;
  const siteKey = process.env.TURNSTILE_SITE_KEY || (preview ? TEST_SITE : '');
  const secret = process.env.TURNSTILE_SECRET_KEY || (preview ? TEST_SECRET : '');
  const liveKeys = siteKey && secret && !siteKey.startsWith('1x0000') && !secret.startsWith('1x0000') && !siteKey.startsWith('2x0000') && !secret.startsWith('2x0000') && !siteKey.startsWith('3x0000') && !secret.startsWith('3x0000');
  const ready = preview || !!(liveKeys && process.env.TURNSTILE_HOSTNAME && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(process.env.SUPABASE_URL || '') && process.env.SUPABASE_SECRET_KEY?.startsWith('sb_secret_') && process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL && process.env.CONTACT_FROM_EMAIL);
  return { preview, siteKey, secret, ready };
}
export async function contactApi(req, res, next) {
  const route = (req.url || '').split('?')[0];
  if (!['/api/contact', '/api/contact-config'].includes(route)) return next();
  const config = settings(req);
  if (route === '/api/contact-config' && req.method === 'GET') return json(res,200,{siteKey:config.siteKey,preview:config.preview,ready:config.ready,email:process.env.CONTACT_EMAIL || '',phone:process.env.CONTACT_PHONE || ''});
  if (route !== '/api/contact' || req.method !== 'POST') return json(res,405,{message:'Method not allowed.'});
  try {
    if (!config.ready) return json(res,503,{message:'The contact form is not live yet. Please try again later.'});
    // Same-origin browser submissions only. Secrets and delivery configuration stay on the server.
    const origin = req.headers.origin;
    if (!origin || new URL(origin).host !== req.headers.host) return json(res,403,{message:'Please submit the form from this website.'});
    if (!req.headers['content-type']?.includes('application/json')) return json(res,415,{message:'Unsupported request format.'});
    const ip = req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    for (const [key,value] of attempts) if (now - value.start > 600000) attempts.delete(key);
    const rate = attempts.get(ip) || { start:now,count:0 }; rate.count++; attempts.set(ip,rate);
    if (rate.count > 10) return json(res,429,{message:'Too many attempts. Please wait ten minutes and try again.'});
    let data = req.body;
    if (!data || typeof data !== 'object') {
      let body = typeof data === 'string' ? data : ''; let bytes = Buffer.byteLength(body);
      if (!body) for await (const chunk of req) { bytes += chunk.length; if (bytes > 16000) return json(res,413,{message:'Your message is too long.'}); body += chunk; }
      if (bytes > 16000) return json(res,413,{message:'Your message is too long.'});
      try { data=JSON.parse(body); } catch { return json(res,400,{message:'Invalid form data.'}); }
    }
    if (!data || typeof data !== 'object') return json(res,400,{message:'Invalid form data.'});
    const text = (key) => typeof data[key] === 'string' ? data[key].trim() : '';
    const name=text('name'),email=text('email'),message=text('message'),phone=text('phone'),service=text('service'),token=text('token');
    if (text('website')) return json(res,400,{message:'Unable to verify this enquiry.'});
    if (name.length<2 || name.length>100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254 || message.length<20 || message.length>5000 || phone.length>40 || service.length>100 || data.consent!=='on') return json(res,400,{message:'Please check your name, email, message and consent.'});
    if (!token || token.length>2048) return json(res,400,{message:'Please complete the CAPTCHA verification.'});
    const validation = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:config.secret,response:token}),signal:AbortSignal.timeout(10000)});
    if (!validation.ok) throw new Error('verification');
    const result = await validation.json();
    if (!result.success || (!config.preview && (result.hostname!==process.env.TURNSTILE_HOSTNAME || result.action!=='contact'))) return json(res,400,{message:'Verification expired or failed. Please verify again.'});
    if (config.preview) return json(res,200,{preview:true});
    const saved = await saveEnquiry({id:randomUUID(),name,email,phone,service,message,consent:true,created_at:new Date().toISOString()});
    return json(res,200,saved);
  } catch { return json(res,502,{message:'We could not send your enquiry. Please try again shortly.'}); }
}
