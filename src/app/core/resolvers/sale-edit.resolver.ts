import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SaleWithDetails } from '../interfaces/sale';
import { SaleService } from '../services/sale.service';

@Injectable({
  providedIn: 'root'
})
export class SaleEditResolver implements Resolve<SaleWithDetails> {
  constructor(private saleService: SaleService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SaleWithDetails> {
    const id = Number(route.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['sales']);
      return EMPTY;
    }

    return this.saleService.getSaleById(id).pipe(
      catchError(() => {
        this.router.navigate(['sales']);
        return EMPTY;
      })
    );
  }
}
