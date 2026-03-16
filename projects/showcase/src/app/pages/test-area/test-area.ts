import { ChangeDetectionStrategy, Component, inject, Renderer2 } from '@angular/core';
import { DOCUMENT, JsonPipe, SlicePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CzInputTextComponent, CzCheckboxComponent, CzInputNumberDirective, CzAutocompleteComponent, CzPasswordComponent, CzSelectComponent, CzValidationLocale } from 'codezium-ui';

interface TestForm {
  email: FormControl<string | null>;
  username: FormControl<string | null>;
  disabledField: FormControl<string | null>;
  // Checkbox test fields
  termsAccepted: FormControl<boolean | null>;
  fruits: FormControl<string[] | null>;
  privacyAccepted: FormControl<boolean | null>;
  disabledChecked: FormControl<boolean | null>;

  // Input Number test fields
  price: FormControl<number | null>;
  weight: FormControl<number | null>;
  percentage: FormControl<number | null>;

  // Native Input test fields
  nativePrice: FormControl<number | null>;
  nativePercentage: FormControl<number | null>;

  // Autocomplete test fields
  autoBasic: FormControl<string | null>;
  autoObj: FormControl<any | null>;
  autoDropdown: FormControl<any | null>;
  autoMultiple: FormControl<any[] | null>;
  autoFloat: FormControl<string | null>;
  autoOver: FormControl<string | null>;
  autoIn: FormControl<string | null>;
  // Password test fields
  passBasic: FormControl<string | null>;
  passToggle: FormControl<string | null>;
  passFeedback: FormControl<string | null>;
  passValidation: FormControl<string | null>;
  passFloat: FormControl<string | null>;
  passOver: FormControl<string | null>;
  passIn: FormControl<string | null>;
  // Select test fields
  selectBasic: FormControl<any | null>;
  selectFilter: FormControl<any | null>;
  selectClear: FormControl<any | null>;
  selectValidation: FormControl<any | null>;
}

@Component({
  selector: 'app-test-area',
  imports: [ReactiveFormsModule, FormsModule, CzInputTextComponent, CzCheckboxComponent, CzInputNumberDirective, CzAutocompleteComponent, CzPasswordComponent, CzSelectComponent, JsonPipe, SlicePipe],
  templateUrl: './test-area.html',
  styleUrl: './test-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestArea {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  templateDrivenValue = false;

  testForm = new FormGroup<TestForm>({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    disabledField: new FormControl({ value: 'Cannot edit me', disabled: true }),

    // Checkboxes
    termsAccepted: new FormControl(false),
    fruits: new FormControl(['Apple']),
    privacyAccepted: new FormControl(true),
    disabledChecked: new FormControl({ value: true, disabled: true }),

    price: new FormControl(1250.50),
    weight: new FormControl(null),
    percentage: new FormControl(50),

    nativePrice: new FormControl(500.25),
    nativePercentage: new FormControl(25),

    autoBasic: new FormControl('', Validators.required),
    autoObj: new FormControl(null),
    autoDropdown: new FormControl(null),
    autoMultiple: new FormControl([], Validators.required),
    autoFloat: new FormControl(''),
    autoOver: new FormControl(''),
    autoIn: new FormControl(''),
    passBasic: new FormControl(''),
    passToggle: new FormControl(''),
    passFeedback: new FormControl(''),
    passValidation: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passFloat: new FormControl(''),
    passOver: new FormControl(''),
    passIn: new FormControl(''),
    selectBasic: new FormControl(null),
    selectFilter: new FormControl(null),
    selectClear: new FormControl(null),
    selectValidation: new FormControl(null, Validators.required)
  });

  // Autocomplete Data & Logic
  countries = [
    { name: 'Argentina', code: 'AR' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Canada', code: 'CA' },
    { name: 'Colombia', code: 'CO' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'Italy', code: 'IT' },
    { name: 'Japan', code: 'JP' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'UK' }
  ];
  filteredCountries: any[] = [];
  filteredBasic: string[] = [];

  filterCountries(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCountries = this.countries.filter(c => c.name.toLowerCase().includes(query));
  }

  filterBasic(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBasic = this.countries.map(c => c.name).filter(name => name.toLowerCase().includes(query));
  }

  // Dynamic Array Categories
  categories: any[] = [
      { name: 'Accounting', key: 'A' },
      { name: 'Marketing', key: 'M' },
      { name: 'Production', key: 'P' },
      { name: 'Research', key: 'R' }
  ];
  selectedCategories: any[] = [this.categories[1]];

  // State Signals (can be bound to the header toggles)
  isDarkMode = false;
  activeTheme = 'base'; // 'base', 'glass', 'neo'
  activeLocale: CzValidationLocale = 'en';

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(this.document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(this.document.documentElement, 'dark');
    }
  }

  setTheme(theme: string) {
    this.activeTheme = theme;
    this.renderer.setAttribute(this.document.documentElement, 'data-theme', theme);
  }

  setLocale(locale: string) {
    this.activeLocale = locale as CzValidationLocale;
    // We mark the form controls as touched and update their value and validity so the error messages refresh instantly.
    Object.values(this.testForm.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }
}
