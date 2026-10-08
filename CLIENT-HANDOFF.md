# ThirdFade client handoff

Review website: https://thirdfade-site.vercel.app/

## Current status

The website is deployed with the transparent ThirdFade logo, static Memorable text and a DepthText second line with a stronger white glow, functional service portfolio links and updated service images, 36 portfolio images and eight supplied review excerpts. The public contact configuration reports `preview=false` and `ready=false`; submissions are disabled until the required services are configured. See DEPLOYMENT.md for the release record. Supabase storage and formatted Resend email integration are implemented locally, pending client account configuration and a real delivery test. No database has been provisioned and ownership has not yet been transferred.

## Information to complete

- Business inbox receiving enquiries: **info@thirdfade.com**
- Client account owner email: **pending**
- Final website domain and DNS administrator: **client will configure**
- Approved sender address on a verified client domain: **pending**
- Review screenshots: **supplied and displayed as captured**; full review text and live Google links are not supplied.
- Portfolio attribution and approval to present concepts as client work: **pending**

## Accounts the client must own

| Service | Client controls | Handoff item |
| --- | --- | --- |
| Vercel | Website, deployments, billing and domain | Transfer existing `thirdfade-site` project to client team, or deploy this package in their account |
| Supabase | Database, exports, billing and access | Client-owned project; apply `supabase/migrations/001_enquiries.sql` |
| Resend | Email sender domain, sending API key and delivery logs | Verify client domain DNS; configure approved business inbox |
| Cloudflare Turnstile | CAPTCHA keys and allowed hostnames | Client-owned widget for final domain |
| Domain provider | Domain ownership, DNS and renewal | Client owner and billing contact |

Use client-owned accounts with individual invitations. The client keeps their passwords, recovery codes and MFA. Store service secrets in their password manager and Vercel server environment; do not put secrets into the source archive, browser code or email attachments.

## Activate the form

1. Create Supabase in the client's account and choose their preferred data region. Run the additive SQL migration. The enquiries table has RLS enabled and no anonymous or authenticated browser access.
2. Create a Supabase server secret key and Resend sending key. Verify the sender domain in Resend using DNS records they supply.
3. Configure Vercel Production environment using `.env.example`: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_EMAIL`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_HOSTNAME`. Optional public phone: `CONTACT_PHONE`. Never prefix secrets with `VITE_`.
4. Remove `CONTACT_PREVIEW_MODE`. Redeploy under the client-owned project.
5. Submit one agreed test enquiry. Confirm the row appears in Supabase, the business inbox receives the formatted message, and Reply addresses the submitter. Check spam as well. Provider acceptance does not prove inbox delivery.
6. Confirm invalid CAPTCHA is rejected and the database cannot be read using a publishable key.

## Operations

Each enquiry is saved before email delivery. Email includes name, email, phone, service, message, consent, timestamp and reference, in HTML and plain text. Records marked `pending` need attention; `accepted` means Resend accepted the email, not that it reached the inbox.

Monitor Supabase pending records and Resend delivery logs. Run `node --env-file=.env.local scripts/retry-enquiry-emails.mjs` to retry up to 50 pending messages from the last 23 hours. Use a client-owned scheduler for frequent retries if required; no scheduler or paid plan has been provisioned. Resend idempotency lasts 24 hours. For older pending records, check Resend logs by reference before resending to avoid duplicates. Keep the destination and sender settings unchanged during retries.

Decide an enquiry retention period with the client and schedule exports/deletion accordingly. The present rate limiter is process-local; CAPTCHA is enforced, but shared rate limiting should be added if traffic warrants it. A browser/network timeout after storage may cause a visitor to resubmit; review apparent duplicates by email/message/time.

## Final access removal

After client acceptance:

- Verify client ownership and billing on every account and successful deployment under their control.
- Give the client source archive, account/project URLs, configuration inventory, DNS notes and test evidence through their chosen secure channel.
- Have the client rotate any service keys accessible during development; update Vercel and test again before revoking old keys.
- Remove developer memberships from Vercel, Supabase, Resend, Cloudflare and the domain account. Revoke temporary invitations/tokens and disconnect local deployment credentials for this project.
- Client confirms they can deploy, view enquiries and receive emails without developer access.

Access removal is the last step. Do not delete the current deployment or database as a shortcut to transferring ownership.

Reference documentation: [Supabase keys](https://supabase.com/docs/guides/getting-started/api-keys), [Resend email API](https://resend.com/docs/api-reference/emails/send-email), [Resend retry idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).

