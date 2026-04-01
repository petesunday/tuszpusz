import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { authInterceptor } from '@/auth/data-access/auth.interceptor';
import { API_URL } from '@/shared/util/api-url.token';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideZard } from './core/providers/provide-zard/providezard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZonelessChangeDetection(),
    provideZard(),
    { provide: API_URL, useValue: environment.apiUrl },
  ],
};
