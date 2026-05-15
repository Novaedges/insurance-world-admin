import { Component, HostListener, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { SnackbarService } from '../../core/services/snackbar.service';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../core/services/auth.service';
import { FCMService } from '../../core/services/fcm.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { effect } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    SnackbarComponent,
    ConfirmationDialogComponent,
    DialogComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);
  private fcmService = inject(FCMService);

  unreadNotifications = signal<any[]>([]);
  notificationCount = signal<number>(0);
  isEnquiryDialogOpen = signal<boolean>(false);
  isNotificationDropdownOpen = signal<boolean>(false);
  latestEnquiry = signal<any>(null);

  isCollapsed = false;
  pageTitle = 'Dashboard';

  sessionTimeRemaining = signal<string>('--:--');
  private timerInterval: any;

  private routeMap: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/products': 'Product Management',
    '/enquiries': 'Enquiry Management',
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
    '/claim-management/record': 'Claim Record',
  };

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateTitle(event.url);
      });

    // Handle incoming notifications
    effect(() => {
      const msg = this.fcmService.currentMessage();
      if (msg) {
        // Play notification sound ONLY on new incoming messages
        this.playNotificationSound();

        // Add to unread list
        this.unreadNotifications.update((list) => [msg, ...list]);
        this.notificationCount.set(this.unreadNotifications().length);

        if (msg.data?.type === 'NEW_ENQUIRY') {
          this.latestEnquiry.set(msg.data);
          this.isEnquiryDialogOpen.set(true);
        }
        this.snackbarService.info(`New notification: ${msg.title}`);
      }
    });
  }

  private playNotificationSound() {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch((err) => {
        console.warn('Sound playback blocked by browser until user interaction:', err);
      });
    } catch (err) {
      console.warn('Could not play notification sound:', err);
    }
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.fetchProfile().catch((err) => {
        console.error('Initial profile fetch failed on layout load:', err);
      });

      this.startCountdownTimer();

      // FCM Setup
      this.fcmService.requestPermission();
      this.fcmService.listenForMessages();
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
    return this.authService.hasPermission(moduleId, 'VIEW');
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
    if (this.isSettingsOpen) {
      this.isNotificationDropdownOpen.set(false);
    }
  }

  closeSettingsMenu() {
    this.isSettingsOpen = false;
  }

  logout() {
    this.authService.logout();
  }

  // Notification Dropdown Logic
  toggleNotifications() {
    this.isNotificationDropdownOpen.set(!this.isNotificationDropdownOpen());
    if (this.isNotificationDropdownOpen()) {
      this.isSettingsOpen = false;
    }
  }

  closeNotificationDropdown() {
    this.isNotificationDropdownOpen.set(false);
  }

  triggerNotificationAnimation() {
    // This is now the bell click handler
    this.toggleNotifications();
  }

  closeEnquiryDialog() {
    this.isEnquiryDialogOpen.set(false);
    this.fcmService.clearMessage();
  }

  viewEnquiry() {
    this.isEnquiryDialogOpen.set(false);
    this.unreadNotifications.set([]);
    this.notificationCount.set(0);
    this.closeNotificationDropdown();
    this.fcmService.clearMessage();
    this.router.navigate(['/enquiries']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-btn') && !target.closest('.dropdown-menu')) {
      this.closeNotificationDropdown();
    }
    if (!target.closest('.settings-wrapper')) {
      this.closeSettingsMenu();
    }
  }
}
