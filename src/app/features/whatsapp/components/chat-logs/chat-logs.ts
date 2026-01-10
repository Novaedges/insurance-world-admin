import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../../shared/components/table/table.component';
import { NotificationService, ChatLog } from '../../../../core/services/notification.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';

@Component({
  selector: 'app-chat-logs',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './chat-logs.html',
  styleUrl: './chat-logs.scss',
})
export class ChatLogs implements OnInit {
  items: ChatLog[] = [];
  columns: Column[] = [
    { field: 'customerName', header: 'Customer' },
    { field: 'message', header: 'Message' },
    { field: 'timestamp', header: 'Time' },
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
    this.notificationService.getChatLogs().subscribe({
      next: (data) => {
        this.items = data;
        if (showNotification) this.snackbar.success('Logs refreshed');
      },
      error: () => this.snackbar.error('Failed to load logs'),
    });
  }
}
