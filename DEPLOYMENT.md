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

Set `VITE_API_URL` to the separately hosted backend's HTTPS origin, without `/api` or a trailing slash. It is currently used by the contact form. Set it for Production and, if required, Preview environments. Rebuild/redeploy after changing it: Vite embeds this public value during the build. Never store secrets in a `VITE_*` variable.

Set `AIRBNB_ICAL_URL` in the Vercel project's server-side Environment Variables for Production and Preview as appropriate. Never prefix it with `VITE_`: the private value is read only by the `/api/availability` Vercel Function and is not included in the browser bundle.

`frontend/vercel.json` supplies the SPA fallback to `index.html` for direct visits and refreshes. Existing static files and the `/api/availability` filesystem function take precedence over the fallback. Routes are `/`, `/why-sa-corte-antiga`, `/gallery`, `/contact`, `/garden-house`, and `/garden-house/gallery`.

References: [Vercel Vite SPA configuration](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas), [Vite environment variables](https://vite.dev/guide/env-and-mode).

## Backend host

- Working directory: `backend`
- Install: `npm install`
- Build: `npm run build`
- Start: `npm start`
- `PORT`: use the host-provided value; defaults to `3000`.
- `FRONTEND_URL`: the exact deployed frontend origin. Multiple approved origins can be supplied as a comma-separated list. Add preview origins explicitly if those deployments need API access. No guessed domain or wildcard is configured.
- `AIRBNB_ICAL_URL`: the same private Airbnb iCal feed used by the Vercel Function, required only if this Express endpoint is deployed and used.
- Health endpoint: `/api/health`.

The server does not bind to a localhost-only interface. SMTP variables support contact delivery; `AIRBNB_ICAL_URL` supports the Express availability endpoint. Other calendar variables remain reserved for future integrations.

## Local development

Copy `frontend/.env.example` to `frontend/.env.local` and `backend/.env.example` to `backend/.env`, then run `npm run dev` in each directory. The backend uses port 3000 and the frontend uses 5173. If the frontend variable is unset, the development proxy also targets port 3000.

## Verification and launch status

Run `npm install`, `npm run typecheck`, and `npm run build` in each directory. Frontend output is `frontend/dist`; backend output is `backend/dist`.

After deployment, directly open and refresh every route and confirm images load. Check `/api/health` on the backend and verify the exact frontend origin is allowed by CORS.

The Vite deployment includes a serverless `/api/availability` function, so Airbnb availability works without a persistent Express server once `AIRBNB_ICAL_URL` is configured in Vercel. The contact form still needs the separately deployed backend and `VITE_API_URL`.

Dependency directories, build output, local environment files, and local verification artifacts are excluded from Git. `.env.example` files remain versionable. Commit only source/configuration and lockfiles; do not publish real environment files.
