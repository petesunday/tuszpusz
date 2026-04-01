import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '@/auth/data-access/auth-data.service';
import { AuthStore } from '@/auth/data-access/auth.store';
import { ZardButtonComponent } from '@/shared/ui/button';
import { ZardCardComponent } from '@/shared/ui/card';
import { ZardCheckboxComponent } from '@/shared/ui/checkbox';
import { ZardInputDirective } from '@/shared/ui/input';

import { LoginFormModel } from '../../model/login-form';

@Component({
  selector: 'tp-login-page',
  imports: [
    FormField,
    ZardButtonComponent,
    ZardCardComponent,
    ZardCheckboxComponent,
    ZardInputDirective,
    NgIcon,
  ],
  template: `
    <div class="flex min-h-screen items-center justify-center p-4">
      <z-card
        class="w-full max-w-md"
        zTitle="Login"
        zDescription="Enter your credentials to access your account"
      >
        <form (submit.prevent)="onSubmit()">
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium" for="username">Username</label>
              <input
                [formField]="loginForm.username"
                zInput
                id="username"
                type="text"
                placeholder="Enter your username"
                autocomplete="username"
                [attr.aria-invalid]="showUsernameErrors() || null"
                [attr.aria-describedby]="showUsernameErrors() ? 'username-error' : null"
              />
              @if (showUsernameErrors()) {
                <div id="username-error" class="flex flex-col gap-1" role="alert">
                  @for (error of loginForm.username().errors(); track $index) {
                    <p class="text-destructive text-sm">{{ error.message }}</p>
                  }
                </div>
              }
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium" for="password">Password</label>
              <div class="relative">
                <input
                  [formField]="loginForm.password"
                  zInput
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  class="pr-10"
                  [attr.aria-invalid]="showPasswordErrors() || null"
                  [attr.aria-describedby]="showPasswordErrors() ? 'password-error' : null"
                />
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  (click)="showPassword.set(!showPassword())"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                >
                  <ng-icon [name]="showPassword() ? 'lucideEyeOff' : 'lucideEye'" size="16" />
                </button>
              </div>
              @if (showPasswordErrors()) {
                <div id="password-error" class="flex flex-col gap-1" role="alert">
                  @for (error of loginForm.password().errors(); track $index) {
                    <p class="text-destructive text-sm">{{ error.message }}</p>
                  }
                </div>
              }
            </div>

            <z-checkbox [formField]="loginForm.rememberMe">Remember me</z-checkbox>

            @if (formErrorMessage(); as message) {
              <p class="text-destructive text-sm" role="alert">{{ message }}</p>
            }

            <button
              z-button
              type="submit"
              zFull
              zSize="lg"
              [zLoading]="isSubmitting()"
              [zDisabled]="loginForm().invalid() || isSubmitting()"
            >
              @if (isSubmitting()) {
                Signing in...
              } @else {
                Sign in
              }
            </button>
          </div>
        </form>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideEye, lucideEyeOff })],
})
export default class LoginPageComponent {
  protected readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly showPassword = signal(false);
  private readonly loginModel = signal<LoginFormModel>({
    password: '',
    rememberMe: false,
    username: '',
  });

  protected readonly loginForm = form(this.loginModel, (login) => {
    required(login.username, { message: 'Username is required.' });
    minLength(login.username, 3, { message: 'Username must be at least 3 characters.' });
    maxLength(login.username, 50, { message: 'Username must be at most 50 characters.' });

    required(login.password, { message: 'Password is required.' });
    minLength(login.password, 6, { message: 'Password must be at least 6 characters.' });
    maxLength(login.password, 50, { message: 'Password must be at most 50 characters.' });
  });

  protected readonly formErrorMessage = computed(() => {
    const error = this.loginForm().errors()[0];
    return error?.message ?? null;
  });

  protected readonly showPasswordErrors = computed(
    () => this.loginForm.password().touched() && this.loginForm.password().invalid(),
  );

  protected readonly showUsernameErrors = computed(
    () => this.loginForm.username().touched() && this.loginForm.username().invalid(),
  );

  protected async onSubmit(): Promise<void> {
    await submit(this.loginForm, async (field) => {
      const { password, rememberMe, username } = field().value();

      this.isSubmitting.set(true);

      try {
        const tokens = await firstValueFrom(
          this.authService.login({ password, remember_me: rememberMe, username }),
        );

        this.authStore.setTokens(tokens);
        await this.router.navigate(['/']);
        return undefined;
      } catch (err: unknown) {
        return [this.toAuthError(err)];
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }

  private toAuthError(err: unknown): { kind: 'auth'; message: string } {
    const httpErr = err as { error?: { detail?: string } };
    const detail = httpErr.error?.detail ?? 'error.unknown';

    const messages: Record<string, string> = {
      'error.login.accountLocked': 'Your account has been locked. Please contact support.',
      'error.login.invalidCredentials': 'Invalid username or password.',
    };

    return {
      kind: 'auth',
      message: messages[detail] ?? 'An unexpected error occurred. Please try again.',
    };
  }
}
