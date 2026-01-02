import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay } from 'rxjs';
import { Resume } from '../models/resume';
import resumeData from '../../assets/resume.json';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private readonly url = 'assets/resume.json';

  getResume(): Observable<Resume> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(resumeData as Resume).pipe(shareReplay(1));
    }

    return this.http.get<Resume>(this.url).pipe(shareReplay(1));
  }
}
