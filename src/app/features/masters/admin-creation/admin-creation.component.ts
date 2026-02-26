import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { AdminCreationService } from './admin-creation.service'; // Import new service
import { Admin } from '../../../core/models/master.models';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-admin-creation',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, DialogComponent, AdminFormComponent],
  templateUrl: './admin-creation.component.html',
  styleUrls: ['./admin-creation.component.scss'],
})
export class AdminCreationComponent implements OnInit {
  admins: Admin[] = [];
  columns: Column[] = [
    { field: 'createdAt', header: 'Created Date', type: 'date' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'phoneNumber', header: 'Phone Number' },
    { field: 'roleType', header: 'Role' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isLoading = false;
  isActiveFilter: boolean = true;
  selectedAdmin: Admin | null = null;

  isPasswordModalOpen = false;
  passwordAdmin: Admin | null = null;
  newPassword = '';

  constructor(
    private adminService: AdminCreationService,
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.adminService.getAdmins(this.isActiveFilter).subscribe((success: any) => {
      this.isLoading = false;
      const data = success.result || [];
      this.admins = data.map((item: any) => ({
        ...item,
        status: item.isActive ? 'Active' : 'Inactive',
      }));
      this.cdr.detectChanges();
    });
  }

  onStatusFilterChange(status: boolean) {
    this.isActiveFilter = status;
    this.loadData();
  }

  openForm(admin: Admin | null = null) {
    if (admin) {
      const _id = admin._id;
      if (_id) {
        this.adminService.getAdminById(_id).subscribe((success: any) => {
          const data = success.result || success.data;
          const adminDetails = Array.isArray(data) ? data[0] : data;

          this.selectedAdmin = {
            ...adminDetails,
            status: adminDetails?.isActive ? 'Active' : 'Inactive',
            _id: adminDetails._id,
          };
          this.isModalOpen = true;
          this.cdr.detectChanges();
        });
      }
    } else {
      this.selectedAdmin = null;
      this.isModalOpen = true;
    }
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedAdmin = null;
  }

  onSave(admin: Admin) {
    if (admin._id) {
      this.adminService.updateAdmin(admin).subscribe(() => {
        this.loadData();
        this.closeForm();
      });
    } else {
      this.adminService.createAdmin(admin).subscribe(() => {
        this.loadData();
        this.closeForm();
      });
    }
  }

  onDelete(item: Admin) {
    const id = item._id || item.id;
    if (id) {
      const payload = {
        _id: id,
        active: false,
      };
      this.adminService.deleteAdmin(payload).subscribe((success: any) => {
        this.loadData();
        this.snackbarService.success(success.msg);
      });
    }
  }

  onChangePassword(admin: Admin) {
    this.passwordAdmin = admin;
    this.newPassword = '';
    this.isPasswordModalOpen = true;
  }

  closePasswordModal() {
    this.isPasswordModalOpen = false;
    this.passwordAdmin = null;
    this.newPassword = '';
  }

  onSavePassword() {
    if (this.passwordAdmin && this.newPassword) {
      const payload = {
        _id: this.passwordAdmin._id,
        password: this.newPassword,
      };
      this.adminService.updatePassword(payload).subscribe(() => {
        this.closePasswordModal();
        this.loadData();
        this.snackbarService.success('Password updated successfully');
      });
    }
  }
}
