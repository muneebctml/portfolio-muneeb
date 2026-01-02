import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminApiService } from './admin-api.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="wrap">
      <header class="top">
        <div>
          <h1>Resume Editor</h1>
          <p class="muted">Edits the live resume JSON used by your portfolio.</p>
        </div>
        <div class="actions">
          <a routerLink="/admin/dashboard" class="link">Back</a>
          <button (click)="reload()" [disabled]="loading()">Reload</button>
          <button class="primary" (click)="save()" [disabled]="loading()">Save</button>
        </div>
      </header>

      <p class="error" *ngIf="error()">{{ error() }}</p>
      <p class="ok" *ngIf="saved()">Saved.</p>

      <textarea class="editor" [value]="text()" (input)="onInput($event)" spellcheck="false"></textarea>
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
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      h1 {
        margin: 0;
        font-size: 1.4rem;
      }
      .muted {
        margin: 0.35rem 0 0;
        color: #a3a3a3;
      }
      .actions {
        display: flex;
        gap: 0.6rem;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-end;
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
      button.primary {
        border: 0;
        background: #6c5ce7;
        color: #0b0c10;
        font-weight: 800;
      }
      button[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .editor {
        width: 100%;
        min-height: calc(100vh - 160px);
        border: 1px solid #252633;
        border-radius: 0.8rem;
        padding: 0.9rem;
        background: #111217;
        color: #e6e6e6;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        line-height: 1.4;
        outline: none;
        resize: vertical;
      }
      .editor:focus {
        border-color: #6c5ce7;
      }
      .error {
        color: #ff7675;
        margin: 0 0 0.75rem;
      }
      .ok {
        color: #55efc4;
        margin: 0 0 0.75rem;
      }
      @media (max-width: 720px) {
        .top {
          flex-direction: column;
          align-items: stretch;
        }
        .actions {
          justify-content: flex-start;
        }
      }
    `,
  ],
})
export class ResumeEditorComponent {
  private api = inject(AdminApiService);
  private platformId = inject(PLATFORM_ID);

  loading = signal(false);
  error = signal<string | null>(null);
  saved = signal(false);
  text = signal('{\n}\n');

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.reload();
  }

  onInput(e: Event): void {
    this.saved.set(false);
    const value = (e.target as HTMLTextAreaElement).value;
    this.text.set(value);
  }

  reload(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.saved.set(false);

    this.api.getResume().subscribe({
      next: (data) => {
        try {
          this.text.set(`${JSON.stringify(data, null, 2)}\n`);
        } catch {
          this.text.set('{\n}\n');
        }
        this.loading.set(false);
      },
      error: (err) => {
        const msg = err?.status === 401 ? 'Unauthorized' : 'Failed to load resume';
        this.error.set(msg);
        this.loading.set(false);
      },
    });
  }

  save(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.saved.set(false);

    let parsed: unknown;
    try {
      parsed = JSON.parse(this.text());
    } catch {
      this.error.set('Invalid JSON (fix formatting and try again)');
      this.loading.set(false);
      return;
    }

    this.api.updateResume(parsed).subscribe({
      next: () => {
        this.saved.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        const msg = err?.status === 401 ? 'Unauthorized' : 'Failed to save resume';
        this.error.set(msg);
        this.loading.set(false);
      },
    });
  }
}

