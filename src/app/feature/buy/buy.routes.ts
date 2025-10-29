import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'form',           // Para creación de nueva compra
    loadComponent: () => import('./buy-form/buy-form').then(c => c.BuyForm)
  },
  {
    path: 'form/:id',       // Para editar o ver detalles
    loadComponent: () => import('./buy-form/buy-form').then(c => c.BuyForm)
  }
]