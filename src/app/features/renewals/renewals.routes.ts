import { Routes } from '@angular/router';
import { RenewalDashboard } from './components/renewal-dashboard/renewal-dashboard';
import { StrategyBuilder } from './components/strategy-builder/strategy-builder';

export const RENEWALS_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: RenewalDashboard },
  { path: 'strategy', component: StrategyBuilder },
];
