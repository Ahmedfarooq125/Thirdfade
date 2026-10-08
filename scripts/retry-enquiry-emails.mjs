import { database, deliver } from '../server/enquiries.mjs';
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY || !process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL || !process.env.CONTACT_FROM_EMAIL) throw new Error('Configure the server environment first.');
// Resend retains idempotency keys for 24 hours. Restrict automatic retries to
// 23 hours; reconcile older records against Resend logs before manual action.
const since = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString();
const pending = await database(`enquiries?email_status=eq.pending&created_at=gte.${encodeURIComponent(since)}&order=created_at.asc&limit=50`);
let failed = 0;
for (const enquiry of pending) {
  try { await deliver(enquiry); console.log('Email accepted:', enquiry.id); }
  catch { failed++; console.error('Email still pending:', enquiry.id); }
}
if (failed) process.exitCode = 1;
