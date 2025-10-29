import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SaleWithDetails, Sale } from '../interfaces/sale';
import { SaleService } from '../services/sale.service';

@Injectable({
  providedIn: 'root'
})
export class SaleListResolver implements Resolve<SaleWithDetails[]> {
  constructor(private saleService: SaleService) {}

  resolve(): Observable<SaleWithDetails[]> {
    return this.saleService.getSales().pipe(
      map((sales: Sale[]) =>
        sales.map(sale => ({
          identifier: sale.identifier,
          code: '', // Si backend no envía code
          issueDate: sale.issueDate,
          paymentMethod: sale.paymentMethod,
          customerIdentifier: sale.customerIdentifier,
          userIdentifier: sale.userIdentifier,
          details: [] // Si backend no envía detalles
        }))
      ),
      catchError(() => of([]))
    );
  }
}
