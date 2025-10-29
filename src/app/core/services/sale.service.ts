import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Sale, SaleWithDetails, SaleCreate } from '../interfaces/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private http = inject(HttpClient);
  private urlBackEnd = `${environment.urlBackEnd}/v1/api/sale`;

  // Para compartir la venta seleccionada entre componentes
  private selectedSaleSubject = new BehaviorSubject<SaleWithDetails | null>(null);
  selectedSale$ = this.selectedSaleSubject.asObservable();

  setSelectedSale(sale: SaleWithDetails | null): void {
    this.selectedSaleSubject.next(sale);
  }

  // Obtener todas las ventas con detalles
  getSales(): Observable<SaleWithDetails[]> {
    return this.http.get<SaleWithDetails[]>(this.urlBackEnd);
  }

  // Obtener una venta por su ID
  getSaleById(id: number): Observable<SaleWithDetails> {
    return this.http.get<SaleWithDetails>(`${this.urlBackEnd}/${id}`);
  }

  // Registrar una nueva venta
  createSale(sale: SaleCreate): Observable<SaleWithDetails> {
    return this.http.post<SaleWithDetails>(`${this.urlBackEnd}/save`, sale);
  }

  // Actualizar una venta existente
  updateSale(id: number, sale: SaleCreate): Observable<SaleWithDetails> {
    return this.http.put<SaleWithDetails>(`${this.urlBackEnd}/update/${id}`, sale);
  }

  // Generar PDF de una venta
  reportPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.urlBackEnd}/pdf/${id}`, { responseType: 'blob' });
  }
}
