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
  limit = 10;
  skip = 0;
  searchTerm = '';
  salesExecutiveId = ''; // Adjust if you have a dropdown for this later

  isLoading = false;

  isInfoModalOpen = false;
  selectedSaleId: string | null = null;

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.salesService
      .getSales(this.limit, this.skip, this.searchTerm, this.salesExecutiveId)
      .subscribe({
        next: (res) => {
          if (res.status && res.result) {
            this.items = res.result;
          } else {
            this.items = [];
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load sales report', err);
          this.items = [];
          this.isLoading = false;
        },
      });
  }

  onRefresh() {
    this.skip = 0;
    this.loadData();
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.skip = 0; // Reset pagination on search
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

  // Next Page / Prev Page helpers
  nextPage() {
    this.skip += this.limit;
    this.loadData();
  }

  prevPage() {
    if (this.skip >= this.limit) {
      this.skip -= this.limit;
      this.loadData();
    }
  }

  exportData(format: 'csv' | 'pdf' | 'excel') {
    this.salesService.exportSales(format).subscribe((success) => {
      if (success) {
        alert(`Exported as ${format.toUpperCase()} successfully! (Mock)`);
      }
    });
  }
}
