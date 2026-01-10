import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../../shared/components/table/table.component';
import { FeatureService, MarketingCampaign } from '../../../../core/services/feature.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-campaign-workflow',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './campaign-workflow.html',
  styleUrl: './campaign-workflow.scss',
})
export class CampaignWorkflow implements OnInit {
  items: MarketingCampaign[] = [];
  columns: Column[] = [
    { field: 'name', header: 'Campaign Name' },
    { field: 'type', header: 'Type' },
    { field: 'targetAudience', header: 'Audience' },
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
    this.featureService.getCampaigns().subscribe({
      next: (data) => {
        this.items = data;
        if (showNotification) this.snackbar.success('Campaigns refreshed');
      },
      error: () => this.snackbar.error('Failed to load campaigns'),
    });
  }
}
