import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { RtoFormComponent } from './rto-form/rto-form.component';
import { MasterService } from '../../../core/services/master.service';
import { RTO } from '../../../core/models/master.models';

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
    { field: 'code', header: 'RTO Code' },
    { field: 'name', header: 'RTO Name' },
    { field: 'city', header: 'City' },
    { field: 'state', header: 'State' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  selectedItem: RTO | null = null;

  constructor(private masterService: MasterService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.masterService.getRTOs().subscribe((data) => (this.items = data));
  }

  openForm(item: RTO | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(item: RTO) {
    this.masterService.saveRTO(item).subscribe(() => {
      this.loadData();
      this.closeForm();
    });
  }

  onDelete(item: RTO) {
    this.masterService.deleteRTO(item.id).subscribe(() => this.loadData());
  }
}
