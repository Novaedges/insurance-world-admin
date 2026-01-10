import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

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
    '/whatsapp': 'WhatsApp Automation',
    '/sms': 'SMS Notifications',
    '/renewals': 'Renewal Management',
    '/payments': 'Payment Gateway',
    '/commissions': 'Commission Management',
    '/crm': 'CRM Integration',
    '/ai-engine': 'AI Premium Suggestions',
    '/marketing': 'Marketing Automation',
  };

  constructor(private router: Router) {
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
    // Basic logout - clear token and redirect
    // Ideally inject AuthService here, but for now direct removal to match simple auth
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
