import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { PolicyTypeFormComponent } from './policy-type-form/policy-type-form.component';
import { PolicyTypeService } from './policy-type.service';
import { PolicyType } from '../../../core/models/master.models';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-policy-type',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, PolicyTypeFormComponent],
  templateUrl: './policy-type.component.html',
  styleUrls: ['../admin-creation/admin-creation.component.scss'], // Reuse styles
})
export class PolicyTypeComponent implements OnInit {
  items: PolicyType[] = [];
  columns: Column[] = [
    { field: 'policyType', header: 'Policy Type' },
    { field: 'tag', header: 'Tag' },
    { field: 'description', header: 'Description' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isSubmitting = false;
  isLoading = false;
  isActiveFilter: boolean = true;
  selectedItem: PolicyType | null = null;
  isInfoModalOpen = false;
  infoData: any = null;

  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(
    private policyTypeService: PolicyTypeService,
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    const limit = this.pageSize;
    const skip = (this.currentPage - 1) * this.pageSize;

    this.policyTypeService.getPolicyTypes(this.isActiveFilter, limit, skip).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.status && response.result) {
          this.items = response.result.map((item: any) => ({
            ...item,
            status: item.isActive ? 'Active' : 'Inactive',
          }));
          this.totalItems = response.totalCount || 0;
        } else {
          this.items = [];
          this.totalItems = 0;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching policy types', error);
        this.items = [];
        this.totalItems = 0;
        this.cdr.detectChanges();
      },
    });
  }

  onPageChange(event: { page: number; limit: number }) {
    this.currentPage = event.page;
    this.pageSize = event.limit;
    this.loadData();
  }

  onStatusFilterChange(status: boolean) {
    this.isActiveFilter = status;
    this.currentPage = 1;
    this.loadData();
  }

  openForm(item: PolicyType | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onView(item: any) {
    this.infoData = item;
    this.isInfoModalOpen = true;
  }

  closeInfoModal() {
    this.isInfoModalOpen = false;
    this.infoData = null;
  }

  onSave(formData: FormData) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const id = formData.get('_id');
    const request = id
      ? this.policyTypeService.updatePolicyType(formData)
      : this.policyTypeService.createPolicyType(formData);

    request.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.loadData();
          this.snackbarService.success(response.msg || 'Policy Type saved successfully');
          this.closeForm();
        } else {
          this.snackbarService.error(response.msg || 'Operation failed');
        }
      },
      error: (error) => {
        console.error('Error saving policy type:', error);
        this.snackbarService.error(error.error?.msg || 'Failed to save policy type');
      },
    });
  }

  onDelete(item: any) {
    if (confirm('Are you sure you want to delete this policy type?')) {
      if (item._id) {
        this.policyTypeService.deletePolicyType(item._id).subscribe({
          next: (response: any) => {
            if (response.status || response.status === undefined) {
              this.loadData();
              this.snackbarService.success(response.msg || 'Policy Type deleted successfully');
            } else {
              this.snackbarService.error(response.msg || 'Failed to delete policy type');
            }
          },
          error: (error) => {
            console.error('Error deleting policy type:', error);
            this.snackbarService.error(error.error?.msg || 'Failed to delete policy type');
          },
        });
      }
    }
  }
}
