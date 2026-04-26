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
    startDate: string = '',
    endDate: string = '',
  ): Observable<any> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString())
      .set('search', search);

    if (salesExecutiveId) {
      params = params.set('salesExecutiveId', salesExecutiveId);
    }
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getSaleById(id: string): Observable<any> {
    let params = new HttpParams().set('_id', id);
    return this.http.get<any>(this.apiUrl, { params });
  }

  downloadSalesReportExcel(
    search: string = '',
    salesExecutiveId: string = '',
    startDate: string = '',
    endDate: string = '',
  ): Observable<any> {
    const url = environment.apiUrl + '/api/web/iw/module/admin/sales/report/download/v1';
    let params = new HttpParams().set('search', search);

    if (salesExecutiveId) {
      params = params.set('salesExecutiveId', salesExecutiveId);
    }
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<any>(url, { params });
  }
}
