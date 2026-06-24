import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Agent } from '../../../core/models/master.models';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { AgentFormComponent } from './agent-form/agent-form.component';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { finalize } from 'rxjs';
import { AgentService } from './agent.service';

@Component({
  selector: 'app-agent-management',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, AgentFormComponent, FormsModule],
  templateUrl: './agent-management.component.html',
  styleUrls: ['./agent-management.component.scss'],
})
export class AgentManagementComponent implements OnInit {
  agents: Agent[] = [];
  loading = false;
  isSubmitting = false;
  isDialogOpen = false;
  isActiveFilter: boolean = true;
  selectedItem: Agent | null = null;
  isInfoModalOpen = false;
  infoData: any = null;
  isDownloading = false;

  // Password reset state
  isPasswordDialogOpen = false;
  passwordFormItem: Agent | null = null;
  newPassword = '';

  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  columns: Column[] = [
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'phoneNumber', header: 'Phone Number' },
    { field: 'agentCode', header: 'Agent Code' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  constructor(
    private agentService: AgentService,
    private snackbar: SnackbarService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const limit = this.pageSize;
    const skip = (this.currentPage - 1) * this.pageSize;

    this.agentService
      .getAgents(this.isActiveFilter, limit, skip)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe((success: any) => {
        const data = success.result || success.data || [];
        this.agents = data.map((item: any) => ({
          ...item,
          bankAccNumber: item.bankAccNumber || item.bankDetails?.bankAccNumber,
          bankBranch: item.bankBranch || item.bankDetails?.bankBranch,
          bankName: item.bankName || item.bankDetails?.bankName,
          ifscCode: item.ifscCode || item.bankDetails?.ifscCode,
          status: item.isActive ? 'Active' : 'Inactive',
        }));
        this.totalItems = success.totalCount || 0;
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

  downloadExcel() {
    this.isDownloading = true;
    this.agentService.downloadExcel(this.isActiveFilter).subscribe({
      next: (res) => {
        this.isDownloading = false;
        if (res.status && res.result && res.result[0][0]?.link) {
          window.open(res.result[0][0].link, '_blank');
        } else {
          this.snackbar.error('Failed to generate excel');
        }
      },
      error: (err) => {
        this.isDownloading = false;
        console.error('Download error:', err);
        this.snackbar.error('Error downloading excel');
      },
    });
  }

  openForm(item: Agent | null = null) {
    if (item) {
      const id = item._id || item.id;
      if (id) {
        this.agentService.getAgentById(id).subscribe((success: any) => {
          const data = success.result || success.data;
          const agentDetails = Array.isArray(data) ? data[0] : data;
          this.selectedItem = {
            ...agentDetails,
            bankAccNumber: agentDetails.bankAccNumber || agentDetails.bankDetails?.bankAccNumber,
            bankBranch: agentDetails.bankBranch || agentDetails.bankDetails?.bankBranch,
            bankName: agentDetails.bankName || agentDetails.bankDetails?.bankName,
            ifscCode: agentDetails.ifscCode || agentDetails.bankDetails?.ifscCode,
            status: agentDetails.isActive ? 'Active' : 'Inactive',
            _id: agentDetails._id || agentDetails.id,
          };
          this.isDialogOpen = true;
          this.cdr.detectChanges();
        });
      }
    } else {
      this.selectedItem = null;
      this.isDialogOpen = true;
    }
  }

  closeForm() {
    this.isDialogOpen = false;
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

  openPasswordForm(item: any) {
    this.passwordFormItem = item;
    this.newPassword = '';
    this.isPasswordDialogOpen = true;
  }

  closePasswordForm() {
    this.isPasswordDialogOpen = false;
    this.passwordFormItem = null;
    this.newPassword = '';
  }

  onPasswordSave() {
    if (!this.passwordFormItem || this.newPassword.length < 6 || this.isSubmitting) return;

    const id = this.passwordFormItem._id || this.passwordFormItem.id;
    if (!id) return;

    this.isSubmitting = true;
    const payload = { _id: id, password: this.newPassword };

    this.agentService
      .updateAgent(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res: any) => {
          if (res && res.status) {
            this.snackbar.success(res.msg || 'Password updated successfully');
            this.closePasswordForm();
          } else {
            this.snackbar.error(res?.msg || 'Failed to update password');
          }
        },
        error: (err) => {
          console.error('Password save error:', err);
          this.snackbar.error(err.error?.msg || 'Failed to update password');
        },
      });
  }

  onSave(item: Agent) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    // Ensure bank details are nested for the API payload
    const payload = {
      ...item,
      bankDetails: {
        bankName: item.bankName,
        bankAccNumber: item.bankAccNumber,
        ifscCode: item.ifscCode,
        bankBranch: item.bankBranch,
      },
    };

    const request = item._id
      ? this.agentService.updateAgent(payload)
      : this.agentService.createAgent(payload);

    request.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
      next: (res: any) => {
        if (res && res.status) {
          this.snackbar.success(res.msg || `Agent ${item._id ? 'updated' : 'added'} successfully`);
          this.loadData();
          this.closeForm();
        } else {
          this.snackbar.error(res?.msg || `Failed to save agent`);
        }
      },
      error: (err) => {
        console.error('Save error:', err);
        this.snackbar.error(err.error?.msg || 'Failed to save agent');
      },
    });
  }

  onDelete(item: Agent) {
    const id = item._id || item.id;
    if (id) {
      const isCurrentlyInactive = item.isActive === false || item.status === 'Inactive';
      const targetActiveStatus = isCurrentlyInactive;
      const payload = { _id: id, isActive: targetActiveStatus };
      this.agentService.deleteAgent(payload).subscribe({
        next: (res: any) => {
          if (res && res.status) {
            const actionText = targetActiveStatus ? 'restored' : 'deactivated';
            this.snackbar.success(res.msg || `Agent ${actionText} successfully`);
            this.loadData();
          } else {
            this.snackbar.error(res?.msg || 'Failed to update agent status');
          }
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.snackbar.error(err.error?.msg || 'Failed to update agent status');
        },
      });
    }
  }
}
