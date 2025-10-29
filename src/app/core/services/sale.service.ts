// src/app/core/services/sale.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Sale, SaleWithDetails, SaleDetail } from '../interfaces/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.urlBackEnd}/v1/api/sale`;

  // Obtener todas las ventas
  getSales(): Observable<SaleWithDetails[]> {
    return this.http.get<Sale[]>(this.baseUrl).pipe(
      switchMap(sales => {
        const salesWithDetails$ = sales.map(sale =>
          this.getSaleById(sale.identifier).pipe(
            map(fullSale => ({
              ...sale,
              code: fullSale.identifier.toString(),
              details: fullSale.details || []
            }))
          )
        );
        return forkJoin(salesWithDetails$);
      })
    );
  }

  // Obtener venta por ID
  getSaleById(id: number): Observable<SaleWithDetails> {
    return this.http.get<SaleWithDetails>(`${this.baseUrl}/${id}`);
  }

  // Crear venta
  createSale(sale: SaleWithDetails): Observable<Sale> {
    return this.http.post<Sale>(this.baseUrl, sale);
  }
}
