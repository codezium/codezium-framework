import {
  Component,
  input,
  computed,
  signal,
  contentChild,
  ElementRef,
  ViewChild,
  TemplateRef,
  OnInit,
  Optional,
  Self,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl, FormsModule } from '@angular/forms';
import { LucideDynamicIcon, LucideChevronDown, LucideCheck, LucideX, LucideLoader2, type LucideIconInput } from '@lucide/angular';
import { CzInputSize, CzLabelPosition, CzInputColor, CzOverlayZIndex, czOverlayZIndex } from '../../types';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';

export interface CzSelectChangeEvent {
  originalEvent: Event;
  value: any;
}

export interface CzSelectFilterEvent {
  originalEvent: Event;
  filter: string;
}

export interface CzSelectLazyLoadEvent {
  first: number;
  last: number;
}

export interface CzSelectFilterOptions {
  filter: (event: Event) => void;
  reset: () => void;
}

export type CzSelectFilterMatchMode =
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'equals'
  | 'notEquals'
  | 'in'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte';

let selectUid = 0;

@Component({
  selector: 'cz-select',
  imports: [CommonModule, FormsModule, LucideDynamicIcon],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class CzSelectComponent implements ControlValueAccessor, OnInit {
  // Common Inputs
  label = input<string>('');
  labelPosition = input<CzLabelPosition>('none');
  size = input<CzInputSize>('md');
  /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
  zIndex = input<CzOverlayZIndex>(null);
  color = input<CzInputColor>('');
  filled = input<boolean>(false);
  variant = input<'outlined' | 'filled'>('outlined');
  fluid = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  invalid = input<boolean>(false);
  placeholder = input<string>('');
  helpText = input<string>('');
  showErrors = input<boolean>(true);
  locale = input<CzValidationLocale>('es');
  customErrors = input<Partial<CzValidationErrorKeys>>();
  name = input<string>('');
  inputId = input<string>('');
  ariaLabel = input<string | null>(null);
  ariaLabelledBy = input<string | null>(null);
  autofocus = input<boolean>(false);
  tabindex = input<number | null>(null);

  readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex()));

  // Select Specific Inputs
  options = input<any[]>([]);
  optionLabel = input<string>('');
  optionValue = input<string>('');
  optionDisabled = input<string | ((item: any) => boolean) | null>(null);
  optionGroupLabel = input<string>('label');
  optionGroupChildren = input<string>('items');
  group = input<boolean>(false);
  multiple = input<boolean>(false);
  checkmark = input<boolean>(false);
  editable = input<boolean>(false);
  filter = input<boolean>(false);
  /** @deprecated Use `filter` instead */
  filterable = input<boolean>(false);
  filterBy = input<string>('');
  filterPlaceholder = input<string>('Search...');
  filterMatchMode = input<CzSelectFilterMatchMode>('contains');
  emptyMessage = input<string>('No results found');
  emptyFilterMessage = input<string>('No results found');
  showClear = input<boolean>(false);
  /** @deprecated Use `showClear` instead */
  clearable = input<boolean>(false);
  loading = input<boolean>(false);
  scrollHeight = input<string>('');
  resetFilterOnHide = input<boolean>(false);
  virtualScroll = input<boolean>(false);
  virtualScrollItemSize = input<number>(34);
  lazy = input<boolean>(false);
  dataKey = input<string>('');
  focusOnHover = input<boolean>(true);
  selectOnFocus = input<boolean>(false);
  autoOptionFocus = input<boolean>(false);
  panelStyleClass = input<string>('');

  // Icons
  dropdownIcon = input<LucideIconInput>(LucideChevronDown);
  clearIcon = input<LucideIconInput>(LucideX);
  loadingIcon = input<LucideIconInput>(LucideLoader2);

  // Slot Templates
  itemTemplate = contentChild<TemplateRef<any>>('itemTemplate');
  selectedItemTemplate = contentChild<TemplateRef<any>>('selectedItemTemplate');
  groupTemplate = contentChild<TemplateRef<any>>('groupTemplate');
  headerTemplate = contentChild<TemplateRef<any>>('headerTemplate');
  footerTemplate = contentChild<TemplateRef<any>>('footerTemplate');
  filterTemplate = contentChild<TemplateRef<any>>('filterTemplate');
  emptyTemplate = contentChild<TemplateRef<any>>('emptyTemplate');
  emptyFilterTemplate = contentChild<TemplateRef<any>>('emptyFilterTemplate');
  dropdownIconTemplate = contentChild<TemplateRef<any>>('dropdownIconTemplate');
  clearIconTemplate = contentChild<TemplateRef<any>>('clearIconTemplate');
  loadingIconTemplate = contentChild<TemplateRef<any>>('loadingIconTemplate');

  @ViewChild('filterInput') filterInput?: ElementRef<HTMLInputElement>;
  @ViewChild('editableInput') editableInput?: ElementRef<HTMLInputElement>;
  @ViewChild('triggerEl') triggerEl?: ElementRef<HTMLElement>;
  @ViewChild('panelEl') panelEl?: ElementRef<HTMLElement>;

  // Icons for template usage
  readonly ChevronDownIcon = LucideChevronDown;
  readonly CheckIcon = LucideCheck;
  readonly XIcon = LucideX;
  readonly LoaderIcon = LucideLoader2;

  // Local State
  value = signal<any>(null);
  isOpen = signal<boolean>(false);
  isFocused = signal<boolean>(false);
  editing = signal<boolean>(false);
  filterValue = signal<string>('');
  formsDisabled = signal<boolean>(false);
  highlightedIndex = signal<number>(-1);
  panelScrollTop = signal<number>(0);

  private static nextId = 0;
  private readonly autoId = `cz-select-${++CzSelectComponent.nextId}`;
  readonly effectiveInputId = computed(() => this.inputId() || this.autoId);
  readonly panelId = computed(() => `${this.effectiveInputId()}-panel`);

  // Outputs
  onChangeEvent = output<CzSelectChangeEvent>({ alias: 'onChange' });
  onFilterEvent = output<CzSelectFilterEvent>({ alias: 'onFilter' });
  onFocusEvent = output<Event>({ alias: 'onFocus' });
  onBlurEvent = output<Event>({ alias: 'onBlur' });
  onClickEvent = output<MouseEvent>({ alias: 'onClick' });
  onShowEvent = output<Event>({ alias: 'onShow' });
  onHideEvent = output<Event>({ alias: 'onHide' });
  onClearEvent = output<Event>({ alias: 'onClear' });
  onLazyLoadEvent = output<CzSelectLazyLoadEvent>({ alias: 'onLazyLoad' });

  // Computeds
  readonly isFilled = computed(() => this.filled() || this.variant() === 'filled');
  readonly actualDisabled = computed(() => this.disabled() || this.formsDisabled());
  readonly effectiveFilter = computed(() => this.filter() || this.filterable());
  readonly showClearButton = computed(() => (this.showClear() || this.clearable()) && !this.actualDisabled() && !this.readonly());

  hasValue = computed(() => {
    const val = this.value();
    if (this.multiple()) {
      return Array.isArray(val) && val.length > 0;
    }
    return val !== null && val !== undefined && val !== '';
  });

  actualPlaceholder = computed(() => {
    const positionsToHide: CzLabelPosition[] = ['float', 'in', 'over'];
    const isFloatingActive = this.isFocused() || this.isOpen() || this.hasValue();
    if (positionsToHide.includes(this.labelPosition()) && this.label()) {
      return isFloatingActive ? this.placeholder() : '';
    }
    return this.placeholder();
  });

  // Validation
  get isInvalid(): boolean {
    if (this.invalid()) return true;
    if (!this.ngControl) return false;
    return !!(this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty));
  }

  get errorMessage(): string | null {
    if (!this.isInvalid || !this.ngControl?.errors) return null;
    const dictionary = {
      ...CZ_VALIDATION_MESSAGES[this.locale()],
      ...this.customErrors(),
    };

    for (const key of Object.keys(this.ngControl.errors)) {
      const mappedError: any = dictionary[key as keyof typeof dictionary];
      if (mappedError) {
        if (typeof mappedError === 'function') {
          return mappedError(
            this.ngControl.errors[key].requiredLength || this.ngControl.errors[key],
          );
        }
        return mappedError;
      }
    }
    return dictionary.default;
  }

  // --- Option helpers ---
  getOptionLabel(option: any): string {
    if (option === null || option === undefined) return '';
    if (typeof option === 'string' || typeof option === 'number') return String(option);
    const labelKey = this.optionLabel();
    if (labelKey) return option[labelKey] ?? '';
    return option.label !== undefined ? String(option.label) : String(option);
  }

  getOptionValue(option: any): any {
    if (option === null || option === undefined) return null;
    if (typeof option === 'string' || typeof option === 'number') return option;
    const valueKey = this.optionValue();
    if (valueKey) return option[valueKey];
    return option.value !== undefined ? option.value : option;
  }

  isOptionDisabled(option: any): boolean {
    const optionDisabled = this.optionDisabled();
    if (typeof optionDisabled === 'function') return !!optionDisabled(option);
    if (typeof optionDisabled === 'string' && optionDisabled) return !!option?.[optionDisabled];
    if (option?.disabled !== undefined) return !!option.disabled;
    return false;
  }

  private isEqual(a: any, b: any): boolean {
    const key = this.dataKey();
    if (key && a && b && typeof a === 'object' && typeof b === 'object') {
      return a[key] === b[key];
    }
    return a === b;
  }

  isSelected(option: any): boolean {
    const optionValue = this.getOptionValue(option);
    if (this.multiple()) {
      const arr = Array.isArray(this.value()) ? this.value() : [];
      return arr.some((val: any) => this.isEqual(val, optionValue));
    }
    return this.hasValue() && this.isEqual(this.value(), optionValue);
  }

  // --- Filtering ---
  private matchesFilter(option: any, query: string): boolean {
    const mode = this.filterMatchMode();
    const fields = (this.filterBy() || this.optionLabel())
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const values: string[] = fields.length
      ? fields.map((field) => String(option?.[field] ?? ''))
      : [this.getOptionLabel(option)];

    return values.some((raw) => {
      const value = raw.toLowerCase();
      switch (mode) {
        case 'startsWith': return value.startsWith(query);
        case 'endsWith': return value.endsWith(query);
        case 'equals': return value === query;
        case 'notEquals': return value !== query;
        case 'in': return query.split(',').map((q) => q.trim()).includes(value);
        case 'lt': return parseFloat(value) < parseFloat(query);
        case 'lte': return parseFloat(value) <= parseFloat(query);
        case 'gt': return parseFloat(value) > parseFloat(query);
        case 'gte': return parseFloat(value) >= parseFloat(query);
        default: return value.includes(query);
      }
    });
  }

  /** Options grouped as provided (filtered) */
  readonly filteredGroups = computed<any[]>(() => {
    if (!this.group()) return [];
    const query = this.filterValue().trim().toLowerCase();
    const groups = this.options() || [];
    if (!query) return groups;
    return groups
      .map((group) => ({
        ...group,
        [this.optionGroupChildren()]: (group?.[this.optionGroupChildren()] || []).filter((option: any) =>
          this.matchesFilter(option, query),
        ),
      }))
      .filter((group) => (group?.[this.optionGroupChildren()] || []).length > 0);
  });

  /** Flat filtered options (also used for keyboard navigation) */
  readonly filteredOptions = computed<any[]>(() => {
    if (this.group()) {
      return this.filteredGroups().flatMap((group) =>
        Array.isArray(group?.[this.optionGroupChildren()]) ? group[this.optionGroupChildren()] : [],
      );
    }
    const query = this.filterValue().trim().toLowerCase();
    const all = this.options() || [];
    if (!query || !this.effectiveFilter()) return all;
    return all.filter((option) => this.matchesFilter(option, query));
  });

  readonly groupOptions = computed<Record<number, any[]>>(() => {
    const map: Record<number, any[]> = {};
    this.filteredGroups().forEach((group, index) => {
      map[index] = group?.[this.optionGroupChildren()] || [];
    });
    return map;
  });

  /** Selected labels for the trigger (single or multiple) */
  readonly selectedLabel = computed(() => {
    if (this.multiple()) {
      const arr = Array.isArray(this.value()) ? this.value() : [];
      return arr.map((val: any) => this.labelByValue(val)).join(', ');
    }
    const val = this.value();
    if (val === null || val === undefined || val === '') return '';
    return this.labelByValue(val);
  });

  /** Selected option object (single mode) */
  readonly selectedOption = computed(() => {
    const val = this.value();
    if (val === null || val === undefined || val === '') return null;
    const flat = this.group()
      ? (this.options() || []).flatMap((group) => group?.[this.optionGroupChildren()] || [])
      : this.options() || [];
    return flat.find((opt) => this.isEqual(this.getOptionValue(opt), val)) ?? null;
  });

  labelByValue(value: any): string {
    const found = (this.options() || []).find((opt) => this.isEqual(this.getOptionValue(opt), value));
    if (found) return this.getOptionLabel(found);
    // Search inside groups
    if (this.group()) {
      for (const group of this.options() || []) {
        const children = group?.[this.optionGroupChildren()] || [];
        const match = children.find((opt: any) => this.isEqual(this.getOptionValue(opt), value));
        if (match) return this.getOptionLabel(match);
      }
    }
    return typeof value === 'object' ? this.getOptionLabel(value) : String(value ?? '');
  }

  /** Editable input display text */
  readonly editableText = computed(() => {
    if (this.editing() && this.filterValue()) return this.filterValue();
    return this.selectedLabel();
  });

  // --- Virtual scroll windowing ---
  private readonly panelHeight = computed(() => {
    const parsed = parseInt(this.scrollHeight() || '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 224;
  });

  readonly virtualItemSize = computed(() => this.virtualScrollItemSize() || 34);

  private readonly isVirtual = computed(() => this.virtualScroll() && !this.group());

  readonly virtualStart = computed(() => {
    if (!this.isVirtual()) return 0;
    return Math.max(0, Math.floor(this.panelScrollTop() / this.virtualItemSize()) - 2);
  });

  readonly virtualEnd = computed(() => {
    const total = this.filteredOptions().length;
    if (!this.isVirtual()) return total;
    const count = Math.ceil(this.panelHeight() / this.virtualItemSize()) + 4;
    return Math.min(total, this.virtualStart() + count);
  });

  readonly visibleOptions = computed<any[]>(() => {
    if (!this.isVirtual()) return this.filteredOptions();
    return this.filteredOptions().slice(this.virtualStart(), this.virtualEnd());
  });

  readonly virtualOffsetBefore = computed(() => (this.isVirtual() ? this.virtualStart() * this.virtualItemSize() : 0));
  readonly virtualOffsetAfter = computed(() =>
    this.isVirtual() ? Math.max(0, this.filteredOptions().length - this.virtualEnd()) * this.virtualItemSize() : 0,
  );

  onPanelScroll(event: Event): void {
    if (!this.virtualScroll()) return;
    this.panelScrollTop.set((event.target as HTMLElement).scrollTop);
    this.emitLazyLoad();
  }

  private emitLazyLoad(): void {
    if (!this.lazy()) return;
    this.onLazyLoadEvent.emit({ first: this.virtualStart(), last: this.virtualEnd() });
  }

  // ControlValueAccessor
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private el: ElementRef,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (this.autofocus() && !this.actualDisabled()) {
      setTimeout(() => this.focus(), 0);
    }
  }

  // CVA Methods
  writeValue(val: any): void {
    if (this.multiple()) {
      this.value.set(Array.isArray(val) ? val : val !== null && val !== undefined ? [val] : []);
    } else {
      this.value.set(val);
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

  // --- Panel management ---
  toggleDropdown(): void {
    if (this.actualDisabled()) return;
    if (this.isOpen()) {
      this.hide();
    } else {
      this.show();
    }
  }

  show(): void {
    if (this.actualDisabled() || this.isOpen()) return;
    this.isOpen.set(true);
    this.isFocused.set(true);
    this.panelScrollTop.set(0);

    if (this.autoOptionFocus()) {
      const options = this.filteredOptions();
      const selectedIndex = options.findIndex((opt) => this.isSelected(opt));
      this.highlightedIndex.set(selectedIndex > -1 ? selectedIndex : 0);
    } else {
      this.highlightedIndex.set(-1);
    }

    if (this.editable()) {
      setTimeout(() => {
        this.editableInput?.nativeElement.focus();
        this.editableInput?.nativeElement.select();
      }, 0);
    } else if (this.effectiveFilter()) {
      setTimeout(() => this.filterInput?.nativeElement.focus(), 0);
    }

    this.onShowEvent.emit(new Event('show'));
    this.emitLazyLoad();
  }

  hide(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.editing.set(false);
    if (this.resetFilterOnHide()) {
      this.filterValue.set('');
    }
    this.highlightedIndex.set(-1);
    this.onTouched();
    this.onHideEvent.emit(new Event('hide'));
  }

  /** Public alias used by PrimeNG parity API */
  close(): void {
    this.hide();
  }

  focus(): void {
    this.triggerEl?.nativeElement.focus();
  }

  // --- Interaction ---
  onTriggerClick(event: MouseEvent): void {
    if (this.actualDisabled()) return;
    this.onClickEvent.emit(event);
    if (this.editable()) {
      this.editing.set(true);
      if (!this.isOpen()) this.show();
      setTimeout(() => {
        this.editableInput?.nativeElement.focus();
        this.editableInput?.nativeElement.select();
      }, 0);
    } else {
      this.toggleDropdown();
    }
  }

  onOptionSelect(option: any, event?: Event): void {
    if (this.actualDisabled() || this.readonly() || this.isOptionDisabled(option)) return;
    const optionValue = this.getOptionValue(option);

    if (this.multiple()) {
      const arr = Array.isArray(this.value()) ? [...this.value()] : [];
      const index = arr.findIndex((val) => this.isEqual(val, optionValue));
      if (index > -1) {
        arr.splice(index, 1);
      } else {
        arr.push(optionValue);
      }
      this.value.set(arr);
      this.onChange(arr);
      this.onChangeEvent.emit({ originalEvent: event ?? new Event('select'), value: arr });
    } else {
      this.value.set(optionValue);
      this.onChange(optionValue);
      this.onChangeEvent.emit({ originalEvent: event ?? new Event('select'), value: optionValue });
      this.filterValue.set('');
      this.hide();
    }
  }

  /** Toggle select all (multiple mode, used by header checkbox in multiselect) */
  onToggleAll(event: Event, checked: boolean): void {
    if (this.actualDisabled() || this.readonly()) return;
    const arr = checked
      ? this.filteredOptions()
          .filter((opt) => !this.isOptionDisabled(opt))
          .map((opt) => this.getOptionValue(opt))
      : [];
    this.value.set(arr);
    this.onChange(arr);
    this.onChangeEvent.emit({ originalEvent: event, value: arr });
  }

  clear(event?: Event): void {
    event?.stopPropagation();
    if (this.actualDisabled() || this.readonly()) return;
    const newValue = this.multiple() ? [] : null;
    this.value.set(newValue);
    this.onChange(newValue);
    this.onClearEvent.emit(event ?? new Event('clear'));
    this.filterValue.set('');
    this.editing.set(false);
  }

  resetFilter(): void {
    this.filterValue.set('');
  }

  onFilterInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.filterValue.set(query);
    this.highlightedIndex.set(0);
    this.onFilterEvent.emit({ originalEvent: event, filter: query });
    this.panelScrollTop.set(0);
    this.emitLazyLoad();
  }

  // Custom filter template helpers (PrimeNG parity: { options } context)
  readonly filterOptions: CzSelectFilterOptions = {
    filter: (event: Event) => this.onFilterInput(event),
    reset: () => this.resetFilter(),
  };

  // --- Editable handling ---
  onEditableInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.filterValue.set(query);
    this.editing.set(true);
    if (!this.isOpen()) this.show();
    this.onFilterEvent.emit({ originalEvent: event, filter: query });
  }

  onEditableBlur(event: Event): void {
    if (!this.editable()) return;
    const query = this.filterValue().trim();
    if (query) {
      const match = this.filteredOptions().find(
        (opt) => this.getOptionLabel(opt).toLowerCase() === query.toLowerCase(),
      );
      if (match) {
        this.onOptionSelect(match, event);
      } else {
        // Custom typed value becomes the model (PrimeNG editable behavior)
        this.value.set(query);
        this.onChange(query);
        this.onChangeEvent.emit({ originalEvent: event, value: query });
      }
    }
    this.editing.set(false);
    this.filterValue.set('');
  }


  // --- Mouse interactions ---
  onOptionHover(index: number): void {
    if (this.focusOnHover()) {
      this.highlightedIndex.set(index);
    }
  }

  onOptionClick(option: any, index: number, event: MouseEvent): void {
    if (this.focusOnHover()) this.highlightedIndex.set(index);
    this.onOptionSelect(option, event);
  }

  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      if (this.isOpen()) this.hide();
      this.isFocused.set(false);
    }
  }

  // --- Keyboard ---
  onKeyDown(event: KeyboardEvent): void {
    if (this.actualDisabled()) return;

    if (!this.isOpen()) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.show();
      }
      return;
    }

    const options = this.filteredOptions();
    const index = this.highlightedIndex();

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!options.length) return;
        const next = index < options.length - 1 ? index + 1 : 0;
        this.highlightedIndex.set(next);
        this.scrollToHighlighted(next);
        if (this.selectOnFocus()) this.selectHighlighted(next, event);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!options.length) return;
        const previous = index > 0 ? index - 1 : options.length - 1;
        this.highlightedIndex.set(previous);
        this.scrollToHighlighted(previous);
        if (this.selectOnFocus()) this.selectHighlighted(previous, event);
        break;
      }
      case 'Home': {
        event.preventDefault();
        if (!options.length) return;
        this.highlightedIndex.set(0);
        this.scrollToHighlighted(0);
        break;
      }
      case 'End': {
        event.preventDefault();
        if (!options.length) return;
        this.highlightedIndex.set(options.length - 1);
        this.scrollToHighlighted(options.length - 1);
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (index >= 0 && options[index]) {
          this.onOptionSelect(options[index], event);
        }
        break;
      }
      case 'Escape': {
        event.preventDefault();
        this.filterValue.set('');
        this.hide();
        break;
      }
      case 'Backspace': {
        if (this.multiple() && Array.isArray(this.value()) && this.value().length > 0) {
          const arr = [...this.value()];
          arr.pop();
          this.value.set(arr);
          this.onChange(arr);
          this.onChangeEvent.emit({ originalEvent: event, value: arr });
        }
        break;
      }
      case 'Tab': {
        this.hide();
        this.isFocused.set(false);
        break;
      }
    }
  }

  private selectHighlighted(index: number, event: Event): void {
    const option = this.filteredOptions()[index];
    if (!option || this.isOptionDisabled(option)) return;
    const optionValue = this.getOptionValue(option);
    if (this.multiple()) {
      const arr = Array.isArray(this.value()) ? [...this.value()] : [];
      const existing = arr.findIndex((val) => this.isEqual(val, optionValue));
      if (existing > -1) arr.splice(existing, 1);
      else arr.push(optionValue);
      this.value.set(arr);
      this.onChange(arr);
      this.onChangeEvent.emit({ originalEvent: event, value: arr });
    } else {
      this.value.set(optionValue);
      this.onChange(optionValue);
      this.onChangeEvent.emit({ originalEvent: event, value: optionValue });
    }
  }

  private scrollToHighlighted(index: number): void {
    if (!this.virtualScroll() || !this.panelEl) return;
    const itemSize = this.virtualItemSize();
    const panelHeight = this.panelHeight();
    const top = index * itemSize;
    const bottom = top + itemSize;
    const scrollTop = this.panelEl.nativeElement.scrollTop;
    if (top < scrollTop) {
      this.panelEl.nativeElement.scrollTop = top;
    } else if (bottom > scrollTop + panelHeight) {
      this.panelEl.nativeElement.scrollTop = bottom - panelHeight;
    }
  }

  optionId(index: number): string {
    return `${this.effectiveInputId()}-option-${index}`;
  }

  optionIndex(option: any): number {
    return this.filteredOptions().indexOf(option);
  }

  /** Index of the highlighted option for aria-activedescendant */
  readonly activeDescendant = computed(() => {
    const index = this.highlightedIndex();
    return index > -1 && this.isOpen() ? this.optionId(index) : null;
  });
}
