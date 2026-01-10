import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface WhatsappConfig {
  id: string;
  providerName: string;
  phoneNumber: string;
  status: 'Active' | 'Inactive';
}

export interface WhatsappTemplate {
  id: string;
  name: string;
  content: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface ChatLog {
  id: string;
  customerName: string;
  message: string;
  timestamp: string;
  status: 'Sent' | 'Read' | 'Failed';
}

export interface SmsConfig {
  id: string;
  provider: string;
  senderId: string;
  status: 'Active' | 'Inactive';
}

export interface SmsTemplate {
  id: string;
  name: string;
  content: string;
  status: 'Active' | 'Inactive';
}

export interface SmsOutboxItem {
  id: string;
  recipient: string;
  message: string;
  sentAt: string;
  status: 'Delivered' | 'Failed' | 'Sent';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Mock Data
  private whatsappConfigs: WhatsappConfig[] = [
    { id: '1', providerName: 'Twilio', phoneNumber: '+1234567890', status: 'Active' },
  ];

  private whatsappTemplates: WhatsappTemplate[] = [
    {
      id: '1',
      name: 'Welcome Message',
      content: 'Hello {{1}}, welcome to Insurance World!',
      status: 'Approved',
    },
  ];

  private chatLogs: ChatLog[] = [
    {
      id: '1',
      customerName: 'John Doe',
      message: 'Hello, I need help.',
      timestamp: '2023-10-27 10:00 AM',
      status: 'Read',
    },
  ];

  private smsConfigs: SmsConfig[] = [
    { id: '1', provider: 'AWS SNS', senderId: 'INSURE', status: 'Active' },
  ];

  private smsTemplates: SmsTemplate[] = [
    { id: '1', name: 'OTP Verification', content: 'Your OTP is {{otp}}', status: 'Active' },
  ];

  private smsOutbox: SmsOutboxItem[] = [
    {
      id: '1',
      recipient: '+919876543210',
      message: 'Your OTP is 1234',
      sentAt: '2023-10-27 10:05 AM',
      status: 'Delivered',
    },
  ];

  constructor() {}

  // WhatsApp Methods
  getWhatsappConfigs(): Observable<WhatsappConfig[]> {
    return of([...this.whatsappConfigs]).pipe(delay(300));
  }

  saveWhatsappConfig(config: WhatsappConfig): Observable<WhatsappConfig> {
    if (config.id) {
      const index = this.whatsappConfigs.findIndex((c) => c.id === config.id);
      if (index !== -1) this.whatsappConfigs[index] = config;
    } else {
      config.id = (this.whatsappConfigs.length + 1).toString();
      this.whatsappConfigs.push(config);
    }
    return of(config).pipe(delay(300));
  }

  deleteWhatsappConfig(id: string): Observable<boolean> {
    this.whatsappConfigs = this.whatsappConfigs.filter((c) => c.id !== id);
    return of(true).pipe(delay(300));
  }

  getWhatsappTemplates(): Observable<WhatsappTemplate[]> {
    return of([...this.whatsappTemplates]).pipe(delay(300));
  }

  saveWhatsappTemplate(template: WhatsappTemplate): Observable<WhatsappTemplate> {
    if (template.id) {
      const index = this.whatsappTemplates.findIndex((t) => t.id === template.id);
      if (index !== -1) this.whatsappTemplates[index] = template;
    } else {
      template.id = (this.whatsappTemplates.length + 1).toString();
      this.whatsappTemplates.push(template);
    }
    return of(template).pipe(delay(300));
  }

  deleteWhatsappTemplate(id: string): Observable<boolean> {
    this.whatsappTemplates = this.whatsappTemplates.filter((t) => t.id !== id);
    return of(true).pipe(delay(300));
  }

  getChatLogs(): Observable<ChatLog[]> {
    return of([...this.chatLogs]).pipe(delay(300));
  }

  // SMS Methods
  getSmsConfigs(): Observable<SmsConfig[]> {
    return of([...this.smsConfigs]).pipe(delay(300));
  }

  saveSmsConfig(config: SmsConfig): Observable<SmsConfig> {
    if (config.id) {
      const index = this.smsConfigs.findIndex((c) => c.id === config.id);
      if (index !== -1) this.smsConfigs[index] = config;
    } else {
      config.id = (this.smsConfigs.length + 1).toString();
      this.smsConfigs.push(config);
    }
    return of(config).pipe(delay(300));
  }

  deleteSmsConfig(id: string): Observable<boolean> {
    this.smsConfigs = this.smsConfigs.filter((c) => c.id !== id);
    return of(true).pipe(delay(300));
  }

  getSmsTemplates(): Observable<SmsTemplate[]> {
    return of([...this.smsTemplates]).pipe(delay(300));
  }

  saveSmsTemplate(template: SmsTemplate): Observable<SmsTemplate> {
    if (template.id) {
      const index = this.smsTemplates.findIndex((t) => t.id === template.id);
      if (index !== -1) this.smsTemplates[index] = template;
    } else {
      template.id = (this.smsTemplates.length + 1).toString();
      this.smsTemplates.push(template);
    }
    return of(template).pipe(delay(300));
  }

  deleteSmsTemplate(id: string): Observable<boolean> {
    this.smsTemplates = this.smsTemplates.filter((t) => t.id !== id);
    return of(true).pipe(delay(300));
  }

  getSmsOutbox(): Observable<SmsOutboxItem[]> {
    return of([...this.smsOutbox]).pipe(delay(300));
  }
}
