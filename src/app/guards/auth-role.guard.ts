import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export function roleGuard(requiredRole: 'Admin' | 'User'): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate([requiredRole === 'Admin' ? '/admin-login' : '/login']);
      return false;
    }

    if (!authService.hasRole(requiredRole)) {
      router.navigate(['/']);
      return false;
    }

    return true;
  };
}

export const adminGuard = roleGuard('Admin');
export const userGuard = roleGuard('User');
