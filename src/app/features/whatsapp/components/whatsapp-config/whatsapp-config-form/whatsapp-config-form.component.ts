import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WhatsappConfig } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-whatsapp-config-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './whatsapp-config-form.component.html',
  styleUrls: ['./whatsapp-config-form.component.scss'],
})
export class WhatsappConfigFormComponent implements OnChanges {
  @Input() data: WhatsappConfig | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<WhatsappConfig>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      providerName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      status: ['Active', Validators.required],
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
