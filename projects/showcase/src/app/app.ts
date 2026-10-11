import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  CzConfirmDialogComponent,
  CzConfirmPopupComponent,
  CzDynamicDialogComponent,
  CzToastComponent,
} from 'codezium-ui';

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
}
