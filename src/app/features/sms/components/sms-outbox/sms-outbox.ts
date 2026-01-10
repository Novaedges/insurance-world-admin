import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../../shared/components/table/table.component';
import { NotificationService, SmsOutboxItem } from '../../../../core/services/notification.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';

@Component({
  selector: 'app-sms-outbox',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './sms-outbox.html',
  styleUrl: './sms-outbox.scss',
})
export class SmsOutbox implements OnInit {
  items: SmsOutboxItem[] = [];
  columns: Column[] = [
    { field: 'recipient', header: 'Recipient' },
    { field: 'message', header: 'Message' },
    { field: 'sentAt', header: 'Sent At' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  constructor(
    private notificationService: NotificationService,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(showNotification = false) {
    this.notificationService.getSmsOutbox().subscribe({
      next: (data) => {
        this.items = data;
        if (showNotification) this.snackbar.success('Outbox refreshed');
      },
      error: () => this.snackbar.error('Failed to load outbox'),
    });
  }
}
