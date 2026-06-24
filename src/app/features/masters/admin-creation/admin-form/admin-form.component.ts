import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Admin } from '../../../../core/models/master.models';

@Component({
  selector: 'app-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
})
export class AdminFormComponent implements OnChanges {
  @Input() admin: Admin | null = null;
  @Output() save = new EventEmitter<Admin>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  availableModules = [
    { id: 'Dashboard', name: 'Dashboard' },
    { id: 'ProductManagement', name: 'Product Management' },
    { id: 'EnquiryManagement', name: 'Enquiry Management' },
    { id: 'SalesReports', name: 'Sales Reports' },
    { id: 'ClaimRecord', name: 'Claim Record' },
    { id: 'AdminCreation', name: 'Admin Creation' },
    { id: 'InsuranceCompany', name: 'Insurance Company' },
    { id: 'PartnerManagement', name: 'Partner Management' },
    { id: 'RTOManagement', name: 'RTO Management' },
    { id: 'InsuranceCategories', name: 'Insurance Categories' },
    { id: 'PolicyType', name: 'Policy Type' },
    { id: 'VehicleMake', name: 'Vehicle Make' },
    { id: 'VehicleModel', name: 'Vehicle Model' },
    { id: 'PromotionalBanners', name: 'Promotional Banners' },
  ];

  availablePermissions = ['VIEW', 'ADD', 'EDIT', 'DELETE'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      _id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: [''],
      roleType: ['ADMIN', Validators.required],
      status: ['Active', Validators.required],
      componentAccess: [[]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['admin']) {
      if (this.admin) {
        const patchData = { ...this.admin };
        if (patchData.id && !patchData._id) patchData._id = patchData.id;
        this.form.patchValue(patchData);
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
      } else {
        this.form.reset({ roleType: 'ADMIN', status: 'Active', componentAccess: [] });
        this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
        this.form.get('password')?.updateValueAndValidity();
      }
    }
  }

  toggleModule(componentId: string) {
    const current: any[] = this.form.get('componentAccess')?.value || [];
    const moduleIndex = current.findIndex((m) => m.component === componentId);

    if (moduleIndex > -1) {
      current.splice(moduleIndex, 1);
    } else {
      current.push({
        component: componentId,
        permissions: ['VIEW', 'ADD', 'EDIT', 'DELETE'],
      });
    }

    this.form.patchValue({ componentAccess: [...current] });
  }

  isModuleEnabled(componentId: string): boolean {
    const current: any[] = this.form.get('componentAccess')?.value || [];
    return current.some((m) => m.component === componentId);
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
