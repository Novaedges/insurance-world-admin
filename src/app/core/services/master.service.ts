import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Admin,
  RTO,
  VehicleMake,
  VehicleModel,
  InsuranceCategory,
  ChildCategory,
  InsuranceCompany,
  Agent,
} from '../models/master.models';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  private categories: InsuranceCategory[] = [
    {
      id: '1',
      name: 'Motor Insurance',
      type: 'Motor',
      description: 'Covers vehicle damages',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Health Insurance',
      type: 'Health',
      description: 'Covers medical expenses',
      status: 'Active',
    },
  ];

  private childCategories: ChildCategory[] = [
    {
      id: '1',
      name: 'Bike Insurance',
      parentCategoryId: '1',
      parentCategoryName: 'Motor Insurance',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Car Insurance',
      parentCategoryId: '1',
      parentCategoryName: 'Motor Insurance',
      status: 'Active',
    },
  ];

  private agents: Agent[] = [];

  constructor(private http: HttpClient) {}

  // --- Generic Helpers ---
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  // --- Category ---
  getCategories(): Observable<InsuranceCategory[]> {
    return of([...this.categories]).pipe(delay(500));
  }
  saveCategory(item: InsuranceCategory): Observable<InsuranceCategory> {
    if (item.id) {
      const index = this.categories.findIndex((x) => x.id === item.id);
      if (index !== -1) this.categories[index] = item;
    } else {
      item.id = this.generateId();
      this.categories.push(item);
    }
    return of(item).pipe(delay(500));
  }
  deleteCategory(id: string): Observable<boolean> {
    this.categories = this.categories.filter((x) => x.id !== id);
    return of(true).pipe(delay(500));
  }

  // --- Child Category ---
  getChildCategories(isActive?: boolean): Observable<ChildCategory[]> {
    const enriched = this.childCategories.map((c) => {
      const p = this.categories.find((cat) => cat.id === c.parentCategoryId);
      return { ...c, parentCategoryName: p ? p.name : 'Unknown' };
    });
    const filtered =
      isActive !== undefined
        ? enriched.filter((c) => c.status === (isActive ? 'Active' : 'Inactive'))
        : enriched;
    return of(filtered).pipe(delay(500));
  }
  saveChildCategory(item: ChildCategory): Observable<ChildCategory> {
    if (item.id) {
      const index = this.childCategories.findIndex((x) => x.id === item.id);
      if (index !== -1) this.childCategories[index] = item;
    } else {
      item.id = this.generateId();
      this.childCategories.push(item);
    }
    return of(item).pipe(delay(500));
  }
  deleteChildCategory(id: string): Observable<boolean> {
    this.childCategories = this.childCategories.filter((x) => x.id !== id);
    return of(true).pipe(delay(500));
  }

  // --- Agent ---
  getAgents(): Observable<Agent[]> {
    return of([...this.agents]).pipe(delay(500));
  }
  saveAgent(item: Agent): Observable<Agent> {
    if (item.id) {
      const index = this.agents.findIndex((x) => x.id === item.id);
      if (index !== -1) this.agents[index] = item;
    } else {
      item.id = this.generateId();
      this.agents.push(item);
    }
    return of(item).pipe(delay(500));
  }
  deleteAgent(id: string): Observable<boolean> {
    this.agents = this.agents.filter((x) => x.id !== id);
    return of(true).pipe(delay(500));
  }
}
