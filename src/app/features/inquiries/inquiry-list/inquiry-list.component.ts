import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { InquiryFormComponent } from '../inquiry-form/inquiry-form.component';
import { InquiryService } from '../../../core/services/inquiry.service';
import { Inquiry } from '../../../core/models/inquiry.models';

@Component({
  selector: 'app-inquiry-list',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, InquiryFormComponent],
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['../../masters/admin-creation/admin-creation.component.scss'],
})
export class InquiryListComponent implements OnInit {
  items: Inquiry[] = [];
  columns: Column[] = [
    { field: 'id', header: 'ID' },
    { field: 'customerName', header: 'Customer' },
    { field: 'productName', header: 'Interest' },
    { field: 'categoryName', header: 'Category' },
    { field: 'status', header: 'Status', type: 'status' },
    { field: 'assignedTo', header: 'Assigned To' },
  ];

  isModalOpen = false;
  selectedItem: Inquiry | null = null;

  constructor(private inquiryService: InquiryService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.inquiryService.getInquiries().subscribe((data) => (this.items = data));
  }

  openForm(item: Inquiry) {
    this.selectedItem = { ...item }; // Clone to avoid direct mutation
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(item: Inquiry) {
    this.inquiryService.saveInquiry(item).subscribe(() => {
      this.loadData();
      this.closeForm();
    });
  }
}
