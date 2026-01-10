import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { TooltipDirective } from '../../../shared/directives/tooltip/tooltip.directive';
import { ProductService } from '../../../core/services/product.service';
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
    { field: 'name', header: 'Product Name' },
    { field: 'insuranceCategoryName', header: 'Category' },
    { field: 'basePrice', header: 'Base Price', type: 'currency', currencyCode: 'INR' },
    { field: 'finalPrice', header: 'Final Price', type: 'currency', currencyCode: 'INR' },
    { field: 'policyDuration', header: 'Duration' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isSubmitting = false;
  selectedItem: Product | null = null;

  constructor(
    private productService: ProductService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(showNotification = false) {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.items = data;
        if (showNotification) {
          this.snackbarService.success('Data refreshed successfully');
        }
      },
      error: () => this.snackbarService.error('Failed to load products'),
    });
  }

  openForm(item: Product | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(item: Product) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.productService
      .saveProduct(item)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
          this.snackbarService.success(
            item.id ? 'Product updated successfully' : 'Product created successfully'
          );
        },
        error: (err) => {
          console.error('Save error:', err);
          this.snackbarService.error('Failed to save product');
        },
      });
  }

  onDelete(item: Product) {
    this.productService.deleteProduct(item.id).subscribe({
      next: () => {
        this.loadData();
        this.snackbarService.success('Product deleted successfully');
      },
      error: () => this.snackbarService.error('Failed to delete product'),
    });
  }
}
