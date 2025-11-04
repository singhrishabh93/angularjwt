import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService, UserProfile } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Load user profile
    this.loadProfile();
  }

  /**
   * Load user profile
   * The JWT token will be automatically added to headers by the interceptor
   */
  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Call real API profile endpoint
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        console.log('✅ Profile loaded:', profile);
        this.profile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Profile error:', error);
        // Handle different error types
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized. Please login again.';
          // Optionally redirect to login
          setTimeout(() => {
            this.logout();
          }, 2000);
        } else if (error.status === 403) {
          this.errorMessage = 'Access forbidden. Insufficient permissions.';
        } else {
          this.errorMessage = error.error?.message || 'Failed to load profile. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  /**
   * Get token info for display
   */
  getTokenInfo(): any {
    const token = this.authService.getToken();
    if (token) {
      return this.authService.getUserInfo();
    }
    return null;
  }
}

