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
import { LucideDynamicIcon, LucideChevronDown, LucideX, LucideSearch, LucideLoader2, type LucideIconInput } from '@lucide/angular';
import { CzInputSize, CzLabelPosition, CzInputColor, CzOverlayZIndex, czOverlayZIndex } from '../../types';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';
import { CzCheckboxComponent } from '../checkbox/checkbox.component';

export interface CzMultiSelectChangeEvent {
  originalEvent: Event;
  value: any[];
}

export interface CzMultiSelectFilterEvent {
  originalEvent: Event;
  filter: string;
}

export interface CzMultiSelectLazyLoadEvent {
  first: number;
  last: number;
}

export interface CzMultiSelectRemoveEvent {
  originalEvent: Event;
  value: any;
}

export interface CzMultiSelectSelectAllChangeEvent {
  originalEvent: Event;
  checked: boolean;
}

export interface CzMultiSelectFilterOptions {
  filter: (event: Event) => void;
  reset: () => void;
}

export type CzMultiSelectDisplay = 'comma' | 'chip';
export type CzMultiSelectFilterMatchMode =
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

let multiSelectUid = 0;

@Component({
  selector: 'cz-multiselect',
  imports: [CommonModule, FormsModule, LucideDynamicIcon, CzCheckboxComponent],
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class CzMultiSelectComponent implements ControlValueAccessor, OnInit {
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

  // MultiSelect specific inputs
  options = input<any[]>([]);
  optionLabel = input<string>('');
  optionValue = input<string>('');
  optionDisabled = input<string | ((item: any) => boolean) | null>(null);
  optionGroupLabel = input<string>('label');
  optionGroupChildren = input<string>('items');
  group = input<boolean>(false);
  dataKey = input<string>('');
  display = input<CzMultiSelectDisplay>('comma');
  maxSelectedLabels = input<number>(3);
  selectedItemsLabel = input<string>('{0} items selected');
  displaySelectedLabel = input<boolean>(true);
  selectionLimit = input<number | undefined>(undefined);
  showToggleAll = input<boolean>(true);
  showHeader = input<boolean>(true);
  filter = input<boolean>(false);
  filterBy = input<string>('');
  filterPlaceholder = input<string>('Search...');
  filterMatchMode = input<CzMultiSelectFilterMatchMode>('contains');
  emptyMessage = input<string>('No results found');
  emptyFilterMessage = input<string>('No results found');
  showClear = input<boolean>(false);
  loading = input<boolean>(false);
  scrollHeight = input<string>('200px');
  resetFilterOnHide = input<boolean>(false);
  virtualScroll = input<boolean>(false);
  virtualScrollItemSize = input<number>(34);
  lazy = input<boolean>(false);
  focusOnHover = input<boolean>(true);
  selectOnFocus = input<boolean>(false);
  autoOptionFocus = input<boolean>(false);
  autofocusFilter = input<boolean>(false);
  /** When bound (not null), the select-all checkbox delegates the logic to onSelectAllChange */
  selectAll = input<boolean | null>(null);
  panelStyleClass = input<string>('');

  // Icons
  dropdownIcon = input<LucideIconInput>(LucideChevronDown);
  clearIcon = input<LucideIconInput>(LucideX);
  filterIcon = input<LucideIconInput>(LucideSearch);
  chipIcon = input<LucideIconInput>(LucideX);
  loadingIcon = input<LucideIconInput>(LucideLoader2);

  // Slot Templates
  itemTemplate = contentChild<TemplateRef<any>>('itemTemplate');
  groupTemplate = contentChild<TemplateRef<any>>('groupTemplate');
  headerTemplate = contentChild<TemplateRef<any>>('headerTemplate');
  footerTemplate = contentChild<TemplateRef<any>>('footerTemplate');
  filterTemplate = contentChild<TemplateRef<any>>('filterTemplate');
  selectedItemsTemplate = contentChild<TemplateRef<any>>('selectedItemsTemplate');
  emptyTemplate = contentChild<TemplateRef<any>>('emptyTemplate');
  emptyFilterTemplate = contentChild<TemplateRef<any>>('emptyFilterTemplate');
  dropdownIconTemplate = contentChild<TemplateRef<any>>('dropdownIconTemplate');
  clearIconTemplate = contentChild<TemplateRef<any>>('clearIconTemplate');
  filterIconTemplate = contentChild<TemplateRef<any>>('filterIconTemplate');
  chipIconTemplate = contentChild<TemplateRef<any>>('chipIconTemplate');
  removeTokenIconTemplate = contentChild<TemplateRef<any>>('removeTokenIconTemplate');
  headerCheckboxIconTemplate = contentChild<TemplateRef<any>>('headerCheckboxIconTemplate');
  itemCheckboxIconTemplate = contentChild<TemplateRef<any>>('itemCheckboxIconTemplate');
  loadingIconTemplate = contentChild<TemplateRef<any>>('loadingIconTemplate');

  @ViewChild('filterInput') filterInput?: ElementRef<HTMLInputElement>;
  @ViewChild('triggerEl') triggerEl?: ElementRef<HTMLElement>;
  @ViewChild('panelEl') panelEl?: ElementRef<HTMLElement>;

  // Icons for template usage
  readonly ChevronDownIcon = LucideChevronDown;
  readonly XIcon = LucideX;
  readonly SearchIcon = LucideSearch;
  readonly LoaderIcon = LucideLoader2;

  // Local State
  value = signal<any[]>([]);
  isOpen = signal<boolean>(false);
  isFocused = signal<boolean>(false);
  filterValue = signal<string>('');
  formsDisabled = signal<boolean>(false);
  highlightedIndex = signal<number>(-1);
  panelScrollTop = signal<number>(0);

  private static nextId = 0;
  private readonly autoId = `cz-multiselect-${++CzMultiSelectComponent.nextId}`;
  readonly effectiveInputId = computed(() => this.inputId() || this.autoId);
  readonly panelId = computed(() => `${this.effectiveInputId()}-panel`);

  // Outputs
  onChangeEvent = output<CzMultiSelectChangeEvent>({ alias: 'onChange' });
  onFilterEvent = output<CzMultiSelectFilterEvent>({ alias: 'onFilter' });
  onFocusEvent = output<Event>({ alias: 'onFocus' });
  onBlurEvent = output<Event>({ alias: 'onBlur' });
  onClickEvent = output<MouseEvent>({ alias: 'onClick' });
  onClearEvent = output<Event>({ alias: 'onClear' });
  onPanelShowEvent = output<Event>({ alias: 'onPanelShow' });
  onPanelHideEvent = output<Event>({ alias: 'onPanelHide' });
  onLazyLoadEvent = output<CzMultiSelectLazyLoadEvent>({ alias: 'onLazyLoad' });
  onRemoveEvent = output<CzMultiSelectRemoveEvent>({ alias: 'onRemove' });
  onSelectAllChangeEvent = output<CzMultiSelectSelectAllChangeEvent>({ alias: 'onSelectAllChange' });

  // Computeds
  readonly isFilled = computed(() => this.filled() || this.variant() === 'filled');
  readonly actualDisabled = computed(() => this.disabled() || this.formsDisabled());
  readonly showClearButton = computed(() => this.showClear() && !this.actualDisabled() && !this.readonly());

  hasValue = computed(() => Array.isArray(this.value()) && this.value().length > 0);

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

  private isEqual(a: any, b: any): boolean {
    const key = this.dataKey();
    if (key && a && b && typeof a === 'object' && typeof b === 'object') {
      return a[key] === b[key];
    }
    return a === b;
  }

  readonly maxSelectionLimitReached = computed(() => {
    const limit = this.selectionLimit();
    return !!limit && this.value().length >= limit;
  });

  isOptionDisabled(option: any): boolean {
    if (this.maxSelectionLimitReached() && !this.isSelected(option)) return true;
    const optionDisabled = this.optionDisabled();
    if (typeof optionDisabled === 'function') return !!optionDisabled(option);
    if (typeof optionDisabled === 'string' && optionDisabled) return !!option?.[optionDisabled];
    if (option?.disabled !== undefined) return !!option.disabled;
    return false;
  }

  isSelected(option: any): boolean {
    const optionValue = this.getOptionValue(option);
    return this.value().some((val) => this.isEqual(val, optionValue));
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

  readonly filteredOptions = computed<any[]>(() => {
    if (this.group()) {
      return this.filteredGroups().flatMap((group) =>
        Array.isArray(group?.[this.optionGroupChildren()]) ? group[this.optionGroupChildren()] : [],
      );
    }
    const query = this.filterValue().trim().toLowerCase();
    const all = this.options() || [];
    if (!query || !this.filter()) return all;
    return all.filter((option) => this.matchesFilter(option, query));
  });

  readonly groupOptions = computed<Record<number, any[]>>(() => {
    const map: Record<number, any[]> = {};
    this.filteredGroups().forEach((group, index) => {
      map[index] = group?.[this.optionGroupChildren()] || [];
    });
    return map;
  });

  // --- Selection state ---
  readonly allSelected = computed(() => {
    const valid = this.filteredOptions().filter((opt) => !this.isOptionDisabled(opt) || this.isSelected(opt));
    if (!valid.length) return false;
    return valid.every((opt) => this.isSelected(opt));
  });

  readonly partialSelected = computed(() => {
    const valid = this.filteredOptions();
    if (!valid.length) return false;
    const selectedCount = valid.filter((opt) => this.isSelected(opt)).length;
    return selectedCount > 0 && selectedCount < valid.length;
  });

  readonly selectedItemsLabelText = computed(() => {
    const count = this.value().length;
    return this.selectedItemsLabel().replace(/\{.*?\}/, String(count));
  });

  /** Comma label or overflow message */
  readonly displayLabel = computed(() => {
    const values = this.value();
    if (!values.length || !this.displaySelectedLabel()) return '';
    const max = this.maxSelectedLabels();
    if (max && values.length > max) {
      return this.selectedItemsLabelText();
    }
    return values.map((val) => this.labelByValue(val)).join(', ');
  });

  labelByValue(value: any): string {
    const flat = this.group()
      ? (this.options() || []).flatMap((group) => group?.[this.optionGroupChildren()] || [])
      : this.options() || [];
    const found = flat.find((opt) => this.isEqual(this.getOptionValue(opt), value));
    if (found) return this.getOptionLabel(found);
    return typeof value === 'object' ? this.getOptionLabel(value) : String(value ?? '');
  }

  // --- Virtual scroll windowing ---
  private readonly panelHeight = computed(() => {
    const parsed = parseInt(this.scrollHeight() || '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 200;
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
    this.value.set(Array.isArray(val) ? val : val !== null && val !== undefined ? [val] : []);
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

    if (this.filter() && this.autofocusFilter()) {
      setTimeout(() => this.filterInput?.nativeElement.focus(), 0);
    }

    this.onPanelShowEvent.emit(new Event('show'));
    this.emitLazyLoad();
  }

  hide(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    if (this.resetFilterOnHide()) {
      this.filterValue.set('');
    }
    this.highlightedIndex.set(-1);
    this.onTouched();
    this.onPanelHideEvent.emit(new Event('hide'));
  }

  focus(): void {
    this.triggerEl?.nativeElement.focus();
  }

  // --- Interaction ---
  onTriggerClick(event: MouseEvent): void {
    if (this.actualDisabled()) return;
    this.onClickEvent.emit(event);
    this.toggleDropdown();
  }

  toggleOption(option: any, event?: Event): void {
    if (this.actualDisabled() || this.readonly() || this.isOptionDisabled(option)) return;
    const optionValue = this.getOptionValue(option);
    const arr = [...this.value()];
    const index = arr.findIndex((val) => this.isEqual(val, optionValue));

    if (index > -1) {
      arr.splice(index, 1);
      this.updateModel(arr, event);
      this.onRemoveEvent.emit({ originalEvent: event ?? new Event('remove'), value: optionValue });
    } else {
      if (this.maxSelectionLimitReached()) return;
      arr.push(optionValue);
      this.updateModel(arr, event);
    }
  }

  /** PrimeNG parity method */
  updateModel(value: any[], event?: Event): void {
    this.value.set(Array.isArray(value) ? value : []);
    this.onChange(this.value());
    this.onChangeEvent.emit({ originalEvent: event ?? new Event('change'), value: this.value() });
  }

  removeOption(value: any, event: Event): void {
    event.stopPropagation();
    if (this.actualDisabled() || this.readonly()) return;
    const arr = this.value().filter((val) => !this.isEqual(val, value));
    this.updateModel(arr, event);
    this.onRemoveEvent.emit({ originalEvent: event, value });
  }

  onToggleAll(event: Event, checked: boolean): void {
    if (this.actualDisabled() || this.readonly()) return;

    if (this.selectAll() !== null) {
      // Developer manages the selection through onSelectAllChange
      this.onSelectAllChangeEvent.emit({ originalEvent: event, checked: !this.allSelected() });
      return;
    }

    const arr = checked
      ? this.filteredOptions()
          .filter((opt) => !this.isOptionDisabled(opt) || this.isSelected(opt))
          .map((opt) => this.getOptionValue(opt))
      : [];
    const unique = [...new Set(arr)];
    const limited = this.selectionLimit() ? unique.slice(0, this.selectionLimit()) : unique;
    this.updateModel(limited, event);
    this.onSelectAllChangeEvent.emit({ originalEvent: event, checked: checked });
  }

  clear(event?: Event): void {
    event?.stopPropagation();
    if (this.actualDisabled() || this.readonly()) return;
    this.updateModel([], event);
    this.onClearEvent.emit(event ?? new Event('clear'));
    this.filterValue.set('');
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
  readonly filterOptions: CzMultiSelectFilterOptions = {
    filter: (event: Event) => this.onFilterInput(event),
    reset: () => this.resetFilter(),
  };

  // --- Mouse interactions ---
  onOptionHover(index: number): void {
    if (this.focusOnHover()) {
      this.highlightedIndex.set(index);
    }
  }

  onOptionClick(option: any, index: number, event: MouseEvent): void {
    if (this.focusOnHover()) this.highlightedIndex.set(index);
    this.toggleOption(option, event);
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
        if (this.selectOnFocus()) this.toggleHighlighted(next, event);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!options.length) return;
        const previous = index > 0 ? index - 1 : options.length - 1;
        this.highlightedIndex.set(previous);
        this.scrollToHighlighted(previous);
        if (this.selectOnFocus()) this.toggleHighlighted(previous, event);
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
          this.toggleOption(options[index], event);
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
        if (this.filterValue() === '' && this.value().length > 0) {
          const arr = [...this.value()];
          const removed = arr.pop();
          this.updateModel(arr, event);
          this.onRemoveEvent.emit({ originalEvent: event, value: removed });
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

  private toggleHighlighted(index: number, event: Event): void {
    const option = this.filteredOptions()[index];
    if (!option || this.isOptionDisabled(option)) return;
    this.toggleOption(option, event);
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

  readonly activeDescendant = computed(() => {
    const index = this.highlightedIndex();
    return index > -1 && this.isOpen() ? this.optionId(index) : null;
  });
}
