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
import { Product } from '../../../core/models/product.models';
// Master Models
import {
  InsuranceCategory,
  VehicleMake,
  VehicleModel,
  RTO,
  InsuranceCompany,
  PolicyType,
} from '../../../core/models/master.models';

// Services
import { MasterService } from '../../../core/services/master.service';
import { InsuranceCategoryService } from '../../masters/insurance-category/insurance-category.service';
import { VehicleMakeService } from '../../masters/vehicle-make/vehicle-make.service';
import { VehicleModelService } from '../../masters/vehicle-model/vehicle-model.service';
import { RtoService } from '../../masters/rto-management/rto.service';
import { PolicyTypeService } from '../../masters/policy-type/policy-type.service';
import { InsuranceCompanyService } from '../../masters/insurance-company/insurance-company.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnChanges, OnInit {
  @Input() data: Product | null = null;
  @Input() isSubmitting: boolean = false;
  @Output() save = new EventEmitter<FormData>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  currentStep = 1;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Master Data Arrays
  categories: InsuranceCategory[] = [];
  makes: VehicleMake[] = [];
  filteredMakes: VehicleMake[] = [];
  models: VehicleModel[] = [];
  filteredModels: VehicleModel[] = [];

  // New Master Data Arrays
  rtos: RTO[] = [];
  insuranceCompanies: InsuranceCompany[] = [];
  policyTypes: PolicyType[] = [];

  finalPrice = 0;

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private categoryService: InsuranceCategoryService,
    private makeService: VehicleMakeService,
    private modelService: VehicleModelService,
    private rtoService: RtoService,
    private policyTypeService: PolicyTypeService,
    private insuranceCompanyService: InsuranceCompanyService,
    private snackbarService: SnackbarService,
  ) {
    this.form = this.fb.group({
      id: [''],
      _id: [''],
      name: ['', Validators.required],
      description: [''],
      insuranceCategoryId: [[], Validators.required],
      makeId: [[]],
      modelId: [[]],

      // New Pricing/Commission fields
      basePrice: [0, Validators.required],
      maxPrice: [0],
      discountType: ['CENT'],
      discountValue: [0, [Validators.min(0), Validators.max(100)]],
      commission: [0],

      policyDuration: [1, Validators.required],
      termsAndConditions: [''],
      status: 'Active',

      // New explicitly matching API Payload
      policyCode: ['', Validators.required],
      insuranceCompaniesId: [[], Validators.required],
      policyTypeId: ['', Validators.required],
      rtoIds: [[], Validators.required],
      policyCovers: [[]],
      priority: [0, Validators.required],
    });

    this.form.valueChanges.subscribe(() => this.calculateFinalPrice());
  }

  ngOnInit() {
    this.loadMasters();
  }

  loadMasters() {
    this.insuranceCompanyService
      .getCompanies()
      .subscribe((res: any) => (this.insuranceCompanies = res.result || []));

    // Valid API calls
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res.result || [];
    });

    this.makeService.getMakes().subscribe((res: any) => {
      this.makes = res.result || [];
    });

    this.modelService.getModels().subscribe((res: any) => {
      this.models = res.result || [];
    });

    this.rtoService.getRTOs().subscribe((res: any) => {
      this.rtos = res.result || [];
    });

    this.policyTypeService.getPolicyTypes().subscribe((res: any) => {
      this.policyTypes = res.result || [];
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.data) {
        const ensureArray = (val: any) => {
          if (!val) return [];
          if (Array.isArray(val)) return val;
          return [val];
        };

        // Handle patch value mapping since field names changed conceptually
        const patchedData = {
          ...this.data,
          name: this.data.policyName || this.data.name,
          basePrice: this.data.minPrice !== undefined ? this.data.minPrice : this.data.basePrice,
          discountValue:
            this.data.discount !== undefined ? this.data.discount : this.data.discountValue,
          discountType: 'CENT',
          insuranceCategoryId: ensureArray(this.data.vehicleTypeId),
          makeId: ensureArray(this.data.manufacturerId),
          modelId: ensureArray(this.data.vehicleModelId),
          insuranceCompaniesId: ensureArray(this.data.insuranceCompaniesId),
          termsAndConditions: this.data.tAndC || this.data.termsAndConditions,
          policyDuration: this.data.policyDuration ? parseInt(String(this.data.policyDuration)) : 1,
          policyCovers: ensureArray(this.data.policyCovers),
        };

        this.form.patchValue(patchedData);
        this.onCategoryChange(false);
        this.onMakeChange(false);
        this.calculateFinalPrice();
        this.imagePreview = this.data.logo || null;
      } else {
        this.form.reset({
          basePrice: 0,
          maxPrice: 0,
          discountType: 'CENT',
          discountValue: 0,
          commission: 0,
          policyDuration: 1,
          status: 'Active',
          rtoIds: [],
          insuranceCompaniesId: [],
          insuranceCategoryId: [],
          makeId: [],
          modelId: [],
          policyCovers: [],
          priority: 0,
        });
        this.finalPrice = 0;
        this.currentStep = 1;
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

  onCategoryChange(resetMakeAndModel = true) {
    const selectedCatIds = this.form.get('insuranceCategoryId')?.value || [];

    // Synchronize by calling the API as requested
    this.makeService.getMakes().subscribe((res: any) => {
      this.makes = res.result || [];
      if (this.makes.length > 0 && selectedCatIds.length > 0) {
        this.filteredMakes = this.makes.filter((m: any) => {
          if (!m.vehicleTypeId) return false;
          if (Array.isArray(m.vehicleTypeId)) {
            return m.vehicleTypeId.some((id: string) => selectedCatIds.includes(id));
          }
          return selectedCatIds.includes(m.vehicleTypeId);
        });
      } else {
        this.filteredMakes = [];
      }
    });

    // Also sync models
    this.modelService.getModels().subscribe((res: any) => {
      this.models = res.result || [];
      this.onMakeChange(false);
    });

    if (resetMakeAndModel) {
      this.form.patchValue({ makeId: [], modelId: [] });
      this.filteredModels = [];
    }
  }

  onMakeChange(resetModel = true) {
    const selectedMakeIds = this.form.get('makeId')?.value || [];
    if (this.models.length > 0 && selectedMakeIds.length > 0) {
      this.filteredModels = this.models.filter((m: any) => {
        const makeId = m.manufacturerId || m.makeId || m._id;
        return selectedMakeIds.includes(makeId);
      });
    } else {
      this.filteredModels = [];
    }

    if (resetModel) {
      this.form.patchValue({ modelId: [] });
    }
  }

  calculateFinalPrice() {
    const base = this.form.get('basePrice')?.value || 0;
    const type = this.form.get('discountType')?.value || 'FLAT';
    const value = this.form.get('discountValue')?.value || 0;

    let discountAmount = 0;
    if (type === 'Percentage') {
      discountAmount = (base * value) / 100;
    } else {
      discountAmount = value; // Assumed FLAT
    }

    this.finalPrice = Math.max(0, base - discountAmount);
  }

  // --- Policy Covers Handlers ---
  addPolicyCover(input: HTMLInputElement) {
    const value = input.value.trim();
    if (!value) return;

    const currentCovers = this.form.get('policyCovers')?.value || [];
    if (!currentCovers.includes(value)) {
      this.form.patchValue({ policyCovers: [...currentCovers, value] });
      input.value = '';
    } else {
      this.snackbarService.error('This cover is already added');
    }
  }

  removePolicyCover(index: number) {
    const currentCovers = this.form.get('policyCovers')?.value || [];
    const newCovers = currentCovers.filter((_: any, i: number) => i !== index);
    this.form.patchValue({ policyCovers: newCovers });
  }

  // --- Multi Select Handlers ---
  isSelected(controlName: string, id: string): boolean {
    const values = this.form.get(controlName)?.value || [];
    return values.includes(id);
  }

  onCheckboxChange(event: any, controlName: string, id: string) {
    const isChecked = event.target.checked;
    const currentValues = this.form.get(controlName)?.value || [];

    let newValues;
    if (isChecked) {
      newValues = [...currentValues, id];
    } else {
      newValues = currentValues.filter((v: string) => v !== id);
    }

    this.form.patchValue({ [controlName]: newValues });

    // Trigger dependent logic
    if (controlName === 'insuranceCategoryId') {
      this.onCategoryChange();
    } else if (controlName === 'makeId') {
      this.onMakeChange();
    }
  }

  setStep(step: number) {
    this.currentStep = step;
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbarService.error('Please fill all required fields');
      return;
    }

    if (this.form.valid) {
      const formData = new FormData();
      const formValue = this.form.value;

      // Structure Payload Logic
      formData.append('policyName', formValue.name);
      formData.append('policyCode', formValue.policyCode);
      formData.append('insuranceCompaniesId', JSON.stringify(formValue.insuranceCompaniesId || []));
      formData.append('vehicleTypeId', JSON.stringify(formValue.insuranceCategoryId || []));
      formData.append('manufacturerId', JSON.stringify(formValue.makeId || []));
      formData.append('vehicleModelId', JSON.stringify(formValue.modelId || []));
      formData.append('policyTypeId', formValue.policyTypeId);
      formData.append('rtoIds', JSON.stringify(formValue.rtoIds || []));
      formData.append('minPrice', String(formValue.basePrice));
      formData.append('maxPrice', String(formValue.maxPrice || 0));
      formData.append('discount', String(formValue.discountValue || 0));
      formData.append('commission', String(formValue.commission || 0));

      // Retained Fields via User Request
      formData.append('name', formValue.name);
      formData.append('description', formValue.description || '');
      // formData.append('insuranceCategoryId', formValue.insuranceCategoryId); // Removed legacy or keep? I'll comment out
      formData.append('policyDuration', String(formValue.policyDuration));
      formData.append('tAndC', formValue.termsAndConditions || '');
      formData.append('status', formValue.status);
      formData.append('discountType', formValue.discountType);
      formData.append('basePrice', String(formValue.basePrice));
      formData.append('policyCovers', JSON.stringify(formValue.policyCovers || []));
      formData.append('priority', String(formValue.priority || 0));

      if (formValue._id || formValue.id) {
        formData.append('_id', formValue._id || formValue.id);
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
