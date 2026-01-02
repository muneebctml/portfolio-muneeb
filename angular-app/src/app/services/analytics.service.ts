import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

type ScreenInfo = { width: number; height: number };

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  private initialized = false;
  private visitorId = '';
  private sessionId = '';
  private sessionStartedAt = '';
  private pageStartedAt = '';
  private currentPath = '';
  private ended = false;

  init(): void {
    if (this.initialized) return;
    if (!isPlatformBrowser(this.platformId)) return;
    this.initialized = true;

    this.visitorId = this.getOrCreateVisitorId();
    this.sessionId = this.uuid();
    this.sessionStartedAt = new Date().toISOString();
    this.pageStartedAt = this.sessionStartedAt;
    this.currentPath = this.router.url || '/';

    this.startSession();
    this.trackPageview(this.currentPath);

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        filter((e) => e.urlAfterRedirects !== this.currentPath)
      )
      .subscribe((e) => {
        this.flushPageDuration();
        this.currentPath = e.urlAfterRedirects;
        this.pageStartedAt = new Date().toISOString();
        this.trackPageview(this.currentPath);
      });

    window.addEventListener('hashchange', () => {
      const next = `${location.pathname}${location.search}${location.hash}`;
      if (next === this.currentPath) return;
      this.flushPageDuration();
      this.currentPath = next;
      this.pageStartedAt = new Date().toISOString();
      this.trackPageview(this.currentPath);
    });

    const end = () => this.endSession();
    window.addEventListener('beforeunload', end);
    this.document.addEventListener('visibilitychange', () => {
      if (this.document.visibilityState === 'hidden') end();
    });
  }

  private startSession(): void {
    const payload = {
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      startedAt: this.sessionStartedAt,
      entryPath: this.currentPath,
      referrer: this.document.referrer || undefined,
      language: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: this.getScreen(),
    };
    this.http.post('/api/track/session/start', payload).subscribe({ error: () => {} });
  }

  private flushPageDuration(): void {
    const started = new Date(this.pageStartedAt).getTime();
    const durationMs = Math.max(0, Date.now() - started);
    const payload = {
      sessionId: this.sessionId,
      path: this.currentPath,
      title: this.document.title || undefined,
      startedAt: this.pageStartedAt,
      durationMs,
    };
    this.http.post('/api/track/pageview', payload).subscribe({ error: () => {} });
  }

  private trackPageview(path: string): void {
    const payload = {
      sessionId: this.sessionId,
      path,
      title: this.document.title || undefined,
      startedAt: this.pageStartedAt,
    };
    this.http.post('/api/track/pageview', payload).subscribe({ error: () => {} });
  }

  private endSession(): void {
    if (this.ended) return;
    this.ended = true;
    this.flushPageDuration();

    const durationMs = Math.max(0, Date.now() - new Date(this.sessionStartedAt).getTime());
    const payload = {
      sessionId: this.sessionId,
      endedAt: new Date().toISOString(),
      durationMs,
      exitPath: this.currentPath,
    };

    const body = JSON.stringify(payload);
    const ok = navigator.sendBeacon?.('/api/track/session/end', new Blob([body], { type: 'application/json' }));
    if (!ok) this.http.post('/api/track/session/end', payload).subscribe({ error: () => {} });
  }

  private getOrCreateVisitorId(): string {
    const key = 'portfolio_visitor_id';
    try {
      const existing = localStorage.getItem(key);
      if (existing) return existing;
      const id = this.uuid();
      localStorage.setItem(key, id);
      return id;
    } catch {
      return this.uuid();
    }
  }

  private getScreen(): ScreenInfo {
    return { width: window.screen.width, height: window.screen.height };
  }

  private uuid(): string {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

