import { Component, OnDestroy, OnInit, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService, SnackbarMessage } from '../../../core/services/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent implements OnInit, OnDestroy {
  private snackbarService = inject(SnackbarService);
  private cdr = inject(ChangeDetectorRef);

  show = signal(false);
  message = signal('');
  type = signal<'success' | 'error' | 'info'>('info');

  private subscription: Subscription = new Subscription();
  private timeoutId: any;

  ngOnInit() {
    this.subscription = this.snackbarService.snackbarState$.subscribe(
      (snackbar: SnackbarMessage) => {
        this.message.set(snackbar.message);
        this.type.set(snackbar.type);
        this.show.set(true);

        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
          this.show.set(false);
          this.cdr.detectChanges(); // Force detection for the hide animation
        }, snackbar.duration || 3000);

        this.cdr.detectChanges(); // Ensure UI reflects the new snackbar immediately
      },
    );
  }

  close() {
    this.show.set(false);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
