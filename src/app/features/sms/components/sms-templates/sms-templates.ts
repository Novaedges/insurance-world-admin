import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../../shared/components/table/table.component';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { NotificationService, SmsTemplate } from '../../../../core/services/notification.service';
import { SmsTemplateFormComponent } from './sms-template-form/sms-template-form.component';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sms-templates',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, SmsTemplateFormComponent],
  templateUrl: './sms-templates.html',
  styleUrl: './sms-templates.scss',
})
export class SmsTemplates implements OnInit {
  items: SmsTemplate[] = [];
  columns: Column[] = [
    { field: 'name', header: 'Template Name' },
    { field: 'content', header: 'Content' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isSubmitting = false;
  selectedItem: SmsTemplate | null = null;

  constructor(
    private notificationService: NotificationService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(showNotification = false) {
    this.notificationService.getSmsTemplates().subscribe({
      next: (data) => {
        this.items = data;
        if (showNotification) this.snackbar.success('Data refreshed');
      },
      error: () => this.snackbar.error('Failed to load templates')
    });
  }

  openForm(item: SmsTemplate | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(item: SmsTemplate) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.notificationService.saveSmsTemplate(item)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
          this.snackbar.success(item.id ? 'Template updated' : 'Template created');
        },
        error: () => this.snackbar.error('Failed to save template')
      });
  }

  onDelete(item: SmsTemplate) {
    this.notificationService.deleteSmsTemplate(item.id).subscribe({
      next: () => {
        this.loadData();
        this.snackbar.success('Template deleted');
      },
      error: () => this.snackbar.error('Failed to delete template')
    });
  }
}
