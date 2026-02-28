import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Load Admin list
    this.adminService.getAdmins(true).subscribe({
      next: (res) => {
        console.log(res);
        const data = res.result || res.data || [];
        this.admins = data.map((admin: any) => ({
          ...admin,
          _id: admin._id || admin.id,
          displayName:
            admin.firstName && admin.lastName
              ? `${admin.firstName} ${admin.lastName}`
              : admin.name || admin.firstName || admin.lastName || 'Unknown',
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load admins', err);
      },
    });

    // Load current Inquiry details to pre-fill
    if (this.inquiryId) {
      this.inquiryService.getInquiryById(this.inquiryId).subscribe({
        next: (res) => {
          if (res.status && res.result) {
            const inquiry = Array.isArray(res.result) ? res.result[0] : res.result;
            if (inquiry) {
              this.selectedSalesExecutiveId = inquiry.salesExecutiveDetails?._id || '';
              this.cdr.detectChanges();
            }
          }
        },
        error: (err) => {
          console.error('Failed to load inquiry details', err);
        },
      });
    }
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
          // Trigger status update/refresh
          this.inquiryService.updateInquiryStatus({ _id: this.inquiryId! }).subscribe({
            next: () => {
              this.snackbarService.success('Sales person assigned successfully');
              this.save.emit();
              this.isSubmitting = false;
            },
            error: () => {
              this.snackbarService.success('Sales person assigned successfully');
              this.save.emit();
              this.isSubmitting = false;
            },
          });
        } else {
          this.snackbarService.error(res.msg || 'Failed to update inquiry');
          this.isSubmitting = false;
        }
      },
      error: (err) => {
        this.snackbarService.error(err.error?.msg || 'Failed to update inquiry');
        this.isSubmitting = false;
      },
    });
  }

  close() {
    this.cancel.emit();
  }
}
