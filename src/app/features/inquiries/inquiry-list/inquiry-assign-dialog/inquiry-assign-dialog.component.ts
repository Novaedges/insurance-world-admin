import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCreationService } from '../../../masters/admin-creation/admin-creation.service';
import { InquiryService } from '../inquiry.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-inquiry-assign-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inquiry-assign-dialog.component.html',
  styleUrls: ['./inquiry-assign-dialog.component.scss'],
})
export class InquiryAssignDialogComponent implements OnInit {
  @Input() inquiryId: string | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  admins: any[] = [];
  selectedSalesExecutiveId: string = '';
  isSubmitting = false;

  constructor(
    private adminService: AdminCreationService,
    private inquiryService: InquiryService,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.adminService.getAdmins().subscribe({
      next: (res) => {
        if (res.status && res.result) {
          this.admins = res.result;
        }
      },
      error: (err) => {
        console.error('Failed to load admins', err);
      },
    });
  }

  onSubmit() {
    if (!this.inquiryId || !this.selectedSalesExecutiveId) {
      this.snackbarService.error('Please select a Sales Person');
      return;
    }

    this.isSubmitting = true;
    this.inquiryService.assignSalesPerson(this.inquiryId, this.selectedSalesExecutiveId).subscribe({
      next: (res) => {
        if (res.status !== false) {
          this.snackbarService.success(res.msg || 'Sales Person assigned successfully');
          this.save.emit();
        } else {
          this.snackbarService.error(res.msg || 'Failed to assign Sales Person');
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.snackbarService.error(err.error?.msg || 'Failed to assign Sales Person');
        this.isSubmitting = false;
      },
    });
  }

  close() {
    this.cancel.emit();
  }
}
