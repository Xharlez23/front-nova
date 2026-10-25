import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API } from './api.config';
import { readJson } from './storage';
import { AuthResponse, User } from '../shared/models';

export const TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  readonly user = signal<User | null>(readJson<User>('user'));
  readonly isAdmin = computed(() => this.user()?.role === 'admin');
  get token(): string | null { return localStorage.getItem(TOKEN_KEY); }

  login(body: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${API}/auth/login`, body).pipe(tap(r => this.start(r)));
  }
  register(body: { name: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${API}/auth/register`, body).pipe(tap(r => this.start(r)));
  }
  logout(to = '/') {
    localStorage.removeItem(TOKEN_KEY); localStorage.removeItem('user');
    this.user.set(null); this.router.navigate([to]);
  }
  private start(r: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, r.token); localStorage.setItem('user', JSON.stringify(r.user)); this.user.set(r.user);
  }
}
