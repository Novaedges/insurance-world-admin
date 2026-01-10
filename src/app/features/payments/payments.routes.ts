import { Routes } from '@angular/router';
import { PaymentSettings } from './components/payment-settings/payment-settings';
import { TransactionHistory } from './components/transaction-history/transaction-history';
import { RefundManager } from './components/refund-manager/refund-manager';

export const PAYMENTS_ROUTES: Routes = [
  { path: '', redirectTo: 'settings', pathMatch: 'full' },
  { path: 'settings', component: PaymentSettings },
  { path: 'history', component: TransactionHistory },
  { path: 'refunds', component: RefundManager },
];
