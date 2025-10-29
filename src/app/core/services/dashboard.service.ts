import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = environment.urlBackEnd;

  constructor(private http: HttpClient) {}

  getTotalSales(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/v1/api/sale/total`);
  }

  getSupplierCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/v1/api/supplier/count`);
  }

  getActiveProductCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/v1/api/product/count/active`);
  }

  getPurchaseCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/v1/api/buy/count`);
  }

}
