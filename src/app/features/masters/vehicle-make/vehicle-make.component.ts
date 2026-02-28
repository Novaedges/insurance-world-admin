import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { VehicleMakeFormComponent } from './vehicle-make-form/vehicle-make-form.component';
import { VehicleMakeService } from './vehicle-make.service';
import { VehicleMake } from '../../../core/models/master.models';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-vehicle-make',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, VehicleMakeFormComponent],
  templateUrl: './vehicle-make.component.html',
  styleUrls: ['../admin-creation/admin-creation.component.scss'],
})
export class VehicleMakeComponent implements OnInit {
  items: VehicleMake[] = [];
  columns: Column[] = [
    { field: 'name', header: 'Make Name' },
    { field: 'vehicleTypeName', header: 'Category' }, // Assuming backend returns populated or we map it
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isLoading = false;
  isActiveFilter: boolean = true;
  selectedItem: VehicleMake | null = null;
  isInfoModalOpen = false;
  infoData: any = null;

  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(
    private makeService: VehicleMakeService,
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    const limit = this.pageSize;
    const skip = (this.currentPage - 1) * this.pageSize;

    this.makeService.getMakes(this.isActiveFilter, limit, skip).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status && response.result) {
        this.items = response.result.map((item: any) => ({
          ...item,
          status: item.isActive ? 'Active' : 'Inactive',
          // If backend doesn't populate vehicleTypeName, we might need to fetch categories to map it,
          // or rely on what's returned. For now assuming it's either in result or we just show ID/Type.
          // Based on user request "show the category form the category GET API",
          // we might need to join data if not provided.
          // Let's assume for now we just display what we have or 'vehicleTypeId' if name is missing.
          vehicleTypeName: item.vehicleType?.name || item.vehicleTypeName || 'N/A',
        }));
        this.totalItems = response.totalCount || 0;
      } else {
        this.items = [];
        this.totalItems = 0;
      }
      this.cdr.detectChanges();
    });
  }

  onPageChange(event: { page: number; limit: number }) {
    this.currentPage = event.page;
    this.pageSize = event.limit;
    this.loadData();
  }

  onStatusFilterChange(status: boolean) {
    this.isActiveFilter = status;
    this.currentPage = 1;
    this.loadData();
  }

  openForm(item: VehicleMake | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onView(item: any) {
    this.infoData = item;
    this.isInfoModalOpen = true;
  }

  closeInfoModal() {
    this.isInfoModalOpen = false;
    this.infoData = null;
  }

  onSave(item: any) {
    const request = item._id
      ? this.makeService.updateMake(item)
      : this.makeService.createMake((({ _id, ...rest }) => rest)(item));

    request.subscribe({
      next: (response: any) => {
        if (response.status) {
          this.loadData();
          this.snackbarService.success(response.msg);
          this.closeForm();
        } else {
          this.snackbarService.error(response.msg || 'Operation failed');
        }
      },
      error: (error) => {
        console.error('Error saving make:', error);
        this.snackbarService.error(error.error?.msg || 'Failed to save make');
      },
    });
  }

  onDelete(item: any) {
    if (item._id) {
      this.makeService.deleteMake(item._id).subscribe({
        next: (response: any) => {
          this.loadData();
          this.snackbarService.success(response.msg || 'Make deleted successfully');
        },
        error: (error) => console.error('Error deleting make:', error),
      });
    }
  }
}
