import { Component, OnDestroy, OnInit } from '@angular/core';
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
  show = false;
  message = '';
  type: 'success' | 'error' | 'info' = 'info';
  private subscription: Subscription = new Subscription();
  private timeoutId: any;

  constructor(private snackbarService: SnackbarService) {}

  ngOnInit() {
    this.subscription = this.snackbarService.snackbarState$.subscribe(
      (snackbar: SnackbarMessage) => {
        this.message = snackbar.message;
        this.type = snackbar.type;
        this.show = true;

        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
          this.show = false;
        }, snackbar.duration || 3000);
      },
    );
  }

  close() {
    this.show = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
