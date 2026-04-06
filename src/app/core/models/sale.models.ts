export interface SaleReportItem {
  _id: string;
  regNumber: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  sellingPrice: number;
  actualPrice: number;
  discount: number;
  policyName: string;
  policyCode: string;
  agentName: string;
  salesExecutiveName: string;
  lapsDate?: string;
}
