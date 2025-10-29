// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { Sale } from '../interfaces/sale';
import { Buy, BuyDetail } from '../interfaces/buy';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = `${environment.urlBackEnd}/v1/api/notifications`;

  constructor(private http: HttpClient) {}

  getLowStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock`);
  }

  getExpiringSoon(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/expiring`);
  }

  getRecentSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/recent-sales`);
  }

  getLastPurchase(): Observable<Buy> {
    return this.http.get<Buy>(`${this.apiUrl}/last-buy`);
  }
}
