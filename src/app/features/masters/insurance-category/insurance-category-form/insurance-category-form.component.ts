import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsuranceCategory } from '../../../../core/models/master.models';

@Component({
  selector: 'app-insurance-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './insurance-category-form.component.html',
  styleUrls: ['../../admin-creation/admin-form/admin-form.component.scss'],
})
export class InsuranceCategoryFormComponent implements OnChanges {
  @Input() data: InsuranceCategory | null = null;
  @Input() isSubmitting: boolean = false;
  @Output() save = new EventEmitter<FormData>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      _id: [''],
      name: ['', Validators.required],
      type: ['Motor', Validators.required],
      description: [''],
      isActive: [true, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.data) {
        this.form.patchValue({
          ...this.data,
          isActive: this.data.isActive ?? true,
        });
        this.imagePreview = this.data.logo || null;
      } else {
        this.form.reset({ type: 'Motor', isActive: true });
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
      Object.keys(this.form.value).forEach((key) => {
        const value = this.form.value[key];
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

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
