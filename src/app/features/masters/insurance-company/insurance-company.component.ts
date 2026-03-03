import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuranceCompanyService } from './insurance-company.service';
import { InsuranceCompany } from '../../../core/models/master.models';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-insurance-company',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, CompanyFormComponent],
  templateUrl: './insurance-company.component.html',
  styleUrls: ['./insurance-company.component.scss'],
})
export class InsuranceCompanyComponent implements OnInit {
  companies: InsuranceCompany[] = [];
  loading = false;
  isSubmitting = false;
  isDialogOpen = false;
  isActiveFilter: boolean = true;
  selectedItem: InsuranceCompany | null = null;
  isInfoModalOpen = false;
  infoData: any = null;

  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  columns: Column[] = [
    { field: 'companyName', header: 'Company Name' },
    { field: 'contactNumber', header: 'Contact' },
    { field: 'email', header: 'Email' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  constructor(
    private companyService: InsuranceCompanyService,
    private snackbar: SnackbarService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.cdr.detectChanges();
    const limit = this.pageSize;
    const skip = (this.currentPage - 1) * this.pageSize;

    this.companyService.getCompanies(this.isActiveFilter, limit, skip).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.status && res.result) {
          this.companies = res.result.map((company: any) => ({
            ...company,
            status: company.isActive !== false ? 'Active' : 'Inactive',
          }));
          this.totalItems = res.totalCount || 0;
        } else {
          this.companies = [];
          this.totalItems = 0;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.companies = [];
        this.totalItems = 0;
        this.cdr.detectChanges();
      },
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

  openForm(item: InsuranceCompany | null = null) {
    this.selectedItem = item;
    this.isDialogOpen = true;
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

  onSave(formData: FormData) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const isEditing = !!(formData.get('_id') || formData.get('companyId'));
    const saveObservable = isEditing
      ? this.companyService.updateCompany(formData)
      : this.companyService.createCompany(formData);

    saveObservable.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.snackbar.show(`Company ${isEditing ? 'updated' : 'added'} successfully`, 'success');
          this.loadData();
          this.closeForm();
        } else {
          this.snackbar.error(res.msg || 'Operation failed');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.snackbar.error('Error saving company');
        this.cdr.detectChanges();
      },
    });
  }

  onDelete(item: any) {
    if (!item._id) return;
    this.companyService.deleteCompany(item._id).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.snackbar.show('Company deleted successfully', 'success');
          this.loadData();
        } else {
          this.snackbar.error(res.msg || 'Operation failed');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackbar.error('Error deleting company');
        this.cdr.detectChanges();
      },
    });
  }
}
