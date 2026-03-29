import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'tp-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('tuszpusz');
}
