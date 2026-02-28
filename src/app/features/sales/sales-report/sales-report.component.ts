import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../../core/services/sales.service';
import { SaleReportItem } from '../../../core/models/sale.models';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { SaleInfoDialogComponent } from './sale-info-dialog/sale-info-dialog.component';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent, SaleInfoDialogComponent],
  templateUrl: './sales-report.component.html',
  styleUrls: [
    '../../masters/admin-creation/admin-creation.component.scss',
    './sales-report.component.scss',
  ],
})
export class SalesReportComponent implements OnInit {
  items: SaleReportItem[] = [];

  // API Pagination & Filters
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';
  salesExecutiveId = ''; // Adjust if you have a dropdown for this later

  pageSizeOptions = [10, 20, 50, 100];
  isLoading = false;

  isInfoModalOpen = false;
  selectedSaleId: string | null = null;

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.pageSize;

    this.salesService
      .getSales(this.pageSize, skip, this.searchTerm, this.salesExecutiveId)
      .subscribe({
        next: (res) => {
          if (res.status && res.result) {
            this.items = res.result;
            this.totalItems = res.totalCount || 0;
          } else {
            this.items = [];
            this.totalItems = 0;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load sales report', err);
          this.items = [];
          this.totalItems = 0;
          this.isLoading = false;
        },
      });
  }

  onRefresh() {
    this.currentPage = 1;
    this.loadData();
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.currentPage = 1; // Reset pagination on search
    this.loadData();
  }

  openInfo(item: SaleReportItem) {
    this.selectedSaleId = item._id;
    this.isInfoModalOpen = true;
  }

  closeInfo() {
    this.isInfoModalOpen = false;
    this.selectedSaleId = null;
  }

  // Pagination Handlers
  onPageChange(event: { page: number; limit: number }) {
    this.currentPage = event.page;
    this.pageSize = event.limit;
    this.loadData();
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.pageSize;
    return this.totalItems > 0
      ? Math.min(end, this.totalItems)
      : this.startIndex + this.items.length - 1;
  }

  get hasPrev(): boolean {
    return this.currentPage > 1;
  }

  get hasNext(): boolean {
    if (this.totalItems > 0) {
      return this.currentPage * this.pageSize < this.totalItems;
    }
    return this.items.length === this.pageSize;
  }

  exportData(format: 'csv' | 'pdf' | 'excel') {
    this.salesService.exportSales(format).subscribe((success) => {
      if (success) {
        alert(`Exported as ${format.toUpperCase()} successfully! (Mock)`);
      }
    });
  }
}
