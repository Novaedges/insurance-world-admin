import { Routes } from '@angular/router';
import { SmsConfig } from './components/sms-config/sms-config';
import { SmsTemplates } from './components/sms-templates/sms-templates';
import { SmsOutbox } from './components/sms-outbox/sms-outbox';

export const SMS_ROUTES: Routes = [
  { path: '', redirectTo: 'config', pathMatch: 'full' },
  { path: 'config', component: SmsConfig },
  { path: 'templates', component: SmsTemplates },
  { path: 'outbox', component: SmsOutbox },
];
