import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { LoginPage } from './feature/auth/login-page/login-page';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  // 🔐 Página de login
  {
    path: 'auth/login',
    component: LoginPage,
  },

  // 🧱 Área principal protegida
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
        data: { roles: ['Administrador','Empleado'] },
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },

  // 🚫 Rutas no encontradas
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
