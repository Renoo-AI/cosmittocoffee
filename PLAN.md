# Cosmitto Coffee Sell-Ready Plan

This checklist prepares the project for final client delivery and resale.

## Delivery Checklist

- Confirm the live URL is final: https://cosmittocoffee.vercel.app/
- Confirm all menu prices, product names, phone number, locations, and opening hours are approved.
- Confirm the favicon, Open Graph image, and logo files are final.
- Confirm all media assets are inside `public/assets`.
- Confirm no runtime media depends on Dropshare, Unsplash, or Google Fonts.
- Confirm the client has access to the GitHub repository and Vercel project if needed.

## Pre-Sale QA

Run:

```bash
npm install
npm run build
npm run preview
```

Check locally:

- homepage renders correctly
- `/menu` renders correctly
- `/404` renders correctly
- `/qr-sticker/` renders correctly
- navbar links scroll to the right sections
- menu tabs scroll and highlight correctly
- footer links open the right social platforms
- map links open Google Maps

## Mobile And Browser Testing

Test on:

- iPhone Safari
- Android Chrome
- Desktop Chrome
- Desktop Edge or Safari

Check:

- hero videos autoplay muted
- one tap/click unmutes the current and next hero videos
- only one video plays at a time
- menu page is readable and easy to scroll
- buttons are easy to tap
- no text overlaps on small screens

## SEO And Social Preview

Check:

- `index.html` title and meta description
- canonical URL
- Open Graph title, description, and image
- Twitter card image
- JSON-LD business data
- `robots.txt`
- `sitemap.xml`

Recommended preview tools:

- https://www.opengraph.xyz/
- https://cards-dev.twitter.com/validator
- Google Search Console sitemap submission

## Vercel Verification

After every deployment, verify:

- `/` returns the homepage
- `/menu` works after refresh
- `/404` works after refresh
- `/qr-sticker/` works after refresh
- `/assets/videos/hero-01.mp4` returns `video/mp4`
- `/assets/favicon.png` returns `image/png`
- security headers are present

## Client Handoff

Provide the client with:

- repository link
- live website link
- this `README.md`
- this `PLAN.md`
- `IDEAS.md` for optional future upgrades
- note that source files are edited in `src/`, and public assets live in `public/assets`
