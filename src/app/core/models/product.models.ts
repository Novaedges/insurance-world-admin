export interface Product {
  id: string;
  name: string;
  description: string;
  insuranceCategoryId: string;
  insuranceCategoryName?: string; // For display
  childCategoryId: string;
  childCategoryName?: string; // For display
  makeId?: string; // Optional (e.g., only for Motor)
  makeName?: string;
  modelId?: string; // Optional
  modelName?: string;
  basePrice: number;
  discountType: 'Percentage' | 'Flat';
  discountValue: number;
  finalPrice: number; // Auto-calculated
  policyDuration: '1 Year' | '3 Years' | '5 Years';
  termsAndConditions: string;
  status: 'Active' | 'Inactive';
}
