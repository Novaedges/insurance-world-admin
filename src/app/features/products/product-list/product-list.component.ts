import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { TooltipDirective } from '../../../shared/directives/tooltip/tooltip.directive';
import { ProductService } from '../product.service';
import { Product } from '../../../core/models/product.models';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, ProductFormComponent, TooltipDirective],
  templateUrl: './product-list.component.html',
  styleUrls: ['../../masters/admin-creation/admin-creation.component.scss'],
})
export class ProductListComponent implements OnInit {
  items: Product[] = [];
  columns: Column[] = [
    { field: 'policyCode', header: 'Policy Code' },
    { field: 'policyName', header: 'Policy Name' },
    { field: 'insuranceCompany', header: 'Company' },
    { field: 'policyTypeName', header: 'Policy Type' },
    { field: 'minPrice', header: 'Min Price', type: 'currency', currencyCode: 'INR' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isSubmitting = false;
  isLoading = false;
  isActiveFilter: boolean = true;
  selectedItem: Product | null = null;

  isInfoModalOpen = false;
  isLoadingInfo = false;
  infoData: any = null;

  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(showNotification = false) {
    this.isLoading = true;
    this.cdr.detectChanges();

    const limit = this.pageSize;
    const skip = (this.currentPage - 1) * this.pageSize;

    this.productService.getProducts(this.isActiveFilter, limit, skip).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.status && response.result) {
          this.items = response.result.map((item: any) => ({
            ...item,
            status: item.isActive !== false ? 'Active' : 'Inactive',
          }));

          // Fallback if totalCount is not provided:
          // If we got a full page, assume there might be more.
          this.totalItems = response.totalCount || 0;

          if (showNotification) {
            this.snackbarService.success('Data refreshed successfully');
          }
        } else {
          this.items = [];
          this.totalItems = 0;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.items = [];
        this.totalItems = 0;
        this.snackbarService.error('Failed to load products');
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
    this.currentPage = 1; // Reset to first page on filter change
    this.loadData();
  }

  openForm(item: any = null) {
    const itemId = item ? item._id || item.id : null;
    if (itemId) {
      // For Edit, wait to load full details
      this.isLoading = true;
      this.cdr.detectChanges();
      this.productService.getProductById(itemId).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.status && res.result) {
            const data = Array.isArray(res.result) ? res.result[0] : res.result;
            this.selectedItem = { ...data };
            this.isModalOpen = true;
          } else {
            this.snackbarService.error('Failed to load full item details for edit');
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.snackbarService.error('Failed to load full item details for edit');
          this.cdr.detectChanges();
        },
      });
    } else {
      // For Add
      this.selectedItem = null;
      this.isModalOpen = true;
      this.cdr.detectChanges();
    }
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onViewPolicy(item: any) {
    if (!item._id) return;
    this.isLoadingInfo = true;
    this.isInfoModalOpen = true;
    this.infoData = null;
    this.cdr.detectChanges();

    this.productService.getProductById(item._id).subscribe({
      next: (response: any) => {
        this.isLoadingInfo = false;
        if (response.status && response.result) {
          const resultData = Array.isArray(response.result) ? response.result[0] : response.result;
          this.infoData = resultData;
        } else {
          this.snackbarService.error('Failed to load full policy info');
          this.closeInfoModal();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingInfo = false;
        this.snackbarService.error('Failed to load full policy info');
        this.closeInfoModal();
        this.cdr.detectChanges();
      },
    });
  }

  closeInfoModal() {
    this.isInfoModalOpen = false;
    this.infoData = null;
  }

  onSave(item: any) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.productService
      .saveProduct(item)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response: any) => {
          if (response.status) {
            this.loadData();
            this.closeForm();
            this.snackbarService.success(response.msg || 'Product saved successfully');
          } else {
            this.snackbarService.error(response.msg || 'Failed to save product');
          }
        },
        error: (err) => {
          console.error('Save error:', err);
          this.snackbarService.error(err.error?.msg || 'Failed to save product');
        },
      });
  }

  onDelete(item: any) {
    if (item._id) {
      this.productService.deleteProduct(item._id).subscribe({
        next: (response: any) => {
          if (response.status !== false) {
            this.loadData();
            this.snackbarService.success(response.msg || 'Product deleted successfully');
          } else {
            this.snackbarService.error(response.msg || 'Failed to delete product');
          }
        },
        error: (err) => {
          console.error('Delete error', err);
          this.snackbarService.error(err.error?.msg || 'Failed to delete product');
        },
      });
    }
  }
}
