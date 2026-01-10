import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, ProductFormComponent],
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
  selectedItem: Product | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getProducts().subscribe((data) => (this.items = data));
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
    this.productService.saveProduct(item).subscribe(() => {
      this.loadData();
      this.closeForm();
    });
  }

  onDelete(item: Product) {
    this.productService.deleteProduct(item.id).subscribe(() => this.loadData());
  }
}
