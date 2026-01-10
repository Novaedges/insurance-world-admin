import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, ConfirmationOptions } from '../../services/confirmation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  state: { isOpen: boolean; options?: ConfirmationOptions } | null = null;
  private sub: Subscription | null = null;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.sub = this.confirmationService.state$.subscribe((state) => {
      this.state = state;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onConfirm() {
    this.confirmationService.resolve(true);
  }

  onCancel() {
    this.confirmationService.resolve(false);
  }
}
