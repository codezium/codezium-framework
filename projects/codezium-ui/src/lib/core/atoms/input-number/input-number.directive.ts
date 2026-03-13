import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  forwardRef,
  input,
  OnInit,
  computed,
  inject
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type CzInputNumberMode = 'decimal' | 'currency';

@Directive({
  selector: '[czInputNumber]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CzInputNumberDirective),
      multi: true
    }
  ]
})
export class CzInputNumberDirective implements ControlValueAccessor, OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  // Configuration Inputs (Matching PrimeNG)
  mode = input<CzInputNumberMode>('decimal');
  currency = input<string>('USD');
  locale = input<string>('en-US');
  useGrouping = input<boolean>(true);
  minFractionDigits = input<number>(0);
  maxFractionDigits = input<number>(2);
  prefix = input<string>('');
  suffix = input<string>('');
  min = input<number>();
  max = input<number>();

  // Computed NumberFormat Instance
  private numberFormatter = computed(() => {
    const options: Intl.NumberFormatOptions = {
      useGrouping: this.useGrouping(),
      minimumFractionDigits: this.minFractionDigits(),
      maximumFractionDigits: this.maxFractionDigits(),
    };

    if (this.mode() === 'currency') {
      options.style = 'currency';
      options.currency = this.currency();
    } else {
      options.style = 'decimal';
    }

    return new Intl.NumberFormat(this.locale(), options);
  });

  private get decimalSeparator(): string {
    const parts = this.numberFormatter().formatToParts(1.1);
    const decimalPart = parts.find(p => p.type === 'decimal');
    return decimalPart ? decimalPart.value : '.';
  }

  private get allowedRegex(): RegExp {
    const escapedDecimal = this.decimalSeparator.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    return new RegExp(`^[0-9-${escapedDecimal}]+$`);
  }

  /** Keys that should always be allowed through regardless of filter */
  private readonly ALWAYS_PERMITTED_KEYS = new Set([
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'Tab', 'Enter', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5',
      'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  ]);

  // Internal State
  private innerValue: number | null = null;
  private isFocused = false;

  // CVA callbacks
  private onChange = (_: number | null) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.updateView();
  }

  // ==== CVA Methods ====
  writeValue(value: any): void {
    const parsed = this.parseValue(value);
    this.innerValue = parsed;
    this.updateView();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }

  // ==== Host Listeners ====
  @HostListener('focus')
  onFocus(): void {
    this.isFocused = true;
    this.updateView(true); // Maybe strip formatting for easier editing, or just keep as is
  }

  @HostListener('blur')
  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.validateBounds();
    this.updateView(); // Re-apply strict formatting
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (this.ALWAYS_PERMITTED_KEYS.has(event.key)) return;

      if (!this.allowedRegex.test(event.key)) {
          event.preventDefault();
      }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
      const pastedText = event.clipboardData?.getData('text') ?? '';
      if (!pastedText.split('').every(char => this.allowedRegex.test(char))) {
          event.preventDefault();
      }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    const value = target.value;
    // 1. Strip all non-numeric characters EXCEPT minus sign and decimal separator
    const cleanStr = this.sanitizeInputString(value);
    
    // 2. Parse to standard JS number
    let numVal: number | null = null;
    if (cleanStr && cleanStr !== '-' && cleanStr !== '.' && cleanStr !== '-.') {
      numVal = parseFloat(cleanStr);
    }
    if (isNaN(numVal as any)) {
      numVal = null;
    }

    // 3. Update internal state
    this.innerValue = numVal;
    
    // 4. Notify Form Model
    this.onChange(numVal);
  }

  // ==== Logic ====
  private validateBounds(): void {
    if (this.innerValue === null) return;

    let changed = false;
    const minVal = this.min();
    const maxVal = this.max();

    if (minVal !== undefined && this.innerValue < minVal) {
      this.innerValue = minVal;
      changed = true;
    }

    if (maxVal !== undefined && this.innerValue > maxVal) {
      this.innerValue = maxVal;
      changed = true;
    }

    if (changed) {
      this.onChange(this.innerValue);
    }
  }

  private updateView(isFocused: boolean = false): void {
    if (this.innerValue === null || isNaN(this.innerValue)) {
      this.renderer.setProperty(this.el.nativeElement, 'value', '');
      return;
    }

    let finalString = '';

    // If focused, we might want to bypass strict Intl formatting so the user can edit raw decimals easier
    // However, to mimic PrimeNG closely, we format it fully.
    finalString = this.numberFormatter().format(this.innerValue);

    // Apply custom Prefix/Suffix if not in currency mode (where Intl handles it)
    if (this.mode() !== 'currency') {
      finalString = `${this.prefix()}${finalString}${this.suffix()}`;
    }

    this.renderer.setProperty(this.el.nativeElement, 'value', finalString);
  }

  private parseValue(val: any): number | null {
    if (val === null || val === undefined || val === '') return null;
    const num = typeof val === 'number' ? val : parseFloat(val.toString().replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? null : num;
  }

  private sanitizeInputString(val: string): string {
    const decimalChar = this.decimalSeparator;
    const escapedDecimal = decimalChar.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    const regex = new RegExp(`[^0-9-${escapedDecimal}]`, 'g');
    
    let sanitized = val.replace(regex, '');
    
    // Convert localized decimal to standard JS '.' for parsing
    if (decimalChar !== '.') {
      sanitized = sanitized.replace(decimalChar, '.');
    }

    // Only allow one decimal point
    const splitParts = sanitized.split('.');
    if (splitParts.length > 2) {
      sanitized = splitParts[0] + '.' + splitParts.slice(1).join('');
    }

    return sanitized;
  }
}
