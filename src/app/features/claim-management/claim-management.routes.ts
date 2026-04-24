import { Routes } from '@angular/router';
import { ClaimRecordComponent } from './claim-record/claim-record';

export const CLAIM_MANAGEMENT_ROUTES: Routes = [
  {
    path: 'record',
    component: ClaimRecordComponent,
  },
  {
    path: '',
    redirectTo: 'record',
    pathMatch: 'full',
  },
];
