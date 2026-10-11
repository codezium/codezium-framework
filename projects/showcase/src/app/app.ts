import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  CzConfirmDialogComponent,
  CzConfirmPopupComponent,
  CzDynamicDialogComponent,
  CzToastComponent,
} from 'codezium-ui';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CzToastComponent,
    CzConfirmDialogComponent,
    CzConfirmPopupComponent,
    CzDynamicDialogComponent,
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('showcase');

  constructor() {
    // Initialize appearance at boot for every route (dark is the corporate default)
    inject(ThemeService);
  }
}
