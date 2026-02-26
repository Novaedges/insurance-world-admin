import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private apiUrl = environment.apiUrl + '/api/web/iw/module/admin/sales/report/v1';

  constructor(private http: HttpClient) {}

  getSales(
    limit: number = 10,
    skip: number = 0,
    search: string = '',
    salesExecutiveId: string = '',
  ): Observable<any> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString())
      .set('search', search);

    if (salesExecutiveId) {
      params = params.set('salesExecutiveId', salesExecutiveId);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getSaleById(id: string): Observable<any> {
    let params = new HttpParams().set('_id', id);
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Mock export function - retained for UI compatibility
  exportSales(format: 'csv' | 'pdf' | 'excel'): Observable<boolean> {
    console.log(`Exporting sales data in ${format.toUpperCase()} format...`);
    // Example: return this.http.get(`${this.apiUrl}/export?format=${format}`);
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }
}
