import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  role: 'Super Admin' | 'Admin' | 'Sales';
  phoneNumber: string;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = signal<boolean>(!!this.getUserFromStorage());

  constructor(private router: Router) {}

  login(phoneNumber: string, passwordOrOtp: string, mode: 'PASSWORD' | 'OTP') {
    // MOCK LOGIN LOGIC
    console.log(`Logging in with ${phoneNumber} and ${mode}`);

    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          name: 'Admin User',
          role: 'Super Admin',
          phoneNumber: phoneNumber,
          permissions: [], // All permissions for Super Admin
        };

        this.storeUser(mockUser, 'mock-jwt-token');
        resolve(true);
      }, 1000);
    });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Keep this for consistency with storeUser
    this.currentUser.set(null); // Keep this for consistency
    this.isAuthenticated.set(false); // Keep this for consistency
    this.router.navigate(['/login']);
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

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
