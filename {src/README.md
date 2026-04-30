# Weather Any Storm — Dominique Schleider Senior Show

RSVP landing page for a senior fashion show. Built with Next.js 14, React, TypeScript, and plain CSS. Rain-themed, editorial aesthetic.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
senior-fashion-show/
├── public/
│   └── images/               ← Drop logo.png and welcome.jpg here
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── rsvp/
│   │   │       └── route.ts  ← Google Sheets webhook handler
│   │   ├── globals.css       ← All styles
│   │   ├── layout.tsx
│   │   └── page.tsx          ← App shell / view state
│   └── components/
│       ├── ConfirmationPage.tsx
│       ├── LandingPage.tsx
│       ├── LogoHeader.tsx
│       ├── NameFields.tsx
│       ├── RainAnimation.tsx
│       └── RSVPPanel.tsx
├── .env.local.example        ← Copy to .env.local
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Replacing the Logo

1. Add your logo file to `/public/images/logo.png` (SVG or PNG, white/transparent works best)
2. Open `src/components/LogoHeader.tsx`
3. Replace the `<span className="logo-text-fallback">` block with:

```tsx
<Image
  src="/images/logo.png"
  alt="Your Name / Brand"
  width={160}
  height={44}
  priority
/>
```

---

## Replacing the Welcome Image

1. Add your image to `/public/images/welcome.jpg` (portrait orientation recommended)
2. Open `src/components/LandingPage.tsx`
3. Replace the `<div className="welcome-image-placeholder">` block with:

```tsx
<Image
  src="/images/welcome.jpg"
  alt="Dominique Schleider Senior Show"
  fill
  style={{ objectFit: 'cover', objectPosition: 'center top' }}
  priority
/>
```

---

## Google Sheets Setup (Data Storage)

### Step 1 — Create the Sheet

Open Google Sheets and create a new spreadsheet. Add these headers in row 1:

| Timestamp | Email | Status | Attendee Count | Attendee Names | Decline First Name | Decline Last Name |

### Step 2 — Create the Apps Script Webhook

1. In your sheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date().toISOString(),
    data.email,
    data.status,
    data.attendeeCount,
    data.attendeeNames,
    data.declineFirstName,
    data.declineLastName
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy → New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** and copy the Web App URL

### Step 3 — Add the Environment Variable

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

> ⚠️ Never commit `.env.local` — it is already in `.gitignore`.

---

## Deploying to Vercel (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. In **Environment Variables**, add:
   - `GOOGLE_SHEETS_WEBHOOK_URL` = your Apps Script URL
4. Click **Deploy**

Your site will be live in ~60 seconds.

---

## Deploying to Netlify

```bash
npm run build
```

Then drag the `.next` folder into Netlify, or connect your GitHub repo and set the build command to `npm run build` and publish directory to `.next`.

Add `GOOGLE_SHEETS_WEBHOOK_URL` in Netlify → Site Settings → Environment Variables.

---

## Customizing Content

All event copy lives in `src/components/LandingPage.tsx`:

- **Title**: "Weather Any Storm"
- **Subtitle**: "Dominique Schleider Senior Show"
- **Details**: Date, time, venue
- **Thanks line**: Sponsors

Edit those strings directly.

---

## Design Notes

- **Font**: Helvetica Neue (system font, no external load needed for Helvetica)
- **Palette**: Black `#0a0a0a`, off-white `#f5f5f0`, grays
- **Rain**: Canvas-based animation (`RainAnimation.tsx`) with ambient + burst modes
- **Transitions**: Slide-up panel (`transform: translateY`) with `cubic-bezier(0.76, 0, 0.24, 1)`
- **Mobile**: Responsive breakpoints at 768px and 480px — image stacks above text on mobile
