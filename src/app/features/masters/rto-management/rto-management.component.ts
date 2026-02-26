import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { RtoFormComponent } from './rto-form/rto-form.component';
import { RtoService } from './rto.service';
import { RTO } from '../../../core/models/master.models';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-rto-management',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, RtoFormComponent],
  templateUrl: './rto-management.component.html',
  styleUrls: ['../admin-creation/admin-creation.component.scss'], // Reuse styles
})
export class RtoManagementComponent implements OnInit {
  items: RTO[] = [];
  columns: Column[] = [
    { field: 'rtoCode', header: 'RTO Code' },
    { field: 'rtoName', header: 'RTO Name' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isLoading = false;
  isActiveFilter: boolean = true;
  selectedItem: RTO | null = null;

  constructor(
    private rtoService: RtoService,
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.rtoService.getRTOs(this.isActiveFilter).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status && response.result) {
        this.items = response.result.map((item: any) => ({
          ...item,
          status: item.isActive ? 'Active' : 'Inactive',
        }));
      } else {
        this.items = []; // Clear items if no data found
      }
      this.cdr.detectChanges();
    });
  }

  onStatusFilterChange(status: boolean) {
    this.isActiveFilter = status;
    this.loadData();
  }

  openForm(item: RTO | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(item: any) {
    const request = item._id
      ? this.rtoService.updateRTO(item)
      : this.rtoService.createRTO((({ _id, ...rest }) => rest)(item));

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
        console.error('Error saving RTO:', error);
        this.snackbarService.error(error.error?.msg || 'Failed to save RTO');
      },
    });
  }

  onDelete(item: any) {
    if (item._id) {
      this.rtoService.deleteRTO(item._id).subscribe({
        next: (success: any) => {
          this.loadData();
          this.snackbarService.success(success.msg);
        },
        error: (error) => console.error('Error deleting RTO:', error),
      });
    }
  }
}
