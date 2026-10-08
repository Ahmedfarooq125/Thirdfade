import test from 'node:test';
import assert from 'node:assert/strict';
import { emailFor, saveEnquiry } from '../server/enquiries.mjs';
process.env.SUPABASE_URL='https://test.supabase.co';
process.env.SUPABASE_SECRET_KEY='sb_secret_test';
process.env.RESEND_API_KEY='test';
process.env.CONTACT_FROM_EMAIL='ThirdFade <forms@example.com>';
process.env.CONTACT_EMAIL='business@example.com';
const enquiry={id:'e0fa995b-272e-49d8-8b88-41b6c2d08230',name:'<Alex>\r\nTest',email:'alex@example.com',phone:'',service:'Web design',message:'<script>alert("hello")</script>',consent:true,created_at:'2026-10-05T00:00:00Z'};
test('email escapes visitor content and uses reply-to',()=>{
 const email=emailFor(enquiry);
 assert.ok(!email.html.includes('<script>'));
 assert.ok(email.html.includes('&lt;script&gt;'));
 assert.ok(!/[\r\n]/.test(email.subject));
 assert.equal(email.reply_to,enquiry.email);
 assert.deepEqual(email.to,['business@example.com']);
});
test('persist before email; record provider acceptance',async()=>{
 const calls=[];
 const original=globalThis.fetch;
 globalThis.fetch=async(url,options)=>{calls.push({url,options});return new Response(options.method==='POST'&&url.includes('resend')?JSON.stringify({id:'email-test'}):null,{status:url.includes('resend')?200:options.method==='POST'?201:204});};
 try {
  assert.deepEqual(await saveEnquiry(enquiry),{saved:true,sent:true});
  assert.equal(calls.length,3);
  assert.ok(calls[0].url.includes('/enquiries'));
  assert.equal(calls[1].options.headers['Idempotency-Key'],`enquiry/${enquiry.id}`);
  assert.equal(JSON.parse(calls[2].options.body).email_status,'accepted');
 } finally {globalThis.fetch=original;}
});
test('database failure prevents email',async()=>{
 let calls=0;const original=globalThis.fetch;
 globalThis.fetch=async()=>{calls++;return new Response(null,{status:503});};
 try{await assert.rejects(saveEnquiry(enquiry));assert.equal(calls,1);}finally{globalThis.fetch=original;}
});
test('email failure keeps persisted enquiry pending',async()=>{
 let calls=0;const original=globalThis.fetch;
 globalThis.fetch=async()=>new Response(null,{status:++calls===1?204:503});
 try{assert.deepEqual(await saveEnquiry(enquiry),{saved:true,emailQueued:true});assert.equal(calls,2);}finally{globalThis.fetch=original;}
});
