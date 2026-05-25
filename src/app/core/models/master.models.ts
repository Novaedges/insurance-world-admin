export interface ComponentAccess {
  component: string;
  permissions: string[];
}

export interface Admin {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  roleType: 'ADMIN' | 'SALES' | 'SUPER_ADMIN';
  phoneNumber: string;
  password?: string;
  status: 'Active' | 'Inactive';
  componentAccess?: ComponentAccess[];
  createdAt?: string;
  isActive?: boolean;
  _id?: string;
}

export interface RTO {
  id?: string;
  rtoCode: string; // e.g., TR01
  rtoName: string;
  city?: string; // Kept as optional if needed for legacy support, or can be removed if strictly following API
  state?: string; // Kept as optional
  isActive?: boolean;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string; // For UI display
}

export interface VehicleMake {
  id?: string;
  name: string;
  vehicleTypeId: string | string[];
  vehicleTypeName?: string; // For display
  category?: 'Bike' | 'Car'; // Legacy, might be removed later if strictly using types
  isActive?: boolean;
  status?: string; // For UI display
  logo?: string;
  _id?: string;
}

export interface VehicleModel {
  id?: string;
  name: string;
  vehicleTypeId: string;
  manufacturerId: string;
  vehicleTypeName?: string; // For display
  manufacturerName?: string; // For display
  fuelType?: string; // Optional if not in API but in UI
  engineCC?: string; // Optional
  isActive?: boolean;
  status?: string; // For UI display
  logo?: string;
  _id?: string;
}

export interface InsuranceCategory {
  id?: string;
  name: string;
  type: 'Motor' | 'Health';
  description?: string;
  logo?: string;
  priority?: number;
  isActive?: boolean;
  _id?: string;
  status?: string; // For UI display
}

export interface ChildCategory {
  id: string;
  name: string;
  parentCategoryId: string;
  parentCategoryName?: string; // For display
  status: 'Active' | 'Inactive';
}

export interface InsuranceCompany {
  _id?: string;
  id?: string;
  companyName: string;
  description?: string;
  address?: string;
  email?: string;
  contactNumber?: string;
  helplineNumber?: string;
  website?: string;
  status?: 'Active' | 'Inactive'; // UI status
  isActive?: boolean; // API status
  logo?: string;
  createdAt?: string;
  updatedAt?: string;

  // Legacy mappings for shared components if needed
  name?: string;
}

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password?: string;
  email?: string;
  agentCode: string; // Readonly in edit, but part of model
  bankName?: string;
  bankAccNumber?: string;
  ifscCode?: string;
  bankBranch?: string;
  panNumber?: string;
  bankDetails?: {
    bankName?: string;
    bankAccNumber?: string;
    ifscCode?: string;
    bankBranch?: string;
  };
  introducerName?: string;
  status: 'Active' | 'Inactive';
  isActive?: boolean;
  _id?: string;
}

export interface PolicyType {
  _id?: string;
  policyType: string;
  tag: string;
  description?: string;
  coverage?: string[];
  isActive?: boolean;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}
