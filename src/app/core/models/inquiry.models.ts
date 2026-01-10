export interface Inquiry {
  id: string;
  source: 'Web' | 'App';
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Product Details
  productId: string;
  productName: string;
  categoryName: string;

  // Specific Details (JSON string or specific fields)
  vehicleDetails?: string; // e.g. "Honda City, 2022"
  healthDetails?: string; // e.g. "Age 35, No pre-existing details"

  preferredTime: string;

  // Lifecycle
  status: 'New' | 'Contacted' | 'Quotation Sent' | 'Negotiation' | 'Converted' | 'Lost';
  assignedTo?: string; // Agent Name or ID
  assignedToInitials?: string;

  createdAt: Date;
  updatedAt: Date;
}
