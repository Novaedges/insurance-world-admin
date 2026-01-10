import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { VehicleModelFormComponent } from './vehicle-model-form/vehicle-model-form.component';
import { MasterService } from '../../../core/services/master.service';
import { VehicleModel } from '../../../core/models/master.models';

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
    { field: 'makeName', header: 'Make' },
    { field: 'fuelType', header: 'Fuel Type' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  selectedItem: VehicleModel | null = null;

  constructor(private masterService: MasterService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.masterService.getModels().subscribe((data) => (this.items = data));
  }

  openForm(item: VehicleModel | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(item: VehicleModel) {
    this.masterService.saveModel(item).subscribe(() => {
      this.loadData();
      this.closeForm();
    });
  }

  onDelete(item: VehicleModel) {
    this.masterService.deleteModel(item.id).subscribe(() => this.loadData());
  }
}
