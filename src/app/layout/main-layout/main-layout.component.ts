import { Component, HostListener, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { SnackbarService } from '../../core/services/snackbar.service';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    SnackbarComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);

  isCollapsed = false;
  pageTitle = 'Dashboard';

  sessionTimeRemaining = signal<string>('--:--');
  private timerInterval: any;

  private routeMap: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/products': 'Product Management',
    '/inquiries': 'Inquiry Management',
    '/sales-reports': 'Sales Reports',
    '/admin-creation': 'Admin Creation',
    '/rto-management': 'RTO Management',
    '/vehicle-make': 'Vehicle Make',
    '/vehicle-model': 'Vehicle Model',
    '/insurance-category': 'Insurance Categories',
    '/policy-type': 'Policy Types',
    '/child-category': 'Sub-Categories',
    '/insurance-company': 'Insurance Companies',
    '/agent-management': 'Partner Management',
    '/whatsapp': 'WhatsApp Automation',
    '/sms': 'SMS Notifications',
    '/renewals': 'Renewal Management',
    '/payments': 'Payment Gateway',
    '/commissions': 'Commission Management',
    '/crm': 'CRM Integration',
    '/ai-engine': 'AI Premium Suggestions',
    '/marketing': 'Marketing Automation',
  };

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateTitle(event.url);
      });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.fetchProfile().catch((err) => {
        console.error('Initial profile fetch failed on layout load:', err);
      });

      this.startCountdownTimer();
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startCountdownTimer() {
    this.updateTimerDisplay(); // Initial tick
    this.timerInterval = setInterval(() => {
      this.updateTimerDisplay();
    }, 1000);
  }

  private updateTimerDisplay() {
    const expiresAtStr = this.authService.sessionExpiresAt();
    if (!expiresAtStr) {
      this.sessionTimeRemaining.set('--:--');
      return;
    }

    const expiresAtDate = new Date(expiresAtStr).getTime();
    const now = new Date().getTime();
    const diff = expiresAtDate - now;

    if (diff <= 0) {
      this.sessionTimeRemaining.set('00:00');
      return;
    }

    // Convert diff to mm:ss format
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Formatting logic
    const minsStr = minutes.toString().padStart(2, '0');
    const secsStr = seconds.toString().padStart(2, '0');

    // If over an hour, show hh:mm:ss
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMins = minutes % 60;
      const hrMinsStr = remainingMins.toString().padStart(2, '0');
      this.sessionTimeRemaining.set(`${hours}:${hrMinsStr}:${secsStr}`);
    } else {
      this.sessionTimeRemaining.set(`${minsStr}:${secsStr}`);
    }
  }

  private updateTitle(url: string) {
    // Check direct match or falls back to known prefixes
    const path = url.split('?')[0]; // simple handling
    // Find matching route
    const match = Object.keys(this.routeMap).find((route) => path.startsWith(route));
    this.pageTitle = match ? this.routeMap[match] : 'Dashboard';
  }

  hasAccess(moduleId: string): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;

    const role = user.role?.toUpperCase() || '';
    if (role === 'SUPER ADMIN' || role === 'SUPER_ADMIN' || role === 'ADMIN') return true;

    return (user.permissions || []).includes(moduleId);
  }

  hasSectionAccess(modules: string[]): boolean {
    return modules.some((m) => this.hasAccess(m));
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  // Mobile Sidebar logic
  isMobileSidebarOpen = false;
  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  // Settings Dropdown Logic
  isSettingsOpen = false;

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  closeSettingsMenu() {
    this.isSettingsOpen = false;
  }

  logout() {
    this.authService.logout();
  }

  // Experimental UI
  isCheckingNotification = false;

  triggerNotificationAnimation() {
    if (this.isCheckingNotification) return;

    this.isCheckingNotification = true;

    // Simulate checking notifications with a quick delay
    setTimeout(() => {
      this.snackbarService.info('All caught up! No recent notifications. ✨');
      this.isCheckingNotification = false;
    }, 400);
  }
}
