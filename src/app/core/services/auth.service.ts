import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id?: string;
  _id?: string;
  name?: string;
  adminName?: string;
  role?: 'Super Admin' | 'Admin' | 'Sales' | string;
  phoneNumber?: string;
  contactNumber?: string;
  email?: string;
  permissions?: string[];
  status?: boolean;
  firstName?: string;
  lastName?: string;
  roleType?: string;
  expiresAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = signal<boolean>(!!this.getUserFromStorage());
  sessionExpiresAt = signal<string | null>(this.getExpiryFromStorage());

  private sessionCheckInterval: any;

  constructor() {
    this.startSessionTracking();
  }

  async login(phoneNumber: string, passwordOrOtp: string, mode: 'PASSWORD' | 'OTP') {
    if (mode === 'PASSWORD') {
      const payload = {
        phoneNumber: phoneNumber,
        password: passwordOrOtp,
      };

      try {
        const response = await firstValueFrom(
          this.http.post<any>(`${environment.apiUrl}/api/web/iw/auth/admin/sign/in/v1`, payload),
        );

        if (!response || !response.status) {
          throw new Error(response?.msg || 'Login failed');
        }

        const tokenObj = response.result?.[0];
        const token = tokenObj?.token;
        const expiresAt = tokenObj?.expiresAt;

        if (!token) {
          throw new Error('Token not found in response');
        }

        if (expiresAt) {
          localStorage.setItem('expiresAt', expiresAt);
          this.sessionExpiresAt.set(expiresAt);
          this.startSessionTracking();
        }

        // After login, try to fetch the actual profile. Give it a fallback if it fails.
        try {
          await this.fetchProfile();
        } catch (profileErr) {
          console.error('Failed to fetch profile after login, using defaults', profileErr);
          const user: User = {
            id: '1',
            name: 'Admin User',
            role: 'Super Admin',
            phoneNumber: phoneNumber,
            permissions: [],
          };
          this.storeUser(user, token);
        }

        return true;
      } catch (error) {
        console.error('Login failed', error);
        throw error;
      }
    }

    // Fallback or OTP logic (keeping it simple for now)
    return false;
  }

  logout() {
    this.stopSessionTracking();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    this.currentUser.set(null);
    this.sessionExpiresAt.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  async fetchProfile() {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${environment.apiUrl}/api/web/iw/admin/profile/v1`),
      );
      if (response && response.status && response.result && response.result.length > 0) {
        const profileData = response.result[0];

        // Map the API fields to our internal User model fields
        const mappedUser: User = {
          ...profileData,
          name:
            `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() ||
            profileData.adminName ||
            'Admin User',
          role: profileData.roleType || 'Admin',
        };

        // Merge the new profile data while keeping token
        const token = this.getToken() || '';
        this.storeUser(mappedUser, token);
        return mappedUser;
      } else {
        throw new Error('Profile fetch failed or returned no data');
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw error;
    }
  }

  private storeUser(user: User, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private getExpiryFromStorage(): string | null {
    return localStorage.getItem('expiresAt');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // --- Session Tracking Logic ---
  private startSessionTracking() {
    this.stopSessionTracking(); // Ensure no duplicates

    // Check immediately on start
    this.checkSession();

    // Then check every 5 seconds
    this.sessionCheckInterval = setInterval(() => {
      this.checkSession();
    }, 5000);
  }

  private stopSessionTracking() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  private checkSession() {
    const expiresAtStr = this.sessionExpiresAt();
    if (!expiresAtStr) return;

    const expiresAtDate = new Date(expiresAtStr).getTime();
    const now = new Date().getTime();

    // If current time is past expiration, or within 1 second of it
    if (now >= expiresAtDate) {
      console.warn('Session expired. Automatically logging out.');
      this.logout();
    }
  }
}
