import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface SnackbarMessage {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackbarSubject = new Subject<SnackbarMessage>();
  public snackbarState$ = this.snackbarSubject.asObservable();

  constructor() {}

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    this.snackbarSubject.next({ message, type, duration });
  }

  success(message: string, duration: number = 3000) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration: number = 3000) {
    this.show(message, 'error', duration);
  }

  info(message: string, duration: number = 3000) {
    this.show(message, 'info', duration);
  }
}
