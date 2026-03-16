import {
  Component,
  input,
  computed,
  Optional,
  Self,
  ViewEncapsulation,
  signal,
  ElementRef,
  ViewChild,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';
import { CzInputSize, CzLabelPosition, CzInputColor } from '../../types';

@Component({
  selector: 'cz-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CzTextAreaComponent implements ControlValueAccessor {
  @ViewChild('textareaElement') textareaElement!: ElementRef<HTMLTextAreaElement>;

  // Inputs using Signals
  label = input<string>('');
  labelPosition = input<CzLabelPosition>('none');
  size = input<CzInputSize>('md');
  color = input<CzInputColor>('');
  filled = input<boolean>(false);
  fluid = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  helpText = input<string>('');
  rows = input<number>(3);
  cols = input<number>(20);
  autoResize = input<boolean>(false);

  // Validation Inputs
  showErrors = input<boolean>(true);
  locale = input<CzValidationLocale>('es');
  customErrors = input<Partial<CzValidationErrorKeys>>();

  // Local States
  value = signal<string>('');
  isFocused = signal<boolean>(false);
  formsDisabled = signal<boolean>(false);

  // Computeds
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

  // Callbacks
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    // Effect to handle autoResize when value changes externally (writeValue)
    effect(() => {
      if (this.autoResize()) {
        const val = this.value();
        // Use setTimeout to wait for DOM update
        setTimeout(() => this.resize(), 0);
      }
    });
  }

  // --- Validation ---
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

  // --- ControlValueAccessor ---
  writeValue(val: any): void {
    this.value.set(val === null || val === undefined ? '' : val);
  }

  registerOnChange(fn: any): void {
    this.registerOnChangeImpl(fn);
  }

  private registerOnChangeImpl(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formsDisabled.set(isDisabled);
  }

  // --- Event Handlers ---
  onInputChange(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
    if (this.autoResize()) {
      this.resize();
    }
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  public resize(): void {
    const textarea = this.textareaElement?.nativeElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }
}
