import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { VehicleModelFormComponent } from './vehicle-model-form/vehicle-model-form.component';
import { VehicleModelService } from './vehicle-model.service';
import { VehicleModel } from '../../../core/models/master.models';
import { SnackbarService } from '../../../core/services/snackbar.service';

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
  isLoading = false;
  isActiveFilter: boolean = true;
  selectedItem: VehicleModel | null = null;

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
    this.modelService.getModels(this.isActiveFilter).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status && response.result) {
        this.items = response.result.map((item: any) => ({
          ...item,
          status: item.isActive ? 'Active' : 'Inactive',
          vehicleTypeName: item.vehicleType?.name || item.vehicleTypeName || 'N/A',
          manufacturerName: item.manufacturer?.name || item.manufacturerName || 'N/A',
        }));
      } else {
        this.items = [];
      }
      this.cdr.detectChanges();
    });
  }

  onStatusFilterChange(status: boolean) {
    this.isActiveFilter = status;
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

  onSave(item: any) {
    const request = item._id
      ? this.modelService.updateModel(item)
      : this.modelService.createModel((({ _id, ...rest }) => rest)(item));

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
