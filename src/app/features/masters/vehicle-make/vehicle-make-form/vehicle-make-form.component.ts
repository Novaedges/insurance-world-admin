import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleMake, InsuranceCategory } from '../../../../core/models/master.models';
import { InsuranceCategoryService } from '../../insurance-category/insurance-category.service';

@Component({
  selector: 'app-vehicle-make-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-make-form.component.html',
  styleUrls: ['../../admin-creation/admin-form/admin-form.component.scss'],
})
export class VehicleMakeFormComponent implements OnInit, OnChanges {
  @Input() data: VehicleMake | null = null;
  @Input() isSubmitting: boolean = false;
  @Output() save = new EventEmitter<FormData>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  categories: InsuranceCategory[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: InsuranceCategoryService,
  ) {
    this.form = this.fb.group({
      _id: [''],
      name: ['', Validators.required],
      vehicleTypeId: ['', Validators.required],
      isActive: [true, Validators.required],
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((response: any) => {
      if (response.status && response.result) {
        this.categories = response.result.filter((c: any) => c.isActive);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.form.patchValue({
        ...this.data,
        isActive: this.data.isActive ?? true,
      });
      this.imagePreview = this.data.logo || null;
    } else {
      this.form.reset({ isActive: true });
      this.imagePreview = null;
    }
    this.selectedFile = null;
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
          formData.append(key, formValue[key]);
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
