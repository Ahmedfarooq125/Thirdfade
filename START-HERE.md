# ThirdFade — client setup

You can own and run this website entirely in your own accounts. No developer login is required. The current review link is https://thirdfade-site.vercel.app/; its contact form is currently disabled until the required services are configured. See DEPLOYMENT.md for the latest production deployment.

## 1. Deploy in your Vercel account

Install Node.js 22 LTS or newer, unzip the package and open a terminal in `thirdfade-site`.

```sh
npm ci
npm run build
npx vercel login
npx vercel --prod
```

Select your own Vercel account/team and create a new project. This package deliberately omits `.vercel` so it is not linked to the developer's project. Accept Vite as the framework, `npm run build` as the build command and `dist` as the output. Save the new production hostname for CAPTCHA setup. You can use Vercel's provided address until you add your website domain.

## 2. Set up your database

Sign in at https://supabase.com/dashboard and create a project in your own organization. Choose the data region and store the database password in your password manager. Open SQL Editor, paste `supabase/migrations/001_enquiries.sql` and run it. Copy the project URL and create a server secret API key (`sb_secret_…`). Keep it private.

Your enquiries will appear in Table Editor → `enquiries`. The website browser cannot read these records.

## 3. Set up email delivery

Sign in at https://resend.com/ using your business-owned account. Add and verify a sending domain you control using the DNS records Resend provides. Your website domain can be added later, but sending email still requires a verified email domain. Confirm your business mailbox `info@thirdfade.com` is active.

Create a sending API key. Choose a verified sender, such as `ThirdFade <forms@your-verified-domain>`. This is separate from the destination, which is `info@thirdfade.com`. Enquiry notifications contain a formatted message and Reply addresses the visitor.

## 4. Set up CAPTCHA

Create a widget at https://dash.cloudflare.com/ → Turnstile. Register your new production hostname and, later, your own website domain. Copy the site key and secret key. The widget action is `contact`, already configured in this project.

## 5. Activate in Vercel

In your project Settings → Environment Variables, add the following for **Production**:

| Variable | Value |
| --- | --- |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SECRET_KEY` | Your private server secret key |
| `RESEND_API_KEY` | Your private sending API key |
| `CONTACT_EMAIL` | `info@thirdfade.com` |
| `CONTACT_FROM_EMAIL` | Your verified sender address |
| `TURNSTILE_SITE_KEY` | Live widget site key |
| `TURNSTILE_SECRET_KEY` | Live widget secret key |
| `TURNSTILE_HOSTNAME` | Exact production hostname, without `https://` or a trailing slash |

Do not set `CONTACT_PREVIEW_MODE` on the client deployment. Redeploy with `npx vercel --prod`. Use `.env.example` as an inventory; it contains no real secrets. Do not use the test CAPTCHA keys for live enquiries.

## 6. Verify and accept ownership

Submit a test message with at least 20 characters. Confirm all three: the success message, the saved Supabase record, and email received by `info@thirdfade.com`. Check Reply addresses the visitor. Inspect Resend logs for delivery status.

Keep your accounts, recovery methods, billing and DNS access under your business control. Confirm you can redeploy and see enquiries yourself. The developer can then remove collaborator access, revoke temporary keys and retire the old review deployment after agreement. The old review URL will not automatically become your new URL.

Read `CLIENT-HANDOFF.md` for failed-email recovery, retention, portfolio attribution and access removal. Automated email retries are not configured; the supplied recovery script is ready for your own scheduler. The source and migration are included so you can maintain the site independently.
