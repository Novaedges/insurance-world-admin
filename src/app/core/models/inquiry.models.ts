export interface InquiryReportItem {
  _id: string;
  regNumber: string;
  invoiceNo: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  policyName: string;
  agentName: string;
  agentPhoneNumber: number;
  status: string;
  rtoDetails?: {
    rtoName: string;
    rtoId: string;
  };
  policyDetails?: {
    policyName: string;
    policyCode: string;
    insuranceCompany: string;
    minPrice: number;
    maxPrice: number;
    discount: number;
    gst: number;
    commission: number;
  };
  vehicleTypeDetails?: {
    name: string;
    _id: string;
  };
  manufacturerDetails?: {
    name: string;
    _id: string;
  };
  vehicleModelDetails?: {
    name: string;
    _id: string;
  };
  policyTypeDetails?: {
    policyType: string;
    coverage: string[];
    _id: string;
  };
  salesExecutiveDetails?: any;
}
