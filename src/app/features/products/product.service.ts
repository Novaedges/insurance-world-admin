import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/api/web/iw/module/insurance/policy/v1';

  constructor(private http: HttpClient) {}

  getProducts(isActive?: boolean): Observable<any> {
    let params: any = {};
    if (isActive !== undefined) {
      params.isActive = isActive;
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
