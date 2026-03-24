import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from './models/hotel';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'hotel_booking_token';
  isLoggedIn = signal(!!localStorage.getItem(this.tokenKey));
  currentRole = signal<string | null>(this.readRoleFromToken(localStorage.getItem(this.tokenKey)));

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest) {
    return this.http.post<AuthResponse>('Auth/login', payload).pipe(
      tap((response) => this.persistToken(response))
    );
  }

  register(payload: RegisterRequest) {
    return this.http.post<AuthResponse>('Auth/register', payload).pipe(
      tap((response) => this.persistToken(response))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn.set(false);
    this.currentRole.set(null);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(role: 'Admin' | 'User') {
    return this.currentRole() === role;
  }

  private extractToken(response: AuthResponse): string | null {
    const possibleToken = response.token ?? response['jwt'] ?? response['accessToken'];
    return typeof possibleToken === 'string' && possibleToken.length ? possibleToken : null;
  }

  private persistToken(response: AuthResponse) {
    const token = this.extractToken(response);
    if (token) {
      localStorage.setItem(this.tokenKey, token);
      this.isLoggedIn.set(true);
      this.currentRole.set(this.readRoleFromToken(token));
    }
  }

  private readRoleFromToken(token: string | null): string | null {
    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }

      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
      const parsed = JSON.parse(decoded) as Record<string, unknown>;
      const roleClaims = [
        parsed['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'],
        parsed['role'],
        parsed['roles']
      ];

      for (const claim of roleClaims) {
        const resolvedRole = this.normalizeRoleClaim(claim);
        if (resolvedRole) {
          return resolvedRole;
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  private normalizeRoleClaim(claim: unknown): 'Admin' | 'User' | null {
    if (typeof claim === 'string') {
      return this.normalizeRoleValue(claim);
    }

    if (Array.isArray(claim)) {
      for (const item of claim) {
        const resolved = this.normalizeRoleClaim(item);
        if (resolved) {
          return resolved;
        }
      }
    }

    return null;
  }

  private normalizeRoleValue(value: string): 'Admin' | 'User' | null {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'admin') {
      return 'Admin';
    }

    if (normalized === 'user') {
      return 'User';
    }

    return null;
  }
}
