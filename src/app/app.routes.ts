import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { LoginPage } from './feature/auth/login-page/login-page';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginPage
  },
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard], // protege todo el layout
    children: [
      {
        path: 'buys',
        loadChildren: () => import('./feature/buy/buy.routes').then(m => m.routes),
        data: { roles: ['Administrador'] },
        canActivate: [roleGuard]
      },
      {
        path: 'suppliers',
        loadChildren: () => import('./feature/supplier/supplier.routes').then(m => m.routes),
        data: { roles: ['Administrador'] },
        canActivate: [roleGuard]
      },
      {
        path: 'products',
        loadChildren: () => import('./feature/product/product.routes').then(m => m.routes),
        data: { roles: ['Administrador'] },
        canActivate: [roleGuard]
      },
      {
        path: 'sales',
        loadChildren: () => import('./feature/sale/sales.routes').then(m => m.routes),
        data: { roles: ['Administrador'] },
        canActivate: [roleGuard]
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
