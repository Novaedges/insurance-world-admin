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
  ChildCategory,
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
  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  currentStep = 1;

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
      insuranceCategoryId: ['', Validators.required],
      makeId: [''],
      modelId: [''],

      // New Pricing/Commission fields
      basePrice: [0, Validators.required],
      maxPrice: [0],
      discountType: ['Flat'],
      discountValue: [0],
      gst: [0, Validators.required],
      commission: [0],

      policyDuration: ['1 Year', Validators.required],
      termsAndConditions: [''],
      status: ['Active', Validators.required],

      // New explicitly matching API Payload
      policyCode: ['', Validators.required],
      insuranceCompany: ['', Validators.required],
      policyTypeId: ['', Validators.required],
      rtoIds: [[], Validators.required],
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
        // Handle patch value mapping since field names changed conceptually
        const patchedData = {
          ...this.data,
          name: this.data.policyName || this.data.name,
          basePrice: this.data.minPrice !== undefined ? this.data.minPrice : this.data.basePrice,
          discountValue:
            this.data.discount !== undefined ? this.data.discount : this.data.discountValue,
          insuranceCategoryId: this.data.vehicleTypeId || this.data.insuranceCategoryId,
          makeId: this.data.manufacturerId || this.data.makeId,
          modelId: this.data.vehicleModelId || this.data.modelId,
        };

        this.form.patchValue(patchedData);
        this.onCategoryChange(false);
        this.onMakeChange(false);
        this.calculateFinalPrice();
      } else {
        this.form.reset({
          basePrice: 0,
          maxPrice: 0,
          discountType: 'Flat',
          discountValue: 0,
          gst: 0,
          commission: 0,
          policyDuration: '1 Year',
          status: 'Active',
          rtoIds: [],
        });
        this.finalPrice = 0;
        this.currentStep = 1;
      }
    }
  }

  onCategoryChange(resetMakeAndModel = true) {
    const catId = this.form.get('insuranceCategoryId')?.value;

    // Dependent Dropdown Logic (Category -> Make)
    if (this.makes.length > 0) {
      this.filteredMakes = this.makes.filter((m: any) => m.vehicleTypeId === catId);
    } else {
      this.filteredMakes = [];
    }

    if (resetMakeAndModel) {
      this.form.patchValue({ makeId: '', modelId: '' });
      this.filteredModels = [];
    }
  }

  onMakeChange(resetModel = true) {
    const makeId = this.form.get('makeId')?.value;
    this.filteredModels = this.models.filter(
      (m: any) => m.manufacturerId === makeId || m.makeId === makeId,
    );
    if (resetModel) {
      this.form.patchValue({ modelId: '' });
    }
  }

  calculateFinalPrice() {
    const base = this.form.get('basePrice')?.value || 0;
    const type = this.form.get('discountType')?.value || 'Flat';
    const value = this.form.get('discountValue')?.value || 0;

    let discountAmount = 0;
    if (type === 'Percentage') {
      discountAmount = (base * value) / 100;
    } else {
      discountAmount = value; // Assumed Flat
    }

    this.finalPrice = Math.max(0, base - discountAmount);
  }

  // --- Multi Select Handlers ---
  isRtoSelected(rtoId: string): boolean {
    const currentRtoIds = this.form.get('rtoIds')?.value || [];
    return currentRtoIds.includes(rtoId);
  }

  onRtoCheckboxChange(event: any, rtoId: string) {
    const isChecked = event.target.checked;
    const currentRtoIds = this.form.get('rtoIds')?.value || [];

    if (isChecked) {
      this.form.patchValue({ rtoIds: [...currentRtoIds, rtoId] });
    } else {
      this.form.patchValue({ rtoIds: currentRtoIds.filter((id: string) => id !== rtoId) });
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
      const formValue = this.form.value;
      const cat = this.categories.find(
        (c: any) =>
          c._id === formValue.insuranceCategoryId || c.id === formValue.insuranceCategoryId,
      );

      // Structure Payload exactly like API expects + retained existing UI fields
      const payload: any = {
        _id: formValue._id || formValue.id,
        policyName: formValue.name,
        policyCode: formValue.policyCode,
        insuranceCompany: formValue.insuranceCompany,
        vehicleTypeId: formValue.insuranceCategoryId,
        manufacturerId: formValue.makeId,
        vehicleModelId: formValue.modelId,
        policyTypeId: formValue.policyTypeId,
        rtoIds: formValue.rtoIds,
        minPrice: Number(formValue.basePrice),
        maxPrice: Number(formValue.maxPrice),
        discount: Number(formValue.discountValue),
        gst: Number(formValue.gst),
        commission: Number(formValue.commission),

        // Retained Fields via User Request
        name: formValue.name,
        description: formValue.description,
        insuranceCategoryName: cat?.name,
        insuranceCategoryId: formValue.insuranceCategoryId,
        policyDuration: formValue.policyDuration,
        termsAndConditions: formValue.termsAndConditions,
        status: formValue.status,
        finalPrice: this.finalPrice,
        discountType: formValue.discountType,
        basePrice: formValue.basePrice,
        makeId: formValue.makeId,
        modelId: formValue.modelId,
      };

      // Cleanup empty _id
      if (!payload._id) {
        delete payload._id;
      }

      this.save.emit(payload);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
