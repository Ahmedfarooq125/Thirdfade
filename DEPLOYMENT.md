# ThirdFade production release

Released 7 October 2026 (India time). Verified at 2026-10-06T20:30:41Z.

| Item | Value |
| --- | --- |
| Public website | https://thirdfade-site.vercel.app/ |
| Status / environment | READY / production |
| Deployment ID | `dpl_HrajuNgFhWu7hqi93ygEgx8TFjGM` |
| Deployment URL | https://thirdfade-site-pndozaxuj-adityasoodgood-9950s-projects.vercel.app |
| Vercel dashboard | https://vercel.com/adityasoodgood-9950s-projects/thirdfade-site/HrajuNgFhWu7hqi93ygEgx8TFjGM |
| Project | `thirdfade-site` / `prj_UOFtYjoyGBrh0H1FVzxXcxPiFviQ` |
| Team scope | `adityasoodgood-9950s-projects` |
| Framework / build | Vite / `npm run build` / `dist` |
| Build duration | 14 seconds |
| Source | Current local workspace; no Git commit |

## Included changes

- Transparent ThirdFade logo. Header artwork height equals half the responsive headline font size, including mobile and shorter desktop windows.
- Headline: Memorable is plain black HTML text with no canvas, animation or moving lines. By design uses React Bits DepthText with 34 layers, a dark-grey face, black depth and a stronger white glow. DepthText follows responsive sizing and supports Pause motion, reduced motion and off-screen suspension.
- Removed the Scroll to discover and Strategy. Creativity. Design. hero pills and black circular backings on service arrows.
- Service deck arrows select their matching portfolio category and scroll to the work section. Cards retain the first supplied image in each category.
- Snapx Services uses the latest supplied light-background screenshot with lime-green navigation. The full original PNG is displayed with contained sizing in the existing fourth Website card.
- AI card titles and eyebrows read “AI Receptionist” and “AI sales Rep”. App redesign and App UI labels removed.
- Seven portfolio categories, 36 displayed images, eight supplied review excerpts, and the existing review card structure with touch, drag, keyboard and screenshot dialogs. No review carousel arrow controls.
- Short desktop hero spacing keeps the main buttons clear of fixed navigation. Reduced motion and Pause motion remain supported.

## Verification

The staged build was checked before promotion. The public URL returned the expected final HTML and bundle. Header logo height was verified at half the headline font size on desktop and mobile. The 1280 x 720 desktop layout was checked for clear spacing between the hero buttons and fixed navigation. Grey headline styling, removed hero pills, service navigation by click and Enter, the latest light-background Snapx artwork, and both AI titles and eyebrows were verified in the browser. Existing review interactions were verified in the preceding release. No real enquiry was submitted.

## Contact form and ownership

The public configuration reports `preview=false` and `ready=false`. The hosted contact form is disabled; it is not accepting, storing or sending real enquiries. Local preview behavior is separate. Client-owned Supabase, Resend and Turnstile settings, a verified sender and a real end-to-end enquiry test remain required. The intended business inbox is `info@thirdfade.com`.

The website remains in the existing Vercel account. Deployment does not transfer account ownership. Follow START-HERE.md and CLIENT-HANDOFF.md to deploy in the client account or arrange a project transfer.

## Handoff archive

The latest package is `thirdfade-client-handoff-refinements.zip`. It includes current source, API routes, server integration, database migration, lockfile, setup guides, asset notes and DEPLOYMENT.json with artifact checksums. Its `dist/index.html`, JavaScript and CSS are copies of this exact public deployment. Static images match the included source assets. Rebuilding on a different platform can produce different bundle filenames.

The archive excludes `.vercel`, local credentials, real `.env` files, caches, dependency folders and source video. `.env.example` is included as the configuration inventory. The client can link the package to their own Vercel account without developer project credentials. The companion `.zip.sha256` records the archive checksum.
Latest follow-up: replaced the fourth Website card image with the latest supplied light Snapx screenshot and made Memorable static. Verified no canvas remains in the headline, the static text has no animation, and the published Snapx image matches the supplied PNG exactly.
