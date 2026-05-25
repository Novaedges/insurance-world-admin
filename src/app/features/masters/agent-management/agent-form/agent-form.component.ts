import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Agent } from '../../../../core/models/master.models';

@Component({
  selector: 'app-agent-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agent-form.component.html',
  styleUrls: ['./agent-form.component.scss'],
})
export class AgentFormComponent implements OnChanges {
  @Input() agent: Agent | null = null;
  @Input() isSubmitting: boolean = false;
  @Output() save = new EventEmitter<Agent>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      _id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.email]],
      password: ['', Validators.required],
      agentCode: ['', Validators.required],
      bankName: [''],
      bankAccNumber: [''],
      ifscCode: [''],
      bankBranch: [''],
      panNumber: [''],
      introducerName: [''],
      isActive: [true, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['agent']) {
      if (this.agent) {
        this.form.patchValue(this.agent);
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
        this.form.get('agentCode')?.setValidators(Validators.required);
      } else {
        this.form.reset({ isActive: true });
        this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
        this.form.get('password')?.updateValueAndValidity();
        this.form.get('agentCode')?.clearValidators();
        this.form.get('agentCode')?.updateValueAndValidity();
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const payload = { ...this.form.value };
      if (!this.agent) {
        delete payload._id;
        delete payload.agentCode;
      }
      this.save.emit(payload);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
