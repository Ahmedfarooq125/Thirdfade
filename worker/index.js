// Cloudflare Worker: serves the built site (dist) and handles the contact form API.
// Same logic as server/contact-api.mjs + server/enquiries.mjs, adapted for Workers.

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const json = (status, data) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });

// Simple per-instance rate limit (best effort). For stronger limits, add a Cloudflare rate limiting rule.
const attempts = new Map();

function settings(env) {
  const siteKey = env.TURNSTILE_SITE_KEY || '';
  const secret = env.TURNSTILE_SECRET_KEY || '';
  const dummy = (v) => /^[123]x0000/.test(v);
  const liveKeys = siteKey && secret && !dummy(siteKey) && !dummy(secret);
  const ready = !!(
    liveKeys &&
    env.TURNSTILE_HOSTNAME &&
    /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(env.SUPABASE_URL || '') &&
    (env.SUPABASE_SECRET_KEY || '').startsWith('sb_secret_') &&
    env.RESEND_API_KEY &&
    env.CONTACT_EMAIL &&
    env.CONTACT_FROM_EMAIL
  );
  return { siteKey, secret, ready };
}

async function database(env, path, options = {}) {
  const response = await fetch(`${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`, {
    ...options,
    headers: { apikey: env.SUPABASE_SECRET_KEY, 'Content-Type': 'application/json', ...options.headers },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('database_request_failed');
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

function emailFor(env, enquiry) {
  const fields = [
    ['Name', enquiry.name],
    ['Email', enquiry.email],
    ['Phone', enquiry.phone || 'Not provided'],
    ['Service', enquiry.service],
    ['Message', enquiry.message],
    ['Received (UTC)', enquiry.created_at],
    ['Reference', enquiry.id],
  ];
  return {
    from: env.CONTACT_FROM_EMAIL,
    to: [env.CONTACT_EMAIL],
    reply_to: enquiry.email,
    subject: `ThirdFade enquiry: ${enquiry.service || 'New project'} — ${enquiry.name}`.replace(/[\r\n]/g, ' '),
    text: `New ThirdFade website enquiry\n\n${fields.map(([l, v]) => `${l}: ${v}`).join('\n\n')}\n\nConsent to contact: Yes`,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;color:#191919"><h1 style="font-size:26px">New website enquiry</h1><p>A visitor would like to discuss a project with ThirdFade.</p>${fields
      .map(
        ([l, v]) =>
          `<div style="padding:14px 0;border-bottom:1px solid #ddd"><strong>${l}</strong><div style="white-space:pre-wrap;margin-top:6px">${escapeHtml(v)}</div></div>`
      )
      .join('')}<p>Consent to contact: Yes. Reply to this email to respond to the visitor.</p></div>`,
  };
}

async function deliver(env, enquiry) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `enquiry/${enquiry.id}`,
    },
    body: JSON.stringify(emailFor(env, enquiry)),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('email_delivery_failed');
  const result = await response.json();
  if (!result.id) throw new Error('email_delivery_failed');
  await database(env, `enquiries?id=eq.${enquiry.id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ email_status: 'accepted', email_id: result.id, email_accepted_at: new Date().toISOString() }),
  });
}

async function saveEnquiry(env, enquiry) {
  await database(env, 'enquiries', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(enquiry) });
  try {
    await deliver(env, enquiry);
    return { saved: true, sent: true };
  } catch {
    console.error('Enquiry saved; email needs retry', enquiry.id);
    return { saved: true, emailQueued: true };
  }
}

async function handleContact(request, env) {
  const config = settings(env);
  try {
    if (!config.ready) return json(503, { message: 'The contact form is not live yet. Please try again later.' });

    const origin = request.headers.get('origin');
    const host = request.headers.get('host') || new URL(request.url).host;
    if (!origin || new URL(origin).host !== host) return json(403, { message: 'Please submit the form from this website.' });
    if (!(request.headers.get('content-type') || '').includes('application/json'))
      return json(415, { message: 'Unsupported request format.' });

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const now = Date.now();
    for (const [key, value] of attempts) if (now - value.start > 600000) attempts.delete(key);
    const rate = attempts.get(ip) || { start: now, count: 0 };
    rate.count++;
    attempts.set(ip, rate);
    if (rate.count > 10) return json(429, { message: 'Too many attempts. Please wait ten minutes and try again.' });

    const body = await request.text();
    if (new TextEncoder().encode(body).length > 16000) return json(413, { message: 'Your message is too long.' });
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return json(400, { message: 'Invalid form data.' });
    }
    if (!data || typeof data !== 'object') return json(400, { message: 'Invalid form data.' });

    const text = (key) => (typeof data[key] === 'string' ? data[key].trim() : '');
    const name = text('name'), email = text('email'), message = text('message');
    const phone = text('phone'), service = text('service'), token = text('token');

    if (text('website')) return json(400, { message: 'Unable to verify this enquiry.' });
    if (
      name.length < 2 || name.length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      message.length < 20 || message.length > 5000 ||
      phone.length > 40 || service.length > 100 ||
      data.consent !== 'on'
    )
      return json(400, { message: 'Please check your name, email, message and consent.' });
    if (!token || token.length > 2048) return json(400, { message: 'Please complete the CAPTCHA verification.' });

    const validation = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: config.secret, response: token }),
      signal: AbortSignal.timeout(10000),
    });
    if (!validation.ok) throw new Error('verification');
    const result = await validation.json();
    if (!result.success || result.hostname !== env.TURNSTILE_HOSTNAME || result.action !== 'contact')
      return json(400, { message: 'Verification expired or failed. Please verify again.' });

    const saved = await saveEnquiry(env, {
      id: crypto.randomUUID(),
      name, email, phone, service, message,
      consent: true,
      created_at: new Date().toISOString(),
    });
    return json(200, saved);
  } catch {
    return json(502, { message: 'We could not send your enquiry. Please try again shortly.' });
  }
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/contact-config') {
      if (request.method !== 'GET') return json(405, { message: 'Method not allowed.' });
      const config = settings(env);
      return json(200, {
        siteKey: config.siteKey,
        preview: false,
        ready: config.ready,
        email: env.CONTACT_EMAIL || '',
        phone: env.CONTACT_PHONE || '',
      });
    }

    if (pathname === '/api/contact') {
      if (request.method !== 'POST') return json(405, { message: 'Method not allowed.' });
      return handleContact(request, env);
    }

    if (pathname.startsWith('/api/')) return json(404, { message: 'Not found.' });

    // Everything else: the static website
    return env.ASSETS.fetch(request);
  },
};