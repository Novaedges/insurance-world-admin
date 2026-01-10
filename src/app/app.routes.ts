import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
        canActivate: [authGuard],
      },
      // Masters Routes Placeholder
      {
        path: 'admin-creation',
        loadComponent: () =>
          import('./features/masters/admin-creation/admin-creation.component').then(
            (m) => m.AdminCreationComponent,
          ),
      },
      {
        path: 'rto-management',
        loadComponent: () =>
          import('./features/masters/rto-management/rto-management.component').then(
            (m) => m.RtoManagementComponent,
          ),
      },
      {
        path: 'vehicle-make',
        loadComponent: () =>
          import('./features/masters/vehicle-make/vehicle-make.component').then(
            (m) => m.VehicleMakeComponent,
          ),
      },
      {
        path: 'vehicle-model',
        loadComponent: () =>
          import('./features/masters/vehicle-model/vehicle-model.component').then(
            (m) => m.VehicleModelComponent,
          ),
      },
      {
        path: 'insurance-category',
        loadComponent: () =>
          import('./features/masters/insurance-category/insurance-category.component').then(
            (m) => m.InsuranceCategoryComponent,
          ),
      },
      {
        path: 'child-category',
        loadComponent: () =>
          import('./features/masters/child-category/child-category.component').then(
            (m) => m.ChildCategoryComponent,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list.component').then(
            (m) => m.ProductListComponent,
          ),
      },
      {
        path: 'inquiries',
        loadComponent: () =>
          import('./features/inquiries/inquiry-list/inquiry-list.component').then(
            (m) => m.InquiryListComponent,
          ),
      },
      {
        path: 'sales-reports',
        loadComponent: () =>
          import('./features/sales/sales-report/sales-report.component').then(
            (m) => m.SalesReportComponent,
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
];
