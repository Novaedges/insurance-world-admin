import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../../shared/components/table/table.component';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { NotificationService, WhatsappTemplate } from '../../../../core/services/notification.service';
import { WhatsappTemplateFormComponent } from './whatsapp-template-form/whatsapp-template-form.component';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-template-manager',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, WhatsappTemplateFormComponent],
  templateUrl: './template-manager.html',
  styleUrl: './template-manager.scss',
})
export class TemplateManager implements OnInit {
  items: WhatsappTemplate[] = [];
  columns: Column[] = [
    { field: 'name', header: 'Template Name' },
    { field: 'content', header: 'Content' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isSubmitting = false;
  selectedItem: WhatsappTemplate | null = null;

  constructor(
    private notificationService: NotificationService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(showNotification = false) {
    this.notificationService.getWhatsappTemplates().subscribe({
      next: (data) => {
        this.items = data;
        if (showNotification) this.snackbar.success('Data refreshed');
      },
      error: () => this.snackbar.error('Failed to load templates')
    });
  }

  openForm(item: WhatsappTemplate | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(item: WhatsappTemplate) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.notificationService.saveWhatsappTemplate(item)
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

  onDelete(item: WhatsappTemplate) {
    this.notificationService.deleteWhatsappTemplate(item.id).subscribe({
      next: () => {
        this.loadData();
        this.snackbar.success('Template deleted');
      },
      error: () => this.snackbar.error('Failed to delete template')
    });
  }
}
