import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, from, shareReplay } from 'rxjs';
import { Resume } from '../models/resume';
import resumeFallback from '../../assets/resume.json';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private readonly url = 'assets/resume.json';

  getResume(): Observable<Resume> {
    if (!isPlatformBrowser(this.platformId)) {
      return from(this.readServerResume());
    }
    return this.http.get<Resume>(this.url).pipe(shareReplay(1));
  }

  private async readServerResume(): Promise<Resume> {
    const fetchFn = (globalThis as unknown as { fetch?: typeof fetch }).fetch;
    if (typeof fetchFn !== 'function') return resumeFallback as Resume;

    const port = process.env['PORT'] ?? '4000';
    const origin = process.env['SSR_ORIGIN'] ?? `http://127.0.0.1:${port}`;
    const url = new URL('/assets/resume.json', origin).toString();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 800);

    try {
      const res = await fetchFn(url, { signal: controller.signal });
      if (!res.ok) return resumeFallback as Resume;
      return (await res.json()) as Resume;
    } catch {
      return resumeFallback as Resume;
    } finally {
      clearTimeout(timeout);
    }
  }
}
