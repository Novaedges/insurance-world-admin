import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../../shared/components/table/table.component';
import { FeatureService, RefundRequest } from '../../../../core/services/feature.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-refund-manager',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './refund-manager.html',
  styleUrl: './refund-manager.scss',
})
export class RefundManager implements OnInit {
  items: RefundRequest[] = [];
  columns: Column[] = [
    { field: 'originalTransactionId', header: 'Txn ID' },
    { field: 'reason', header: 'Reason' },
    { field: 'amount', header: 'Amount', type: 'currency' },
    { field: 'date', header: 'Requested Date', type: 'date' },
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
    this.featureService.getRefunds().subscribe({
      next: (data) => {
        this.items = data;
        if (showNotification) this.snackbar.success('Refunds refreshed');
      },
      error: () => this.snackbar.error('Failed to load refunds'),
    });
  }
}
