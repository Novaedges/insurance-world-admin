export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Sales';
  status: 'Active' | 'Inactive';
  permissions?: string[];
}

export interface RTO {
  id: string;
  code: string; // e.g., TR01
  name: string;
  city: string;
  state: string;
  status: 'Active' | 'Inactive';
}

export interface VehicleMake {
  id: string;
  name: string;
  category: 'Bike' | 'Car';
  status: 'Active' | 'Inactive';
}

export interface VehicleModel {
  id: string;
  name: string;
  makeId: string;
  makeName?: string; // For display
  engineCC?: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
  status: 'Active' | 'Inactive';
}

export interface InsuranceCategory {
  id: string;
  name: string;
  type: 'Motor' | 'Health';
  description?: string;
  status: 'Active' | 'Inactive';
}

export interface ChildCategory {
  id: string;
  name: string;
  parentCategoryId: string;
  parentCategoryName?: string; // For display
  status: 'Active' | 'Inactive';
}

export interface InsuranceCompany {
  id: string;
  name: string;
  address: string;
  email: string;
  contactNumber: string;
  helplineNumber: string;
  website?: string;
  status: 'Active' | 'Inactive';
}

export interface Agent {
  id: string;
  fullName: string;
  contactNumber: string;
  address: string;
  email?: string;
  agentCode: string;
  status: 'Active' | 'Inactive';
}
