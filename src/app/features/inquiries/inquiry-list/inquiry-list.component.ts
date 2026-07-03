import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { InquiryInfoDialogComponent } from './inquiry-info-dialog/inquiry-info-dialog.component';
import { InquiryAssignDialogComponent } from './inquiry-assign-dialog/inquiry-assign-dialog.component';
import { InquiryUpdateDialogComponent } from './inquiry-update-dialog/inquiry-update-dialog.component';
import { InquiryService } from './inquiry.service';
import { InquiryReportItem } from '../../../core/models/inquiry.models';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-inquiry-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    DialogComponent,
    InquiryInfoDialogComponent,
    InquiryAssignDialogComponent,
    InquiryUpdateDialogComponent,
  ],
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./inquiry-list.component.scss'],
})
export class InquiryListComponent implements OnInit {
  items: InquiryReportItem[] = [];
  filteredItems: InquiryReportItem[] = [];
  isLoading = true;

  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  // Modals state
  selectedInquiryId: string | null = null;
  selectedInquiryStatus: string = 'Pending';

  isInfoModalOpen = false;
  isAssignModalOpen = false;
  isUpdateModalOpen = false;

  // Filters & State
  searchTerm = '';
  selectedStatuses: string[] = ['Pending'];
  availableStatuses = ['Pending', 'Connected', 'Completed', 'Not Interested', 'Cancelled'];
  apiMessage: string = '';
  isStatusDropdownOpen = false;

  constructor(
    private inquiryService: InquiryService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private snackbarService: SnackbarService,
  ) {}

  isAdmin(): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;
    const role = user.role?.toUpperCase() || '';
    return role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'SUPER ADMIN';
  }

  ngOnInit() {
    this.loadData();
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.isStatusDropdownOpen = false;
  }

  toggleStatusDropdown(event: Event) {
    event.stopPropagation();
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  getSelectedStatusText(): string {
    if (this.selectedStatuses.length === 0) {
      return 'Select Status';
    } else if (this.selectedStatuses.length === 1) {
      return this.selectedStatuses[0];
    } else if (this.selectedStatuses.length === this.availableStatuses.length) {
      return 'All Statuses';
    } else {
      return `${this.selectedStatuses.length} Selected`;
    }
  }

  toggleStatus(status: string) {
    const index = this.selectedStatuses.indexOf(status);
    if (index > -1) {
      this.selectedStatuses.splice(index, 1);
    } else {
      this.selectedStatuses.push(status);
    }
    this.currentPage = 1;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.apiMessage = '';

    if (this.selectedStatuses.length === 0) {
      this.items = [];
      this.apiMessage = 'Status is required';
      this.isLoading = false;
      return;
    }

    const skip = (this.currentPage - 1) * this.pageSize;

    this.inquiryService.getInquiries(this.pageSize, skip, this.selectedStatuses).subscribe({
      next: (res) => {
        if (res.status && res.result) {
          this.items = res.result;
          this.filterItems(); // Initial filter
          this.totalItems = res.totalCount || 0;
          if (this.items.length === 0) {
            this.apiMessage = res.msg || 'No data found.';
          }
        } else {
          this.items = [];
          this.filterItems();
          this.totalItems = 0;
          this.apiMessage = res.msg || 'No data found.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch enquiries', err);
        this.items = [];
        this.filterItems();
        this.totalItems = 0;
        this.apiMessage = err.error?.msg || 'Failed to load enquiries.';
        this.isLoading = false;
      },
    });
  }

  onRefresh() {
    this.currentPage = 1;
    this.loadData();
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterItems();
  }

  filterItems() {
    if (!this.searchTerm) {
      this.filteredItems = [...this.items];
      return;
    }

    this.filteredItems = this.items.filter((item) => {
      const searchStr =
        `${item.regNumber} ${item.name} ${item.phoneNumber} ${item.policyName} ${item.status}`.toLowerCase();
      return searchStr.includes(this.searchTerm);
    });
  }

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

  // Info Modal
  openInfo(id: string) {
    this.selectedInquiryId = id;
    this.isInfoModalOpen = true;
  }

  closeInfo() {
    this.isInfoModalOpen = false;
    this.selectedInquiryId = null;
  }

  // Assign Modal
  openAssign(id: string) {
    this.selectedInquiryId = id;
    this.isAssignModalOpen = true;
  }

  closeAssign() {
    this.isAssignModalOpen = false;
    this.selectedInquiryId = null;
  }

  onAssignSaved() {
    this.closeAssign();
    this.loadData();
  }

  // Update Modal
  openUpdate(inquiry: InquiryReportItem) {
    this.selectedInquiryId = inquiry._id;
    this.selectedInquiryStatus = inquiry.status;
    this.isUpdateModalOpen = true;
  }

  closeUpdate() {
    this.isUpdateModalOpen = false;
    this.selectedInquiryId = null;
  }

  onUpdateSaved() {
    this.closeUpdate();
    this.loadData();
  }

  deleteInquiry(id: string) {
    this.confirmationService.confirm({
      title: 'Delete Inquiry',
      message: 'Are you sure you want to delete this inquiry? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    }).then((confirmed) => {
      if (confirmed) {
        this.inquiryService.deleteInquiry(id).subscribe({
          next: (res) => {
            if (res.status !== false) {
              this.snackbarService.success(res.msg || 'Inquiry deleted successfully');
              this.loadData();
            } else {
              this.snackbarService.error(res.msg || 'Failed to delete Inquiry');
            }
          },
          error: (err) => {
            this.snackbarService.error(err.error?.msg || 'Failed to delete Inquiry');
          },
        });
      }
    });
  }
}
