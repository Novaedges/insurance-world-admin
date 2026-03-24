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
import { ChildCategory, InsuranceCategory } from '../../../../core/models/master.models';
import { MasterService } from '../../../../core/services/master.service';

@Component({
  selector: 'app-child-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './child-category-form.component.html',
  styleUrls: ['../../admin-creation/admin-form/admin-form.component.scss'],
})
export class ChildCategoryFormComponent implements OnChanges, OnInit {
  @Input() data: ChildCategory | null = null;
  @Output() save = new EventEmitter<ChildCategory>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  parentCategories: InsuranceCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
  ) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      parentCategoryId: ['', Validators.required],
      status: ['Active', Validators.required],
    });
  }

  ngOnInit() {
    this.masterService.getCategories().subscribe((cats) => (this.parentCategories = cats));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.data) {
        this.form.patchValue(this.data);
      } else {
        this.form.reset({ status: 'Active' });
      }
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
