import {
  Component,
  ElementRef,
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
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';
import { CzInputSize, CzLabelPosition, CzInputColor, CzOverlayZIndex, czOverlayZIndex } from '../../types';

export interface CzAutoCompleteOptionGroup {
  [key: string]: any;
}

@Component({
  selector: 'cz-autocomplete',
  imports: [CommonModule],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class CzAutocompleteComponent implements ControlValueAccessor, OnInit {
  // --- Parity with input-text ---
  label = input<string>('');
  labelPosition = input<CzLabelPosition>('none');
  size = input<CzInputSize>('md');
  /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
  zIndex = input<CzOverlayZIndex>(null);

  readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex()));

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
  /** Property name (or getter) used as the option label */
  optionLabel = input<string | ((item: any) => string) | null>(null);
  /** Legacy alias of `optionLabel` */
  field = input<string>('');
  dropdown = input<boolean>(false);
  multiple = input<boolean>(false);
  /** Ensures uniqueness of selected items in multiple mode */
  unique = input<boolean>(true);
  minLength = input<number>(1);
  /** PrimeNG alias: minimum number of characters to initiate a search */
  minQueryLength = input<number | null>(null);
  delay = input<number>(300);
  forceSelection = input<boolean>(false);
  emptyMessage = input<string>('No results found');
  showEmptyMessage = input<boolean>(true);

  // --- PrimeNG parity additions ---
  inputId = input<string>('');
  name = input<string>('');
  ariaLabel = input<string | null>(null);
  ariaLabelledBy = input<string | null>(null);
  autofocus = input<boolean>(false);
  tabindex = input<number | null>(null);
  invalid = input<boolean>(false);
  variant = input<'outlined' | 'filled'>('outlined');
  showClear = input<boolean>(false);
  scrollHeight = input<string>('');
  panelStyleClass = input<string>('');
  inputStyleClass = input<string>('');

  /** Options grouped by category */
  group = input<boolean>(false);
  optionGroupLabel = input<string>('label');
  optionGroupChildren = input<string>('items');

  /** Dropdown button behavior: blank query or the current input value */
  dropdownMode = input<'blank' | 'current'>('blank');
  dropdownAriaLabel = input<string>('Show suggestions');

  /** Focus behavior */
  autoOptionFocus = input<boolean>(true);
  selectOnFocus = input<boolean>(false);
  focusOnHover = input<boolean>(true);

  /** Virtual scroll over large suggestion sets */
  virtualScroll = input<boolean>(false);
  virtualScrollItemSize = input<number>(34);

  // Outputs
  completeMethod = output<{ originalEvent: Event; query: string }>();
  onSelect = output<any>();
  onUnselect = output<any>();
  onClear = output<void>();
  onDropdownClick = output<{ originalEvent: Event; query: string }>();
  onFocusEvent = output<Event>({ alias: 'onFocus' });
  onBlurEvent = output<Event>({ alias: 'onBlur' });

  // Slot Templates
  itemTemplate = contentChild<TemplateRef<any>>('itemTemplate');
  selectedItemTemplate = contentChild<TemplateRef<any>>('selectedItemTemplate');
  headerTemplate = contentChild<TemplateRef<any>>('headerTemplate');
  footerTemplate = contentChild<TemplateRef<any>>('footerTemplate');
  groupTemplate = contentChild<TemplateRef<any>>('groupTemplate');
  emptyTemplate = contentChild<TemplateRef<any>>('emptyTemplate');

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  // --- Internal State ---
  value = signal<any>(null); // For single mode (object/string) OR multiple mode (array)
  inputValue = signal<string>(''); // Purely the text typed in the input box
  isFocused = signal<boolean>(false);
  formsDisabled = signal<boolean>(false);
  overlayVisible = signal<boolean>(false);
  highlightOption: any = null;
  /** Virtual scroll offset */
  panelScrollTop = signal<number>(0);
  private timeout: any;
  private searching = false;

  readonly isFilled = computed(() => this.filled() || this.variant() === 'filled');
  readonly effectiveMinQueryLength = computed(() => this.minQueryLength() ?? this.minLength());

  private static nextId = 0;
  private readonly autoId = `cz-autocomplete-${++CzAutocompleteComponent.nextId}`;
  readonly effectiveInputId = computed(() => this.inputId() || this.autoId);
  readonly panelId = computed(() => `${this.effectiveInputId()}-panel`);

  readonly actualDisabled = computed(() => this.disabled() || this.formsDisabled());

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

  /** Flat list of selectable options (groups are flattened for keyboard navigation) */
  readonly flatOptions = computed<any[]>(() => {
    if (!this.group()) return this.suggestions() || [];
    return (this.suggestions() || []).flatMap((group) =>
      Array.isArray(group?.[this.optionGroupChildren()]) ? group[this.optionGroupChildren()] : [],
    );
  });

  /* --- Virtual scroll windowing --- */

  private readonly panelHeight = computed(() => {
    const parsed = parseInt(this.scrollHeight() || '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 224;
  });

  readonly virtualItemSize = computed(() => this.virtualScrollItemSize() || 34);

  readonly virtualStart = computed(() => {
    if (!this.virtualScroll()) return 0;
    return Math.max(0, Math.floor(this.panelScrollTop() / this.virtualItemSize()) - 2);
  });

  readonly virtualEnd = computed(() => {
    const total = this.suggestions()?.length ?? 0;
    if (!this.virtualScroll()) return total;
    const count = Math.ceil(this.panelHeight() / this.virtualItemSize()) + 4;
    return Math.min(total, this.virtualStart() + count);
  });

  readonly visibleSuggestions = computed<any[]>(() => {
    if (!this.virtualScroll()) return this.suggestions() || [];
    return (this.suggestions() || []).slice(this.virtualStart(), this.virtualEnd());
  });

  readonly virtualOffsetBefore = computed(() => (this.virtualScroll() ? this.virtualStart() * this.virtualItemSize() : 0));
  readonly virtualOffsetAfter = computed(() =>
    this.virtualScroll() ? Math.max(0, (this.suggestions()?.length ?? 0) - this.virtualEnd()) * this.virtualItemSize() : 0,
  );

  onPanelScroll(event: Event): void {
    if (!this.virtualScroll()) return;
    this.panelScrollTop.set((event.target as HTMLElement).scrollTop);
  }

  // Callbacks
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private el: ElementRef,
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
      this.value.set(Array.isArray(val) ? val : val ? [val] : []);
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

  onFocus(event?: Event): void {
    this.isFocused.set(true);
    if (event) this.onFocusEvent.emit(event);
  }

  onBlur(event?: Event): void {
    this.isFocused.set(false);
    this.onTouched();
    if (event) this.onBlurEvent.emit(event);

    // Force selection logic: If typing invalid text, revert it
    if (this.forceSelection() && !this.multiple() && this.inputValue()) {
      const matchingSuggestion = (this.suggestions() || []).find(
        (s) => this.resolveFieldData(s) === this.inputValue(),
      );
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

    if (query.length >= this.effectiveMinQueryLength()) {
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
    const query = this.dropdownMode() === 'current' ? (this.inputEl?.nativeElement.value || '') : '';
    if (this.overlayVisible()) {
      this.hideOverlay();
    } else {
      this.onDropdownClick.emit({ originalEvent: event, query });
      this.showOverlay();
    }
  }

  /** Clears the value and the typed query */
  clear(event?: Event): void {
    event?.stopPropagation();
    if (this.actualDisabled() || this.readonly()) return;

    this.value.set(this.multiple() ? [] : null);
    this.inputValue.set('');
    if (this.inputEl) this.inputEl.nativeElement.value = '';
    this.onChange(this.multiple() ? [] : null);
    this.hideOverlay();
    this.onClear.emit();
  }

  // --- Logic & Selection ---
  selectItem(option: any, focus: boolean = true): void {
    if (this.multiple()) {
      const currentArr = Array.isArray(this.value()) ? [...this.value()] : [];
      const exists = currentArr.findIndex(
        (o) => this.resolveFieldData(o) === this.resolveFieldData(option),
      );

      if (exists === -1) {
        currentArr.push(option);
        this.value.set(currentArr);
        this.onChange(currentArr);
      } else if (!this.unique()) {
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

    const optionLabel = this.optionLabel();
    if (typeof optionLabel === 'function') return optionLabel(data);
    if (typeof optionLabel === 'string' && optionLabel) return data[optionLabel] ?? '';
    if (this.field()) return data[this.field()] ?? '';
    return '';
  }

  /** Options of a group for grouped rendering */
  groupOptions(group: CzAutoCompleteOptionGroup): any[] {
    const children = group?.[this.optionGroupChildren()];
    return Array.isArray(children) ? children : [];
  }

  /** Highlights an option (used by hover when `focusOnHover` is enabled) */
  onOptionHover(option: any): void {
    if (this.focusOnHover()) {
      this.highlightOption = option;
    }
  }

  /** Sets the value while keeping the panel open (used by `selectOnFocus`) */
  private focusSelection(option: any): void {
    if (!this.selectOnFocus()) return;

    if (this.multiple()) {
      this.selectItem(option, false);
      this.showOverlay();
    } else {
      this.value.set(option);
      this.inputValue.set(this.resolveFieldData(option));
      if (this.inputEl) this.inputEl.nativeElement.value = this.inputValue();
      this.onChange(option);
      this.onSelect.emit(option);
    }
  }

  optionId(index: number): string {
    return `${this.effectiveInputId()}-option-${index}`;
  }

  optionIndex(option: any): number {
    return this.flatOptions().indexOf(option);
  }

  // --- Keyboard ---
  onKeyDown(event: KeyboardEvent): void {
    if (this.actualDisabled() || this.readonly()) return;

    if (this.overlayVisible()) {
      const items = this.flatOptions();
      const index = items.indexOf(this.highlightOption);

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const next = index < items.length - 1 ? items[index + 1] : items[0];
          if (next !== undefined) {
            this.highlightOption = next;
            this.focusSelection(next);
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const previous = index > 0 ? items[index - 1] : items[items.length - 1];
          if (previous !== undefined) {
            this.highlightOption = previous;
            this.focusSelection(previous);
          }
          break;
        }
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
      if (
        event.key === 'Backspace' &&
        this.multiple() &&
        this.inputValue() === '' &&
        Array.isArray(this.value()) &&
        this.value().length > 0
      ) {
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
    this.panelScrollTop.set(0);
    // Auto-highlight first item if enabled
    if (this.autoOptionFocus() && !this.highlightOption && this.flatOptions().length) {
      this.highlightOption = this.flatOptions()[0];
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
  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.hideOverlay();
    }
  }
}
