import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CzAutocompleteComponent } from '../../../../../../../codezium-ui/src/public-api';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { AUTOCOMPLETE_DOC_I18N } from './autocomplete-doc.i18n';

@Component({
    selector: 'cz-autocomplete-doc-page',
    imports: [CzAutocompleteComponent, AppCodeComponent, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="autocomplete">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <!-- ── IMPORT ── -->
            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC USAGE ── -->
            <section>
                <h2 id="basic-usage">{{ t().basicTitle }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md">
                    <cz-autocomplete 
                        label="Country" 
                        [suggestions]="filteredBasic"
                        (completeMethod)="filterBasic($event)"
                        placeholder="Search...">
                    </cz-autocomplete>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── OBJECTS & DROPDOWN ── -->
            <section>
                <h2 id="objects-dropdown">{{ t().itemsTitle }}</h2>
                <p [innerHTML]="t().itemsDesc"></p>
                <div class="cz-mb-md">
                    <cz-autocomplete 
                        label="Select Country" 
                        [suggestions]="filteredCountries"
                        (completeMethod)="filterCountries($event)"
                        field="name"
                        [dropdown]="true"
                        placeholder="Choose from dropdown">
                    </cz-autocomplete>
                </div>
                <app-code [code]="itemsCode" />
            </section>

            <!-- ── MULTIPLE (CHIPS) ── -->
            <section>
                <h2 id="multiple">{{ t().multipleTitle }}</h2>
                <p [innerHTML]="t().multipleDesc"></p>
                <div class="cz-mb-md">
                    <cz-autocomplete 
                        label="Categories" 
                        [suggestions]="filteredCategories"
                        (completeMethod)="filterCategories($event)"
                        field="name"
                        [multiple]="true"
                        [fluid]="true"
                        color="warning"
                        placeholder="Add categories...">
                    </cz-autocomplete>
                </div>
                <app-code [code]="multipleCode" />
            </section>

            <!-- ── LABELS ── -->
            <section>
                <h2 id="labels">{{ t().labelsTitle }}</h2>
                <p [innerHTML]="t().labelsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md cz-items-end">
                    <cz-autocomplete label="No Position" labelPosition="none" placeholder="Type here"></cz-autocomplete>
                    <cz-autocomplete label="Over Label" labelPosition="over" placeholder="Type here"></cz-autocomplete>
                    <cz-autocomplete label="Inner Label" labelPosition="in" placeholder="Type here"></cz-autocomplete>
                    <cz-autocomplete label="Floating Label" labelPosition="float" placeholder="Type here"></cz-autocomplete>
                </div>
                <app-code [code]="labelsCode" />
            </section>

            <!-- ── COLORS & STATES ── -->
            <section>
                <h2 id="colors">{{ t().colorsTitle }}</h2>
                <p [innerHTML]="t().colorsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-autocomplete label="Primary Options" color="primary" labelPosition="float" [multiple]="true" [dropdown]="true"></cz-autocomplete>
                    <cz-autocomplete label="Success Input" color="success" labelPosition="over"></cz-autocomplete>
                    <cz-autocomplete label="Disabled" [disabled]="true" [filled]="true" labelPosition="float"></cz-autocomplete>
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().apiTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>{{ t().table.prop }}</th><th>{{ t().table.type }}</th><th>{{ t().table.default }}</th><th>{{ t().table.desc }}</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>suggestions</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>Array of suggestions to display</td></tr>
                            <tr><td><code>field</code></td><td><code>string</code></td><td><code>''</code></td><td>Field of the object to be displayed</td></tr>
                            <tr><td><code>dropdown</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays a button to trigger the dropdown</td></tr>
                            <tr><td><code>multiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Specifies if multiple values can be selected</td></tr>
                            <tr><td><code>minLength</code></td><td><code>number</code></td><td><code>1</code></td><td>Minimum characters to trigger search</td></tr>
                            <tr><td><code>delay</code></td><td><code>number</code></td><td><code>300</code></td><td>Delay between keystrokes in ms</td></tr>
                            <tr><td><code>forceSelection</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Clears input if unselected text is entered</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
})
export class AutocompleteDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => AUTOCOMPLETE_DOC_I18N[this.lang.currentLang() as keyof typeof AUTOCOMPLETE_DOC_I18N]);
    readonly AUTOCOMPLETE_DOC_I18N = AUTOCOMPLETE_DOC_I18N; 

    // ---- Data ----
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
    categories = [
        { name: 'Accounting', key: 'A' },
        { name: 'Marketing', key: 'M' },
        { name: 'Production', key: 'P' },
        { name: 'Research', key: 'R' }
    ];

    filteredBasic: string[] = [];
    filteredCountries: any[] = [];
    filteredCategories: any[] = [];

    // ---- Filtering Methods ----
    filterBasic(event: any) {
        const query = event.query.toLowerCase();
        this.filteredBasic = this.countries.map(c => c.name).filter(name => name.toLowerCase().includes(query));
    }

    filterCountries(event: any) {
        const query = event.query.toLowerCase();
        this.filteredCountries = this.countries.filter(c => c.name.toLowerCase().includes(query));
    }
    
    filterCategories(event: any) {
        const query = event.query.toLowerCase();
        this.filteredCategories = this.categories.filter(c => c.name.toLowerCase().includes(query));
    }

    // ---- Code Snippets ----
    importCode: Code = {
        typescript: `import { CzAutocompleteComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-autocomplete 
  label="Country" 
  [suggestions]="filteredBasic"
  (completeMethod)="filterBasic($event)"
  placeholder="Search...">
</cz-autocomplete>`,
        typescript: `import { Component } from '@angular/core';
import { CzAutocompleteComponent } from 'codezium-ui';

@Component({
  standalone: true,
  imports: [CzAutocompleteComponent],
  template: '...'
})
export class MyComponent {
  countries = [
    { name: 'Argentina' }, { name: 'Brazil' },
    { name: 'Canada' }, { name: 'Spain' }
  ];
  filteredBasic: string[] = [];

  filterBasic(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBasic = this.countries
      .map(c => c.name)
      .filter(name => name.toLowerCase().includes(query));
  }
}`
    };

    itemsCode: Code = {
        html: `<cz-autocomplete 
  label="Select Country" 
  [suggestions]="filteredCountries"
  (completeMethod)="filterCountries($event)"
  field="name"
  [dropdown]="true"
  placeholder="Choose from dropdown">
</cz-autocomplete>`,
        typescript: `import { Component } from '@angular/core';
import { CzAutocompleteComponent } from 'codezium-ui';

@Component({
  standalone: true,
  imports: [CzAutocompleteComponent],
  template: '...'
})
export class MyComponent {
  countries = [
    { name: 'Argentina', code: 'AR' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Mexico', code: 'MX' }
  ];
  filteredCountries: any[] = [];

  filterCountries(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCountries = this.countries.filter(c => 
      c.name.toLowerCase().includes(query)
    );
  }
}`
    };

    multipleCode: Code = {
        html: `<cz-autocomplete 
  label="Categories" 
  [suggestions]="filteredCategories"
  (completeMethod)="filterCategories($event)"
  field="name"
  [multiple]="true"
  [fluid]="true"
  color="warning"
  placeholder="Add categories...">
</cz-autocomplete>`,
        typescript: `import { Component } from '@angular/core';
import { CzAutocompleteComponent } from 'codezium-ui';

@Component({
  standalone: true,
  imports: [CzAutocompleteComponent],
  template: '...'
})
export class MyComponent {
  categories = [
    { name: 'Accounting', key: 'A' },
    { name: 'Marketing', key: 'M' },
    { name: 'Production', key: 'P' },
    { name: 'Research', key: 'R' }
  ];
  filteredCategories: any[] = [];

  filterCategories(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCategories = this.categories.filter(c => 
      c.name.toLowerCase().includes(query)
    );
  }
}`
    };

    labelsCode: Code = {
        html: `<cz-autocomplete label="No Position" labelPosition="none" placeholder="Type here"></cz-autocomplete>
<cz-autocomplete label="Over Label" labelPosition="over" placeholder="Type here"></cz-autocomplete>
<cz-autocomplete label="Inner Label" labelPosition="in" placeholder="Type here"></cz-autocomplete>
<cz-autocomplete label="Floating Label" labelPosition="float" placeholder="Type here"></cz-autocomplete>`
    };

    colorsCode: Code = {
        html: `<cz-autocomplete label="Primary Options" color="primary" labelPosition="float" [multiple]="true" [dropdown]="true"></cz-autocomplete>
<cz-autocomplete label="Success Input" color="success" labelPosition="over"></cz-autocomplete>
<cz-autocomplete label="Disabled" [disabled]="true" [filled]="true" labelPosition="float"></cz-autocomplete>`
    };
}
