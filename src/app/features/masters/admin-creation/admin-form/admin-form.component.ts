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
    { id: 'products', name: 'Product Management' },
    { id: 'inquiries', name: 'Inquiry Management' },
    { id: 'sales-reports', name: 'Sales Reports' },
    { id: 'admin-creation', name: 'Admin Creation' },
    { id: 'rto-management', name: 'RTO Management' },
    { id: 'vehicle-make', name: 'Vehicle Make' },
    { id: 'vehicle-model', name: 'Vehicle Model' },
    { id: 'insurance-category', name: 'Categories' },
    { id: 'child-category', name: 'Sub-Categories' },
    { id: 'insurance-company', name: 'Insurance Companies' },
    { id: 'agent-management', name: 'Agent Management' },
    { id: 'whatsapp', name: 'WhatsApp' },
    { id: 'sms', name: 'SMS' },
    { id: 'payments', name: 'Payments' },
    { id: 'commissions', name: 'Commissions' },
    { id: 'renewals', name: 'Renewals' },
    { id: 'crm', name: 'CRM Sync' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'ai-engine', name: 'AI Engine' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Sales', Validators.required],
      status: ['Active', Validators.required],
      permissions: [[]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['admin'] && this.admin) {
      this.form.patchValue(this.admin);
    } else {
      this.form.reset({ role: 'Sales', status: 'Active', permissions: [] });
    }
  }

  togglePermission(moduleId: string) {
    const current = this.form.get('permissions')?.value || [];
    if (current.includes(moduleId)) {
      this.form.patchValue({ permissions: current.filter((id: string) => id !== moduleId) });
    } else {
      this.form.patchValue({ permissions: [...current, moduleId] });
    }
  }

  isPermissionSelected(moduleId: string): boolean {
    return (this.form.get('permissions')?.value || []).includes(moduleId);
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
