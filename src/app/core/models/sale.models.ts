export interface Sale {
  id: string;
  policyNumber: string;
  customerName: string;
  productName: string;
  categoryName: string;
  premiumAmount: number;
  discountApplied: number;
  finalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  policyStartDate: Date;
  policyEndDate: Date;
  agentName: string;
  saleDate: Date;
}
