import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RTO } from '../../../../core/models/master.models';

@Component({
  selector: 'app-rto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rto-form.component.html',
  styleUrls: ['../../admin-creation/admin-form/admin-form.component.scss'], // Reuse styles
})
export class RtoFormComponent implements OnChanges {
  @Input() data: RTO | null = null;
  @Output() save = new EventEmitter<any>(); // Changed to any to support new structure with _id
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      _id: [''],
      rtoCode: ['', Validators.required],
      rtoName: ['', Validators.required],
      isActive: [true, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.form.patchValue(this.data);
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
