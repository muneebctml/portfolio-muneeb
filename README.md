# Portfolio

Personal portfolio built with Angular 18 (standalone components). The Angular app lives under `app/`.

## Quick Start

1. `cd app`
2. `npm install`
3. `npm start`
4. Open http://localhost:4200

## Project Structure

- `app/` — Angular workspace and source
- `app/src/assets/` — static assets and `resume.json` data
- `app/dist/app/` — production build output

## Common Scripts

Run these from `app/`:

- `npm start` — start dev server
- `npm run build` — build to `dist/app`
- `npm test` — run unit tests (Karma)

## Update Your Resume

Edit `app/src/assets/resume.json` with your details. Changes appear on reload.

## Build & Deploy

1. `cd app && npm run build`
2. Serve the contents of `dist/app` with any static host (e.g., Nginx, GitHub Pages, Netlify).

## More

For Angular CLI tips and scaffolding commands, see `app/README.md`.

