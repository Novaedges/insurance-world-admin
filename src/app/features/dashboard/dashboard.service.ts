import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getDashboardData(startDate: string, endDate: string): Observable<any> {
    // startDate and endDate should be in YYYYMMDD format
    return this.http.get<any>(`${environment.apiUrl}/api/web/iw/module/admin/dashboard/v1`, {
      params: { startDate, endDate },
    });
  }
}
