import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthStore } from '@/auth/data-access/auth.store';
import { ZardButtonComponent } from '@/shared/ui/button';
import { ZardCardComponent } from '@/shared/ui/card';

@Component({
  selector: 'tp-home-page',
  imports: [ZardButtonComponent, ZardCardComponent],
  template: `
    <div class="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <z-card class="w-full max-w-md" zTitle="Welcome" zDescription="You are logged in">
        <div class="flex flex-col gap-4">
          <p class="text-muted-foreground text-sm">
            Hello, <span class="text-foreground font-medium">{{ authStore.username() }}</span>
          </p>
          <button z-button zType="outline" zFull (click)="logout()">Sign out</button>
        </div>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected logout(): void {
    this.authStore.clearAuth();
    this.router.navigate(['/auth/login']);
  }
}
