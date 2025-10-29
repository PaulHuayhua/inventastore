import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./buy-list/buy-list').then(c => c.BuyList)
  },
  {
    path: 'form', // Creación de nueva compra
    loadComponent: () => import('./buy-form/buy-form').then(c => c.BuyForm)
  },
  {
    path: 'form/:id', // Edición o ver detalle
    loadComponent: () => import('./buy-form/buy-form').then(c => c.BuyForm)
  }
];
