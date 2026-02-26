import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SaleReportItem } from '../../../../core/models/sale.models';
import { SalesService } from '../../../../core/services/sales.service';

@Component({
  selector: 'app-sale-info-dialog',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './sale-info-dialog.component.html',
  styleUrls: ['./sale-info-dialog.component.scss'],
})
export class SaleInfoDialogComponent implements OnInit, OnChanges {
  @Input() saleId: string | null = null;
  @Output() cancel = new EventEmitter<void>();

  saleDetails: SaleReportItem | null = null;
  isLoading = true;

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    if (this.saleId) {
      this.loadData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['saleId'] && this.saleId) {
      this.loadData();
    }
  }

  loadData() {
    this.isLoading = true;
    this.salesService.getSaleById(this.saleId!).subscribe({
      next: (res) => {
        if (res.status && res.result && res.result.length > 0) {
          this.saleDetails = res.result[0];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load sale info', err);
        this.isLoading = false;
      },
    });
  }

  close() {
    this.cancel.emit();
  }
}
