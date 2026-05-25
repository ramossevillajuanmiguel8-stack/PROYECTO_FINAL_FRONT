import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.estaLogueado) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.esAdmin()) {
    router.navigate(['/no-autorizado']);
    return false;
  }
  return true;
};

export const adminOpGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.esAdminOp()) {
    router.navigate(['/no-autorizado']);
    return false;
  }
  return true;
};

export const operarioGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.esOperario()) {
    router.navigate(['/no-autorizado']);
    return false;
  }
  return true;
};

export const clienteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.esCliente()) {
    router.navigate(['/no-autorizado']);
    return false;
  }
  return true;
};