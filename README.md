# Portfolio

Personal portfolio (https://muneebtech.net/) built with Angular 18 standalone components. The live site is the Angular app in `angular-app/`. `react-app-v1/` and `react-app-v2/` are experiments and are not deployed.

## Quick Start

1. `cd angular-app`
2. `npm install`
3. `npm start`
4. Open http://localhost:4200

## Project Structure

- `angular-app/` — Angular workspace and source
- `angular-app/src/assets/` — static assets and `resume.json` data
- `angular-app/dist/app/browser/` — production build output

## Common Scripts

Run these from `angular-app/`:

- `npm start` — start dev server
- `npm run build` — build to `dist/app`
- `npm test` — run unit tests (Karma)

## Update Your Resume

Edit `angular-app/src/assets/resume.json` with your details. Changes appear on reload.

The downloadable CVs are `angular-app/src/assets/Muneeb-Ur-Rehman-Backend-Resume.pdf` and `Muneeb-Ur-Rehman-FullStack-Resume.pdf`. `Muneeb-Ur-Rehman-Resume.pdf` is kept as a copy of the backend CV so older links still work.

## Build & Deploy

1. `cd angular-app && npm run build`
2. Serve the contents of `dist/app/browser` with any static host (e.g., Nginx, GitHub Pages, Netlify).

## More

For Angular CLI tips and scaffolding commands, see `angular-app/README.md`.

