import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SmsTemplate } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-sms-template-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sms-template-form.component.html',
  styleUrls: ['./sms-template-form.component.scss']
})
export class SmsTemplateFormComponent implements OnChanges {
  @Input() data: SmsTemplate | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<SmsTemplate>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      content: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.data) {
        this.form.patchValue(this.data);
      } else {
        this.form.reset({ status: 'Active' });
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
