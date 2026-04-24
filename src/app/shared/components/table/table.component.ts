import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipDirective } from '../../directives/tooltip/tooltip.directive';
import { ConfirmationService } from '../../services/confirmation.service';

export interface Column {
  field: string;
  header: string;
  type?: 'text' | 'status' | 'currency' | 'date' | 'uppercase';
  currencyCode?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipDirective],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  private _data: any[] = [];
  filteredData: any[] = [];
  searchTerm: string = '';

  @Input() set data(value: any[]) {
    this._data = value || [];
    this.filterData();
  }
  get data(): any[] {
    return this._data;
  }

  @Input() columns: Column[] = [];
  @Input() actions: boolean = true;
  @Input() hiddenActions: string[] = [];
  @Input() isLoading: boolean = false;
  @Input() showStatusFilter: boolean = false;
  @Input() statusFilterValue: 'true' | 'false' = 'true';
  @Input() editTooltip: string = 'Edit';
  @Input() editDisableField: string = '';

  // Pagination Inputs
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() showPagination: boolean = true;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() changePassword = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<void>();
  @Output() statusFilterChange = new EventEmitter<boolean>();

  // Pagination Output
  @Output() pageChange = new EventEmitter<{ page: number; limit: number }>();

  pageSizeOptions = [10, 20, 50, 100];

  constructor(private confirmationService: ConfirmationService) {}

  onStatusFilterChange(event: any) {
    const isActive = event.target.value === 'true';
    this.statusFilterChange.emit(isActive);
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterData();
  }

  resolveFieldValue(row: any, field: string): any {
    if (field.includes(' - ')) {
      const parts = field.split(' - ');
      const val1 = row[parts[0]];
      const val2 = row[parts[1]];
      if (val1 === undefined || val2 === undefined) return '';
      return { isRange: true, val1, val2 };
    }
    return row[field];
  }

  filterData() {
    if (!this.searchTerm) {
      this.filteredData = [...this._data];
      return;
    }

    this.filteredData = this._data.filter((row) => {
      return this.columns.some((col) => {
        const value = this.resolveFieldValue(row, col.field);
        if (value && typeof value === 'object' && value.isRange) {
          const combined = `${value.val1} - ${value.val2}`.toLowerCase();
          return combined.includes(this.searchTerm);
        }
        const val = value?.toString().toLowerCase();
        return val && val.includes(this.searchTerm);
      });
    });
  }

  onRefresh() {
    this.refresh.emit();
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onView(row: any) {
    this.view.emit(row);
  }

  async onDelete(row: any) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (confirmed) {
      this.delete.emit(row);
    }
  }

  onChangePassword(row: any) {
    this.changePassword.emit(row);
  }

  // Pagination Methods
  onPageSizeChange(event: any) {
    const newLimit = parseInt(event.target.value, 10);
    this.pageChange.emit({ page: 1, limit: newLimit });
  }

  onPrevPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit({ page: this.currentPage - 1, limit: this.pageSize });
    }
  }

  onNextPage() {
    // If totalItems is 0, we assume there's a next page if current data length equals pageSize
    const hasNext =
      this.totalItems > 0
        ? this.currentPage * this.pageSize < this.totalItems
        : this._data.length === this.pageSize;

    if (hasNext) {
      this.pageChange.emit({ page: this.currentPage + 1, limit: this.pageSize });
    }
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.pageSize;
    return this.totalItems > 0
      ? Math.min(end, this.totalItems)
      : this.startIndex + this._data.length - 1;
  }

  get hasPrev(): boolean {
    return this.currentPage > 1;
  }

  get hasNext(): boolean {
    if (this.totalItems > 0) {
      return this.currentPage * this.pageSize < this.totalItems;
    }
    return this._data.length === this.pageSize;
  }
}
