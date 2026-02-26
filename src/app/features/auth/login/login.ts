import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);

  userType = signal<'producer' | 'employee' | 'other'>('producer');
  isOtpMode = signal(false);
  isLoading = signal(false);
  showPassword = signal(false);

  loginForm = this.fb.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    password: ['', [Validators.required]],
    otp: ['', [Validators.pattern(/^[0-9]{6}$/)]],
  });

  setUserType(type: 'producer' | 'employee' | 'other') {
    this.userType.set(type);
  }

  togglePasswordVisibility() {
    this.showPassword.update((v) => !v);
  }

  toggleMode() {
    this.isOtpMode.update((v) => !v);
    const passwordControl = this.loginForm.get('password');
    const otpControl = this.loginForm.get('otp');

    if (this.isOtpMode()) {
      passwordControl?.clearValidators();
      otpControl?.setValidators([Validators.required]);
    } else {
      passwordControl?.setValidators([Validators.required]);
      otpControl?.clearValidators();
    }
    passwordControl?.updateValueAndValidity();
    otpControl?.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { phoneNumber, password, otp } = this.loginForm.value;
    const mode = this.isOtpMode() ? 'OTP' : 'PASSWORD';
    const credential = this.isOtpMode() ? otp : password;

    try {
      await this.authService.login(phoneNumber!, credential!, mode);
      this.snackbarService.success('Login successful! Welcome back.');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      const errorMessage = 'Login failed. Please try again.';
      this.snackbarService.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
