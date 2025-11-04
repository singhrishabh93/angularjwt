import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UserProfile {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // EscuelaJS API endpoint
  private apiUrl = 'https://api.escuelajs.co/api/v1/auth/profile';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get user profile
   * The JWT token will be automatically added to headers by the interceptor
   */
  getProfile(): Observable<UserProfile> {
    // The authInterceptor will automatically add the Authorization header
    console.log('📡 Fetching user profile from API...');
    return this.http.get<UserProfile>(this.apiUrl);
  }
}

