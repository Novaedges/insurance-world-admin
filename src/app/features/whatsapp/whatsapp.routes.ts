import { Routes } from '@angular/router';
import { WhatsappConfig } from './components/whatsapp-config/whatsapp-config';
import { TemplateManager } from './components/template-manager/template-manager';
import { ChatLogs } from './components/chat-logs/chat-logs';

export const WHATSAPP_ROUTES: Routes = [
  { path: '', redirectTo: 'config', pathMatch: 'full' },
  { path: 'config', component: WhatsappConfig },
  { path: 'templates', component: TemplateManager },
  { path: 'logs', component: ChatLogs },
];
