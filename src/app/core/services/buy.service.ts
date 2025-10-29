import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Buy } from '../interfaces/buy';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  private http = inject(HttpClient);
  private urlBackEnd = `${environment.urlBackEnd}/v1/api/buy`;

  private selectedBuySubject = new BehaviorSubject<Buy | null>(null);
  selectedBuy$ = this.selectedBuySubject.asObservable();

  setSelectedBuy(buy: Buy | null): void {
    this.selectedBuySubject.next(buy);
  }

  findAll() {
    return this.http.get<Buy[]>(this.urlBackEnd);
  }

  save(buy: Buy) {
    return this.http.post<Buy>(`${this.urlBackEnd}/save`, buy);
  }

  update(buy: Buy) {
    return this.http.put<Buy>(`${this.urlBackEnd}/update`, buy);
  }

  findById(identifier: number) {
    return this.http.get<Buy>(`${this.urlBackEnd}/${identifier}`);
  }

  reportPdf(id: number) {
    return this.http.get(`${this.urlBackEnd}/pdf/${id}`, {
      responseType: 'blob'
    });
  }
}