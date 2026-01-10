import { Routes } from '@angular/router';
import { CommissionStructure } from './components/commission-structure/commission-structure';
import { PayoutReconciliation } from './components/payout-reconciliation/payout-reconciliation';
import { AgentStatement } from './components/agent-statement/agent-statement';

export const COMMISSIONS_ROUTES: Routes = [
  { path: '', redirectTo: 'structure', pathMatch: 'full' },
  { path: 'structure', component: CommissionStructure },
  { path: 'reconciliation', component: PayoutReconciliation },
  { path: 'statement', component: AgentStatement },
];
