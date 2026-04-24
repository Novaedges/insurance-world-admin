import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { AdminCreationService } from './admin-creation.service'; // Import new service
import { Admin } from '../../../core/models/master.models';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { AuthService } from '../../../core/services/auth.service';

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

  isInfoModalOpen = false;
  infoData: any = null;

  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(
    private adminService: AdminCreationService,
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    const limit = this.pageSize;
    const skip = (this.currentPage - 1) * this.pageSize;

    this.adminService.getAdmins(this.isActiveFilter, limit, skip).subscribe({
      next: (success: any) => {
        this.isLoading = false;
        const data = success.result || [];
        this.admins = data.map((item: any) => ({
          ...item,
          status: item.isActive ? 'Active' : 'Inactive',
          roleType: this.formatRole(item.roleType),
        }));
        this.totalItems = success.totalCount || 0;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackbarService.error(err.error?.msg || 'Failed to load admins');
      },
    });
  }

  formatRole(role: string): string {
    if (!role) return '';
    return role
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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

  openForm(admin: Admin | null = null) {
    if (admin) {
      const _id = admin._id || admin.id;
      if (_id) {
        this.adminService.getAdminById(_id).subscribe({
          next: (success: any) => {
            const data = success.result || success.data;
            const adminDetails = Array.isArray(data) ? data[0] : data;

            this.selectedAdmin = {
              ...adminDetails,
              status: adminDetails?.isActive ? 'Active' : 'Inactive',
              _id: adminDetails._id,
            };
            this.isModalOpen = true;
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            this.snackbarService.error(err.error?.msg || 'Failed to fetch admin details');
          },
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
    const _id = admin._id || admin.id;
    if (_id) {
      const payload = { ...admin, _id };
      this.adminService.updateAdmin(payload).subscribe({
        next: (success: any) => {
          if (success.status) {
            this.snackbarService.success(success.msg || 'Admin updated successfully');
            this.loadData();
            this.closeForm();
          } else {
            this.snackbarService.error(success.msg || 'Failed to update admin');
          }
        },
        error: (err: any) => {
          this.snackbarService.error(err.error?.msg || 'Failed to update admin');
        },
      });
    } else {
      this.adminService.createAdmin(admin).subscribe({
        next: (success: any) => {
          if (success.status) {
            this.snackbarService.success(success.msg || 'Admin created successfully');
            this.loadData();
            this.closeForm();
          } else {
            this.snackbarService.error(success.msg || 'Failed to create admin');
          }
        },
        error: (err: any) => {
          this.snackbarService.error(err.error?.msg || 'Failed to create admin');
        },
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
      this.adminService.deleteAdmin(payload).subscribe({
        next: (success: any) => {
          this.loadData();
          this.snackbarService.success(success.msg || 'Admin deleted successfully');
        },
        error: (err: any) => {
          this.snackbarService.error(err.error?.msg || 'Failed to delete admin');
        },
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
      this.adminService.updatePassword(payload).subscribe({
        next: (success: any) => {
          if (success.status) {
            this.closePasswordModal();
            this.loadData();
            this.snackbarService.success(success.msg || 'Password updated successfully');
          } else {
            this.snackbarService.error(success.msg || 'Failed to update password');
          }
        },
        error: (err: any) => {
          this.snackbarService.error(err.error?.msg || 'Failed to update password');
        },
      });
    }
  }

  getHiddenActions(): string[] {
    const hidden = [];
    if (!this.authService.hasPermission('admin-creation', 'EDIT')) {
      hidden.push('edit');
      hidden.push('password');
    }
    if (!this.authService.hasPermission('admin-creation', 'DELETE')) {
      hidden.push('delete');
    }
    return hidden;
  }

  onView(item: any) {
    this.infoData = item;
    this.isInfoModalOpen = true;
  }

  closeInfoModal() {
    this.isInfoModalOpen = false;
    this.infoData = null;
  }
}
