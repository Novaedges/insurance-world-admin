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
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  categories: InsuranceCategory[] = [];

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
    } else {
      this.form.reset({ isActive: true });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
