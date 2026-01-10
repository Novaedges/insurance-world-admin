import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../../shared/components/table/table.component';
import { FeatureService, CommissionRule } from '../../../../core/services/feature.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-commission-structure',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './commission-structure.html',
  styleUrl: './commission-structure.scss',
})
export class CommissionStructure implements OnInit {
  items: CommissionRule[] = [];
  columns: Column[] = [
    { field: 'role', header: 'Agent Role' },
    { field: 'percentage', header: 'Commission %' },
    { field: 'minSaleAmount', header: 'Min Sale Amount', type: 'currency' },
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
    this.featureService.getCommissionRules().subscribe({
      next: (data) => {
        this.items = data;
        if (showNotification) this.snackbar.success('Commission rules refreshed');
      },
      error: () => this.snackbar.error('Failed to load rules'),
    });
  }
}
