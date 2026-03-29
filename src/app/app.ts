import { Component, signal } from '@angular/core';

@Component({
  selector: 'tp-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('tuszpusz');
}
