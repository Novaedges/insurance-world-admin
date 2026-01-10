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
import { MasterService } from '../../../core/services/master.service';
import {
  InsuranceCategory,
  ChildCategory,
  VehicleMake,
  VehicleModel,
} from '../../../core/models/master.models';

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

  // Master Data
  categories: InsuranceCategory[] = [];
  childCategories: ChildCategory[] = [];
  filteredChildCategories: ChildCategory[] = [];
  makes: VehicleMake[] = [];
  models: VehicleModel[] = [];
  filteredModels: VehicleModel[] = [];

  isMotorInsurance = false;
  finalPrice = 0;

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
  ) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      insuranceCategoryId: ['', Validators.required],
      childCategoryId: ['', Validators.required],
      makeId: [''],
      modelId: [''],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      discountType: ['Flat', Validators.required],
      discountValue: [0, [Validators.required, Validators.min(0)]],
      policyDuration: ['1 Year', Validators.required],
      termsAndConditions: ['', Validators.required],
      status: ['Active', Validators.required],
    });

    this.form.valueChanges.subscribe(() => this.calculateFinalPrice());
  }

  ngOnInit() {
    this.loadMasters();
  }

  loadMasters() {
    this.masterService.getCategories().subscribe((res) => (this.categories = res));
    this.masterService.getChildCategories().subscribe((res) => (this.childCategories = res));
    this.masterService.getMakes().subscribe((res) => (this.makes = res));
    this.masterService.getModels().subscribe((res) => (this.models = res));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.data) {
        this.form.patchValue(this.data);
        this.onCategoryChange(false);
        this.onMakeChange();
        this.calculateFinalPrice();
      } else {
        this.form.reset({
          basePrice: 0,
          discountType: 'Flat',
          discountValue: 0,
          policyDuration: '1 Year',
          status: 'Active',
        });
        this.finalPrice = 0;
        this.currentStep = 1;
      }
    }
  }

  onCategoryChange(resetChild = true) {
    const catId = this.form.get('insuranceCategoryId')?.value;
    const selectedCat = this.categories.find((c) => c.id === catId);

    this.isMotorInsurance = selectedCat?.type === 'Motor';
    this.filteredChildCategories = this.childCategories.filter((c) => c.parentCategoryId === catId);

    if (resetChild) {
      this.form.patchValue({ childCategoryId: '' });
    }
  }

  onMakeChange() {
    const makeId = this.form.get('makeId')?.value;
    this.filteredModels = this.models.filter((m) => m.makeId === makeId);
  }

  calculateFinalPrice() {
    const base = this.form.get('basePrice')?.value || 0;
    const type = this.form.get('discountType')?.value;
    const value = this.form.get('discountValue')?.value || 0;

    let discountAmount = 0;
    if (type === 'Percentage') {
      discountAmount = (base * value) / 100;
    } else {
      discountAmount = value;
    }

    this.finalPrice = Math.max(0, base - discountAmount);
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
    if (this.form.valid) {
      const formValue = this.form.value;
      const cat = this.categories.find((c) => c.id === formValue.insuranceCategoryId);
      const child = this.childCategories.find((c) => c.id === formValue.childCategoryId);

      const payload: Product = {
        ...formValue,
        insuranceCategoryName: cat?.name,
        childCategoryName: child?.name,
        finalPrice: this.finalPrice,
      };

      this.save.emit(payload);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
