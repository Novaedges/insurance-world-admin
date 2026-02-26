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
import { InquiryReportItem } from '../../../../core/models/inquiry.models';
import { InquiryService } from '../inquiry.service';

@Component({
  selector: 'app-inquiry-info-dialog',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './inquiry-info-dialog.component.html',
  styleUrls: ['./inquiry-info-dialog.component.scss'],
})
export class InquiryInfoDialogComponent implements OnInit, OnChanges {
  @Input() inquiryId: string | null = null;
  @Output() cancel = new EventEmitter<void>();

  inquiryDetails: InquiryReportItem | null = null;
  isLoading = true;

  constructor(private inquiryService: InquiryService) {}

  ngOnInit(): void {
    if (this.inquiryId) {
      this.loadData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inquiryId'] && this.inquiryId) {
      this.loadData();
    }
  }

  loadData() {
    this.isLoading = true;
    this.inquiryService.getInquiryById(this.inquiryId!).subscribe({
      next: (res) => {
        if (res.status && res.result && res.result.length > 0) {
          this.inquiryDetails = res.result[0];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load inquiry info', err);
        this.isLoading = false;
      },
    });
  }

  close() {
    this.cancel.emit();
  }
}
