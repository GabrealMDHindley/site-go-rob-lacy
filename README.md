# Go Rob Lacy — Website

**People | Systems | Greater Results.** The complete Go Rob Lacy website: every page,
image, video, the intro animation, the booking calendar, the contact form and the AI
chat assistant. This folder is ready to launch on your own Vercel account.

## What's in this folder

| Item | What it is |
| --- | --- |
| `index.html` | The whole website: pages, design, animations and all content |
| `api/chat.js` | The AI chat assistant (bottom-right corner of the site) |
| `api/ghl-slots.js`, `api/ghl-book.js` | The live booking calendar (connects to your GoHighLevel) |
| `images/` | Logo files, icons, share image, result galleries |
| `videos/` | The intro video (`loader-4k.mp4` and `loader.mp4`) and the demo videos |
| `vercel.json`, `package.json`, `package-lock.json` | Settings Vercel reads when it builds the site. Don't delete these. |
| `robots.txt` | Lets search engines index the site |

**Logo files:** `images/logo.svg` (full logo), `images/logo-lockup.svg` (horizontal
version used in the header), and `images/emblem.svg` (the mountain mark only). SVG files
stay sharp at any size. PNG copies are in the same folder.

---

## 1. Launch the site on Vercel

**Before you start:** under Vercel's fair-use rules, the free **Hobby** plan is for
personal, non-commercial use. A business website should be on the **Pro** plan. The site
is about 200 MB, mostly demo videos.

### Option A — GitHub + Vercel (recommended; works on any plan)

1. **Unzip** the file. You'll get one folder with the whole website in it.
2. **Put the folder on GitHub** with the free **GitHub Desktop** app
   (desktop.github.com):
   - Sign in with your GitHub account (create one at github.com if you need to).
   - **File → Add local repository… → Choose…** and select the website folder.
   - GitHub Desktop will say the folder isn't a repository yet. Click **"create a
     repository"**, then **Create repository**.
   - Click **Publish repository**. Keeping it private is fine. On the Hobby plan,
     publish it under your personal account, not an organization; Hobby can't import
     organization repositories.

   *Why not upload in the browser?* GitHub's website rejects files over 25 MB, and two
   of the demo videos are larger. GitHub Desktop has no such limit.
3. **Import it into Vercel:** go to vercel.com → **Add New… → Project**, then connect
   GitHub if asked. Find the repository and click **Import**.
4. On the **Configure Project** screen:
   - Set **Framework Preset** to **Other**.
   - Leave the **Build and Output Settings** empty.
   - You can add the environment variables from section 3 now or later.
   - Click **Deploy**.
5. After about a minute the site is live at `<project-name>.vercel.app`. From now on,
   any change published to the GitHub repository redeploys the site automatically.

### Option B — Vercel CLI (Pro plan)

Install Node.js 20 or newer, open a terminal inside the website folder and run:

```
npx vercel@latest --prod
```

Log in when asked, choose **set up a new project**, and accept the defaults. Vercel caps
CLI uploads at 100 MB on the Hobby plan, so this site needs Pro for this route.
Option A works on any plan.

---

## 2. Connect your domain

In Vercel, open the project and go to **Settings → Domains → Add**. Enter your domain
(for example `goroblacy.com` and `www.goroblacy.com`) and follow the DNS instructions
Vercel shows. **If that domain already runs a website, pointing it at Vercel replaces
that website.**

---

## 3. Turn on the chat assistant and booking calendar

Go to Vercel → your project → **Settings → Environment Variables**. Add each variable
below for **Production** (and **Preview** if you use it). Then go to **Deployments →
⋯ → Redeploy**, because a variable only takes effect on the next deployment.

| Variable | What it turns on | Where to get it |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Full AI answers in the chat assistant | console.anthropic.com → **API Keys** → Create Key. Anthropic bills per use, typically a few cents per question. |
| `CHAT_MODEL` *(optional)* | Which Claude model the assistant uses | Default: `claude-opus-5`. Use `claude-haiku-4-5` for a lower cost per question. |
| `GHL_API_KEY` | Live booking calendar | GoHighLevel → **Settings → Private Integrations** → create an integration with access to Calendars, Calendar Events and Contacts, then copy its token. |
| `GHL_LOCATION_ID` | Live booking calendar | Your GoHighLevel sub-account ID: the code after `/location/` in your GoHighLevel web address, also shown under **Settings → Business Profile**. |
| `GHL_CALENDAR_ID` | Live booking calendar | GoHighLevel → **Calendars → Calendar Settings** → the consultation calendar's ID. |

**Without these the site still works.** The chat assistant answers from the website's
own content inside the visitor's browser, and the calendar tells visitors to send a
message through the contact form so you can book them personally.

**Contact form → GoHighLevel:**
1. In GoHighLevel, go to **Automation → Workflows → Create Workflow**, add the trigger
   **Inbound Webhook**, and copy its URL.
2. In `index.html`, find `ghlWebhookUrl: ""` (in the `CONFIG` section near the top of
   the site's data) and paste the URL between the quotes.
3. Publish the change.

The form sends `firstName`, `lastName`, `email`, `phone`, `industry`, `message` and
`source`. Build the workflow to create or update the contact and add them to your
pipeline.

**Thank-you page:** `https://<your-domain>/goroblacyconsultationconfirmed` is a
confirmation page. You can use it as the redirect for GoHighLevel booking pages.

---

## 4. Check that everything works

- Open the site. The intro plays, then the home page appears. You can skip the intro
  with **Skip Intro**.
- Visit `https://<your-domain>/api/chat`. It should show `"ok":true`. Once your
  Anthropic key is added it shows `"configured":true`.
- On the **Contact** page, the calendar shows open times once the three `GHL_`
  variables are set.

---

## 5. Editing the site later

- **Business details** (name, phone, email, address, hours) are in `CONFIG` at the top
  of the site's data inside `index.html`. Edit them once and they update on every page,
  in the footer and in the chat assistant. Lines marked `[CONFIRM]` are details to
  double-check before launch: the legal company name and business hours.
- **Content** (services, industries, testimonials, press outlets, process steps, About
  copy, stats) lives in `index.html` between `/* KB:DATA:START */` and
  `/* KB:DATA:END */`.
- **The chat assistant updates itself.** It reads that same content every time the site
  deploys, so any service or detail you add there is known to the assistant right away.
  Keep that section to plain data (text, lists and numbers), because the chat server
  reads it directly.
- **Example websites:** some industry pages show live previews of example websites
  hosted elsewhere, listed in `SITE_PREVIEWS` and `PROPERTY_SITE_EXAMPLES` in
  `index.html`. If one of those sites ever goes offline, remove its entry.
- **Intro video:** `videos/loader-4k.mp4` plays on large, high-resolution screens and
  `videos/loader.mp4` everywhere else. To replace it, keep the same file names.

---

**Media rights:** confirm you have the rights to every photo, video and testimonial you
publish on the site.
