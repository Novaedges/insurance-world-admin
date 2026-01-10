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
import { VehicleModel, VehicleMake } from '../../../../core/models/master.models';
import { MasterService } from '../../../../core/services/master.service';

@Component({
  selector: 'app-vehicle-model-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-model-form.component.html',
  styleUrls: ['../../admin-creation/admin-form/admin-form.component.scss'],
})
export class VehicleModelFormComponent implements OnChanges, OnInit {
  @Input() data: VehicleModel | null = null;
  @Output() save = new EventEmitter<VehicleModel>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  makes: VehicleMake[] = [];

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
  ) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      makeId: ['', Validators.required],
      engineCC: [''],
      fuelType: ['Petrol', Validators.required],
      status: ['Active', Validators.required],
    });
  }

  ngOnInit() {
    this.masterService.getMakes().subscribe((makes) => (this.makes = makes));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.form.patchValue(this.data);
    } else {
      this.form.reset({ fuelType: 'Petrol', status: 'Active' });
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
