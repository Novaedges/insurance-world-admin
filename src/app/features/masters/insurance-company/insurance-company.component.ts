import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../core/services/master.service';
import { InsuranceCompany } from '../../../core/models/master.models';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { finalize } from 'rxjs/operators';

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
  isDialogOpen = false;
  selectedItem: InsuranceCompany | null = null;

  columns: Column[] = [
    { field: 'name', header: 'Company Name' },
    { field: 'contactNumber', header: 'Contact' },
    { field: 'email', header: 'Email' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  constructor(
    private masterService: MasterService,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.masterService
      .getInsuranceCompanies()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((data: InsuranceCompany[]) => (this.companies = data));
  }

  openForm(item: InsuranceCompany | null = null) {
    this.selectedItem = item;
    this.isDialogOpen = true;
  }

  closeForm() {
    this.isDialogOpen = false;
    this.selectedItem = null;
  }

  onSave(item: InsuranceCompany) {
    this.masterService.saveInsuranceCompany(item).subscribe(() => {
      this.snackbar.show(
        `Company ${item.id ? 'updated' : 'added'} successfully`,
        'success'
      );
      this.loadData();
      this.closeForm();
    });
  }

  onDelete(item: InsuranceCompany) {
    this.masterService.deleteInsuranceCompany(item.id).subscribe(() => {
      this.snackbar.show('Company deleted successfully', 'success');
      this.loadData();
    });
  }
}
