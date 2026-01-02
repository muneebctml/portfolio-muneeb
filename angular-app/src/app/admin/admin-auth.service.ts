import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly key = 'portfolio_admin_token';

  getToken(): string | null {
    try {
      return localStorage.getItem(this.key);
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    try {
      localStorage.setItem(this.key, token);
    } catch {
      // ignore
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {
      // ignore
    }
  }
}

