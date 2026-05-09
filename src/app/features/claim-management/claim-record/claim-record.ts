import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimRecordService } from './claim-record.service';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { finalize } from 'rxjs/operators';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-claim-record',
  standalone: true,
  imports: [CommonModule, TableComponent, FormsModule],
  templateUrl: './claim-record.html',
  styleUrl: './claim-record.scss',
})
export class ClaimRecordComponent implements OnInit {
  private claimService = inject(ClaimRecordService);
  private confirmationService = inject(ConfirmationService);
  private snackbarService = inject(SnackbarService);

  claims: any[] = [];
  isLoading = false;
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  availableStatuses = ['PENDING', 'COMPLETED'];
  selectedStatuses: string[] = ['PENDING', 'COMPLETED'];
  isStatusDropdownOpen = false;

  startDate = '';
  endDate = '';
  maxDate = new Date().toISOString().split('T')[0];

  columns: Column[] = [
    { field: 'createdAt', header: 'Date', type: 'date' },
    { field: 'RegistrationNo', header: 'Reg No', type: 'uppercase' },
    { field: 'ownerName', header: 'Owner Name', type: 'uppercase' },
    { field: 'contactNumber', header: 'Phone' },
    { field: 'vehicleType', header: 'Vehicle' },
    { field: 'insuranceType', header: 'Insurance' },
    { field: 'policyNo', header: 'Policy No' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  ngOnInit() {
    this.initDates();
    this.loadClaims();
  }

  initDates() {
    // const now = new Date();
    // const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    // const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // this.startDate = firstDay.toISOString().split('T')[0];
    // this.endDate = lastDay.toISOString().split('T')[0];
    this.startDate = '';
    this.endDate = '';
  }

  formatDateForApi(dateStr: string): string {
    return dateStr ? dateStr.replace(/-/g, '') : '';
  }

  loadClaims() {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.pageSize;
    const status =
      this.selectedStatuses.length > 0 ? this.selectedStatuses : ['PENDING', 'COMPLETED'];

    this.claimService
      .getClaims(this.pageSize, skip, status)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this.claims = res.result || [];
            this.totalItems = res.total || this.claims.length;
          }
        },
        error: (err) => console.error('Error loading claims:', err),
      });
  }

  @HostListener('document:click')
  clickout() {
    this.isStatusDropdownOpen = false;
  }

  toggleStatusDropdown(event: Event) {
    event.stopPropagation();
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  toggleStatus(status: string) {
    const index = this.selectedStatuses.indexOf(status);
    if (index > -1) {
      if (this.selectedStatuses.length > 1) {
        this.selectedStatuses.splice(index, 1);
      }
    } else {
      this.selectedStatuses.push(status);
    }
    this.currentPage = 1;
    this.loadClaims();
  }

  getSelectedStatusText(): string {
    if (this.selectedStatuses.length === 0) return 'Select Status';
    if (this.selectedStatuses.length === this.availableStatuses.length) return 'All Statuses';
    return this.selectedStatuses.join(', ');
  }

  async onUpdateStatus(claim: any) {
    if (claim.status === 'COMPLETED') return;

    const confirmed = await this.confirmationService.confirm({
      title: 'Update Claim Status',
      message: 'Are you sure you want to mark this claim as COMPLETED?',
      confirmText: 'Yes, Complete it',
      cancelText: 'Cancel',
      type: 'info',
    });

    if (confirmed) {
      this.isLoading = true;
      this.claimService
        .updateClaimStatus(claim._id, 'COMPLETED')
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.snackbarService.success('Claim updated to COMPLETED successfully');
              this.loadClaims();
            } else {
              this.snackbarService.error(res.msg || 'Failed to update claim');
            }
          },
          error: (err) => this.snackbarService.error('Error updating claim status'),
        });
    }
  }

  onPageChange(event: { page: number; limit: number }) {
    this.currentPage = event.page;
    this.pageSize = event.limit;
    this.loadClaims();
  }

  onRefresh() {
    this.loadClaims();
  }

  onDownload() {
    this.isLoading = true;
    const status =
      this.selectedStatuses.length > 0 ? this.selectedStatuses : ['PENDING', 'COMPLETED'];

    this.claimService
      .downloadClaimsExcel(status)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          if (res.status && res.result && res.result.length > 0) {
            const link = res.result[0].link;
            if (link) {
              window.open(link, '_blank');
              this.snackbarService.success('Claim records report generated successfully');
            } else {
              this.snackbarService.error('Download link not found');
            }
          } else {
            this.snackbarService.error(res.msg || 'Failed to generate report');
          }
        },
        error: (err) => {
          console.error('Download error:', err);
          this.snackbarService.error('Error downloading claim records');
        },
      });
  }
}
