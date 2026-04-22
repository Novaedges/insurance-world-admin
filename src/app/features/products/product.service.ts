import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/api/web/iw/module/insurance/policy/v1';

  constructor(private http: HttpClient) {}

  getProducts(isActive?: boolean, limit?: number, skip?: number): Observable<any> {
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
    return this.http.get<any>(this.apiUrl, { params });
  }

  downloadProducts(isActive?: boolean): Observable<Blob> {
    let params = new HttpParams();
    if (isActive !== undefined) {
      params = params.set('isActive', isActive.toString());
    }
    params = params.set('download', '1');
    return this.http.get(this.apiUrl, { params, responseType: 'blob' });
  }

  saveProduct(data: FormData): Observable<any> {
    const id = data.get('_id');
    if (id) {
      return this.http.put<any>(this.apiUrl, data);
    } else {
      return this.http.post<any>(this.apiUrl, data);
    }
  }
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      params: { _id: id },
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl, {
      params: { _id: id, isActive: false },
    });
  }
}
