import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InquiryService {
  private apiUrl = environment.apiUrl + '/api/web/iw/module/admin/inquiry/v1';

  constructor(private http: HttpClient) {}

  getInquiries(limit: number = 10, skip: number = 0, status: string[] = []): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString()).set('skip', skip.toString());

    if (status && status.length > 0) {
      params = params.set('status', JSON.stringify(status));
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getInquiryById(id: string): Observable<any> {
    let params = new HttpParams().set('_id', id);
    return this.http.get<any>(this.apiUrl, { params });
  }

  assignSalesPerson(inquiryId: string, salesExecutiveId: string): Observable<any> {
    return this.http.put<any>(this.apiUrl, {
      _id: inquiryId,
      salesExecutiveId: salesExecutiveId,
    });
  }

  updateInquiryStatus(payload: {
    _id: string;
    status: string;
    policyTypeId?: string;
    policyId?: string;
    sellingPrice?: number;
  }): Observable<any> {
    return this.http.patch<any>(this.apiUrl, payload);
  }
}
