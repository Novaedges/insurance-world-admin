import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface ConfirmationOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private stateSubject = new BehaviorSubject<{ isOpen: boolean; options?: ConfirmationOptions }>({
    isOpen: false,
  });
  state$ = this.stateSubject.asObservable();

  private confirmSubject = new Subject<boolean>();

  constructor() {}

  confirm(options: ConfirmationOptions = {}): Promise<boolean> {
    const defaultOptions: ConfirmationOptions = {
      title: 'Are you sure?',
      message: 'Do you really want to verify this action?',
      confirmText: 'Yes, Confirm',
      cancelText: 'Cancel',
      type: 'danger',
      ...options,
    };

    this.stateSubject.next({ isOpen: true, options: defaultOptions });

    // Reset subject for new confirmation
    this.confirmSubject = new Subject<boolean>();
    return new Promise((resolve) => {
      this.confirmSubject.subscribe((result) => {
        this.stateSubject.next({ isOpen: false });
        resolve(result);
      });
    });
  }

  resolve(result: boolean) {
    this.confirmSubject.next(result);
    this.confirmSubject.complete();
  }
}
