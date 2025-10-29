// src/app/core/resolvers/buy.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BuyService } from '../services/buy.service';
import { Buy } from '../interfaces/buy';

@Injectable({
  providedIn: 'root'
})
export class BuyResolver implements Resolve<Buy[]> {

  constructor(private buyService: BuyService) {}

  resolve(): Observable<Buy[]> {
    return this.buyService.findAll().pipe(
      catchError((error) => {
        console.error('Error al cargar compras:', error);
        return of([]); // Retorna un array vacío si falla
      })
    );
  }
}
