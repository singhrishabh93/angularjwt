import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor() {}

  /**
   * Store JWT token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('🔐 JWT Token stored:', token);
    console.log('📋 Token decoded:', this.decodeToken(token));
  }

  /**
   * Get JWT token from localStorage
   */
  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      console.log('🔑 Current JWT Token:', token);
      console.log('📋 Token decoded:', this.decodeToken(token));
    }
    return token;
  }

  /**
   * Remove JWT token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  /**
   * Decode JWT token payload (for demonstration purposes)
   * Note: In production, validate token signature on backend
   */
  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Get user info from token
   */
  getUserInfo(): any {
    const token = this.getToken();
    if (token) {
      return this.decodeToken(token);
    }
    return null;
  }
}

