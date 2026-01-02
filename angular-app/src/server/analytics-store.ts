import fs from 'node:fs/promises';
import path from 'node:path';

export type Visitor = {
  id: string;
  firstSeenAt: string;
  lastSeenAt: string;
  ip?: string;
  userAgent?: string;
  language?: string;
  timeZone?: string;
  screen?: { width: number; height: number };
  referrer?: string;
};

export type Session = {
  id: string;
  visitorId: string;
  startedAt: string;
  endedAt?: string;
  durationMs?: number;
  entryPath?: string;
  exitPath?: string;
  referrer?: string;
};

export type Pageview = {
  sessionId: string;
  path: string;
  title?: string;
  startedAt: string;
  durationMs?: number;
};

type AnalyticsDb = {
  visitors: Record<string, Visitor>;
  sessions: Record<string, Session>;
  pageviews: Pageview[];
};

export type Summary = {
  totals: {
    visitors: number;
    sessions: number;
    pageviews: number;
    avgSessionDurationMs: number | null;
  };
  recentSessions: Array<
    Pick<Session, 'id' | 'visitorId' | 'startedAt' | 'endedAt' | 'durationMs' | 'entryPath' | 'exitPath' | 'referrer'> & {
      visitor?: Pick<Visitor, 'ip' | 'language' | 'timeZone' | 'userAgent'>;
    }
  >;
};

export class AnalyticsStore {
  private readonly dbPath: string;
  private db: AnalyticsDb = { visitors: {}, sessions: {}, pageviews: [] };
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(dataDir: string) {
    this.dbPath = path.join(dataDir, 'analytics.json');
  }

  async init(): Promise<void> {
    await fs.mkdir(path.dirname(this.dbPath), { recursive: true });
    try {
      const raw = await fs.readFile(this.dbPath, 'utf8');
      const parsed = JSON.parse(raw) as AnalyticsDb;
      this.db = {
        visitors: parsed?.visitors ?? {},
        sessions: parsed?.sessions ?? {},
        pageviews: parsed?.pageviews ?? [],
      };
    } catch {
      // ignore; start fresh
    }
  }

  recordSessionStart(input: {
    visitorId: string;
    sessionId: string;
    startedAt: string;
    entryPath?: string;
    referrer?: string;
    ip?: string;
    userAgent?: string;
    language?: string;
    timeZone?: string;
    screen?: { width: number; height: number };
  }): void {
    const nowIso = new Date().toISOString();

    const existingVisitor = this.db.visitors[input.visitorId];
    this.db.visitors[input.visitorId] = {
      id: input.visitorId,
      firstSeenAt: existingVisitor?.firstSeenAt ?? nowIso,
      lastSeenAt: nowIso,
      ip: input.ip ?? existingVisitor?.ip,
      userAgent: input.userAgent ?? existingVisitor?.userAgent,
      language: input.language ?? existingVisitor?.language,
      timeZone: input.timeZone ?? existingVisitor?.timeZone,
      screen: input.screen ?? existingVisitor?.screen,
      referrer: input.referrer ?? existingVisitor?.referrer,
    };

    this.db.sessions[input.sessionId] = {
      id: input.sessionId,
      visitorId: input.visitorId,
      startedAt: input.startedAt,
      entryPath: input.entryPath,
      referrer: input.referrer,
    };

    void this.persistSoon();
  }

  recordPageview(input: { sessionId: string; path: string; title?: string; startedAt: string; durationMs?: number }) {
    if (!this.db.sessions[input.sessionId]) return;
    for (let i = this.db.pageviews.length - 1; i >= 0; i--) {
      const pv = this.db.pageviews[i];
      if (pv.sessionId !== input.sessionId) break;
      if (pv.path === input.path && pv.startedAt === input.startedAt) {
        pv.title = input.title ?? pv.title;
        pv.durationMs = input.durationMs ?? pv.durationMs;
        void this.persistSoon();
        return;
      }
    }

    this.db.pageviews.push({
      sessionId: input.sessionId,
      path: input.path,
      title: input.title,
      startedAt: input.startedAt,
      durationMs: input.durationMs,
    });
    void this.persistSoon();
  }

  recordSessionEnd(input: { sessionId: string; endedAt: string; durationMs?: number; exitPath?: string }): void {
    const session = this.db.sessions[input.sessionId];
    if (!session) return;

    session.endedAt = input.endedAt;
    session.exitPath = input.exitPath ?? session.exitPath;
    session.durationMs =
      input.durationMs ??
      (session.startedAt && input.endedAt
        ? Math.max(0, new Date(input.endedAt).getTime() - new Date(session.startedAt).getTime())
        : session.durationMs);

    const visitor = this.db.visitors[session.visitorId];
    if (visitor) visitor.lastSeenAt = new Date().toISOString();

    void this.persistSoon();
  }

  getSummary(limitRecent = 25): Summary {
    const sessions = Object.values(this.db.sessions);
    const ended = sessions.filter((s) => typeof s.durationMs === 'number' && s.durationMs >= 0);
    const avg =
      ended.length > 0
        ? Math.round(ended.reduce((acc, s) => acc + (s.durationMs ?? 0), 0) / ended.length)
        : null;

    const recentSessions = sessions
      .slice()
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limitRecent)
      .map((s) => {
        const visitor = this.db.visitors[s.visitorId];
        return {
        id: s.id,
        visitorId: s.visitorId,
        startedAt: s.startedAt,
        endedAt: s.endedAt,
        durationMs: s.durationMs,
        entryPath: s.entryPath,
        exitPath: s.exitPath,
        referrer: s.referrer,
        visitor: visitor
          ? { ip: visitor.ip, language: visitor.language, timeZone: visitor.timeZone, userAgent: visitor.userAgent }
          : undefined,
        };
      });

    return {
      totals: {
        visitors: Object.keys(this.db.visitors).length,
        sessions: sessions.length,
        pageviews: this.db.pageviews.length,
        avgSessionDurationMs: avg,
      },
      recentSessions,
    };
  }

  private persistSoon(): Promise<void> {
    this.writeQueue = this.writeQueue.then(async () => {
      const tmp = `${this.dbPath}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(this.db), 'utf8');
      await fs.rename(tmp, this.dbPath);
    });
    return this.writeQueue;
  }
}
