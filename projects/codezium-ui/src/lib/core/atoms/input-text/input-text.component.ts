import {
  Component,
  input,
  computed,
  Optional,
  Self,
  ViewEncapsulation,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';
import { CzInputSize, CzLabelPosition, CzInputColor } from '../../types';

@Component({
  selector: 'cz-input-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="cz-input-wrapper"
      [class.cz-input-fluid]="fluid()"
      [class.cz-input-filled]="filled()"
      [class.cz-input-disabled]="actualDisabled()"
      [class.cz-input-has-error]="isInvalid"
      [class.cz-input-focused]="isFocused()"
      [attr.data-size]="size()"
      [attr.data-label-position]="labelPosition()"
      [attr.data-color]="color() || null"
    >
      @if (label() && labelPosition() === 'none') {
        <label class="cz-input-label-static">{{ label() }}</label>
      }

      <div class="cz-input-container" [class.cz-float-active]="isFocused() || hasValue()">
        <input
          [type]="type()"
          [placeholder]="actualPlaceholder()"
          [disabled]="actualDisabled()"
          [value]="value()"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          class="cz-input-native"
          [class.cz-has-value]="hasValue()"
        />

        @if (label()) {
            @if (labelPosition() === 'over') {
              <label class="cz-input-label-over">{{ label() }}</label>
            } @else if (labelPosition() === 'in' || labelPosition() === 'float') {
              <label class="cz-input-label-inner">{{ label() }}</label>
            }
        }
      </div>

      <!-- Ayuda y Mensajes de Validación Automáticos / Dinámicos -->
      <div class="cz-input-messages">
        @if (showErrors() && isInvalid && errorMessage) {
          <small class="cz-input-error-text">{{ errorMessage }}</small>
        }
        
        <!-- Slot para que el usuario inyecte sus propios mensajes de error (ignorando el auto) -->
        <ng-content select="[czError]"></ng-content>

        @if (helpText()) {
          <small class="cz-input-help-text">{{ helpText() }}</small>
        }

        <!-- Slot para que el usuario inyecte su propia ayuda dinámica -->
        <ng-content select="[czHelp]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./input-text.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CzInputTextComponent implements ControlValueAccessor {
  // Inputs definidos usando Signals (Angular 17/20+)
  label = input<string>('');
  labelPosition = input<CzLabelPosition>('none');
  size = input<CzInputSize>('md');
  color = input<CzInputColor>('');
  filled = input<boolean>(false);
  fluid = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  type = input<string>('text');
  helpText = input<string>('');

  // Permite al usuario desactivar los mensajes embebidos generados automáticamente (default: true)
  showErrors = input<boolean>(true);

  // Sistema de Internacionalización y Sobrescritura de mensajes
  locale = input<CzValidationLocale>('es');
  customErrors = input<Partial<CzValidationErrorKeys>>();

  // Estados Locales Reactivos
  value = signal<string>('');
  isFocused = signal<boolean>(false);
  formsDisabled = signal<boolean>(false);

  // Computeds inteligentes
  actualDisabled = computed(() => this.disabled() || this.formsDisabled());
  hasValue = computed(() => {
    const v = this.value();
    return v !== null && v !== undefined && v.toString().length > 0;
  });

  actualPlaceholder = computed(() => {
    const positionsToHide: CzLabelPosition[] = ['float', 'in', 'over'];
    if (positionsToHide.includes(this.labelPosition()) && this.label()) {
      return (this.isFocused() || this.hasValue()) ? this.placeholder() : '';
    }
    return this.placeholder();
  });

  // Callbacks del ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl != null) {
      // Configuramos este componente como el valueAccessor para el modelo de datos padre
      this.ngControl.valueAccessor = this;
    }
  }

  // --- Validación Automática ---
  get isInvalid(): boolean {
    if (!this.ngControl) return false;
    return !!(this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty));
  }

  get errorMessage(): string | null {
    if (!this.isInvalid || !this.ngControl?.errors) return null;
    const errors = this.ngControl.errors;

    // Cargar Diccionario (Base en Locale + Overwrites customizados del usuario)
    const dictionary = {
      ...CZ_VALIDATION_MESSAGES[this.locale()],
      ...this.customErrors()
    };

    // Resolución dinámica y extensible de errores
    for (const key of Object.keys(errors)) {
      const mappedError = dictionary[key];
      if (mappedError) {
        // Si la traducción requiere parámetros, los inyectamos
        if (typeof mappedError === 'function') {
          // Soporte nativo para params 'minlength' & 'maxlength' (Angular docs standard)
          return mappedError(errors[key].requiredLength || errors[key]);
        }
        return mappedError; // Traducciones planas como 'required', 'email', 'customKey'
      }
    }

    return dictionary.default;
  }

  // --- Métodos de ControlValueAccessor ---
  writeValue(val: any): void {
    this.value.set(val === null || val === undefined ? '' : val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formsDisabled.set(isDisabled);
  }

  // --- Eventos del DOM Nativos ---
  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val); // Notifica a Angular core
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched(); // Notifica a Angular core (desencadena touched validations)
  }

  onFocus(): void {
    this.isFocused.set(true);
  }
}
