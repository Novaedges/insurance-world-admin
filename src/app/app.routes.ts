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
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      // Masters Routes
      {
        path: 'admin-creation',
        loadChildren: () =>
          import('./features/masters/admin-creation/admin-creation.routes').then(
            (m) => m.ADMIN_CREATION_ROUTES,
          ),
      },
      {
        path: 'rto-management',
        loadChildren: () =>
          import('./features/masters/rto-management/rto-management.routes').then(
            (m) => m.RTO_MANAGEMENT_ROUTES,
          ),
      },
      {
        path: 'vehicle-make',
        loadChildren: () =>
          import('./features/masters/vehicle-make/vehicle-make.routes').then(
            (m) => m.VEHICLE_MAKE_ROUTES,
          ),
      },
      {
        path: 'vehicle-model',
        loadChildren: () =>
          import('./features/masters/vehicle-model/vehicle-model.routes').then(
            (m) => m.VEHICLE_MODEL_ROUTES,
          ),
      },
      {
        path: 'insurance-category',
        loadChildren: () =>
          import('./features/masters/insurance-category/insurance-category.routes').then(
            (m) => m.INSURANCE_CATEGORY_ROUTES,
          ),
      },
      {
        path: 'child-category',
        loadChildren: () =>
          import('./features/masters/child-category/child-category.routes').then(
            (m) => m.CHILD_CATEGORY_ROUTES,
          ),
      },
      {
        path: 'policy-type',
        loadChildren: () =>
          import('./features/masters/policy-type/policy-type.routes').then(
            (m) => m.POLICY_TYPE_ROUTES,
          ),
      },
      {
        path: 'insurance-company',
        loadChildren: () =>
          import('./features/masters/insurance-company/insurance-company.routes').then(
            (m) => m.INSURANCE_COMPANY_ROUTES,
          ),
      },
      {
        path: 'agent-management',
        loadChildren: () =>
          import('./features/masters/agent-management/agent-management.routes').then(
            (m) => m.AGENT_MANAGEMENT_ROUTES,
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
      },
      {
        path: 'inquiries',
        loadChildren: () =>
          import('./features/inquiries/inquiries.routes').then((m) => m.INQUIRIES_ROUTES),
      },
      {
        path: 'sales-reports',
        loadChildren: () => import('./features/sales/sales.routes').then((m) => m.SALES_ROUTES),
      },
      // Future Enhancement Modules
      {
        path: 'whatsapp',
        loadChildren: () =>
          import('./features/whatsapp/whatsapp.routes').then((m) => m.WHATSAPP_ROUTES),
      },
      {
        path: 'sms',
        loadChildren: () => import('./features/sms/sms.routes').then((m) => m.SMS_ROUTES),
      },
      {
        path: 'renewals',
        loadChildren: () =>
          import('./features/renewals/renewals.routes').then((m) => m.RENEWALS_ROUTES),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./features/payments/payments.routes').then((m) => m.PAYMENTS_ROUTES),
      },
      {
        path: 'commissions',
        loadChildren: () =>
          import('./features/commissions/commissions.routes').then((m) => m.COMMISSIONS_ROUTES),
      },
      {
        path: 'crm',
        loadChildren: () => import('./features/crm/crm.routes').then((m) => m.CRM_ROUTES),
      },
      {
        path: 'ai-engine',
        loadChildren: () =>
          import('./features/ai-engine/ai-engine.routes').then((m) => m.AI_ENGINE_ROUTES),
      },
      {
        path: 'marketing',
        loadChildren: () =>
          import('./features/marketing/marketing.routes').then((m) => m.MARKETING_ROUTES),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
];
