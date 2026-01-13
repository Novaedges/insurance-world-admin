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
      id: [''],
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      helplineNumber: ['', Validators.required],
      website: [''],
      status: ['Active', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['company'] && this.company) {
      this.form.patchValue(this.company);
    } else {
      this.form.reset({ status: 'Active' });
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
