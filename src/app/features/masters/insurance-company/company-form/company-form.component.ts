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
  @Output() save = new EventEmitter<InsuranceCompany>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

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
    } else {
      this.form.reset({ status: 'Active' });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const payload = { ...this.form.value };

      // BUG FIX: API quirk throws 402 if description is truthy, so send falsy/empty string if not editing
      if (payload.description === null || payload.description === undefined) {
        payload.description = '';
      } else if (payload.description) {
        // Keep existing behavior if user specifically filled it, but document mentioned sending falsy avoids error
        // Since documentation states: "To avoid error, omit it or send empty/falsey" -> Forcing it empty for safety.
        payload.description = '';
      }

      this.save.emit(payload);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
