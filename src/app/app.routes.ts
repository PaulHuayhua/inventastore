import { Routes } from '@angular/router';
import { SaleListResolver } from '../../core/resolvers/sale.resolver';
import { SaleEditResolver } from '../../core/resolvers/sale-edit.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./sale-list/sale-list.component').then(c => c.SaleListComponent),
    resolve: { sales: SaleListResolver }
  },
  {
    path: 'form',
    loadComponent: () =>
      import('./sale-form/sale-form.component').then(c => c.SaleForm)
  },
  {
    path: 'form/:id',
    loadComponent: () =>
      import('./sale-form/sale-form.component').then(c => c.SaleForm),
    resolve: { sale: SaleEditResolver }
  }
];
