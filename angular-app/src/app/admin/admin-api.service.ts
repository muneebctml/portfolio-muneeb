import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminAuthService } from './admin-auth.service';

export type AdminSummary = {
  totals: {
    visitors: number;
    sessions: number;
    pageviews: number;
    avgSessionDurationMs: number | null;
  };
  recentSessions: Array<{
    id: string;
    visitorId: string;
    startedAt: string;
    endedAt?: string;
    durationMs?: number;
    entryPath?: string;
    exitPath?: string;
    referrer?: string;
    visitor?: {
      ip?: string;
      language?: string;
      timeZone?: string;
      userAgent?: string;
    };
  }>;
};

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private auth = inject(AdminAuthService);

  login(username: string, password: string) {
    return this.http.post<{ token: string }>('/api/admin/login', { username, password });
  }

  getSummary() {
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get<AdminSummary>('/api/admin/summary', { headers });
  }
}
