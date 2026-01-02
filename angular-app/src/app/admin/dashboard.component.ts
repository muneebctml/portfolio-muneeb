import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminApiService, AdminSummary } from './admin-api.service';
import { AdminAuthService } from './admin-auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="wrap">
      <header class="top">
        <h1>Dashboard</h1>
        <div class="actions">
          <a routerLink="/admin/resume" class="link">Edit resume</a>
          <a routerLink="/" class="link">Back to site</a>
          <button (click)="logout()">Logout</button>
        </div>
      </header>

      <section class="grid" *ngIf="summary() as s; else loadingTpl">
        <div class="card">
          <div class="k">Visitors</div>
          <div class="v">{{ s.totals.visitors }}</div>
        </div>
        <div class="card">
          <div class="k">Sessions</div>
          <div class="v">{{ s.totals.sessions }}</div>
        </div>
        <div class="card">
          <div class="k">Pageviews</div>
          <div class="v">{{ s.totals.pageviews }}</div>
        </div>
        <div class="card">
          <div class="k">Avg session</div>
          <div class="v">{{ formatMs(s.totals.avgSessionDurationMs) }}</div>
        </div>
      </section>

      <section class="table" *ngIf="summary() as s">
        <h2>Recent Sessions</h2>
        <div class="row head">
          <div>Started</div>
          <div>Duration</div>
          <div>Entry</div>
          <div>Origin</div>
        </div>
        <div class="row" *ngFor="let r of s.recentSessions">
          <div>{{ r.startedAt | date: 'short' }}</div>
          <div>{{ formatMs(r.durationMs ?? null) }}</div>
          <div class="mono">{{ r.entryPath || '-' }}</div>
          <div class="mono">{{ formatOrigin(r) }}</div>
        </div>
      </section>

      <ng-template #loadingTpl>
        <p class="muted">Loading summary...</p>
        <p class="error" *ngIf="error()">{{ error() }}</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .wrap {
        min-height: 100vh;
        padding: 1.25rem;
        background: #0b0c10;
        color: #e6e6e6;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
      }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      h1 {
        margin: 0;
        font-size: 1.4rem;
      }
      .actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }
      .link {
        color: #a3a3a3;
        text-decoration: none;
      }
      button {
        border: 1px solid #252633;
        border-radius: 0.65rem;
        padding: 0.55rem 0.75rem;
        background: #111217;
        color: #e6e6e6;
        cursor: pointer;
      }
      .grid {
        display: grid;
        gap: 0.8rem;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin: 1rem 0 1.5rem;
      }
      .card {
        border: 1px solid #252633;
        border-radius: 0.8rem;
        padding: 0.9rem;
        background: #111217;
      }
      .k {
        color: #a3a3a3;
        font-size: 0.9rem;
      }
      .v {
        font-size: 1.4rem;
        font-weight: 800;
        margin-top: 0.15rem;
      }
      .table h2 {
        margin: 0 0 0.75rem;
        font-size: 1.1rem;
      }
      .row {
        display: grid;
        grid-template-columns: 170px 110px 1fr 1fr;
        gap: 0.75rem;
        padding: 0.55rem 0.75rem;
        border: 1px solid #252633;
        border-top: 0;
        background: #111217;
      }
      .row.head {
        border-top: 1px solid #252633;
        font-weight: 700;
      }
      .mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        color: #a3a3a3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .muted {
        color: #a3a3a3;
      }
      .error {
        color: #ff7675;
      }
      @media (max-width: 900px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .row {
          grid-template-columns: 140px 90px 1fr;
        }
        .row > div:nth-child(4) {
          display: none;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  private api = inject(AdminApiService);
  private auth = inject(AdminAuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  summary = signal<AdminSummary | null>(null);
  error = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.api.getSummary().subscribe({
      next: (s) => this.summary.set(s),
      error: (err) => {
        const msg = err?.status === 401 ? 'Unauthorized (check login/JWT_SECRET)' : 'Failed to load summary';
        this.error.set(msg);
      },
    });
  }

  logout(): void {
    this.auth.clear();
    this.router.navigateByUrl('/admin/login');
  }

  formatOrigin(r: AdminSummary['recentSessions'][number]): string {
    const ip = r.visitor?.ip;
    const tz = r.visitor?.timeZone;
    const ref = r.referrer ? this.tryHost(r.referrer) : null;
    return [ref, ip, tz].filter(Boolean).join(' · ') || '-';
  }

  private tryHost(url: string): string | null {
    try {
      return new URL(url).host;
    } catch {
      return url;
    }
  }

  formatMs(ms: number | null): string {
    if (ms === null) return '-';
    if (ms < 1000) return `${ms} ms`;
    const totalSec = Math.round(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  }
}
