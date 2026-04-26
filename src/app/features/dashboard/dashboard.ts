import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  isLoading = false;
  today = this.formatDate(new Date());
  dateRange = {
    start: this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), // Start of month
    end: this.formatDate(new Date()), // Today
  };

  kpiStats: any = null;
  totalCommission = 0;
  netPremium = 0;
  categoryStats: any[] = [];
  topModels: any[] = [];
  topAgents: any[] = [];
  topExecutives: any[] = [];
  conicGradient = '';

  ngOnInit() {
    this.loadDashboard();
  }

  formatDateForApi(dateStr: string): string {
    return dateStr.replace(/-/g, '');
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onDateChange() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    const start = this.formatDateForApi(this.dateRange.start);
    const end = this.formatDateForApi(this.dateRange.end);

    this.dashboardService
      .getDashboardData(start, end)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          if (res.status && res.result && res.result.length > 0) {
            const data = res.result[0];
            this.kpiStats = data.kpis;
            this.totalCommission = data.totalCommission || 0;
            this.netPremium =
              (this.kpiStats?.totalPremium?.value || 0) -
              (this.kpiStats?.totalCommission?.value || 0);
            this.categoryStats = data.categoryInsights || [];
            this.topModels = data.topDemandedModels || [];
            this.topAgents = data.topSalesAgents || [];
            this.topExecutives = data.topSalesExecutives || [];
            this.generateGradient();
          }
        },
        error: (err) => console.error('Dashboard error:', err),
      });
  }

  generateGradient() {
    if (this.topModels.length === 0) {
      this.conicGradient = 'conic-gradient(#e2e8f0 0% 100%)';
      return;
    }

    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#94a3b8'];
    let currentPercentage = 0;
    const total = this.topModels.reduce((acc, curr) => acc + curr.count, 0);

    const gradientParts = this.topModels.map((item, index) => {
      const percentage = (item.count / total) * 100;
      const start = currentPercentage;
      currentPercentage += percentage;
      const color = colors[index % colors.length];
      item.color = color; // Assign color for legend
      return `${color} ${start}% ${currentPercentage}%`;
    });

    this.conicGradient = `conic-gradient(${gradientParts.join(', ')})`;
  }

  get totalModelCount(): number {
    return this.topModels.reduce((acc, curr) => acc + curr.count, 0);
  }
}
