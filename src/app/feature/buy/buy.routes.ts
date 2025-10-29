import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () => import('./buy-list/buy-list').then(c => c.BuyList)
  },
  {
    path: 'form/:id',
    loadComponent: () => import('./buy-form/buy-form').then(c => c.BuyForm)
  }
]