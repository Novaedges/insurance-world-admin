import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { VehicleMakeFormComponent } from './vehicle-make-form/vehicle-make-form.component';
import { MasterService } from '../../../core/services/master.service';
import { VehicleMake } from '../../../core/models/master.models';

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
    { field: 'category', header: 'Category' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  selectedItem: VehicleMake | null = null;

  constructor(private masterService: MasterService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.masterService.getMakes().subscribe((data) => (this.items = data));
  }

  openForm(item: VehicleMake | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(item: VehicleMake) {
    this.masterService.saveMake(item).subscribe(() => {
      this.loadData();
      this.closeForm();
    });
  }

  onDelete(item: VehicleMake) {
    this.masterService.deleteMake(item.id).subscribe(() => this.loadData());
  }
}
