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
import {
  VehicleModel,
  VehicleMake,
  InsuranceCategory,
} from '../../../../core/models/master.models';
import { VehicleMakeService } from '../../vehicle-make/vehicle-make.service';
import { InsuranceCategoryService } from '../../insurance-category/insurance-category.service';

@Component({
  selector: 'app-vehicle-model-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-model-form.component.html',
  styleUrls: ['../../admin-creation/admin-form/admin-form.component.scss'],
})
export class VehicleModelFormComponent implements OnChanges, OnInit {
  @Input() data: VehicleModel | null = null;
  @Input() isSubmitting: boolean = false;
  @Output() save = new EventEmitter<FormData>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  categories: InsuranceCategory[] = [];
  allMakes: VehicleMake[] = [];
  filteredMakes: VehicleMake[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private makeService: VehicleMakeService,
    private categoryService: InsuranceCategoryService,
  ) {
    this.form = this.fb.group({
      _id: [''],
      name: ['', Validators.required],
      vehicleTypeId: ['', Validators.required],
      manufacturerId: ['', Validators.required],
      engineCC: [''],
      fuelType: ['Petrol', Validators.required],
      isActive: [true, Validators.required],
    });
  }

  ngOnInit() {
    this.loadMasterData();

    // Listen to category changes to filter makes
    this.form.get('vehicleTypeId')?.valueChanges.subscribe((typeId) => {
      this.filterMakes(typeId);
    });
  }

  loadMasterData() {
    this.categoryService.getCategories().subscribe((response: any) => {
      if (response.status && response.result) {
        this.categories = response.result.filter((c: any) => c.isActive);
      }
    });

    this.makeService.getMakes().subscribe((response: any) => {
      if (response.status && response.result) {
        this.allMakes = response.result.filter((m: any) => m.isActive);
        // If form already has value, filter now
        const currentTypeId = this.form.get('vehicleTypeId')?.value;
        if (currentTypeId) {
          this.filterMakes(currentTypeId);
        }
      }
    });
  }

  filterMakes(typeId: string) {
    if (!typeId) {
      this.filteredMakes = [];
      return;
    }
    // Filter makes where vehicleTypeId matches (could be an array)
    this.filteredMakes = this.allMakes.filter((make) => {
      if (Array.isArray(make.vehicleTypeId)) {
        return make.vehicleTypeId.includes(typeId);
      }
      return make.vehicleTypeId === typeId;
    });

    // Check if current manufacturerId is valid for new category, if not reset
    const currentMakeId = this.form.get('manufacturerId')?.value;
    if (currentMakeId && !this.filteredMakes.find((m) => m._id === currentMakeId)) {
      this.form.patchValue({ manufacturerId: '' });
    }
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
        this.form.reset({ fuelType: 'Petrol', isActive: true });
        this.filteredMakes = [];
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
