import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // EscuelaJS API endpoint
  private apiUrl = 'https://api.escuelajs.co/api/v1/auth/login';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Login user and get JWT token
   * This service makes a POST request to the login endpoint
   * and automatically stores the token using AuthService
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap((response) => {
        // Automatically store tokens when login is successful
        if (response.access_token) {
          this.authService.setToken(response.access_token);
          this.authService.setRefreshToken(response.refresh_token);
          console.log('✅ Login successful! Tokens stored.');
          console.log('📦 Login Response:', response);
        }
      })
    );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(refreshToken: string): Observable<LoginResponse> {
    const refreshUrl = 'https://api.escuelajs.co/api/v1/auth/refresh-token';
    return this.http.post<LoginResponse>(refreshUrl, { refreshToken }).pipe(
      tap((response) => {
        if (response.access_token) {
          this.authService.setToken(response.access_token);
          this.authService.setRefreshToken(response.refresh_token);
          console.log('✅ Token refreshed successfully!');
        }
      })
    );
  }
}

