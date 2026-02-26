import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RTO } from '../../../core/models/master.models';

@Injectable({
  providedIn: 'root',
})
export class RtoService {
  private apiUrl = environment.apiUrl + '/api/web/iw/module/insurance/rto/v1';

  constructor(private http: HttpClient) {}

  getRTOs(isActive?: boolean): Observable<any> {
    let params: any = {};
    if (isActive !== undefined) {
      params.isActive = isActive;
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  createRTO(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateRTO(data: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, data);
  }

  deleteRTO(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl, {
      params: { _id: id, isActive: false },
    });
  }
}
