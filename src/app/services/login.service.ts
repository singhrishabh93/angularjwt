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
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // Replace with your actual API endpoint
  private apiUrl = 'https://your-api.com/api/auth/login';

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
        // Automatically store token when login is successful
        if (response.token) {
          this.authService.setToken(response.token);
          console.log('Token stored successfully');
        }
      })
    );
  }

  /**
   * For demo purposes - mock login endpoint
   * Replace this with your actual API call
   */
  mockLogin(credentials: LoginRequest): Observable<LoginResponse> {
    // Simulate API call
    return new Observable((observer) => {
      setTimeout(() => {
        // Mock response - Replace with actual API call
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6ImRlbW9AZXhhbXBsZS5jb20ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        const response: LoginResponse = {
          token: mockToken,
          user: {
            id: '123',
            email: credentials.email,
            name: 'John Doe'
          }
        };
        
        // Store token
        this.authService.setToken(mockToken);
        console.log('✅ Login successful! Token received and stored.');
        console.log('📦 Login Response:', response);
        observer.next(response);
        observer.complete();
      }, 1000);
    });
  }
}

