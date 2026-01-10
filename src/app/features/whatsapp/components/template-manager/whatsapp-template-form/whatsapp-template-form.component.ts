import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WhatsappTemplate } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-whatsapp-template-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './whatsapp-template-form.component.html',
  styleUrls: ['./whatsapp-template-form.component.scss']
})
export class WhatsappTemplateFormComponent implements OnChanges {
  @Input() data: WhatsappTemplate | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<WhatsappTemplate>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      content: ['', Validators.required],
      status: ['Pending', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.data) {
        this.form.patchValue(this.data);
      } else {
        this.form.reset({ status: 'Pending' });
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
