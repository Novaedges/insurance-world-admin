import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../../shared/components/table/table.component';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import {
  NotificationService,
  WhatsappConfig as WhatsappConfigModel,
} from '../../../../core/services/notification.service';
import { WhatsappConfigFormComponent } from './whatsapp-config-form/whatsapp-config-form.component';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-whatsapp-config',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, WhatsappConfigFormComponent],
  templateUrl: './whatsapp-config.html',
  styleUrl: './whatsapp-config.scss',
})
export class WhatsappConfig implements OnInit {
  items: WhatsappConfigModel[] = [];
  columns: Column[] = [
    { field: 'providerName', header: 'Provider' },
    { field: 'phoneNumber', header: 'Phone Number' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isSubmitting = false;
  selectedItem: WhatsappConfigModel | null = null;

  constructor(
    private notificationService: NotificationService,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(showNotification = false) {
    this.notificationService.getWhatsappConfigs().subscribe({
      next: (data) => {
        this.items = data;
        if (showNotification) this.snackbar.success('Data refreshed');
      },
      error: () => this.snackbar.error('Failed to load configs'),
    });
  }

  openForm(item: WhatsappConfigModel | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(item: WhatsappConfigModel) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.notificationService
      .saveWhatsappConfig(item)
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

  onDelete(item: WhatsappConfigModel) {
    this.notificationService.deleteWhatsappConfig(item.id).subscribe({
      next: () => {
        this.loadData();
        this.snackbar.success('Config deleted');
      },
      error: () => this.snackbar.error('Failed to delete config'),
    });
  }
}
