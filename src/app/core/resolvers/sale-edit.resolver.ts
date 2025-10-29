import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SaleWithDetails } from '../interfaces/sale';
import { SaleService } from '../services/sale.service';

@Injectable({
  providedIn: 'root'
})
export class SaleEditResolver implements Resolve<SaleWithDetails | null> {
  constructor(private saleService: SaleService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SaleWithDetails | null> {
    const id = route.paramMap.get('id');
    if (!id) return of(null);

    return this.saleService.getSaleById(+id).pipe(
      catchError(() => of(null))
    );
  }
}
