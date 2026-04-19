export interface Product {
  id: string;
  name: string; // Used as policyName based on user preference
  description: string;
  insuranceCategoryId: string;
  insuranceCategoryName?: string; // For display
  childCategoryId: string;
  childCategoryName?: string; // For display
  makeId?: string; // Maps to manufacturerId
  makeName?: string;
  modelId?: string; // vehicleModelId
  modelName?: string;
  basePrice: number; // Keep for now
  discountType: 'Percentage' | 'Flat';
  discountValue: number;
  finalPrice: number; // Auto-calculated
  policyDuration: '1 Year' | '3 Years' | '5 Years';
  termsAndConditions: string;
  status: 'Active' | 'Inactive';

  // New API Fields mapped exactly
  policyName?: string;
  policyCode?: string;
  insuranceCompaniesId?: string[]; // Multiple Insurance Company IDs
  vehicleTypeId?: string[]; // Multiple Vehicle Type IDs
  manufacturerId?: string[]; // Multiple Manufacturer IDs
  vehicleModelId?: string[]; // Multiple Vehicle Model IDs
  policyTypeId?: string;
  rtoIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  discount?: number;
  gst?: number;
  commission?: number;
  logo?: string;
  tAndC?: string;
  policyCovers?: string[];
}
