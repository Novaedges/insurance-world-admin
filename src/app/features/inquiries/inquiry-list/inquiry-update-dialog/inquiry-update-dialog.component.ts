import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InquiryService } from '../inquiry.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-inquiry-update-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inquiry-update-dialog.component.html',
  styleUrls: ['./inquiry-update-dialog.component.scss'],
})
export class InquiryUpdateDialogComponent implements OnInit {
  @Input() inquiryId: string | null = null;
  @Input() currentStatus: string = 'Pending';
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  statusOptions = ['Pending', 'On Going', 'Completed', 'Not Interested'];

  formData = {
    status: 'Pending',
    policyTypeId: '',
    policyId: '',
    sellingPrice: null as number | null,
  };

  isSubmitting = false;

  constructor(
    private inquiryService: InquiryService,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit() {
    if (this.currentStatus && this.statusOptions.includes(this.currentStatus)) {
      this.formData.status = this.currentStatus;
    }
  }

  onSubmit() {
    if (!this.inquiryId) return;

    if (this.formData.status === 'Completed' && !this.formData.sellingPrice) {
      this.snackbarService.error('Selling Price is required when marking as Completed');
      return;
    }

    this.isSubmitting = true;

    const payload: any = {
      _id: this.inquiryId,
      status: this.formData.status,
    };

    if (this.formData.policyTypeId) payload.policyTypeId = this.formData.policyTypeId;
    if (this.formData.policyId) payload.policyId = this.formData.policyId;
    if (this.formData.sellingPrice) payload.sellingPrice = this.formData.sellingPrice;

    this.inquiryService.updateInquiryStatus(payload).subscribe({
      next: (res) => {
        if (res.status !== false) {
          this.snackbarService.success(res.msg || 'Inquiry updated successfully');
          this.save.emit();
        } else {
          this.snackbarService.error(res.msg || 'Failed to update Inquiry');
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.snackbarService.error(err.error?.msg || 'Failed to update Inquiry');
        this.isSubmitting = false;
      },
    });
  }

  close() {
    this.cancel.emit();
  }
}
