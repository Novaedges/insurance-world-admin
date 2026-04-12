import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Banner } from '../../../../../core/models/banner.models';

@Component({
  selector: 'app-banner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.scss'],
})
export class BannerFormComponent implements OnChanges {
  @Input() bannerData: Banner | null = null;
  @Input() isSubmitting: boolean = false;
  @Output() save = new EventEmitter<FormData>();
  @Output() cancel = new EventEmitter<void>();

  bannerForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder) {
    this.bannerForm = this.fb.group({
      _id: [null],
      showInPortal: [false],
      priority: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bannerData']) {
      if (this.bannerData) {
        this.bannerForm.patchValue({
          _id: this.bannerData._id,
          showInPortal: this.bannerData.showInPortal,
          priority: this.bannerData.priority,
        });
        this.imagePreview = this.bannerData.imageUrl || null;
      } else {
        this.bannerForm.reset({
          _id: null,
          showInPortal: false,
          priority: 0,
        });
        this.imagePreview = null;
      }
      this.selectedFile = null;
    }
  }

  onFileSelected(event: any): void {
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

  onSubmit(): void {
    if (this.bannerForm.invalid) {
      this.bannerForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const formValue = this.bannerForm.value;

    if (formValue._id) {
      formData.append('_id', formValue._id);
    }

    formData.append('showInPortal', formValue.showInPortal.toString());
    formData.append('priority', formValue.priority.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.save.emit(formData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
