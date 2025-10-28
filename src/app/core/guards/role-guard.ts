import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment'; 

export const roleGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  try {
    
    const user: any = await firstValueFrom(
      http.get(`${environment.urlBackEnd}/v1/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    );

    const userRole = user.role?.replace('ROLE_', '') || '';
    const allowedRoles = route.data['roles'] as string[];

    
    if (allowedRoles.includes(userRole)) {
      return true;
    } else {
      alert('Acceso denegado. No tienes permisos para esta sección.');
      router.navigateByUrl('/auth/login');
      return false;
    }
  } catch (error) {
    console.error('Error al validar rol del usuario:', error);
    router.navigateByUrl('/auth/login');
    return false;
  }
};
