import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipDirective } from '../../directives/tooltip/tooltip.directive';
import { ConfirmationService } from '../../services/confirmation.service';

export interface Column {
  field: string;
  header: string;
  type?: 'text' | 'status' | 'currency' | 'date';
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
  @Input() set data(value: any[]) {
    this._data = value;
    this.filteredData = [...value];
  }
  get data(): any[] {
    return this._data;
  }

  @Input() columns: Column[] = [];
  @Input() actions: boolean = true;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<void>();

  _data: any[] = [];
  filteredData: any[] = [];
  searchTerm: string = '';

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterData();
  }

  filterData() {
    if (!this.searchTerm) {
      this.filteredData = [...this._data];
      return;
    }

    this.filteredData = this._data.filter((row) => {
      return this.columns.some((col) => {
        const val = row[col.field]?.toString().toLowerCase();
        return val && val.includes(this.searchTerm);
      });
    });
  }

  constructor(private confirmationService: ConfirmationService) {}

  onRefresh() {
    this.refresh.emit();
  }

  onEdit(row: any) {
    this.edit.emit(row);
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
}
