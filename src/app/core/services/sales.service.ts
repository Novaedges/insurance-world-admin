import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Sale } from '../models/sale.models';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private sales: Sale[] = [
    {
      id: '1',
      policyNumber: 'POL-2023001',
      customerName: 'John Doe',
      productName: 'Comprehensive Bike Policy',
      categoryName: 'Motor Insurance',
      premiumAmount: 8500,
      discountApplied: 500,
      finalAmount: 8000,
      paymentStatus: 'Paid',
      policyStartDate: new Date('2023-01-01'),
      policyEndDate: new Date('2024-01-01'),
      agentName: 'Mike Johnson',
      saleDate: new Date('2022-12-25'),
    },
    {
      id: '2',
      policyNumber: 'POL-2023002',
      customerName: 'Alice Smith',
      productName: 'Family Health Guard',
      categoryName: 'Health Insurance',
      premiumAmount: 25000,
      discountApplied: 2000,
      finalAmount: 23000,
      paymentStatus: 'Paid',
      policyStartDate: new Date('2023-02-15'),
      policyEndDate: new Date('2024-02-14'),
      agentName: 'Sarah Wilson',
      saleDate: new Date('2023-02-10'),
    },
    {
      id: '3',
      policyNumber: 'POL-2023003',
      customerName: 'Bob Brown',
      productName: 'Travel Secure',
      categoryName: 'Travel Insurance',
      premiumAmount: 5000,
      discountApplied: 0,
      finalAmount: 5000,
      paymentStatus: 'Pending',
      policyStartDate: new Date('2023-06-01'),
      policyEndDate: new Date('2023-06-15'),
      agentName: 'Admin',
      saleDate: new Date('2023-05-28'),
    },
  ];

  getSales(): Observable<Sale[]> {
    return of([...this.sales]).pipe(delay(500));
  }

  // Mock export function
  exportSales(format: 'csv' | 'pdf' | 'excel'): Observable<boolean> {
    console.log(`Exporting sales data in ${format.toUpperCase()} format...`);
    return of(true).pipe(delay(1000));
  }
}
