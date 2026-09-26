# Go Rob Lacy — website

**People | Systems | Greater Results.** AI systems, websites & growth infrastructure for
businesses across 29 industries — Go Rob Lacy Inc., 16110 Foliage Avenue West,
Rosemount, Minnesota 55068 · +1 928 392-4421 · rob@goroblacy.com.

**Live:** https://site-go-rob-lacy.vercel.app (Vercel team SHAI, project `site-go-rob-lacy`;
every push to `main` deploys to production automatically).

Static single-page site (`index.html`, hash routes) plus three Vercel serverless
functions in `api/`. Built from the studio's SHAI template — same catalog, industries,
testimonials, press sheet and demo media — with its own navy/ivory/gold design system
from the client's logo, a Three.js "summit" hero, an OpenArt intro video, and an AI
chat assistant.

## Where things live
- **Logo:** vector artwork — `images/logo.svg` (stacked), `images/logo-lockup.svg`
  (header), `images/emblem.svg` (chat button). Favicons, `apple-touch-icon.png` and
  `og-image.jpg` are PNG/JPG renders of the same artwork.
- **Intro video:** `videos/loader-4k.mp4` (3840×2160, large / high-density desktop
  screens) and `videos/loader.mp4` (1920×1080, phones, tablets, smaller screens,
  Save-Data); poster `images/loader-poster.jpg`. The page picks one at load time.
- **Business details:** `CONFIG` at the top of the `KB:DATA` block in `index.html`.
- **Content:** `SVC` (services), `IND` (industry playbooks), `TESTIMONIALS`, `PRESS_*`,
  `PROCESS_STEPS`, `ABOUT_COPY`, `SITE_STATS`, `HERO_COPY` — all inside the
  `/* KB:DATA:START */ … /* KB:DATA:END */` block.
- **Booking calendar:** `api/ghl-slots.js` + `api/ghl-book.js` need `GHL_API_KEY`,
  `GHL_LOCATION_ID`, `GHL_CALENDAR_ID` as Vercel environment variables (the client's own
  GoHighLevel account). Without them the calendar shows a friendly fallback.
- **Contact form:** posts to `CONFIG.ghlWebhookUrl` (a GoHighLevel Inbound Webhook) once set.
- **Confirmation page:** `/goroblacyconsultationconfirmed` (rewrite in `vercel.json`).

## Chat assistant
Bottom-right widget. `api/chat.js` answers with Claude (`@anthropic-ai/sdk`), grounded in
the site's own content: it reads this deployment's `index.html` (bundled via
`vercel.json` → `includeFiles`), evaluates the `KB:DATA` block, and retrieves the most
relevant services / industry offers / testimonials / press outlets for each question.

- `GET /api/chat` is a health check: it reports whether this deployment's knowledge
  loads, how many entries it has, and whether a key is configured.
- Needs `ANTHROPIC_API_KEY` in the Vercel project. Optional `CHAT_MODEL`
  (default `claude-opus-5`).
- Without a key (or if the API is unreachable) the widget answers locally in the
  browser from the same knowledge, so it always works.
- **It updates itself:** there is no separate knowledge base. Add or edit a service,
  industry, testimonial, press outlet or contact detail in the `KB:DATA` block and the
  assistant knows it on the next deploy. Keep DOM code out of that block (the server
  evaluates it without a browser).
