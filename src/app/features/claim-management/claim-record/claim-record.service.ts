import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClaimRecordService {
  private http = inject(HttpClient);

  getClaims(limit: number = 10, skip: number = 0, status: string[] = ['PENDING']): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/web/iw/module/claim/v1`, {
      params: {
        limit: limit.toString(),
        skip: skip.toString(),
        status: JSON.stringify(status),
      },
    });
  }

  updateClaimStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/web/iw/module/claim/v1`, {
      _id: id,
      status: status,
    });
  }
}
