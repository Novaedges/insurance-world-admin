import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { InquiryInfoDialogComponent } from './inquiry-info-dialog/inquiry-info-dialog.component';
import { InquiryAssignDialogComponent } from './inquiry-assign-dialog/inquiry-assign-dialog.component';
import { InquiryUpdateDialogComponent } from './inquiry-update-dialog/inquiry-update-dialog.component';
import { InquiryService } from './inquiry.service';
import { InquiryReportItem } from '../../../core/models/inquiry.models';

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
  styleUrls: [
    '../../masters/admin-creation/admin-creation.component.scss',
    '../../../shared/components/table/table.component.scss',
    './inquiry-list.component.scss',
  ],
})
export class InquiryListComponent implements OnInit {
  items: InquiryReportItem[] = [];
  isLoading = true;

  // Pagination
  limit = 10;
  skip = 0;

  // Modals state
  selectedInquiryId: string | null = null;
  selectedInquiryStatus: string = 'Pending';

  isInfoModalOpen = false;
  isAssignModalOpen = false;
  isUpdateModalOpen = false;

  // Filters & State
  selectedStatuses: string[] = ['Pending'];
  availableStatuses = ['Pending', 'On Going', 'Completed', 'Not Interested'];
  apiMessage: string = '';
  isStatusDropdownOpen = false;

  constructor(private inquiryService: InquiryService) {}

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
    this.skip = 0;
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

    this.inquiryService.getInquiries(this.limit, this.skip, this.selectedStatuses).subscribe({
      next: (res) => {
        if (res.status && res.result) {
          this.items = res.result;
          if (this.items.length === 0) {
            this.apiMessage = res.msg || 'No data found.';
          }
        } else {
          this.items = [];
          this.apiMessage = res.msg || 'No data found.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch inquiries', err);
        this.items = [];
        this.apiMessage = err.error?.msg || 'Failed to load inquiries.';
        this.isLoading = false;
      },
    });
  }

  onRefresh() {
    this.skip = 0;
    this.loadData();
  }

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
}
