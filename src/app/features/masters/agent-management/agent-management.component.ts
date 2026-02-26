import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent } from '../../../core/models/master.models';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { AgentFormComponent } from './agent-form/agent-form.component';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { finalize } from 'rxjs/operators';
import { AgentService } from './agent.service';

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
  isActiveFilter: boolean = true;
  selectedItem: Agent | null = null;

  columns: Column[] = [
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'phoneNumber', header: 'Phone Number' },
    { field: 'agentCode', header: 'Agent Code' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  constructor(
    private agentService: AgentService,
    private snackbar: SnackbarService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.agentService
      .getAgents(this.isActiveFilter)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe((success: any) => {
        const data = success.result || [];
        this.agents = data.map((item: any) => ({
          ...item,
          status: item.isActive ? 'Active' : 'Inactive',
        }));
      });
  }

  onStatusFilterChange(status: boolean) {
    this.isActiveFilter = status;
    this.loadData();
  }

  openForm(item: Agent | null = null) {
    if (item) {
      const id = item._id || item.id;
      if (id) {
        this.agentService.getAgentById(id).subscribe((success: any) => {
          const data = success.result || success.data;
          const agentDetails = Array.isArray(data) ? data[0] : data;
          this.selectedItem = {
            ...agentDetails,
            status: agentDetails.isActive ? 'Active' : 'Inactive',
            _id: agentDetails._id || agentDetails.id,
          };
          this.isDialogOpen = true;
          this.cdr.detectChanges();
        });
      }
    } else {
      this.selectedItem = null;
      this.isDialogOpen = true;
    }
  }

  closeForm() {
    this.isDialogOpen = false;
    this.selectedItem = null;
  }

  onSave(item: Agent) {
    if (item._id) {
      this.agentService.updateAgent(item).subscribe(() => {
        this.snackbar.success('Agent updated successfully');
        this.loadData();
        this.closeForm();
      });
    } else {
      this.agentService.createAgent(item).subscribe(() => {
        this.snackbar.success('Agent added successfully');
        this.loadData();
        this.closeForm();
      });
    }
  }

  onDelete(item: Agent) {
    const id = item._id || item.id;
    if (id) {
      const payload = { _id: id, isActive: false };
      this.agentService.deleteAgent(payload).subscribe((success: any) => {
        this.snackbar.success(success.msg);
        this.loadData();
      });
    }
  }
}
