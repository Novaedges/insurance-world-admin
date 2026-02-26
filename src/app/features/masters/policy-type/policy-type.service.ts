import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PolicyTypeService {
  private apiUrl = environment.apiUrl + '/api/web/iw/module/insurance/policy/type/v1';

  constructor(private http: HttpClient) {}

  getPolicyTypes(isActive?: boolean): Observable<any> {
    let params: any = {};
    if (isActive !== undefined) {
      params.isActive = isActive;
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  createPolicyType(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updatePolicyType(data: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, data);
  }

  deletePolicyType(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl, {
      body: { _id: id, isActive: false },
    });
  }
}
