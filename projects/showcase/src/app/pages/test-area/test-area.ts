import { ChangeDetectionStrategy, Component, inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CzInputTextComponent, CzValidationLocale } from 'codezium-ui';

interface TestForm {
  email: FormControl<string | null>;
  username: FormControl<string | null>;
  disabledField: FormControl<string | null>;
}

@Component({
  selector: 'app-test-area',
  imports: [ReactiveFormsModule, FormsModule, CzInputTextComponent],
  templateUrl: './test-area.html',
  styleUrl: './test-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestArea {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  testForm = new FormGroup<TestForm>({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    disabledField: new FormControl({ value: 'Cannot edit me', disabled: true }),
  });

  // State Signals (can be bound to the header toggles)
  isDarkMode = false;
  activeTheme = 'base'; // 'base', 'glass', 'neo'
  activeLocale: CzValidationLocale = 'en';

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(this.document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(this.document.documentElement, 'dark');
    }
  }

  setTheme(theme: string) {
    this.activeTheme = theme;
    this.renderer.setAttribute(this.document.documentElement, 'data-theme', theme);
  }

  setLocale(locale: string) {
    this.activeLocale = locale as CzValidationLocale;
    // We mark the form controls as touched and update their value and validity so the error messages refresh instantly.
    Object.values(this.testForm.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }
}
