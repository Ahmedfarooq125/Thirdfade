const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export async function database(path, options = {}) {
  const response = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`, {
    ...options,
    headers: { apikey: process.env.SUPABASE_SECRET_KEY, 'Content-Type': 'application/json', ...options.headers },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('database_request_failed');
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

export function emailFor(enquiry) {
  const fields = [['Name', enquiry.name], ['Email', enquiry.email], ['Phone', enquiry.phone || 'Not provided'], ['Service', enquiry.service], ['Message', enquiry.message], ['Received (UTC)', enquiry.created_at], ['Reference', enquiry.id]];
  return {
    from: process.env.CONTACT_FROM_EMAIL,
    to: [process.env.CONTACT_EMAIL],
    reply_to: enquiry.email,
    subject: `ThirdFade enquiry: ${enquiry.service || 'New project'} — ${enquiry.name}`.replace(/[\r\n]/g, ' '),
    text: `New ThirdFade website enquiry\n\n${fields.map(([label,value]) => `${label}: ${value}`).join('\n\n')}\n\nConsent to contact: Yes`,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;color:#191919"><h1 style="font-size:26px">New website enquiry</h1><p>A visitor would like to discuss a project with ThirdFade.</p>${fields.map(([label,value]) => `<div style="padding:14px 0;border-bottom:1px solid #ddd"><strong>${label}</strong><div style="white-space:pre-wrap;margin-top:6px">${escape(value)}</div></div>`).join('')}<p>Consent to contact: Yes. Reply to this email to respond to the visitor.</p></div>`,
  };
}

export async function deliver(enquiry) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type':'application/json', 'Idempotency-Key': `enquiry/${enquiry.id}` },
    body: JSON.stringify(emailFor(enquiry)), signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('email_delivery_failed');
  const result = await response.json();
  if (!result.id) throw new Error('email_delivery_failed');
  await database(`enquiries?id=eq.${enquiry.id}`, { method:'PATCH', headers:{Prefer:'return=minimal'}, body:JSON.stringify({email_status:'accepted',email_id:result.id,email_accepted_at:new Date().toISOString()}) });
}

export async function saveEnquiry(enquiry) {
  await database('enquiries', {method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(enquiry)});
  try { await deliver(enquiry); return {saved:true,sent:true}; }
  catch { console.error('Enquiry saved; email needs retry', enquiry.id); return {saved:true,emailQueued:true}; }
}
