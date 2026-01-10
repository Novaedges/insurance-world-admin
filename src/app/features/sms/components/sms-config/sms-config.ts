import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../../shared/components/table/table.component';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import {
  NotificationService,
  SmsConfig as SmsConfigModel,
} from '../../../../core/services/notification.service';
import { SmsConfigFormComponent } from './sms-config-form/sms-config-form.component';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sms-config',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, SmsConfigFormComponent],
  templateUrl: './sms-config.html',
  styleUrl: './sms-config.scss',
})
export class SmsConfig implements OnInit {
  items: SmsConfigModel[] = [];
  columns: Column[] = [
    { field: 'provider', header: 'Provider' },
    { field: 'senderId', header: 'Sender ID' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isSubmitting = false;
  selectedItem: SmsConfigModel | null = null;

  constructor(
    private notificationService: NotificationService,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(showNotification = false) {
    this.notificationService.getSmsConfigs().subscribe({
      next: (data) => {
        this.items = data;
        if (showNotification) this.snackbar.success('Data refreshed');
      },
      error: () => this.snackbar.error('Failed to load configs'),
    });
  }

  openForm(item: SmsConfigModel | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(item: SmsConfigModel) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.notificationService
      .saveSmsConfig(item)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
          this.snackbar.success(item.id ? 'Config updated' : 'Config created');
        },
        error: () => this.snackbar.error('Failed to save config'),
      });
  }

  onDelete(item: SmsConfigModel) {
    this.notificationService.deleteSmsConfig(item.id).subscribe({
      next: () => {
        this.loadData();
        this.snackbar.success('Config deleted');
      },
      error: () => this.snackbar.error('Failed to delete config'),
    });
  }
}
