import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../core/services/master.service';
import { Agent } from '../../../core/models/master.models';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { AgentFormComponent } from './agent-form/agent-form.component';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-agent-management',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogComponent, AgentFormComponent],
  templateUrl: './agent-management.component.html',
  styleUrls: ['./agent-management.component.scss'],
})
export class AgentManagementComponent implements OnInit {
  agents: Agent[] = [];
  loading = false;
  isDialogOpen = false;
  selectedItem: Agent | null = null;

  columns: Column[] = [
    { field: 'fullName', header: 'Full Name' },
    { field: 'agentCode', header: 'Agent Code' },
    { field: 'contactNumber', header: 'Contact' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  constructor(
    private masterService: MasterService,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.masterService
      .getAgents()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((data: Agent[]) => (this.agents = data));
  }

  openForm(item: Agent | null = null) {
    this.selectedItem = item;
    this.isDialogOpen = true;
  }

  closeForm() {
    this.isDialogOpen = false;
    this.selectedItem = null;
  }

  onSave(item: Agent) {
    this.masterService.saveAgent(item).subscribe(() => {
      this.snackbar.show(
        `Agent ${item.id ? 'updated' : 'added'} successfully`,
        'success'
      );
      this.loadData();
      this.closeForm();
    });
  }

  onDelete(item: Agent) {
    this.masterService.deleteAgent(item.id).subscribe(() => {
      this.snackbar.show('Agent deleted successfully', 'success');
      this.loadData();
    });
  }
}
