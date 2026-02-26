import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PolicyType } from '../../../../core/models/master.models';

@Component({
  selector: 'app-policy-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './policy-type-form.component.html',
  styleUrls: ['../../admin-creation/admin-form/admin-form.component.scss'], // Using existing shared form styles
})
export class PolicyTypeFormComponent implements OnChanges {
  @Input() data: PolicyType | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      _id: [''],
      policyType: ['', Validators.required],
      tag: ['', Validators.required],
      description: [''],
      coverageText: [''], // Will be converted to/from string[] coverage
      isActive: [true, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.form.patchValue({
        ...this.data,
        coverageText: this.data.coverage ? this.data.coverage.join(', ') : '',
        isActive: this.data.isActive ?? true,
      });
    } else {
      this.form.reset({ isActive: true });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const payload: any = {
        policyType: formValue.policyType,
        tag: formValue.tag,
        description: formValue.description,
        isActive: formValue.isActive,
      };

      if (formValue._id) {
        payload._id = formValue._id;
      }

      if (formValue.coverageText) {
        payload.coverage = formValue.coverageText
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);
      } else {
        payload.coverage = [];
      }

      this.save.emit(payload);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
