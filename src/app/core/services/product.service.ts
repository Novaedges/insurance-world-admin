import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '../models/product.models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      name: 'Comprehensive Bike Policy',
      description: 'Full coverage for your two-wheeler',
      insuranceCategoryId: '1',
      insuranceCategoryName: 'Motor Insurance',
      childCategoryId: '1',
      childCategoryName: 'Bike Insurance',
      makeId: '1',
      makeName: 'Honda',
      modelId: '1',
      modelName: 'City',
      basePrice: 8500,
      discountType: 'Percentage',
      discountValue: 10,
      finalPrice: 7650,
      policyDuration: '1 Year',
      termsAndConditions: 'Standard T&C apply.',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Family Health Guard',
      description: 'Medical coverage for family of 4',
      insuranceCategoryId: '2',
      insuranceCategoryName: 'Health Insurance',
      childCategoryId: '3',
      childCategoryName: 'Family Floater',
      basePrice: 25000,
      discountType: 'Flat',
      discountValue: 2000,
      finalPrice: 23000,
      policyDuration: '1 Year',
      termsAndConditions: 'Waiting period 30 days.',
      status: 'Active',
    },
  ];

  getProducts(): Observable<Product[]> {
    return of([...this.products]).pipe(delay(500));
  }

  saveProduct(product: Product): Observable<Product> {
    if (product.id) {
      const index = this.products.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        this.products[index] = product;
      }
    } else {
      product.id = (this.products.length + 1).toString();
      this.products.push(product);
    }
    return of(product);
  }

  deleteProduct(id: string): Observable<boolean> {
    this.products = this.products.filter((p) => p.id !== id);
    return of(true).pipe(delay(500));
  }
}
