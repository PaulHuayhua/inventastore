import { CanActivateFn } from '@angular/router';

export const workingHoursGuard: CanActivateFn = () => {
  const hora = new Date().getHours();

  if (hora >= 8 && hora <= 22) {
    console.log('✅ Acceso permitido: dentro del horario laboral.');
    return true;
  } else {
    alert('⏰ Solo puedes acceder durante el horario laboral (8:00 AM - 6:00 PM).');
    console.warn('❌ Acceso denegado: fuera del horario laboral.');
    return false;
  }
};
