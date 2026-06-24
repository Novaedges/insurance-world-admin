import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  // Check if route has specific module permission requirements
  // The first segment of the URL path corresponds to the moduleId
  const urlSegments = state.url
    .split('?')[0]
    .split('/')
    .filter((s) => s);
  if (urlSegments.length > 0) {
    const firstSegment = urlSegments[0];

    // Modules that require validation (keys of idMap in auth.service.ts)
    const modulesWithPermissions = [
      'dashboard',
      'products',
      'enquiries',
      'sales-reports',
      'admin-creation',
      'insurance-company',
      'agent-management',
      'rto-management',
      'insurance-category',
      'policy-type',
      'vehicle-make',
      'vehicle-model',
      'marketing',
      'claim-management',
    ];

    if (modulesWithPermissions.includes(firstSegment)) {
      if (!authService.hasPermission(firstSegment, 'VIEW')) {
        // Redirect to dashboard, or profile if they don't have access to dashboard
        if (firstSegment !== 'dashboard') {
          return router.createUrlTree(['/dashboard']);
        } else {
          return router.createUrlTree(['/profile']);
        }
      }
    }
  }

  return true;
};
