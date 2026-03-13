import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Optional,
  Self,
  ViewChild,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
  contentChild,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';
import { CzInputSize, CzLabelPosition, CzInputColor } from '../../atoms/input-text/input-text.component';

@Component({
  selector: 'cz-autocomplete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CzAutocompleteComponent implements ControlValueAccessor, OnInit {
  // --- Parity with input-text ---
  label = input<string>('');
  labelPosition = input<CzLabelPosition>('none');
  size = input<CzInputSize>('md');
  color = input<CzInputColor>('');
  filled = input<boolean>(false);
  fluid = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  placeholder = input<string>('');
  type = input<string>('text');
  helpText = input<string>('');
  showErrors = input<boolean>(true);
  locale = input<CzValidationLocale>('es');
  customErrors = input<Partial<CzValidationErrorKeys>>();

  // --- Autocomplete specifics (PrimeNG Parity) ---
  suggestions = input<any[]>([]);
  field = input<string>('');
  dropdown = input<boolean>(false);
  multiple = input<boolean>(false);
  minLength = input<number>(1);
  delay = input<number>(300);
  forceSelection = input<boolean>(false);
  emptyMessage = input<string>('No results found');

  // Outputs
  completeMethod = output<{ originalEvent: Event, query: string }>();
  onSelect = output<any>();
  onUnselect = output<any>();
  onClear = output<void>();
  onDropdownClick = output<{ originalEvent: Event, query: string }>();

  // Slot Templates
  itemTemplate = contentChild<TemplateRef<any>>('itemTemplate');
  selectedItemTemplate = contentChild<TemplateRef<any>>('selectedItemTemplate');

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  // --- Internal State ---
  value = signal<any>(null); // For single mode (object/string) OR multiple mode (array)
  inputValue = signal<string>(''); // Purely the text typed in the input box
  isFocused = signal<boolean>(false);
  formsDisabled = signal<boolean>(false);
  overlayVisible = signal<boolean>(false);
  highlightOption: any = null;
  private timeout: any;
  private searching = false;

  // Computeds
  actualDisabled = computed(() => this.disabled() || this.formsDisabled());
  hasValue = computed(() => {
    const v = this.value();
    if (this.multiple()) {
      return Array.isArray(v) && v.length > 0;
    }
    return v !== null && v !== undefined && v !== '';
  });

  actualPlaceholder = computed(() => {
    if ((this.labelPosition() === 'float' || this.labelPosition() === 'in') && this.label()) {
      return this.isFocused() ? this.placeholder() : '';
    }
    if (this.multiple() && this.hasValue()) {
      // In multiple mode, if there are chips, hide the placeholder
      return '';
    }
    return this.placeholder();
  });

  // Callbacks
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private el: ElementRef
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    // Initialize value explicitly as array if multiple mode
    if (this.multiple() && !this.value()) {
      this.value.set([]);
    }
  }

  // --- Automatic Validations ---
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
      const mappedError: any = dictionary[key as keyof typeof dictionary];
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
    if (this.multiple()) {
      this.value.set(Array.isArray(val) ? val : (val ? [val] : []));
    } else {
      this.value.set(val);
      // For single mode, if it's an object visually resolve it
      this.inputValue.set(val ? this.resolveFieldData(val) : '');
    }
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

  // --- DOM Interaction ---
  onWrapperClick(): void {
    this.focusInput();
  }

  focusInput(): void {
    if (this.inputEl && !this.actualDisabled()) {
      this.inputEl.nativeElement.focus();
    }
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
    
    // Force selection logic: If typing invalid text, revert it
    if (this.forceSelection() && !this.multiple() && this.inputValue()) {
        const matchingSuggestion = (this.suggestions() || []).find(s => this.resolveFieldData(s) === this.inputValue());
        if (!matchingSuggestion) {
            // Revert back to selected value or clear
            this.inputValue.set(this.value() ? this.resolveFieldData(this.value()) : '');
            if (this.inputEl) this.inputEl.nativeElement.value = this.inputValue();
        }
    }
  }

  onInput(event: Event): void {
    if (this.actualDisabled() || this.readonly()) return;
    const query = (event.target as HTMLInputElement).value;
    
    // In single mode where force selection is OFF, typing raw text becomes the value
    if (!this.multiple() && !this.forceSelection()) {
        this.value.set(query);
        this.onChange(query);
    }
    this.inputValue.set(query);

    if (query.length === 0) {
      this.hideOverlay();
      this.onClear.emit();
      return;
    }

    if (query.length >= this.minLength()) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.search(event, query);
      }, this.delay());
    } else {
      this.hideOverlay();
    }
  }

  search(event: Event, query: string): void {
    this.searching = true;
    this.completeMethod.emit({ originalEvent: event, query });
    // Assuming the host updates suggestions shortly after.
    // In PrimeNG, show overlay only if there are suggestions, we do it blindly and display 'emptyMessage' if none
    this.showOverlay();
  }

  handleDropdownClick(event: Event): void {
    this.focusInput();
    const query = this.inputEl?.nativeElement.value || '';
    if (this.overlayVisible()) {
       this.hideOverlay();
    } else {
       this.onDropdownClick.emit({ originalEvent: event, query });
       this.showOverlay();
    }
  }

  // --- Logic & Selection ---
  selectItem(option: any, focus: boolean = true): void {
    if (this.multiple()) {
        const currentArr = Array.isArray(this.value()) ? [...this.value()] : [];
        if (currentArr.findIndex(o => this.resolveFieldData(o) === this.resolveFieldData(option)) === -1) {
            currentArr.push(option);
            this.value.set(currentArr);
            this.onChange(currentArr);
        }
        this.inputValue.set('');
        if (this.inputEl) this.inputEl.nativeElement.value = '';
    } else {
        this.value.set(option);
        const resolvedText = this.resolveFieldData(option);
        this.inputValue.set(resolvedText);
        if (this.inputEl) this.inputEl.nativeElement.value = resolvedText;
        this.onChange(option);
    }
    this.onSelect.emit(option);
    if (focus) this.focusInput();
    this.hideOverlay();
  }

  removeItem(event: Event, index: number): void {
    event.stopPropagation();
    if (this.actualDisabled() || this.readonly()) return;
    const currentArr = Array.isArray(this.value()) ? [...this.value()] : [];
    const removed = currentArr.splice(index, 1)[0];
    this.value.set(currentArr);
    this.onChange(currentArr);
    this.onUnselect.emit(removed);
  }

  // Resolve object property (e.g. { name: 'USA', code: 'US' } -> 'USA')
  resolveFieldData(data: any): string {
    if (data == null) return '';
    if (typeof data === 'string' || typeof data === 'number') return String(data);
    if (this.field()) {
      return data[this.field()] || '';
    }
    return '';
  }

  // --- Keyboard ---
  onKeyDown(event: KeyboardEvent): void {
    if (this.actualDisabled() || this.readonly()) return;

    if (this.overlayVisible()) {
      const items = this.suggestions() || [];
      const index = items.indexOf(this.highlightOption);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (index < items.length - 1) this.highlightOption = items[index + 1];
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (index > 0) this.highlightOption = items[index - 1];
          break;
        case 'Enter':
          event.preventDefault();
          if (this.highlightOption) this.selectItem(this.highlightOption);
          break;
        case 'Escape':
          event.preventDefault();
          this.hideOverlay();
          break;
      }
    } else {
      if (event.key === 'ArrowDown' && this.dropdown()) {
        this.showOverlay();
      }
      if (event.key === 'Backspace' && this.multiple() && this.inputValue() === '' && Array.isArray(this.value()) && this.value().length > 0) {
        const arr = [...this.value()];
        const removed = arr.pop();
        this.value.set(arr);
        this.onChange(arr);
        this.onUnselect.emit(removed);
      }
    }
  }

  // --- Overlay Management ---
  showOverlay(): void {
    this.overlayVisible.set(true);
    // Auto-highlight first item if none is highlighted
    if (!this.highlightOption && this.suggestions()?.length) {
      this.highlightOption = this.suggestions()[0];
    }
  }

  hideOverlay(): void {
    this.overlayVisible.set(false);
    this.highlightOption = null;
  }

  onOverlayMouseDown(event: Event): void {
    // Prevent blur from triggering when clicking inside overlay list
    event.preventDefault(); 
  }

  // Host listener logic strictly matching PrimeNG clicking-out philosophy
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.hideOverlay();
    }
  }
}
