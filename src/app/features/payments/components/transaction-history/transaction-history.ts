import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../../shared/components/table/table.component';
import { FeatureService, PaymentTransaction } from '../../../../core/services/feature.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss',
})
export class TransactionHistory implements OnInit {
  items: PaymentTransaction[] = [];
  columns: Column[] = [
    { field: 'transactionId', header: 'Txn ID' },
    { field: 'customerName', header: 'Customer' },
    { field: 'amount', header: 'Amount', type: 'currency' },
    { field: 'date', header: 'Date', type: 'date' },
    { field: 'method', header: 'Method' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  constructor(
    private featureService: FeatureService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(showNotification = false) {
    this.featureService.getTransactions().subscribe({
      next: (data) => {
        this.items = data;
        if (showNotification) this.snackbar.success('Transactions refreshed');
      },
      error: () => this.snackbar.error('Failed to load transactions'),
    });
  }
}
