import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
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
  // Mock Data
  private admins: Admin[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@admin.com',
      role: 'Super Admin',
      status: 'Active',
      permissions: [],
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@sales.com',
      role: 'Sales',
      status: 'Active',
      permissions: ['products', 'whatsapp'],
    },
  ];

  private rtoList: RTO[] = [
    {
      id: '1',
      code: 'TR01',
      name: 'Agartala RTO',
      city: 'Agartala',
      state: 'Tripura',
      status: 'Active',
    },
    { id: '2', code: 'DL01', name: 'Delhi North', city: 'Delhi', state: 'Delhi', status: 'Active' },
  ];

  private makes: VehicleMake[] = [
    { id: '1', name: 'Honda', category: 'Bike', status: 'Active' },
    { id: '2', name: 'Maruti Suzuki', category: 'Car', status: 'Active' },
  ];

  private models: VehicleModel[] = [
    {
      id: '1',
      name: 'City',
      makeId: '2',
      makeName: 'Maruti Suzuki',
      fuelType: 'Petrol',
      status: 'Active',
    }, // Note: Honda City exists but using dummy link
    {
      id: '2',
      name: 'Activa',
      makeId: '1',
      makeName: 'Honda',
      fuelType: 'Petrol',
      status: 'Active',
    },
  ];

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

  private insuranceCompanies: InsuranceCompany[] = [
    {
      id: '1',
      name: 'HDFC ERGO',
      address: 'Mumbai, India',
      email: 'contact@hdfcergo.com',
      contactNumber: '1800-2660-340',
      helplineNumber: '1800-2666-400',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Digit Insurance',
      address: 'Bangalore, India',
      email: 'hello@godigit.com',
      contactNumber: '1800-258-5956',
      helplineNumber: '1800-258-4444',
      status: 'Active',
    },
  ];

  private agents: Agent[] = [
    {
      id: '1',
      fullName: 'Rahul Sharma',
      contactNumber: '9876543210',
      address: 'New Delhi, India',
      agentCode: 'AG001',
      status: 'Active',
    },
  ];

  constructor() {}

  // --- Generic Helpers ---
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // --- Admin ---
  getAdmins(): Observable<Admin[]> {
    return of([...this.admins]).pipe(delay(500));
  }

  saveAdmin(admin: Admin): Observable<Admin> {
    if (admin.id) {
      const index = this.admins.findIndex((x) => x.id === admin.id);
      if (index !== -1) this.admins[index] = admin;
    } else {
      admin.id = this.generateId();
      this.admins.push(admin);
    }
    return of(admin).pipe(delay(500));
  }

  deleteAdmin(id: string): Observable<boolean> {
    this.admins = this.admins.filter((x) => x.id !== id);
    return of(true).pipe(delay(500));
  }

  // --- RTO ---
  getRTOs(): Observable<RTO[]> {
    return of([...this.rtoList]).pipe(delay(500));
  }
  saveRTO(item: RTO): Observable<RTO> {
    if (item.id) {
      const index = this.rtoList.findIndex((x) => x.id === item.id);
      if (index !== -1) this.rtoList[index] = item;
    } else {
      item.id = this.generateId();
      this.rtoList.push(item);
    }
    return of(item).pipe(delay(500));
  }
  deleteRTO(id: string): Observable<boolean> {
    this.rtoList = this.rtoList.filter((x) => x.id !== id);
    return of(true).pipe(delay(500));
  }

  // --- Make ---
  getMakes(): Observable<VehicleMake[]> {
    return of([...this.makes]).pipe(delay(500));
  }
  saveMake(item: VehicleMake): Observable<VehicleMake> {
    if (item.id) {
      const index = this.makes.findIndex((x) => x.id === item.id);
      if (index !== -1) this.makes[index] = item;
    } else {
      item.id = this.generateId();
      this.makes.push(item);
    }
    return of(item).pipe(delay(500));
  }
  deleteMake(id: string): Observable<boolean> {
    this.makes = this.makes.filter((x) => x.id !== id);
    return of(true).pipe(delay(500));
  }

  // --- Model ---
  getModels(): Observable<VehicleModel[]> {
    // Enrich with make name for display if needed
    const enriched = this.models.map((m) => {
      const make = this.makes.find((mk) => mk.id === m.makeId);
      return { ...m, makeName: make ? make.name : 'Unknown' };
    });
    return of(enriched).pipe(delay(500));
  }
  saveModel(item: VehicleModel): Observable<VehicleModel> {
    if (item.id) {
      const index = this.models.findIndex((x) => x.id === item.id);
      if (index !== -1) this.models[index] = item;
    } else {
      item.id = this.generateId();
      this.models.push(item);
    }
    return of(item).pipe(delay(500));
  }
  deleteModel(id: string): Observable<boolean> {
    this.models = this.models.filter((x) => x.id !== id);
    return of(true).pipe(delay(500));
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
  getChildCategories(): Observable<ChildCategory[]> {
    const enriched = this.childCategories.map((c) => {
      const p = this.categories.find((cat) => cat.id === c.parentCategoryId);
      return { ...c, parentCategoryName: p ? p.name : 'Unknown' };
    });
    return of(enriched).pipe(delay(500));
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

  // --- Insurance Company ---
  getInsuranceCompanies(): Observable<InsuranceCompany[]> {
    return of([...this.insuranceCompanies]).pipe(delay(500));
  }
  saveInsuranceCompany(item: InsuranceCompany): Observable<InsuranceCompany> {
    if (item.id) {
      const index = this.insuranceCompanies.findIndex((x) => x.id === item.id);
      if (index !== -1) this.insuranceCompanies[index] = item;
    } else {
      item.id = this.generateId();
      this.insuranceCompanies.push(item);
    }
    return of(item).pipe(delay(500));
  }
  deleteInsuranceCompany(id: string): Observable<boolean> {
    this.insuranceCompanies = this.insuranceCompanies.filter((x) => x.id !== id);
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
