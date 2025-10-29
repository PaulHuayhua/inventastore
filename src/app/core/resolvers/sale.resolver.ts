import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SaleWithDetails } from '../interfaces/sale';
import { SaleService } from '../services/sale.service';

@Injectable({
  providedIn: 'root'
})
export class SaleListResolver implements Resolve<SaleWithDetails[]> {
  constructor(private saleService: SaleService) {}

  resolve(): Observable<SaleWithDetails[]> {
    return this.saleService.getSales();
  }
}
