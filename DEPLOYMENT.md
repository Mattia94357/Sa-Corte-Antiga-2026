# Deployment

Deploy the Vite frontend and Express backend separately. No deployment is performed by the build commands.

## Vercel frontend settings

| Setting | Value |
| --- | --- |
| Root Directory | `frontend` |
| Framework Preset | `Vite` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js | `22.x` |

Set `VITE_API_URL` to the separately hosted backend's HTTPS origin, without `/api` or a trailing slash. Set it for Production and, if required, Preview environments. Rebuild/redeploy after changing it: Vite embeds this public value during the build. Never store secrets in a `VITE_*` variable.

`frontend/vercel.json` supplies the SPA fallback to `index.html` for direct visits and refreshes. Existing static files are served normally. Routes are `/`, `/why-sa-corte-antiga`, `/gallery`, `/contact`, `/garden-house`, and `/garden-house/gallery`.

References: [Vercel Vite SPA configuration](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas), [Vite environment variables](https://vite.dev/guide/env-and-mode).

## Backend host

- Working directory: `backend`
- Install: `npm install`
- Build: `npm run build`
- Start: `npm start`
- `PORT`: use the host-provided value; defaults to `3000`.
- `FRONTEND_URL`: the exact deployed frontend origin. Multiple approved origins can be supplied as a comma-separated list. Add preview origins explicitly if those deployments need API access. No guessed domain or wildcard is configured.
- Health endpoint: `/api/health`.

The server does not bind to a localhost-only interface. The example SMTP/calendar variables are reserved for future integrations and are not currently required or used.

## Local development

Copy `frontend/.env.example` to `frontend/.env.local` and `backend/.env.example` to `backend/.env`, then run `npm run dev` in each directory. The backend uses port 3000 and the frontend uses 5173. If the frontend variable is unset, the development proxy also targets port 3000.

## Verification and launch status

Run `npm install`, `npm run typecheck`, and `npm run build` in each directory. Frontend output is `frontend/dist`; backend output is `backend/dist`.

After deployment, directly open and refresh every route and confirm images load. Check `/api/health` on the backend and verify the exact frontend origin is allowed by CORS.

The frontend can be hosted as a static site, but API features need a running backend and the configured `VITE_API_URL`. The existing availability endpoint returns sample dates, and the contact endpoint validates requests without delivering email. Those behaviors are unchanged by deployment preparation; live booking feeds and email delivery remain separate launch work.

Dependency directories, build output, local environment files, and local verification artifacts are excluded from Git. `.env.example` files remain versionable. Commit only source/configuration and lockfiles; do not publish real environment files.
