import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from './admin-api.service';
import { AdminAuthService } from './admin-auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="wrap">
      <div class="card">
        <h1>Admin Login</h1>
        <p class="muted">Sign in to view analytics.</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <label>
            Username
            <input formControlName="username" autocomplete="username" />
          </label>

          <label>
            Password
            <input type="password" formControlName="password" autocomplete="current-password" />
          </label>

          <button type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Signing in...' : 'Sign in' }}
          </button>

          <p class="error" *ngIf="error()">{{ error() }}</p>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .wrap {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1.5rem;
        background: #0b0c10;
        color: #e6e6e6;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
      }
      .card {
        width: min(420px, 100%);
        border: 1px solid #252633;
        border-radius: 0.9rem;
        padding: 1.25rem;
        background: #111217;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
      }
      h1 {
        font-size: 1.4rem;
        margin: 0 0 0.25rem;
      }
      .muted {
        margin: 0 0 1rem;
        color: #a3a3a3;
      }
      form {
        display: grid;
        gap: 0.9rem;
      }
      label {
        display: grid;
        gap: 0.35rem;
        color: #a3a3a3;
        font-size: 0.9rem;
      }
      input {
        border: 1px solid #252633;
        border-radius: 0.6rem;
        padding: 0.7rem 0.8rem;
        background: #0b0c10;
        color: #e6e6e6;
        outline: none;
      }
      input:focus {
        border-color: #6c5ce7;
      }
      button {
        border: 0;
        border-radius: 0.7rem;
        padding: 0.75rem 0.9rem;
        background: #6c5ce7;
        color: #0b0c10;
        font-weight: 700;
        cursor: pointer;
      }
      button[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .error {
        margin: 0.25rem 0 0;
        color: #ff7675;
      }
    `,
  ],
})
export class LoginComponent {
  private api = inject(AdminApiService);
  private auth = inject(AdminAuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);

    const { username, password } = this.form.getRawValue();
    this.api.login(username, password).subscribe({
      next: ({ token }) => {
        this.auth.setToken(token);
        this.router.navigateByUrl('/admin/dashboard');
      },
      error: (err) => {
        const msg = err?.status === 401 ? 'Invalid username or password' : 'Login failed';
        this.error.set(msg);
        this.loading.set(false);
      },
    });
  }
}

