# Vercel Deployment

Production URL:

https://cosmittocoffee.vercel.app/

## GitHub Upload

Commit these project files:

- `src/`
- `public/`
- `index.html`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `vercel.json`
- `.gitignore`
- `todo.txt`

Do not commit:

- `node_modules/`
- `dist/`
- `.vercel/`

## Vercel Settings

Vercel should auto-detect the project from `vercel.json`.

- Framework: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20 or newer

## After Deployment

Check:

- `https://cosmittocoffee.vercel.app/`
- `https://cosmittocoffee.vercel.app/robots.txt`
- `https://cosmittocoffee.vercel.app/sitemap.xml`
- browser tab favicon
- Open Graph preview
- mobile menu and hero video behavior
