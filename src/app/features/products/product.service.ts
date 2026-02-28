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

  getProducts(isActive?: boolean, limit: number = 10, skip: number = 0): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString()).set('skip', skip.toString());

    if (isActive !== undefined) {
      params = params.set('isActive', isActive.toString());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  saveProduct(data: any): Observable<any> {
    if (data._id) {
      // Ensure 'id' is not sent to avoid backend conflicts
      const { id, ...updateData } = data;
      return this.http.put<any>(this.apiUrl, updateData);
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
