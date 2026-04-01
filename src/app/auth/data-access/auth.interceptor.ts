import { type HttpHandlerFn, type HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from './auth-data.service';
import { AuthStore } from './auth.store';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authStore.accessToken();

  const authReq = accessToken ? addAuthHeader(req, accessToken) : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      const httpError = error as { status?: number };
      if (httpError.status === 401 && !req.url.includes('/auth/')) {
        return handleUnauthorized(req, next, authStore, authService, router);
      }
      return throwError(() => error);
    }),
  );
};

function addAuthHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function handleUnauthorized(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authStore: InstanceType<typeof AuthStore>,
  authService: AuthService,
  router: Router,
) {
  const refreshToken = authStore.refreshToken();

  if (!refreshToken || isRefreshing) {
    authStore.clearAuth();
    router.navigate(['/auth/login']);
    return throwError(() => new Error('Session expired'));
  }

  isRefreshing = true;

  return authService.refreshToken({ refresh: refreshToken }).pipe(
    switchMap((tokens) => {
      isRefreshing = false;
      authStore.setTokens(tokens);
      return next(addAuthHeader(req, tokens.access));
    }),
    catchError((err: unknown) => {
      isRefreshing = false;
      authStore.clearAuth();
      router.navigate(['/auth/login']);
      return throwError(() => err);
    }),
  );
}
