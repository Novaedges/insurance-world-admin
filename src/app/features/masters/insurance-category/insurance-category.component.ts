import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { InsuranceCategoryFormComponent } from './insurance-category-form/insurance-category-form.component';
import { InsuranceCategoryService } from './insurance-category.service';
import { InsuranceCategory } from '../../../core/models/master.models';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-insurance-category',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, InsuranceCategoryFormComponent],
  templateUrl: './insurance-category.component.html',
  styleUrls: ['../admin-creation/admin-creation.component.scss'], // Reuse styles
})
export class InsuranceCategoryComponent implements OnInit {
  items: InsuranceCategory[] = [];
  columns: Column[] = [
    { field: 'name', header: 'Category Name' },
    { field: 'type', header: 'Type' },
    { field: 'priority', header: 'Priority' },
    { field: 'description', header: 'Description' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isSubmitting = false;
  isLoading = false;
  isActiveFilter: boolean = true;
  selectedItem: InsuranceCategory | null = null;
  isInfoModalOpen = false;
  infoData: any = null;

  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(
    private categoryService: InsuranceCategoryService,
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

    this.categoryService
      .getCategories(this.isActiveFilter, limit, skip)
      .subscribe((response: any) => {
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

  openForm(item: InsuranceCategory | null = null) {
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

    const id = formData.get('_id') as string;
    const request = id
      ? this.categoryService.updateCategory(formData)
      : this.categoryService.createCategory(formData);

    request.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.loadData();
          this.snackbarService.success(response.msg);
          this.closeForm();
        } else {
          this.snackbarService.error(response.msg || 'Operation failed');
        }
      },
      error: (error) => {
        console.error('Error saving category:', error);
        this.snackbarService.error(error.error?.msg || 'Failed to save category');
      },
    });
  }

  onDelete(item: any) {
    if (item._id) {
      const isCurrentlyInactive = item.isActive === false || item.status === 'Inactive';
      const targetActiveStatus = isCurrentlyInactive;
      this.categoryService.deleteCategory(item._id, targetActiveStatus).subscribe({
        next: (response: any) => {
          this.loadData();
          const actionText = targetActiveStatus ? 'restored' : 'deactivated';
          this.snackbarService.success(response.msg || `Category ${actionText} successfully`);
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.snackbarService.error(error.error?.msg || 'Failed to update category status');
        },
      });
    }
  }
}
