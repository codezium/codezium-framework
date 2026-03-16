import {
  Component,
  input,
  computed,
  signal,
  ElementRef,
  ViewChild,
  OnInit,
  Optional,
  Self,
  HostListener,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl, FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronDown, Check, X } from 'lucide-angular';
import { CzInputSize, CzLabelPosition, CzInputColor } from '../../types';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';

@Component({
  selector: 'cz-select',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CzSelectComponent implements ControlValueAccessor, OnInit {
  // Common Inputs
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

  // Select Specific Inputs
  options = input<any[]>([]);
  optionLabel = input<string>('');
  optionValue = input<string>('');
  filterable = input<boolean>(false);
  clearable = input<boolean>(false);
  emptyMessage = input<string>('No results found');
  filterPlaceholder = input<string>('Search...');

  @ViewChild('filterInput') filterInput?: ElementRef<HTMLInputElement>;

  // Icons
  readonly ChevronDownIcon = ChevronDown;
  readonly CheckIcon = Check;
  readonly XIcon = X;

  // Local State
  value = signal<any>(null);
  isOpen = signal<boolean>(false);
  isFocused = signal<boolean>(false);
  filterValue = signal<string>('');
  formsDisabled = signal<boolean>(false);
  hoveredIndex = signal<number>(-1);

  // Computeds
  actualDisabled = computed(() => this.disabled() || this.formsDisabled());
  
  hasValue = computed(() => {
    const val = this.value();
    return val !== null && val !== undefined && val !== '';
  });

  actualPlaceholder = computed(() => {
    // Hide placeholder when label is occupying the center
    const positionsToHide: CzLabelPosition[] = ['float', 'in', 'over'];
    const isFloatingActive = this.isFocused() || this.isOpen() || this.hasValue();
    if (positionsToHide.includes(this.labelPosition()) && this.label()) {
      return isFloatingActive ? this.placeholder() : '';
    }
    return this.placeholder();
  });

  filteredOptions = computed(() => {
    const query = this.filterValue().toLowerCase();
    const all = this.options();
    if (!query || !this.filterable()) return all;

    return all.filter(opt => {
      const label = this.getLabel(opt).toLowerCase();
      return label.includes(query);
    });
  });

  selectedLabel = computed(() => {
    const val = this.value();
    if (val === null || val === undefined || val === '') return '';
    
    const option = this.options().find(opt => this.getValue(opt) === val);
    return option ? this.getLabel(option) : String(val);
  });

  // ControlValueAccessor
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private el: ElementRef
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {}

  // Helpers
  getLabel(option: any): string {
    if (!option) return '';
    if (typeof option === 'string' || typeof option === 'number') return String(option);
    const labelKey = this.optionLabel();
    return labelKey ? option[labelKey] : String(option);
  }

  getValue(option: any): any {
    if (!option) return null;
    if (typeof option === 'string' || typeof option === 'number') return option;
    const valueKey = this.optionValue();
    return valueKey ? option[valueKey] : option;
  }

  // Validations
  get isInvalid(): boolean {
    if (!this.ngControl) return false;
    return !!(this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty));
  }

  get errorMessage(): string | null {
    if (!this.isInvalid || !this.ngControl?.errors) return null;
    const dictionary = {
      ...CZ_VALIDATION_MESSAGES[this.locale()],
      ...this.customErrors()
    };

    for (const key of Object.keys(this.ngControl.errors)) {
      const mappedError: any = dictionary[key as keyof typeof dictionary];
      if (mappedError) {
        if (typeof mappedError === 'function') {
          return mappedError(this.ngControl.errors[key].requiredLength || this.ngControl.errors[key]);
        }
        return mappedError;
      }
    }
    return dictionary.default;
  }

  // CVA Methods
  writeValue(val: any): void {
    this.value.set(val);
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

  // Interaction
  toggleDropdown(): void {
    if (this.actualDisabled()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.isOpen.set(true);
    this.isFocused.set(true);
    if (this.filterable()) {
      setTimeout(() => this.filterInput?.nativeElement.focus(), 0);
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.filterValue.set('');
    this.hoveredIndex.set(-1);
    this.onTouched();
  }

  onOptionSelect(option: any): void {
    const val = this.getValue(option);
    this.value.set(val);
    this.onChange(val);
    this.close();
  }

  clear(event: Event): void {
    event.stopPropagation();
    this.value.set(null);
    this.onChange(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      if (this.isOpen()) this.close();
      this.isFocused.set(false);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.actualDisabled()) return;

    if (!this.isOpen()) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.open();
      }
      return;
    }

    const options = this.filteredOptions();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.hoveredIndex.update(i => (i < options.length - 1 ? i + 1 : i));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.hoveredIndex.update(i => (i > 0 ? i - 1 : 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (this.hoveredIndex() >= 0) {
          this.onOptionSelect(options[this.hoveredIndex()]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'Tab':
        this.close();
        this.isFocused.set(false);
        break;
    }
  }
}
