import { Injectable, inject, signal } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class FCMService {
  private messaging = inject(Messaging);
  private http = inject(HttpClient);

  currentMessage = signal<NotificationPayload | null>(null);
  token = signal<string | null>(null);

  constructor() {
    this.setupBroadcastListener();
  }

  private setupBroadcastListener() {
    const channel = new BroadcastChannel('fcm_notifications');
    channel.onmessage = (event) => {
      console.log('Received message from BroadcastChannel:', event.data);
      this.handleIncomingPayload(event.data);
    };
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(this.messaging, {
          vapidKey: environment.vapidKey,
        });
        if (token) {
          console.log('FCM Token:', token);
          this.token.set(token);
          this.saveTokenToBackend(token).subscribe();
        }
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  }

  private saveTokenToBackend(token: string) {
    // Replace with your actual endpoint
    return this.http
      .post(`${environment.apiUrl}/api/web/iw/admin/fcm/token/v1`, { fcmToken: token })
      .pipe(
        tap(() => console.log('Token saved to backend')),
        catchError((err) => {
          console.error('Error saving token to backend:', err);
          return of(null);
        }),
      );
  }

  listenForMessages() {
    onMessage(this.messaging, (payload: any) => {
      console.log('Message received in foreground:', payload);
      this.handleIncomingPayload(payload);
    });
  }

  private handleIncomingPayload(payload: any) {
    this.currentMessage.set({
      title: payload.notification?.title || 'Notification',
      body: payload.notification?.body || '',
      data: payload.data,
    });
  }

  clearMessage() {
    this.currentMessage.set(null);
  }
}
