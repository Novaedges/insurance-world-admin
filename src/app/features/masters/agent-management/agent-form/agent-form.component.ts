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
  @Output() save = new EventEmitter<Agent>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      fullName: ['', Validators.required],
      contactNumber: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.email]],
      agentCode: ['', Validators.required],
      status: ['Active', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['agent'] && this.agent) {
      this.form.patchValue(this.agent);
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
