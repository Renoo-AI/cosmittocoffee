# Cosmitto Coffee Website

Client-ready website for Cosmitto Coffee, built as a fast static React/Vite site and prepared for deployment on Vercel.

Live site: https://cosmittocoffee.vercel.app/

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- TypeScript
- Vercel static hosting
- Local bundled media assets in `public/assets`

## Project Setup

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Node.js requirement: `>=20.19.0`.

## Deployment

The project is ready for Vercel.

Recommended Vercel settings:

- Framework preset: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 20 or newer

The `vercel.json` file includes:

- SPA rewrites for `/`, `/menu`, and `/404`
- clean URLs
- security headers
- long-term caching for `/assets`

## Assets

All required media is bundled locally in `public/assets`, so the website does not depend on Dropshare, Unsplash, or Google Fonts at runtime.

Important folders and files:

- Logos: `public/assets/logo-black.png`, `logo-red.png`, `logo-white.png`
- Favicon: `public/assets/favicon.png`
- Open Graph image: `public/assets/og-image.png`
- Hero videos: `public/assets/videos/hero-01.mp4`, `hero-02.mp4`, `hero-03.mp4`
- Local fonts: `public/assets/fonts`
- Page images: `hero-poster.jpg`, `coffee-beans.png`, `frappe.png`, `classic-coffee.png`, `interior.png`, `morning-boost.jpg`, `cold-drink.jpg`

To replace an asset, keep the same filename and path when possible. This avoids needing code changes.

## Editing Content

Most site content is currently edited in `src/App.tsx`.

Common edits:

- Phone number: `PHONE_DISPLAY` and `PHONE_HREF`
- Social links: `SOCIAL_LINKS`
- Locations and map links: `LOCATIONS`
- Menu items and prices: `MENU`
- Hero video order: `HERO_VIDEO_URLS`
- Logos: `LOGO_URLS`

SEO and social preview metadata are in `index.html`.

Site manifest, robots, and sitemap files are in `public/`.

## Final Checks Before Delivery

Before handing the site to a client or publishing a new version:

```bash
npm run build
```

Then check:

- homepage loads
- `/menu` loads
- `/404` loads
- hero videos play on desktop and mobile
- mute/unmute works
- favicon appears in the browser tab
- Open Graph image appears in social preview tools
- phone, social links, locations, hours, and prices are final

## Files Not To Commit

These folders are generated locally and should not be committed:

- `node_modules/`
- `dist/`
- `.vercel/`

