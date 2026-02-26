import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminCreationService {
  public static dialogResult = false;
  public static rowId = null;
  public static productName = null;
  headers: any;

  constructor(private http: HttpClient) {}

  getAdmins(isActive?: boolean): Observable<any> {
    let params: any = {};
    if (isActive !== undefined) {
      params.active = isActive;
    }
    return this.http.get<any>(environment.apiUrl + '/api/web/iw/module/admin/v1', { params });
  }

  getAdminById(_id: string): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/api/web/iw/module/admin/v1', {
      params: { _id },
    });
  }

  createAdmin(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/web/iw/module/admin/v1', data);
  }

  updateAdmin(data: any): Observable<any> {
    return this.http.put<any>(environment.apiUrl + '/api/web/iw/module/admin/v1', data);
  }

  updatePassword(data: any): Observable<any> {
    return this.http.patch<any>(environment.apiUrl + '/api/web/iw/module/admin/v1', data);
  }

  deleteAdmin(data: any): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + '/api/web/iw/module/admin/v1', {
      params: data,
    });
  }
}
