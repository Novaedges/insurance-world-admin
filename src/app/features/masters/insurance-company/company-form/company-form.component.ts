import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsuranceCompany } from '../../../../core/models/master.models';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
})
export class CompanyFormComponent implements OnChanges {
  @Input() company: InsuranceCompany | null = null;
  @Input() isSubmitting: boolean = false;
  @Output() save = new EventEmitter<FormData>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      companyId: [''], // Will handle _id vs companyId
      companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: [''],
      address: [''],
      email: ['', [Validators.email]],
      contactNumber: ['', [Validators.pattern('^[0-9]{10}$')]],
      helplineNumber: ['', [Validators.pattern('^[0-9]{10}$')]],
      website: [''],
      status: ['Active', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['company'] && this.company) {
      // Form expects companyName, API returns companyName.
      // We map _id to companyId for the form edit state
      this.form.patchValue({
        ...this.company,
        companyId: this.company._id || this.company.id,
      });
      this.imagePreview = this.company.logo || null;
    } else {
      this.form.reset({ status: 'Active' });
      this.selectedFile = null;
      this.imagePreview = null;
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

      Object.keys(formValue).forEach((key) => {
        if (formValue[key] !== null && formValue[key] !== undefined) {
          // BUG FIX: API quirk mentioned in existing code - description safety
          if (key === 'description') {
            formData.append(key, '');
          } else {
            formData.append(key, formValue[key]);
          }
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
