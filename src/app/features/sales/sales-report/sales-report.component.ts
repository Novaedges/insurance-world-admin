import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../../core/services/sales.service';
import { Sale } from '../../../core/models/sale.models';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './sales-report.component.html',
  styleUrls: [
    '../../masters/admin-creation/admin-creation.component.scss',
    './sales-report.component.scss',
  ],
})
export class SalesReportComponent implements OnInit {
  items: Sale[] = [];
  filteredItems: Sale[] = [];

  filters = {
    startDate: '',
    endDate: '',
    category: '',
    agent: '',
  };

  searchTerm: string = '';
  isFilterApplied = false;

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.salesService.getSales().subscribe((data) => {
      this.items = data;
      this.applyFilters(); // Re-apply filters including search
    });
  }

  onRefresh() {
    this.loadData();
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredItems = this.items.filter((item) => {
      const matchCategory = !this.filters.category || item.categoryName === this.filters.category;
      const matchAgent = !this.filters.agent || item.agentName === this.filters.agent;

      let matchDate = true;
      if (this.filters.startDate) {
        matchDate = matchDate && new Date(item.saleDate) >= new Date(this.filters.startDate);
      }
      if (this.filters.endDate) {
        matchDate = matchDate && new Date(item.saleDate) <= new Date(this.filters.endDate);
      }

      const matchSearch =
        !this.searchTerm ||
        item.policyNumber.toLowerCase().includes(this.searchTerm) ||
        item.customerName.toLowerCase().includes(this.searchTerm) ||
        item.productName.toLowerCase().includes(this.searchTerm);

      return matchCategory && matchAgent && matchDate && matchSearch;
    });

    // Check if any filter is active (excluding search which is handled separately usually, but here included)
    this.isFilterApplied = !!(
      this.filters.category ||
      this.filters.agent ||
      this.filters.startDate ||
      this.filters.endDate
    );
  }

  resetFilters() {
    this.filters = {
      startDate: '',
      endDate: '',
      category: '',
      agent: '',
    };
    this.isFilterApplied = false;
    this.filteredItems = [...this.items];
  }

  exportData(format: 'csv' | 'pdf' | 'excel') {
    this.salesService.exportSales(format).subscribe((success) => {
      if (success) {
        alert(`Exported as ${format.toUpperCase()} successfully! (Mock)`);
      }
    });
  }
}
