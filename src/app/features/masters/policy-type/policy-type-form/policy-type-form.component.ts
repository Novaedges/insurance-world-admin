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
  @Input() isSubmitting: boolean = false;
  @Output() save = new EventEmitter<FormData>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      _id: [''],
      policyType: ['', Validators.required],
      tag: ['', Validators.required],
      description: [''],
      coverageText: [''],
      isActive: [true, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.data) {
        this.form.patchValue({
          ...this.data,
          coverageText: this.data.coverage ? this.data.coverage.join(', ') : '',
          isActive: this.data.isActive ?? true,
        });
        this.imagePreview = this.data.logo || null;
      } else {
        this.form.reset({ isActive: true });
        this.imagePreview = null;
      }
      this.selectedFile = null;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData();
      const formValue = this.form.value;

      formData.append('policyType', formValue.policyType);
      formData.append('tag', formValue.tag);
      formData.append('description', formValue.description || '');
      formData.append('isActive', formValue.isActive);

      if (formValue._id) {
        formData.append('_id', formValue._id);
      }

      if (formValue.coverageText) {
        const coverage = formValue.coverageText
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);
        formData.append('coverage', JSON.stringify(coverage));
      } else {
        formData.append('coverage', JSON.stringify([]));
      }

      if (this.selectedFile) {
        formData.append('logo', this.selectedFile);
      }

      this.save.emit(formData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
