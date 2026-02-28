import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ChildCategoryFormComponent } from './child-category-form/child-category-form.component';
import { MasterService } from '../../../core/services/master.service';
import { ChildCategory } from '../../../core/models/master.models';

@Component({
  selector: 'app-child-category',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, ChildCategoryFormComponent],
  templateUrl: './child-category.component.html',
  styleUrls: ['../admin-creation/admin-creation.component.scss'],
})
export class ChildCategoryComponent implements OnInit {
  items: ChildCategory[] = [];
  columns: Column[] = [
    { field: 'name', header: 'Child Category Name' },
    { field: 'parentCategoryName', header: 'Parent Category' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  isLoading = false;
  isActiveFilter: boolean = true;
  selectedItem: ChildCategory | null = null;
  isInfoModalOpen = false;
  infoData: any = null;

  constructor(private masterService: MasterService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.masterService.getChildCategories(this.isActiveFilter).subscribe((data) => {
      this.items = data;
      this.isLoading = false;
    });
  }

  onStatusFilterChange(status: boolean) {
    this.isActiveFilter = status;
    this.loadData();
  }

  openForm(item: ChildCategory | null = null) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
  }

  closeForm() {
    this.isModalOpen = false;
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

  onSave(item: ChildCategory) {
    this.masterService.saveChildCategory(item).subscribe(() => {
      this.loadData();
      this.closeForm();
    });
  }

  onDelete(item: ChildCategory) {
    this.masterService.deleteChildCategory(item.id).subscribe(() => this.loadData());
  }
}
