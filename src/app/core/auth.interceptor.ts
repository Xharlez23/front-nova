import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

// Agrega el token a cada petición y cierra la sesión si el servidor dice que expiró
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;
  const request = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(request).pipe(catchError((e: HttpErrorResponse) => {
    if (e.status === 401 && token && !req.url.includes('/auth/')) auth.logout('/login');
    return throwError(() => e);
  }));
};
