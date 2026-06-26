import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InquiryService } from '../inquiry.service';
import { ProductService } from '../../../products/product.service';
import { PolicyTypeService } from '../../../masters/policy-type/policy-type.service';
import { InsuranceCompanyService } from '../../../masters/insurance-company/insurance-company.service';
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
  policies: any[] = [];
  policyTypes: any[] = [];
  insuranceCompanies: any[] = [];
  selectedPolicyDetails: any = null;
  selectedPolicyTypeDetails: any = null;
  selectedPolicyCovers: string[] = [];

  formData = {
    status: 'Pending',
    policyId: '',
    sellingPrice: null as number | null,
    commission: null as number | null,
    afterSaleCommission: null as number | null,
    discount: null as number | null,
    lapsDate: '',
    paymentNotes: [] as { note: string; referenceNo: string }[],
    remarks: '',
  };

  get netAmount(): number {
    const premium = this.formData.sellingPrice || 0;
    const commission = this.formData.commission || 0;
    return premium - commission;
  }

  isSubmitting = false;
  get isReadOnly(): boolean {
    return this.currentStatus === 'Completed';
  }

  constructor(
    private inquiryService: InquiryService,
    private productService: ProductService,
    private policyTypeService: PolicyTypeService,
    private insuranceCompanyService: InsuranceCompanyService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    if (this.currentStatus && this.statusOptions.includes(this.currentStatus)) {
      this.formData.status = this.currentStatus;
    }
    this.getInsuranceCompanyName();
    this.loadPolicies();
    this.loadPolicyTypes();
    this.loadInquiryDetails();
  }

  getInsuranceCompanyName() {
    this.insuranceCompanyService.getCompanies(true).subscribe({
      next: (res) => {
        if (res.status && res.result) {
          this.insuranceCompanies = res.result;
        }
      },
      error: (err) => console.error('Failed to load companies', err),
    });
  }

  loadCompaniesName(): string {
    if (!this.selectedPolicyDetails) return '';
    if (this.selectedPolicyDetails.insuranceCompany) {
      return this.selectedPolicyDetails.insuranceCompany;
    }

    if (
      this.selectedPolicyDetails.insuranceCompaniesId &&
      Array.isArray(this.selectedPolicyDetails.insuranceCompaniesId)
    ) {
      const names = [];
      for (const id of this.selectedPolicyDetails.insuranceCompaniesId) {
        // Handle if id is an object with _id or id, or just string
        const idStr = typeof id === 'object' && id !== null ? id._id || id.id : id;
        const comp = this.insuranceCompanies.find((c) => c._id === idStr);
        if (comp) {
          names.push(comp.companyName || comp.name);
        }
      }
      return names.join(', ');
    }
    return '';
  }

  loadInquiryDetails() {
    if (this.inquiryId) {
      this.inquiryService.getInquiryById(this.inquiryId).subscribe({
        next: (res) => {
          if (res.status && res.result) {
            const inquiry = Array.isArray(res.result) ? res.result[0] : res.result;

            console.log(inquiry);
            if (inquiry && inquiry.policyDetails) {
              this.selectedPolicyDetails = inquiry.policyDetails;
            }
            if (inquiry && inquiry.policyTypeDetails) {
              this.selectedPolicyTypeDetails = inquiry.policyTypeDetails;
            }

            if (inquiry && inquiry.policyCovers) {
              this.selectedPolicyCovers = inquiry.policyCovers;
            }

            if (inquiry) {
              // If policies are already loaded, try to find and select
              if (this.policies.length > 0) {
                this.selectPolicyByDetails(inquiry);
              } else {
                // Store temporarily to select once policies load
                this.tempInquiry = inquiry;
              }
            }
            console.log(inquiry);
            if (inquiry && inquiry.afterSaleCommission !== undefined) {
              this.formData.commission = inquiry.afterSaleCommission;
            }
            console.log(this.formData);
            if (inquiry && inquiry.discount !== undefined) {
              this.formData.discount = inquiry.discount;
            }
            if (inquiry && inquiry.sellingPrice !== undefined) {
              this.formData.sellingPrice = inquiry.sellingPrice;
            }

            if (inquiry && inquiry.lapsDate) {
              // Ensure date is in YYYY-MM-DD format for input[type="date"]
              const date = new Date(inquiry.lapsDate);
              this.formData.lapsDate = date.toISOString().split('T')[0];
            }

            if (inquiry && inquiry.paymentNotes && Array.isArray(inquiry.paymentNotes)) {
              this.formData.paymentNotes = [...inquiry.paymentNotes];
            } else if (this.formData.paymentNotes.length === 0) {
              this.addPaymentDetail();
            }

            if (inquiry && inquiry.remarks) {
              this.formData.remarks = inquiry.remarks;
            }

            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Failed to load inquiry details for pre-filling', err);
        },
      });
    }
  }

  private tempInquiry: any = null;

  private selectPolicyByDetails(inquiry: any, skipUpdateDetails: boolean = false) {
    if (!inquiry) return;

    // First try to match by exact policyId
    const policyIdStr =
      typeof inquiry.policyId === 'object' && inquiry.policyId !== null
        ? inquiry.policyId._id || inquiry.policyId.id
        : inquiry.policyId;

    if (policyIdStr) {
      const matched = this.policies.find((p) => p._id === policyIdStr);
      if (matched) {
        this.formData.policyId = matched._id;
        if (!skipUpdateDetails) {
          this.onPolicyChange(false);
        }
        return;
      }
    }

    const name = inquiry.policyName;
    const policyTypeId = inquiry.policyTypeDetails?._id;
    const companyName = inquiry.policyDetails?.insuranceCompany;

    let matchedPolicy = this.policies.find((p) => {
      const nameMatch =
        p.policyName?.toLowerCase() === name?.toLowerCase() ||
        p.name?.toLowerCase() === name?.toLowerCase();
      const typeMatch = policyTypeId ? p.policyTypeId === policyTypeId : true;

      let companyMatch = false;
      if (companyName) {
        if (p.insuranceCompanies && Array.isArray(p.insuranceCompanies)) {
          companyMatch = p.insuranceCompanies.some(
            (c: any) =>
              c.name?.toLowerCase() === companyName.toLowerCase() ||
              c.companyName?.toLowerCase() === companyName.toLowerCase(),
          );
        }
        if (!companyMatch && p.insuranceCompaniesId && Array.isArray(p.insuranceCompaniesId)) {
          companyMatch = p.insuranceCompaniesId.some((id: any) => {
            const idStr = typeof id === 'object' && id !== null ? id._id || id.id : id;
            const comp = this.insuranceCompanies.find((c) => c._id === idStr);
            if (comp) {
              const cName = comp.companyName || comp.name;
              return cName?.toLowerCase() === companyName.toLowerCase();
            }
            return false;
          });
        }
      } else {
        companyMatch = true;
      }
      return nameMatch && typeMatch && companyMatch;
    });

    // Fallback 1: match name and type
    if (!matchedPolicy) {
      matchedPolicy = this.policies.find((p) => {
        const nameMatch =
          p.policyName?.toLowerCase() === name?.toLowerCase() ||
          p.name?.toLowerCase() === name?.toLowerCase();
        const typeMatch = policyTypeId ? p.policyTypeId === policyTypeId : true;
        return nameMatch && typeMatch;
      });
    }

    // Fallback 2: match name only
    if (!matchedPolicy) {
      matchedPolicy = this.policies.find(
        (p) =>
          p.policyName?.toLowerCase() === name?.toLowerCase() ||
          p.name?.toLowerCase() === name?.toLowerCase(),
      );
    }

    if (matchedPolicy) {
      this.formData.policyId = matchedPolicy._id;
      if (!skipUpdateDetails) {
        this.onPolicyChange(false);
      }
    }
  }

  loadPolicies() {
    this.productService.getProducts(true).subscribe({
      next: (res) => {
        if (res.status && res.result) {
          this.policies = res.result;
          if (this.tempInquiry) {
            this.selectPolicyByDetails(this.tempInquiry);
            this.tempInquiry = null;
          } else if (this.formData.policyId) {
            // Re-sync if policyId was already set by loadInquiryDetails
            this.onPolicyChange(false);
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
          // Re-sync type details if a policy is already selected
          if (this.formData.policyId) {
            this.onPolicyChange(false);
          }
        }
      },
      error: (err) => {
        console.error('Failed to load policy types', err);
      },
    });
  }

  addPaymentDetail() {
    this.formData.paymentNotes.push({ note: '', referenceNo: '' });
  }

  removePaymentDetail(index: number) {
    if (this.formData.paymentNotes.length > 1) {
      this.formData.paymentNotes.splice(index, 1);
    } else {
      this.formData.paymentNotes[0] = { note: '', referenceNo: '' };
    }
  }

  onPolicyChange(isManual: boolean = true) {
    const selectedPolicy = this.policies.find((p) => p._id === this.formData.policyId);
    if (selectedPolicy) {
      this.selectedPolicyDetails = selectedPolicy;

      // Find matching policy type
      this.selectedPolicyTypeDetails = this.policyTypes.find(
        (t) => t._id === selectedPolicy.policyTypeId,
      );

      // Pre-fill fields if they are null
      if (isManual) {
        this.formData.commission = null;
      }
      if (this.formData.discount === null || this.formData.discount === undefined) {
        this.formData.discount = 0;
      }
      this.cdr.detectChanges();
    } else {
      this.selectedPolicyDetails = null;
      this.selectedPolicyTypeDetails = null;
    }
  }

  onSellingPriceChange() {
    if (this.selectedPolicyDetails) {
      const sellingPrice = this.formData.sellingPrice || 0;
      const discountPercent = this.selectedPolicyDetails.discount || 0;
      this.formData.commission = Math.round((sellingPrice * discountPercent) / 100);
      this.formData.discount = this.formData.commission;
    }
  }

  onCommissionChange() {
    this.formData.discount = this.formData.commission;
  }

  onSubmit() {
    if (!this.inquiryId) return;

    if (!this.formData.remarks || this.formData.remarks.trim() === '') {
      this.snackbarService.error('Note is mandatory');
      return;
    }

    if (!this.formData.lapsDate) {
      this.snackbarService.error('Lapse Date is mandatory');
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
      remarks: this.formData.remarks,
    };

    if (this.formData.policyId) {
      payload.policyId = this.formData.policyId;
    }

    // Always send policyTypeId if we have it, regardless of whether policy changed
    if (this.selectedPolicyTypeDetails?._id) {
      payload.policyTypeId = this.selectedPolicyTypeDetails._id;
    }

    if (this.formData.sellingPrice) payload.sellingPrice = this.formData.sellingPrice;
    if (this.formData.commission) payload.commission = this.formData.commission;
    if (this.formData.discount) payload.discount = this.formData.discount;
    if (this.formData.lapsDate) payload.lapsDate = this.formData.lapsDate;

    // Filter out empty payment notes
    const validpaymentNotess = this.formData.paymentNotes.filter(
      (pn) => pn.note.trim() !== '' || pn.referenceNo.trim() !== '',
    );
    if (validpaymentNotess.length > 0) {
      payload.paymentNotes = validpaymentNotess;
    }

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
