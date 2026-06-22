import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../../shared/components/table/table.component';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { BannerFormComponent } from './banner-form/banner-form.component';
import { BannerService } from './banner.service';
import { Banner, BannerApiResponse } from '../../../../core/models/banner.models';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-promotional-banner',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, BannerFormComponent],
  templateUrl: './promotional-banner.component.html',
  styleUrls: ['../../../masters/admin-creation/admin-creation.component.scss'],
})
export class PromotionalBannerComponent implements OnInit {
  items: Banner[] = [];
  columns: Column[] = [
    { field: 'priority', header: 'Priority' },
    { field: 'showInPortal', header: 'Show in Portal' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isSubmitting = false;
  isLoading = false;
  isActiveFilter: boolean = true;
  selectedItem: Banner | null = null;

  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(
    private bannerService: BannerService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    const limit = this.pageSize;
    const skip = (this.currentPage - 1) * this.pageSize;

    this.bannerService.getBanners(this.isActiveFilter, limit, skip).subscribe({
      next: (response: BannerApiResponse) => {
        this.isLoading = false;
        if (response.status && response.result) {
          this.items = response.result.map((item: any) => ({
            ...item,
            status: item.isActive !== false ? 'Active' : 'Inactive',
          }));
          this.totalItems = response.totalCount || 0;
        } else {
          this.items = [];
          this.totalItems = 0;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.items = [];
        this.totalItems = 0;
        this.snackbarService.error('Failed to load banners');
        this.cdr.detectChanges();
      },
    });
  }

  onPageChange(event: { page: number; limit: number }): void {
    this.currentPage = event.page;
    this.pageSize = event.limit;
    this.loadData();
  }

  onStatusFilterChange(status: boolean) {
    this.isActiveFilter = status;
    this.currentPage = 1;
    this.loadData();
  }

  openForm(item: Banner | null = null): void {
    this.selectedItem = item;
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(formData: FormData): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const request = formData.has('_id')
      ? this.bannerService.updateBanner(formData)
      : this.bannerService.createBanner(formData);

    request.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
      next: (response: BannerApiResponse) => {
        if (response.status) {
          this.loadData();
          this.closeForm();
          this.snackbarService.success(response.msg || 'Banner saved successfully');
        } else {
          this.snackbarService.error(response.msg || 'Failed to save banner');
        }
      },
      error: (err) => {
        this.snackbarService.error(err.error?.msg || 'Failed to save banner');
      },
    });
  }

  onDelete(item: Banner): void {
    if (!item._id) return;

    const isCurrentlyInactive = item.isActive === false || item.status === 'Inactive';
    const targetActiveStatus = isCurrentlyInactive;
    this.bannerService.toggleBannerStatus(item._id, targetActiveStatus).subscribe({
      next: (response: BannerApiResponse) => {
        if (response.status) {
          this.loadData();
          this.snackbarService.success(
            response.msg || `Banner ${targetActiveStatus ? 'activated' : 'deactivated'} successfully`,
          );
        } else {
          this.snackbarService.error(response.msg || 'Failed to update banner status');
        }
      },
      error: (err) => {
        this.snackbarService.error(err.error?.msg || 'Failed to update banner status');
      },
    });
  }
}
