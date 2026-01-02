# Portfolio

Personal portfolio built with Angular 18 (standalone components). The Angular app lives under `angular-app/`.

## Quick Start

1. `cd angular-app`
2. `npm install`
3. `npm start`
4. Open http://localhost:4200

## Project Structure

- `angular-app/` - Angular workspace and source
- `angular-app/src/assets/` - static assets and `resume.json` data
- `angular-app/dist/app/` - production build output

## Common Scripts

Run these from `angular-app/`:

- `npm start` - start dev server
- `npm run build` - build to `dist/app`
- `npm test` - run unit tests (Karma)

## Update Your Resume

Edit `angular-app/src/assets/resume.json` with your details. Changes appear on reload.

## Build & Deploy

1. `cd angular-app && npm run build`
2. Serve `dist/app/browser` with any static host (for a static site), or run the SSR server in `dist/app/server` (required for the admin dashboard/API).

## Docker

Production build served by the Node SSR server (includes the analytics API):

1. `docker compose up --build`
2. Open http://localhost:9999

Use a different port:

- PowerShell: `$env:PORT=3000; docker compose up --build`
- Bash: `PORT=3000 docker compose up --build`

## Admin dashboard

- Login: `http://localhost:9999/admin/login`
- Dashboard: `http://localhost:9999/admin/dashboard`
- Resume editor: `http://localhost:9999/admin/resume`

Credentials are controlled via env vars in `docker-compose.yml` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`).

## SEO

The Angular app is configured for SSR + prerender (SSG) so the static build includes real HTML + meta tags (better for Google and link previews).

- Edit `angular-app/src/assets/resume.json` to control title/description and OpenGraph/Twitter tags.
- Edit `angular-app/public/sitemap.xml` and `angular-app/public/robots.txt` with your real domain.

## More

For Angular CLI tips and scaffolding commands, see `angular-app/README.md`.
