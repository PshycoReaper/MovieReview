import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private api = 'http://localhost:3000/api/auth';

  adminName = signal(sessionStorage.getItem('adminName') ?? '');

  login(email: string, password: string) {
    return this.http.post(`${this.api}/login`, {
      email,
      password,
    });
  }
}
