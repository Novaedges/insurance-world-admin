import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// --- Interfaces ---

// Payments
export interface PaymentTransaction {
  id: string;
  transactionId: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
  method: 'Credit Card' | 'UPI' | 'Net Banking';
}

export interface RefundRequest {
  id: string;
  originalTransactionId: string;
  reason: string;
  amount: number;
  status: 'Requested' | 'Processed' | 'Rejected';
  date: string;
}

// Commissions
export interface CommissionRule {
  id: string;
  role: string;
  percentage: number;
  minSaleAmount: number;
  status: 'Active' | 'Inactive';
}

export interface AgentPayout {
  id: string;
  agentName: string;
  amount: number;
  period: string;
  status: 'Paid' | 'Processing' | 'Hold';
}

// Renewals
export interface RenewalPolicy {
  id: string;
  policyNumber: string;
  customerName: string;
  expiryDate: string;
  premiumAmount: number;
  status: 'Due' | 'Overdue' | 'Renewed';
}

// CRM
export interface CrmLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted';
}

// Marketing
export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'Email' | 'SMS' | 'Social Media';
  status: 'Draft' | 'Scheduled' | 'Running' | 'Completed';
  targetAudience: string;
}

// AI Engine
export interface AiModel {
  id: string;
  name: string;
  type: 'Risk Scoring' | 'Fraud Detection' | 'Chatbot';
  accuracy: string;
  lastTrained: string;
  status: 'Active' | 'Training' | 'Inactive';
}

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  // --- Mock Data ---

  private transactions: PaymentTransaction[] = [
    {
      id: '1',
      transactionId: 'TXN12345',
      customerName: 'John Doe',
      amount: 1500,
      date: '2024-01-15',
      status: 'Success',
      method: 'Credit Card',
    },
    {
      id: '2',
      transactionId: 'TXN67890',
      customerName: 'Jane Smith',
      amount: 2500,
      date: '2024-01-16',
      status: 'Pending',
      method: 'UPI',
    },
    {
      id: '3',
      transactionId: 'TXN54321',
      customerName: 'Alice Johnson',
      amount: 5000,
      date: '2024-01-14',
      status: 'Failed',
      method: 'Net Banking',
    },
  ];

  private refunds: RefundRequest[] = [
    {
      id: '1',
      originalTransactionId: 'TXN54321',
      reason: 'Double deduction',
      amount: 5000,
      status: 'Requested',
      date: '2024-01-14',
    },
  ];

  private commissionRules: CommissionRule[] = [
    { id: '1', role: 'Agent', percentage: 10, minSaleAmount: 1000, status: 'Active' },
    { id: '2', role: 'Super Agent', percentage: 15, minSaleAmount: 5000, status: 'Active' },
  ];

  private agentPayouts: AgentPayout[] = [
    { id: '1', agentName: 'Agent Bond', amount: 4500, period: 'Jan 2024', status: 'Processing' },
    { id: '2', agentName: 'Agent Hunt', amount: 3200, period: 'Jan 2024', status: 'Paid' },
  ];

  private renewalPolicies: RenewalPolicy[] = [
    {
      id: '1',
      policyNumber: 'POL-001',
      customerName: 'Michael Scott',
      expiryDate: '2024-02-01',
      premiumAmount: 12000,
      status: 'Due',
    },
    {
      id: '2',
      policyNumber: 'POL-002',
      customerName: 'Dwight Schrute',
      expiryDate: '2024-01-10',
      premiumAmount: 8500,
      status: 'Overdue',
    },
  ];

  private leads: CrmLead[] = [
    {
      id: '1',
      name: 'Jim Halpert',
      email: 'jim@dm.com',
      phone: '9876543210',
      source: 'Website',
      status: 'New',
    },
    {
      id: '2',
      name: 'Pam Beesly',
      email: 'pam@dm.com',
      phone: '9876543211',
      source: 'Referral',
      status: 'Contacted',
    },
  ];

  private campaigns: MarketingCampaign[] = [
    {
      id: '1',
      name: 'New Year Discount',
      type: 'Email',
      status: 'Running',
      targetAudience: 'All Customers',
    },
    { id: '2', name: 'Summer Sale', type: 'SMS', status: 'Draft', targetAudience: 'Leads' },
  ];

  private aiModels: AiModel[] = [
    {
      id: '1',
      name: 'Risk Scorer V1',
      type: 'Risk Scoring',
      accuracy: '92%',
      lastTrained: '2024-01-01',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Chat Bot Alpha',
      type: 'Chatbot',
      accuracy: '85%',
      lastTrained: '2024-01-10',
      status: 'Training',
    },
  ];

  constructor() {}

  // --- Methods ---

  // Payments
  getTransactions(): Observable<PaymentTransaction[]> {
    return of(this.transactions).pipe(delay(300));
  }

  getRefunds(): Observable<RefundRequest[]> {
    return of(this.refunds).pipe(delay(300));
  }

  // Commissions
  getCommissionRules(): Observable<CommissionRule[]> {
    return of(this.commissionRules).pipe(delay(300));
  }

  getAgentPayouts(): Observable<AgentPayout[]> {
    return of(this.agentPayouts).pipe(delay(300));
  }

  // Renewals
  getRenewals(): Observable<RenewalPolicy[]> {
    return of(this.renewalPolicies).pipe(delay(300));
  }

  // CRM
  getLeads(): Observable<CrmLead[]> {
    return of(this.leads).pipe(delay(300));
  }

  // Marketing
  getCampaigns(): Observable<MarketingCampaign[]> {
    return of(this.campaigns).pipe(delay(300));
  }

  // AI Engine
  getAiModels(): Observable<AiModel[]> {
    return of(this.aiModels).pipe(delay(300));
  }
}
