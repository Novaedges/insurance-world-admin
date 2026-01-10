import { Routes } from '@angular/router';
import { CrmMapping } from './components/crm-mapping/crm-mapping';
import { SyncStatus } from './components/sync-status/sync-status';

export const CRM_ROUTES: Routes = [
  { path: '', redirectTo: 'mapping', pathMatch: 'full' },
  { path: 'mapping', component: CrmMapping },
  { path: 'status', component: SyncStatus },
];
