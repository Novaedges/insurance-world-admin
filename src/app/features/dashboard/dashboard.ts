import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  currentDate = new Date();
  dateRange = {
    start: new Date().toISOString().split('T')[0], // Default Today
    end: new Date().toISOString().split('T')[0],
  };

  // Mock Data for KPIs
  kpis = [
    {
      label: 'Total Inquiries',
      value: '1,245',
      trend: 12,
      icon: 'ri-mail-line',
      colorClass: 'blue-icon',
    },
    {
      label: 'Active Policies',
      value: '854',
      trend: 5,
      icon: 'ri-file-text-line',
      colorClass: 'green-icon',
    },
    {
      label: 'Conversion Rate',
      value: '24%',
      trend: -2,
      icon: 'ri-pie-chart-line',
      colorClass: 'purple-icon',
    },
    {
      label: 'Total Premium',
      value: '₹45L',
      trend: 8,
      icon: 'ri-money-rupee-circle-line',
      colorClass: 'orange-icon',
    },
  ];

  // Mock Data for Category Insights
  categoryStats = [
    { label: 'Motor Insurance', value: 65, color: '#6366f1' }, // Indigo
    { label: 'Health Insurance', value: 25, color: '#10b981' }, // Emerald
    { label: 'Travel Insurance', value: 10, color: '#f59e0b' }, // Amber
  ];

  // Top Models for Pie Chart
  topModels = [
    { label: 'Honda City', value: 40, color: '#6366f1' },
    { label: 'Swift Dzire', value: 30, color: '#8b5cf6' },
    { label: 'Hyundai Creta', value: 20, color: '#ec4899' },
    { label: 'Other', value: 10, color: '#94a3b8' },
  ];

  conicGradient = `conic-gradient(
    #6366f1 0% 40%, 
    #8b5cf6 40% 70%, 
    #ec4899 70% 90%, 
    #94a3b8 90% 100%
  )`;

  // Mock Sales Agents
  topAgents = [
    { name: 'Sarah Wilson', initials: 'SW', sales: 12500, conversion: 32, trend: 'up' },
    { name: 'Mike Johnson', initials: 'MJ', sales: 9800, conversion: 28, trend: 'up' },
    { name: 'Emily Davis', initials: 'ED', sales: 7400, conversion: 25, trend: 'down' },
  ];

  // Mock Alerts
  alerts = [
    {
      title: 'Policy Expiring',
      desc: 'customer@email.com - Policy #9988 expires in 3 days',
      due: '3d',
      type: 'critical',
    },
    {
      title: 'Unassigned Inquiry',
      desc: 'New inquiry for Motor Insurance from London',
      due: '1h',
      type: 'warning',
    },
    {
      title: 'Payment Failed',
      desc: 'Transaction #TX123 failed for $450',
      due: '2h',
      type: 'error',
    },
  ];
}
