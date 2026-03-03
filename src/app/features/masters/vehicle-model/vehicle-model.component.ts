import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { VehicleModelFormComponent } from './vehicle-model-form/vehicle-model-form.component';
import { VehicleModelService } from './vehicle-model.service';
import { VehicleModel } from '../../../core/models/master.models';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-vehicle-model',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, VehicleModelFormComponent],
  templateUrl: './vehicle-model.component.html',
  styleUrls: ['../admin-creation/admin-creation.component.scss'],
})
export class VehicleModelComponent implements OnInit {
  items: VehicleModel[] = [];
  columns: Column[] = [
    { field: 'name', header: 'Model Name' },
    { field: 'vehicleTypeName', header: 'Category' },
    { field: 'manufacturerName', header: 'Make' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isSubmitting = false;
  isLoading = false;
  isActiveFilter: boolean = true;
  selectedItem: VehicleModel | null = null;
  isInfoModalOpen = false;
  infoData: any = null;

  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(
    private modelService: VehicleModelService,
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

    this.modelService.getModels(this.isActiveFilter, limit, skip).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status && response.result) {
        this.items = response.result.map((item: any) => ({
          ...item,
          status: item.isActive ? 'Active' : 'Inactive',
          vehicleTypeName: item.vehicleType?.name || item.vehicleTypeName || 'N/A',
          manufacturerName: item.manufacturer?.name || item.manufacturerName || 'N/A',
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

  openForm(item: VehicleModel | null = null) {
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

  onSave(formData: FormData) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const id = formData.get('_id');
    const request = id
      ? this.modelService.updateModel(formData)
      : this.modelService.createModel(formData);

    request.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
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
        console.error('Error saving model:', error);
        this.snackbarService.error(error.error?.msg || 'Failed to save model');
      },
    });
  }

  onDelete(item: any) {
    if (item._id) {
      this.modelService.deleteModel(item._id).subscribe({
        next: (response: any) => {
          this.loadData();
          this.snackbarService.success(response.msg || 'Model deleted successfully');
        },
        error: (error) => console.error('Error deleting model:', error),
      });
    }
  }
}
