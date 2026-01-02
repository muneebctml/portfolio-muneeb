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
2. Serve the contents of `dist/app` with any static host (e.g., Nginx, GitHub Pages, Netlify).

## Docker

Production build served by Nginx:

1. `docker compose up --build`
2. Open http://localhost:8080

## More

For Angular CLI tips and scaffolding commands, see `angular-app/README.md`.

