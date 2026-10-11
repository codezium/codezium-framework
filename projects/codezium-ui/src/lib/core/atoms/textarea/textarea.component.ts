import {
  Component,
  input,
  computed,
  output,
  Optional,
  Self,
  ViewEncapsulation,
  signal,
  ElementRef,
  ViewChild,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';
import { CzInputSize, CzLabelPosition, CzInputColor } from '../../types';

@Component({
  selector: 'cz-textarea',
  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class CzTextAreaComponent implements ControlValueAccessor {
  @ViewChild('textareaElement') textareaElement!: ElementRef<HTMLTextAreaElement>;

  // Inputs using Signals
  label = input<string>('');
  labelPosition = input<CzLabelPosition>('none');
  size = input<CzInputSize>('md');
  color = input<CzInputColor>('');
  filled = input<boolean>(false);
  variant = input<'outlined' | 'filled'>('outlined');
  fluid = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  invalid = input<boolean>(false);
  placeholder = input<string>('');
  helpText = input<string>('');
  rows = input<number>(3);
  cols = input<number>(20);
  autoResize = input<boolean>(false);
  autofocus = input<boolean>(false);
  inputId = input<string>('');
  name = input<string>('');
  ariaLabel = input<string | null>(null);
  ariaLabelledBy = input<string | null>(null);
  tabindex = input<number | null>(null);

  /** Callback to invoke on textarea resize */
  onResizeEvent = output<Event>({ alias: 'onResize' });
  /** Callback to invoke when the textarea receives focus */
  onFocusEvent = output<Event>({ alias: 'onFocus' });
  /** Callback to invoke when the textarea loses focus */
  onBlurEvent = output<Event>({ alias: 'onBlur' });

  private static nextId = 0;
  private readonly autoId = `cz-textarea-${++CzTextAreaComponent.nextId}`;
  readonly effectiveInputId = computed(() => this.inputId() || this.autoId);

  // Validation Inputs
  showErrors = input<boolean>(true);
  locale = input<CzValidationLocale>('es');
  customErrors = input<Partial<CzValidationErrorKeys>>();

  // Local States
  value = signal<string>('');
  isFocused = signal<boolean>(false);
  formsDisabled = signal<boolean>(false);

  // Computeds
  readonly isFilled = computed(() => this.filled() || this.variant() === 'filled');
  actualDisabled = computed(() => this.disabled() || this.formsDisabled());
  hasValue = computed(() => {
    const v = this.value();
    return v !== null && v !== undefined && v.toString().length > 0;
  });

  actualPlaceholder = computed(() => {
    const positionsToHide: CzLabelPosition[] = ['float', 'in', 'over'];
    if (positionsToHide.includes(this.labelPosition()) && this.label()) {
      return this.isFocused() || this.hasValue() ? this.placeholder() : '';
    }
    return this.placeholder();
  });

  // Callbacks
  onChange: any = () => {};
  onTouched: any = () => {};

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
    if (this.invalid()) return true;
    if (!this.ngControl) return false;
    return !!(this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty));
  }

  get errorMessage(): string | null {
    if (!this.isInvalid || !this.ngControl?.errors) return null;
    const errors = this.ngControl.errors;
    const dictionary = {
      ...CZ_VALIDATION_MESSAGES[this.locale()],
      ...this.customErrors(),
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

  onBlur(event?: Event): void {
    this.isFocused.set(false);
    this.onTouched();
    if (event) this.onBlurEvent.emit(event);
  }

  onFocus(event?: Event): void {
    this.isFocused.set(true);
    if (event) this.onFocusEvent.emit(event);
  }

  public resize(): void {
    const textarea = this.textareaElement?.nativeElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
      this.onResizeEvent.emit(new Event('resize'));
    }
  }
}
