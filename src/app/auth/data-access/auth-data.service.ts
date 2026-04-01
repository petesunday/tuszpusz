import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import * as z from 'zod/mini';

import type { LoginRequest } from '@/auth/model/login-request.schema';
import type { LogoutRequest } from '@/auth/model/logout-request.schema';
import type { MessageResponse } from '@/auth/model/message-response.schema';
import type { PasswordChangeRequest } from '@/auth/model/password-change-request.schema';
import type { RefreshTokenRequest } from '@/auth/model/refresh-token-request.schema';

import { loginRequestSchema } from '@/auth/model/login-request.schema';
import { logoutRequestSchema } from '@/auth/model/logout-request.schema';
import { messageResponseSchema } from '@/auth/model/message-response.schema';
import { passwordChangeRequestSchema } from '@/auth/model/password-change-request.schema';
import { refreshTokenRequestSchema } from '@/auth/model/refresh-token-request.schema';
import { tokenResponseSchema } from '@/auth/model/token-response.schema';
import { API_URL } from '@/shared/util/api-url.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_URL)}/auth`;

  login(request: LoginRequest) {
    const payload = z.parse(loginRequestSchema, request);

    return this.http
      .post<unknown>(`${this.baseUrl}/login`, payload)
      .pipe(map((response) => z.parse(tokenResponseSchema, response)));
  }

  refreshToken(request: RefreshTokenRequest) {
    const payload = z.parse(refreshTokenRequestSchema, request);

    return this.http
      .post<unknown>(`${this.baseUrl}/refresh-token`, payload)
      .pipe(map((response) => z.parse(tokenResponseSchema, response)));
  }

  logout(request: LogoutRequest) {
    const payload = z.parse(logoutRequestSchema, request);

    return this.http
      .post<unknown>(`${this.baseUrl}/logout`, payload)
      .pipe(map((response) => z.parse(messageResponseSchema, response) as MessageResponse));
  }

  changePassword(request: PasswordChangeRequest) {
    const payload = z.parse(passwordChangeRequestSchema, request);

    return this.http
      .post<unknown>(`${this.baseUrl}/change-password`, payload)
      .pipe(map((response) => z.parse(messageResponseSchema, response) as MessageResponse));
  }
}
