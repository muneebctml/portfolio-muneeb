import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import type { Request } from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { AnalyticsStore } from './src/server/analytics-store';
import { issueAdminToken, requireAdminAuth, validateAdminCredentials } from './src/server/admin-auth';

const analytics = new AnalyticsStore(process.env['ANALYTICS_DATA_DIR'] ?? resolve(process.cwd(), '.data'));
const analyticsReady = analytics.init();

function getClientIp(req: Request): string | undefined {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string') return xff.split(',')[0]?.trim() || undefined;
  if (Array.isArray(xff) && xff.length > 0) return xff[0]?.trim() || undefined;
  return req.socket.remoteAddress || undefined;
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.disable('x-powered-by');
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.use('/admin', (_req, res, next) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    next();
  });

  const api = express.Router();
  api.use(express.json({ limit: '1mb' }));

  api.get('/health', (_req, res) => res.json({ ok: true }));

  api.post('/admin/login', (req, res) => {
    const username = String(req.body?.username ?? '');
    const password = String(req.body?.password ?? '');
    if (!validateAdminCredentials(username, password)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    try {
      res.json({ token: issueAdminToken(username) });
    } catch (e) {
      res.status(500).json({ error: 'Server misconfigured: JWT_SECRET not set' });
    }
  });

  api.get('/admin/summary', requireAdminAuth, (_req, res) => {
    res.json(analytics.getSummary());
  });

  api.post('/track/session/start', (req, res) => {
    const visitorId = String(req.body?.visitorId ?? '');
    const sessionId = String(req.body?.sessionId ?? '');
    const startedAt = String(req.body?.startedAt ?? '');
    if (!visitorId || !sessionId || !startedAt) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    analytics.recordSessionStart({
      visitorId,
      sessionId,
      startedAt,
      entryPath: typeof req.body?.entryPath === 'string' ? req.body.entryPath : undefined,
      referrer: typeof req.body?.referrer === 'string' ? req.body.referrer : undefined,
      ip: getClientIp(req),
      userAgent: typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : undefined,
      language: typeof req.body?.language === 'string' ? req.body.language : undefined,
      timeZone: typeof req.body?.timeZone === 'string' ? req.body.timeZone : undefined,
      screen:
        typeof req.body?.screen?.width === 'number' && typeof req.body?.screen?.height === 'number'
          ? { width: req.body.screen.width, height: req.body.screen.height }
          : undefined,
    });

    res.json({ ok: true });
  });

  api.post('/track/pageview', (req, res) => {
    const sessionId = String(req.body?.sessionId ?? '');
    const path = String(req.body?.path ?? '');
    const startedAt = String(req.body?.startedAt ?? '');
    if (!sessionId || !path || !startedAt) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    analytics.recordPageview({
      sessionId,
      path,
      title: typeof req.body?.title === 'string' ? req.body.title : undefined,
      startedAt,
      durationMs: typeof req.body?.durationMs === 'number' ? req.body.durationMs : undefined,
    });

    res.json({ ok: true });
  });

  api.post('/track/session/end', (req, res) => {
    const sessionId = String(req.body?.sessionId ?? '');
    const endedAt = String(req.body?.endedAt ?? '');
    if (!sessionId || !endedAt) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    analytics.recordSessionEnd({
      sessionId,
      endedAt,
      durationMs: typeof req.body?.durationMs === 'number' ? req.body.durationMs : undefined,
      exitPath: typeof req.body?.exitPath === 'string' ? req.body.exitPath : undefined,
    });

    res.json({ ok: true });
  });

  server.use('/api', api);

  // Serve static files from /browser
  server.use(express.static(browserDistFolder, { maxAge: '1y', index: false }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

async function run(): Promise<void> {
  await analyticsReady;
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

void run();
