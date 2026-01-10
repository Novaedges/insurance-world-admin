import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SmsConfig } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-sms-config-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sms-config-form.component.html',
  styleUrls: ['./sms-config-form.component.scss']
})
export class SmsConfigFormComponent implements OnChanges {
  @Input() data: SmsConfig | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<SmsConfig>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      provider: ['', Validators.required],
      senderId: ['', Validators.required],
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
