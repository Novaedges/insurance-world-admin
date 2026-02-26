import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { InsuranceCategoryFormComponent } from './insurance-category-form/insurance-category-form.component';
import { InsuranceCategoryService } from './insurance-category.service';
import { InsuranceCategory } from '../../../core/models/master.models';
import { SnackbarService } from '../../../core/services/snackbar.service';

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
    { field: 'description', header: 'Description' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isLoading = false;
  isActiveFilter: boolean = true;
  selectedItem: InsuranceCategory | null = null;

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
    this.categoryService.getCategories(this.isActiveFilter).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status && response.result) {
        this.items = response.result.map((item: any) => ({
          ...item,
          status: item.isActive ? 'Active' : 'Inactive',
        }));
      } else {
        this.items = [];
      }
      this.cdr.detectChanges();
    });
  }

  onStatusFilterChange(status: boolean) {
    this.isActiveFilter = status;
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

  onSave(formData: FormData) {
    const id = formData.get('_id') as string;
    const request = id
      ? this.categoryService.updateCategory(formData)
      : this.categoryService.createCategory(formData);

    request.subscribe({
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
      this.categoryService.deleteCategory(item._id).subscribe({
        next: (response: any) => {
          this.loadData();
          this.snackbarService.success(response.msg || 'Category deleted successfully');
        },
        error: (error) => console.error('Error deleting category:', error),
      });
    }
  }
}
