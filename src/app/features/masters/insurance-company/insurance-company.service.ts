import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InsuranceCompanyService {
  private apiUrl = environment.apiUrl + '/api/web/iw/module/company/reg/v1';

  constructor(private http: HttpClient) {}

  getCompanies(isActive?: boolean, limit: number = 10, skip: number = 0): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString()).set('skip', skip.toString());

    if (isActive !== undefined) {
      params = params.set('isActive', isActive.toString());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  createCompany(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateCompany(data: any): Observable<any> {
    if (data._id && !data.companyId) {
      data.companyId = data._id;
    }
    return this.http.put<any>(this.apiUrl, data);
  }

  deleteCompany(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl, {
      params: { _id: id, isActive: false },
    });
  }
}
