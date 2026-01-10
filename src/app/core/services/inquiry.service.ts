import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Inquiry } from '../models/inquiry.models';

@Injectable({
  providedIn: 'root',
})
export class InquiryService {
  private inquiries: Inquiry[] = [
    {
      id: '101',
      source: 'Web',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+1 234 567 890',
      productId: '1',
      productName: 'Comprehensive Bike Policy',
      categoryName: 'Motor Insurance',
      vehicleDetails: 'Honda City, 2018',
      preferredTime: 'Morning (10-12)',
      status: 'New',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '102',
      source: 'App',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      customerPhone: '+1 987 654 321',
      productId: '2',
      productName: 'Family Health Guard',
      categoryName: 'Health Insurance',
      healthDetails: 'Family of 4, Eldest 45',
      preferredTime: 'Evening (6-8)',
      status: 'Contacted',
      assignedTo: 'Mike Johnson',
      assignedToInitials: 'MJ',
      createdAt: new Date(Date.now() - 86400000), // Yesterday
      updatedAt: new Date(),
    },
  ];

  getInquiries(): Observable<Inquiry[]> {
    return of([...this.inquiries]).pipe(delay(500));
  }

  getInquiryById(id: string): Observable<Inquiry | undefined> {
    return of(this.inquiries.find((i) => i.id === id)).pipe(delay(500));
  }

  saveInquiry(inquiry: Inquiry): Observable<Inquiry> {
    const index = this.inquiries.findIndex((i) => i.id === inquiry.id);
    if (index !== -1) {
      this.inquiries[index] = { ...inquiry, updatedAt: new Date() };
    } else {
      inquiry.id = (100 + this.inquiries.length + 1).toString();
      inquiry.createdAt = new Date();
      inquiry.updatedAt = new Date();
      this.inquiries.push(inquiry);
    }
    return of(inquiry).pipe(delay(500));
  }
}
