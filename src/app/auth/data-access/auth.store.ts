import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import * as z from 'zod/mini';

import type { TokenResponse } from '@/auth/model/token-response.schema';

import { tokenResponseSchema } from '@/auth/model/token-response.schema';

const TOKEN_STORAGE_KEY = 'auth_tokens';

interface AuthState {
  accessToken: null | string;
  refreshToken: null | string;
  username: null | string;
}

function clearStoredTokens(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function loadStoredTokens(): Partial<AuthState> {
  if (typeof localStorage === 'undefined') {
    return {};
  }

  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      const parsed = z.parse(tokenResponseSchema, JSON.parse(stored)) as TokenResponse;
      return {
        accessToken: parsed.access,
        refreshToken: parsed.refresh,
        username: parsed.username,
      };
    }
  } catch {
    clearStoredTokens();
  }

  return {};
}

function persistTokens(tokens: TokenResponse): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(z.parse(tokenResponseSchema, tokens)));
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  username: null,
  ...loadStoredTokens(),
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.accessToken()),
  })),
  withMethods((store) => ({
    setTokens(tokens: TokenResponse) {
      persistTokens(tokens);
      patchState(store, {
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
        username: tokens.username,
      });
    },
    clearAuth() {
      clearStoredTokens();
      patchState(store, {
        accessToken: null,
        refreshToken: null,
        username: null,
      });
    },
  })),
);
