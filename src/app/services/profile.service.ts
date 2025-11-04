import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // Replace with your actual API endpoint
  private apiUrl = 'https://your-api.com/api/user/profile';

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
    return this.http.get<UserProfile>(this.apiUrl);
  }

  /**
   * For demo purposes - mock profile endpoint
   * Replace this with your actual API call
   */
  mockGetProfile(): Observable<UserProfile> {
    // Simulate API call
    return new Observable((observer) => {
      setTimeout(() => {
        const token = this.authService.getToken();
        const userInfo = token ? this.authService.getUserInfo() : null;

        const profile: UserProfile = {
          id: userInfo?.sub || '123',
          email: userInfo?.email || 'demo@example.com',
          name: userInfo?.name || 'John Doe',
          role: 'user',
          avatar: 'https://via.placeholder.com/150'
        };

        observer.next(profile);
        observer.complete();
      }, 500);
    });
  }
}

