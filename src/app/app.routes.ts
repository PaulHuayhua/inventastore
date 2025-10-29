import { Routes } from '@angular/router';
import { SaleListResolver } from '../app/core/resolvers/sale.resolver';
import { SaleEditResolver } from '../app/core/resolvers/sale-edit.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature/sale/sale-list/sale-list.component').then(c => c.SaleListComponent),
    resolve: { sales: SaleListResolver }
  },
  {
    path: 'form',
    loadComponent: () =>
      import('./feature/sale/sale-form/sale-form.component').then(c => c.SaleFormComponent)
  },
  {
    path: 'form/:id',
    loadComponent: () =>
      import('./feature/sale/sale-form/sale-form.component').then(c => c.SaleFormComponent),
    resolve: { sale: SaleEditResolver }
  }
];
