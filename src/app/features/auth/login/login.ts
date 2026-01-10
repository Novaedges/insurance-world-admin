import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

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

  isOtpMode = signal(false);
  isLoading = signal(false);

  loginForm = this.fb.group({
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    password: ['', [Validators.required]],
    otp: [''],
  });

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

    await this.authService.login(phoneNumber!, credential!, mode);
    this.isLoading.set(false);
    this.router.navigate(['/dashboard']);
  }
}
