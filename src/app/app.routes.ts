import { Routes } from '@angular/router';

import { authGuard, guestGuard } from '@/auth/data-access/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./auth/feature/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./home/feature/home.routes').then((m) => m.homeRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
