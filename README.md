# ThirdFade website

Responsive React, TypeScript and Vite single-page website with a continuous liquid-chrome background, monochrome interface and four sections in order: services, portfolio, reviews and contact.

## Run and build

```sh
npm install
npm run dev
npm run build
npm run preview
```

The built page starts at `dist/index.html`. The build includes readable HTML for search engines. A static host can serve the page, but the contact form requires the included API routes or an equivalent Node host. Vercel uses `api/contact.mjs` and `api/contact-config.mjs`; `vercel.json` configures Vite and SPA routing. Development and local preview use the same API through the Vite middleware.

## Main files

- `src/App.tsx`: static and DepthText headline, Magnetic Dock, service deck, filtered portfolio and supplied review carousel.
- `src/data/portfolio.ts`: gallery image order, categories, captions and alt text.
- `src/data/reviews.ts`: eight supplied review excerpts, captured dates and screenshot frames.
- `src/components/ui/canvas-text.tsx`: monochrome animated hero lettering with accessible fallback text.
- `src/components/ui/apple-cards-carousel.tsx`: responsive review carousel and accessible screenshot dialogs, without arrow controls.
- `src/sections.css`: responsive section, card, dock and form styles.
- `src/components/ui/orbit-card-stack.tsx`: Componentry Orbit Card Stack with keyboard support and numbered touch controls.
- `src/components/ui/magnetic-dock.tsx`: Componentry Magnetic Dock with spring magnification, tooltips and active indicators.
- `src/components/ui/floating-dock.tsx`: Aceternity Floating Dock adapted for portfolio categories, existing dependencies, keyboard support and labelled mobile controls.
- `src/components/ui/wavy-background.tsx`: Aceternity canvas waves adapted for a translucent monochrome capsule, with pause, reduced-motion and visibility handling.
- `src/components/ContactForm.tsx`: labelled form, consent, validation, CAPTCHA lifecycle and submission states.
- `server/contact-api.mjs`: server validation, honeypot, rate limiting, CAPTCHA verification and Supabase/Resend integration.
- `src/components/hero/`: supplied liquid-chrome fragment shader and native WebGL renderer.
- `public/assets/portfolio/`: user-supplied references for all seven portfolio categories.
- `public/assets/brand/thirdfade-transparent.png`: supplied logo displayed in the hero header and footer.

## Content and assets

The interface uses the supplied hero CSS's white, black and silver palette. One fixed viewport canvas animates behind every section. Motion respects reduced-motion settings and can be paused anywhere on the page. The supplied ThirdFade logo replaces the header and footer tagline and scales across desktop and mobile layouts. Historical logo/cloud assets remain on disk but are excluded from Vercel upload.

The portfolio includes six images each for Website, Branding, Apps and E-commerce, four Meta Ads dashboards, six SEO screenshots and two AI Automation app concepts, in the supplied order. The original images are displayed without cropping; the surrounding interface remains monochrome. The seven-category capsule uses a translucent gradient with black and dark-grey canvas waves. Waves pause with the global motion control, respect reduced motion and stop while hidden or offscreen. See PORTFOLIO-ASSETS.md for the image inventory. Eight review cards use the two supplied screenshots, preserving their visible text and truncation. The original card structure is retained with swipe, drag and keyboard browsing; each review opens its supplied screenshot. Arrow controls are removed. Dates are captured screenshot labels, not live Google data. See REVIEW-ASSETS.md. Confirm portfolio attribution before presenting supplied concepts as completed client work.

The site uses the supplied logo, portfolio references and review screenshots. Public contact details are only displayed after `CONTACT_EMAIL` and/or `CONTACT_PHONE` are configured. Manrope remains the interface font until licensed Creato Display webfonts are supplied.

## Contact form setup

Localhost automatically uses Cloudflare Turnstile's official dummy keys. The hosted review deployment can explicitly set `CONTACT_PREVIEW_MODE=true` to enable the same preview behavior. Preview submissions validate and report that **no message was sent**. Preview data is not persisted or forwarded to a contact destination.

For live enquiries, configure these server environment variables on Vercel (see `.env.example`):

- `TURNSTILE_SITE_KEY`: live widget site key.
- `TURNSTILE_SECRET_KEY`: live secret, stored only on the server.
- `TURNSTILE_HOSTNAME`: exact public site hostname registered with Turnstile.
- `SUPABASE_URL`, `SUPABASE_SECRET_KEY`: server database connection.
- `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`: email provider and verified sender.
- `CONTACT_EMAIL`, `CONTACT_PHONE`: business destination and optional public phone.

Apply `supabase/migrations/001_enquiries.sql` before activation. Enquiries are stored before email delivery. Failed emails remain pending for recovery using `scripts/retry-enquiry-emails.mjs`. See `CLIENT-HANDOFF.md` for activation, retry limitations, ownership and secure credential transfer. Remove `CONTACT_PREVIEW_MODE` and verify a real test before accepting live enquiries.

Turnstile documentation: https://developers.cloudflare.com/turnstile/troubleshooting/testing/ and https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

## Deployment

Run `vercel link` followed by `vercel deploy --prod` from this directory once the CLI is authenticated. `.vercelignore` excludes source media/tool caches, local environment files and unused assets. Do not upload `node_modules`, `.work`, secrets or `original-hero.mp4`.

Current production URL: https://thirdfade-site.vercel.app/ (Vercel project `thirdfade-site`, account scope `adityasoodgood-9950s-projects`). The latest contact configuration reports `preview=false` and `ready=false`: the public form is disabled until the client configures its services. Localhost uses preview mode. See DEPLOYMENT.md for the deployment record and current handoff contents.

Verified for the current UI: TypeScript/build, desktop and 390px mobile headline/review layout, all eight supplied reviews, removed arrow controls, keyboard browsing, screenshot dialogs, Escape dismissal with restored focus, and the shared motion control. No real enquiry was sent. Earlier contact validation tests remain separate from live service activation.



## Latest visual refinements

The header logo artwork height is half the responsive headline font size. The second headline line uses React Bits DepthText with a dark-grey face, black depth layers and a stronger white glow. Hero footer pills are removed. Service arrows select their matching portfolio category. Snapx uses the latest supplied light-background screenshot, and AI titles and eyebrows read AI Receptionist and AI sales Rep. Short desktop layouts reserve space for the fixed navigation. See DEPLOYMENT.md for the current release and handoff archive.