# Portfolio

Personal portfolio generated with Angular 18 (standalone components).

## Run locally

1. `cd angular-app`
2. `npm start` or `npm run start`
3. Open `http://localhost:4200` in your browser

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

`npm run build` produces artifacts in `dist/`.

## Run with Docker (production build)

From the repo root:

1. `docker compose up --build`
2. Open `http://localhost:9999`

Use a different port:

- PowerShell: `$env:PORT=3000; docker compose up --build`
- Bash: `PORT=3000 docker compose up --build`

## Admin dashboard (analytics)

Tracks visitors/sessions/page time and exposes an admin UI:

- Login: `http://localhost:9999/admin/login`
- Dashboard: `http://localhost:9999/admin/dashboard`

Defaults are set in `docker-compose.yml` (change for real deployments):

- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`

## SEO (Google friendly)

This project is configured for SSR + prerender (SSG) so the generated `dist/app/browser/index.html` contains real page content and meta tags (better for crawlers and link previews).

- Update `src/assets/resume.json` (especially `name`, `title`, `summary`, `website`, `photo`) to control `<title>`, description, OpenGraph/Twitter tags, canonical URL and share image.
- Update `public/sitemap.xml` and `public/robots.txt` with your real domain before deploying.

## Update your resume

Edit `src/assets/resume.json` with your real details. The site updates on reload.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
