import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { InsuranceCategoryFormComponent } from './insurance-category-form/insurance-category-form.component';
import { MasterService } from '../../../core/services/master.service';
import { InsuranceCategory } from '../../../core/models/master.models';

@Component({
  selector: 'app-insurance-category',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, InsuranceCategoryFormComponent],
  templateUrl: './insurance-category.component.html',
  styleUrls: ['../admin-creation/admin-creation.component.scss'],
})
export class InsuranceCategoryComponent implements OnInit {
  items: InsuranceCategory[] = [];
  columns: Column[] = [
    { field: 'name', header: 'Category Name' },
    { field: 'type', header: 'Type' },
    { field: 'description', header: 'Description' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  selectedItem: InsuranceCategory | null = null;

  constructor(private masterService: MasterService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.masterService.getCategories().subscribe((data) => (this.items = data));
  }

  openForm(item: InsuranceCategory | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSave(item: InsuranceCategory) {
    this.masterService.saveCategory(item).subscribe(() => {
      this.loadData();
      this.closeForm();
    });
  }

  onDelete(item: InsuranceCategory) {
    this.masterService.deleteCategory(item.id).subscribe(() => this.loadData());
  }
}
