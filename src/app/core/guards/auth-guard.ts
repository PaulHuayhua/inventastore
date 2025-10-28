import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  console.log('[authGuard] destino:', state.url);
  console.log('[authGuard] token en localStorage:', token);

  if (isLoggedIn) {
    return true;
  } else {
    // 👇 Redirige al login y conserva la ruta original en returnUrl
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
};
