import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { LoginPage } from './feature/auth/login-page/login-page';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginPage,
  },
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    canActivateChild: [roleGuard],
    children: [
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./feature/supplier/supplier.routes').then((m) => m.routes),
        data: { roles: ['Administrador'] },
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./feature/product/product.routes').then((m) => m.routes),
        data: { roles: ['Administrador'] },
      },
      {
        path: 'buys',
        loadChildren: () =>
          import('./feature/buy/buy.routes').then((m) => m.routes),
        data: { roles: ['Administrador'] },
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./feature/sale/sales.routes').then((m) => m.routes),
        data: { roles: ['Administrador'] },
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];