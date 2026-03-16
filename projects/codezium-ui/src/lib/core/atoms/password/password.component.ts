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
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { CzInputSize, CzLabelPosition, CzInputColor } from '../../types';

@Component({
  selector: 'cz-password',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CzPasswordComponent implements ControlValueAccessor {
  // Common Inputs (mirrored from CzInputText)
  label = input<string>('');
  labelPosition = input<CzLabelPosition>('none');
  size = input<CzInputSize>('md');
  color = input<CzInputColor>('');
  filled = input<boolean>(false);
  fluid = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  helpText = input<string>('');
  showErrors = input<boolean>(true);
  locale = input<CzValidationLocale>('es');
  customErrors = input<Partial<CzValidationErrorKeys>>();

  // Password Specific Inputs
  toggleMask = input<boolean>(true);
  feedback = input<boolean>(false);
  weakLabel = input<string>('Weak');
  mediumLabel = input<string>('Medium');
  strongLabel = input<string>('Strong');

  // Icons
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;

  // Local State
  value = signal<string>('');
  isFocused = signal<boolean>(false);
  formsDisabled = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  // Computeds
  actualDisabled = computed(() => this.disabled() || this.formsDisabled());
  hasValue = computed(() => {
    const v = this.value();
    return v !== null && v !== undefined && v.toString().length > 0;
  });

  actualPlaceholder = computed(() => {
    if ((this.labelPosition() === 'float' || this.labelPosition() === 'in') && this.label()) {
      return this.isFocused() ? this.placeholder() : '';
    }
    return this.placeholder();
  });

  inputType = computed(() => this.showPassword() ? 'text' : 'password');

  strengthScore = computed(() => {
    const val = this.value();
    if (!val) return 0;
    
    let score = 0;
    if (val.length > 6) score += 20;
    if (val.length > 10) score += 20;
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score += 20;
    if (/\d/.test(val)) score += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) score += 20;
    
    return score;
  });

  strengthClass = computed(() => {
    const score = this.strengthScore();
    if (score < 40) return 'cz-strength-weak';
    if (score < 80) return 'cz-strength-medium';
    return 'cz-strength-strong';
  });

  strengthLabel = computed(() => {
    const score = this.strengthScore();
    if (score === 0) return '';
    if (score < 40) return this.weakLabel();
    if (score < 80) return this.mediumLabel();
    return this.strongLabel();
  });

  // ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  get isInvalid(): boolean {
    if (!this.ngControl) return false;
    return !!(this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty));
  }

  get errorMessage(): string | null {
    if (!this.isInvalid || !this.ngControl?.errors) return null;
    const errors = this.ngControl.errors;
    const dictionary = {
      ...CZ_VALIDATION_MESSAGES[this.locale()],
      ...this.customErrors()
    };

    for (const key of Object.keys(errors)) {
      const mappedError = dictionary[key];
      if (mappedError) {
        if (typeof mappedError === 'function') {
          return mappedError(errors[key].requiredLength || errors[key]);
        }
        return mappedError;
      }
    }
    return dictionary.default;
  }

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

  // Events
  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onToggleMask(): void {
    if (this.actualDisabled()) return;
    this.showPassword.update(v => !v);
  }
}
