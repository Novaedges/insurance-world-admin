import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { MasterService } from '../../../core/services/master.service';
import { Admin } from '../../../core/models/master.models';

@Component({
  selector: 'app-admin-creation',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, AdminFormComponent],
  templateUrl: './admin-creation.component.html',
  styleUrls: ['./admin-creation.component.scss'],
})
export class AdminCreationComponent implements OnInit {
  admins: Admin[] = [];
  columns: Column[] = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  selectedAdmin: Admin | null = null;

  constructor(private masterService: MasterService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.masterService.getAdmins().subscribe((data) => (this.admins = data));
  }

  openForm(admin: Admin | null = null) {
    this.selectedAdmin = admin ? { ...admin } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedAdmin = null;
  }

  onSave(admin: Admin) {
    this.masterService.saveAdmin(admin).subscribe(() => {
      this.loadData();
      this.closeForm();
    });
  }

  onDelete(item: Admin) {
    this.masterService.deleteAdmin(item.id).subscribe(() => this.loadData());
  }
}
