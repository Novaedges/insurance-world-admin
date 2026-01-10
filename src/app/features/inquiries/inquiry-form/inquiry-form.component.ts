import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Inquiry } from '../../../core/models/inquiry.models';

@Component({
  selector: 'app-inquiry-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inquiry-form.component.html',
  styleUrls: [
    '../../masters/admin-creation/admin-form/admin-form.component.scss',
    './inquiry-form.component.scss',
  ],
})
export class InquiryFormComponent implements OnChanges {
  @Input() data: Inquiry | null = null;
  @Output() save = new EventEmitter<Inquiry>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  // Mock Agent List
  agents = ['Mike Johnson', 'Sarah Wilson', 'Emily Davis', 'John Smith'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      assignedTo: [''],
      status: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.form.patchValue({
        assignedTo: this.data.assignedTo || '',
        status: this.data.status,
      });
    }
  }

  onSubmit() {
    if (this.form.valid && this.data) {
      const updatedInquiry: Inquiry = {
        ...this.data,
        ...this.form.value,
      };
      this.save.emit(updatedInquiry);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
