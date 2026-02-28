import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InquiryService } from '../inquiry.service';
import { ProductService } from '../../../products/product.service';
import { PolicyTypeService } from '../../../masters/policy-type/policy-type.service';
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

  statusOptions = ['Pending', 'Connected', 'Completed', 'Not Interested', 'Cancelled'];
  // Connected, Not Interested, Cancelled, Completed
  policies: any[] = [];
  policyTypes: any[] = [];
  selectedPolicyDetails: any = null;
  selectedPolicyTypeDetails: any = null;

  formData = {
    status: 'Pending',
    policyId: '',
    sellingPrice: null as number | null,
    commission: null as number | null,
    discount: null as number | null,
    note: '',
  };

  isSubmitting = false;

  constructor(
    private inquiryService: InquiryService,
    private productService: ProductService,
    private policyTypeService: PolicyTypeService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    if (this.currentStatus && this.statusOptions.includes(this.currentStatus)) {
      this.formData.status = this.currentStatus;
    }
    this.loadPolicies();
    this.loadPolicyTypes();
    this.loadInquiryDetails();
  }

  loadInquiryDetails() {
    if (this.inquiryId) {
      this.inquiryService.getInquiryById(this.inquiryId).subscribe({
        next: (res) => {
          if (res.status && res.result) {
            const inquiry = Array.isArray(res.result) ? res.result[0] : res.result;
            if (inquiry && inquiry.policyName) {
              const targetPolicyName = inquiry.policyName;
              // If policies are already loaded, try to find and select
              if (this.policies.length > 0) {
                this.selectPolicyByName(targetPolicyName);
              } else {
                // Store temporarily to select once policies load
                this.tempPolicyName = targetPolicyName;
              }
            }
          }
        },
        error: (err) => {
          console.error('Failed to load inquiry details for pre-filling', err);
        },
      });
    }
  }

  private tempPolicyName: string = '';

  private selectPolicyByName(name: string) {
    const matchedPolicy = this.policies.find(
      (p) =>
        p.policyName?.toLowerCase() === name.toLowerCase() ||
        p.name?.toLowerCase() === name.toLowerCase(),
    );

    if (matchedPolicy) {
      this.formData.policyId = matchedPolicy._id;
      this.onPolicyChange();
    }
  }

  loadPolicies() {
    this.productService.getProducts(true).subscribe({
      next: (res) => {
        if (res.status && res.result) {
          this.policies = res.result;
          if (this.tempPolicyName) {
            this.selectPolicyByName(this.tempPolicyName);
            this.tempPolicyName = '';
          }
        }
      },
      error: (err) => {
        console.error('Failed to load policies', err);
      },
    });
  }

  loadPolicyTypes() {
    this.policyTypeService.getPolicyTypes(true).subscribe({
      next: (res) => {
        if (res.status && res.result) {
          this.policyTypes = res.result;
        }
      },
      error: (err) => {
        console.error('Failed to load policy types', err);
      },
    });
  }

  onPolicyChange() {
    const selectedPolicy = this.policies.find((p) => p._id === this.formData.policyId);
    if (selectedPolicy) {
      this.selectedPolicyDetails = selectedPolicy;

      // Find matching policy type
      this.selectedPolicyTypeDetails = this.policyTypes.find(
        (t) => t._id === selectedPolicy.policyTypeId,
      );

      // Pre-fill fields if they are null
      if (!this.formData.commission) this.formData.commission = selectedPolicy.commission;
      if (!this.formData.discount) this.formData.discount = selectedPolicy.discount;
      this.cdr.detectChanges();
    } else {
      this.selectedPolicyDetails = null;
      this.selectedPolicyTypeDetails = null;
    }
  }

  onSubmit() {
    if (!this.inquiryId) return;

    if (!this.formData.note || this.formData.note.trim() === '') {
      this.snackbarService.error('Note is mandatory');
      return;
    }

    if (this.formData.status === 'Completed' && !this.formData.sellingPrice) {
      this.snackbarService.error('Selling Price is required when marking as Completed');
      return;
    }

    this.isSubmitting = true;

    const payload: any = {
      _id: this.inquiryId,
      status: this.formData.status,
      note: this.formData.note,
    };

    if (this.formData.policyId) {
      payload.policyId = this.formData.policyId;
      // Also send policyTypeId if we have it
      if (this.selectedPolicyDetails?.policyTypeId) {
        payload.policyTypeId = this.selectedPolicyDetails.policyTypeId;
      }
    }

    if (this.formData.sellingPrice) payload.sellingPrice = this.formData.sellingPrice;
    if (this.formData.commission) payload.commission = this.formData.commission;
    if (this.formData.discount) payload.discount = this.formData.discount;

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
