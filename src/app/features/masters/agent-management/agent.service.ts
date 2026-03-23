import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  constructor(private http: HttpClient) {}

  getAgents(isActive?: boolean, limit?: number, skip?: number): Observable<any> {
    let params = new HttpParams();
    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    if (skip !== undefined) {
      params = params.set('skip', skip.toString());
    }
    if (isActive !== undefined) {
      params = params.set('isActive', isActive.toString());
    }
    return this.http.get<any>(environment.apiUrl + '/api/web/iw/module/insurance/agent/v1', {
      params,
    });
  }

  getAgentById(id: string): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/api/web/iw/module/insurance/agent/v1', {
      params: { _id: id },
    });
  }

  createAgent(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/web/iw/module/insurance/agent/v1', data);
  }

  updateAgent(data: any): Observable<any> {
    return this.http.put<any>(environment.apiUrl + '/api/web/iw/module/insurance/agent/v1', data);
  }

  deleteAgent(data: any): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + '/api/web/iw/module/insurance/agent/v1', {
      body: data,
    });
  }
}
