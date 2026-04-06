import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BannerApiResponse } from '../../../../core/models/banner.models';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private apiUrl = environment.apiUrl + '/api/web/iw/module/admin/settings/banner/v1';

  constructor(private http: HttpClient) {}

  getBanners(
    isActive: boolean = true,
    limit: number = 10,
    skip: number = 0,
    id?: string,
  ): Observable<BannerApiResponse> {
    let params = new HttpParams()
      .set('isActive', isActive.toString())
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    if (id) {
      params = params.set('_id', id);
    }

    return this.http.get<BannerApiResponse>(this.apiUrl, { params });
  }

  createBanner(data: FormData): Observable<BannerApiResponse> {
    return this.http.post<BannerApiResponse>(this.apiUrl, data);
  }

  updateBanner(data: FormData): Observable<BannerApiResponse> {
    return this.http.put<BannerApiResponse>(this.apiUrl, data);
  }

  toggleBannerStatus(id: string, isActive: boolean): Observable<BannerApiResponse> {
    const params = new HttpParams().set('_id', id).set('isActive', isActive.toString());

    return this.http.delete<BannerApiResponse>(this.apiUrl, { params });
  }
}
