import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../core/services/auth';

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
export class MainLayoutComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  isCollapsed = false;
  pageTitle = 'Dashboard';

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
    '/child-category': 'Sub-Categories',
    '/insurance-company': 'Insurance Companies',
    '/agent-management': 'Agent Management',
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
    if (user.role === 'Super Admin') return true;
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

  logout() {
    this.authService.logout();
  }
}
