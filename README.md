# DawaStore

Online pharmacy app for Pakistan: medicine catalogue, prescription upload, cart, checkout and an admin dashboard.

Live: https://hanif-ryk.github.io/Dawa-Store/

Built with React 19, TypeScript, Vite and Tailwind CSS v4. Originally generated in [Google AI Studio](https://ai.studio/apps/8912d2e5-95a1-4cc7-b7d9-13eeb8acbebd).

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # type check
npm run build    # production build in dist/
```

## Deployment

Every push to `main` is built and published to GitHub Pages by `.github/workflows/deploy.yml`.
Pull requests are built and type-checked but not deployed.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Do not upload built files (`index-*.js`, `index-*.css`) to the repo any more; edit the source in `src/` instead.

## Design system

Colors, type and component rules: `design-system/tokens.css`.

- Primary buttons: `bg-emerald-700`, hover `bg-emerald-800` (white text passes WCAG AA)
- Prescription (Rx) badges: indigo (`bg-indigo-50 text-indigo-700 border-indigo-200`, or solid `bg-indigo-600` on images)
- Headings use Outfit; body text uses Plus Jakarta Sans
- Minimum text size: 12px (`text-xs`)

## Known limitation

Login and the admin role are stored in the browser (`localStorage`); there is no server-side authentication.
Add a real auth backend before handling real customer or prescription data.
