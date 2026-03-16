import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CzSelectComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SELECT_DOC_I18N } from './select-doc.i18n';

@Component({
  selector: 'cz-select-doc-page',
  standalone: true,
  imports: [CzSelectComponent, AppCodeComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-page">
      <h1 id="select">{{ t().title }}</h1>
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
        <div class="cz-mb-md" style="max-width: 300px;">
          <cz-select 
            [options]="cities" 
            optionLabel="name" 
            optionValue="code"
            placeholder="Select a City">
          </cz-select>
        </div>
        <app-code [code]="basicCode" />
      </section>

      <!-- ── FILTERING ── -->
      <section>
        <h2 id="filter">{{ t().filterTitle }}</h2>
        <p [innerHTML]="t().filterDesc"></p>
        <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
          <cz-select [options]="cities" optionLabel="name" [filterable]="true" placeholder="Search cities"></cz-select>
        </div>
        <app-code [code]="filterCode" />
      </section>

      <!-- ── CLEARABLE ── -->
      <section>
        <h2 id="clear">{{ t().clearTitle }}</h2>
        <p [innerHTML]="t().clearDesc"></p>
        <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
          <cz-select [options]="cities" optionLabel="name" [clearable]="true" placeholder="Clearable cities"></cz-select>
        </div>
        <app-code [code]="clearCode" />
      </section>

      <!-- ── LABELS ── -->
      <section>
        <h2 id="labels">{{ t().labelsTitle }}</h2>
        <p [innerHTML]="t().labelsDesc"></p>
        <div class="cz-grid cz-grid-cols-1 md:cz-grid-cols-2 cz-gap-lg cz-mb-md">
          <div class="cz-flex cz-flex-col cz-gap-xs">
            <cz-select [options]="cities" optionLabel="name" label="No Position" labelPosition="none" placeholder="Select one"></cz-select>
          </div>
          <div class="cz-flex cz-flex-col cz-gap-xs">
            <cz-select [options]="cities" optionLabel="name" label="Over Label" labelPosition="over" placeholder="Select one"></cz-select>
          </div>
          <div class="cz-flex cz-flex-col cz-gap-xs">
            <cz-select [options]="cities" optionLabel="name" label="Inner Label" labelPosition="in" placeholder="Select one"></cz-select>
          </div>
          <div class="cz-flex cz-flex-col cz-gap-xs">
            <cz-select [options]="cities" optionLabel="name" label="Floating Label" labelPosition="float" placeholder="Select one"></cz-select>
          </div>
        </div>
        <app-code [code]="labelsCode" />
      </section>

      <!-- ── THEMES ── -->
      <section>
        <h2 id="themes">{{ t().themesTitle }}</h2>
        <p [innerHTML]="t().themesDesc"></p>
        <div class="cz-grid cz-grid-cols-1 md:cz-grid-cols-3 cz-gap-md cz-mb-md">
          <div class="cz-p-md cz-border cz-rounded-lg" style="background: var(--cz-theme-surface);">
            <small class="cz-text-muted cz-mb-sm cz-display-block">Base</small>
            <cz-select [options]="cities" optionLabel="name" label="Base theme"></cz-select>
          </div>
          <div class="cz-p-md cz-border cz-rounded-lg" data-theme="glass">
            <small class="cz-text-muted cz-mb-sm cz-display-block">Glass</small>
            <cz-select [options]="cities" optionLabel="name" label="Glass theme"></cz-select>
          </div>
          <div class="cz-p-md cz-border cz-rounded-lg" data-theme="neo">
            <small class="cz-text-muted cz-mb-sm cz-display-block">Neo</small>
            <cz-select [options]="cities" optionLabel="name" label="Neo theme"></cz-select>
          </div>
        </div>
      </section>

      <!-- ── COLORS ── -->
      <section>
        <h2 id="colors">{{ t().colorsTitle }}</h2>
        <p [innerHTML]="t().colorsDesc"></p>
        <div class="cz-grid cz-grid-cols-2 md:cz-grid-cols-3 cz-gap-lg cz-mb-md">
          <cz-select color="primary" label="Primary" [options]="cities" optionLabel="name"></cz-select>
          <cz-select color="secondary" label="Secondary" [options]="cities" optionLabel="name"></cz-select>
          <div class="cz-p-sm cz-rounded-md" style="background: #111827;">
            <cz-select color="dark" label="Dark Variant" [options]="cities" optionLabel="name"></cz-select>
          </div>
          <cz-select color="success" label="Success" [options]="cities" optionLabel="name"></cz-select>
          <cz-select color="danger" label="Danger" [options]="cities" optionLabel="name"></cz-select>
        </div>
        <app-code [code]="colorsCode" />
      </section>

      <!-- ── API ── -->
      <section>
        <h2 id="api">{{ t().apiTitle }}</h2>
        <div class="doc-table-wrapper">
          <table class="doc-table">
            <thead>
              <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td><code>options</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>An array of objects to display as options.</td></tr>
              <tr><td><code>optionLabel</code></td><td><code>string</code></td><td><code>null</code></td><td>Property name or getter function to use as the label of an option.</td></tr>
              <tr><td><code>optionValue</code></td><td><code>string</code></td><td><code>null</code></td><td>Property name or getter function to use as the value of an option.</td></tr>
              <tr><td><code>filter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When specified, displays a filter input in the panel.</td></tr>
              <tr><td><code>showClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When enabled, a clear icon is displayed to clear the value.</td></tr>
              <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>null</code></td><td>Default text to display when no option is selected.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `
})
export class SelectDocPage {
  private readonly lang = inject(LanguageService);
  readonly t = computed(() => SELECT_DOC_I18N[this.lang.currentLang() as keyof typeof SELECT_DOC_I18N]);

  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

  importCode: Code = {
    typescript: `import { CzSelectComponent } from 'codezium-ui';`
  };

  basicCode: Code = {
    html: `<cz-select 
  [options]="cities" 
  optionLabel="name" 
  optionValue="code" 
  placeholder="Select a City"
  [formControl]="cityControl">
</cz-select>`,
    typescript: `import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CzSelectComponent } from 'codezium-ui';

@Component({
  imports: [CzSelectComponent, ReactiveFormsModule],
  template: '...'
})
export class MyComponent {
  cityControl = new FormControl('NY');

  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];
}`
  };

  filterCode: Code = {
    html: `<cz-select [options]="cities" optionLabel="name" [filterable]="true"></cz-select>`,
    typescript: `// Component logic remains the same. 
// Just add [filterable]="true" to the template.`
  };

  clearCode: Code = {
    html: `<cz-select [options]="cities" optionLabel="name" [clearable]="true"></cz-select>`,
    typescript: `// Component logic remains the same. 
// Just add [clearable]="true" to the template.`
  };

  labelsCode: Code = {
    html: `<cz-select label="No Position" labelPosition="none" ...></cz-select>
<cz-select label="Over Label" labelPosition="over" ...></cz-select>
<cz-select label="Inner Label" labelPosition="in" ...></cz-select>
<cz-select label="Floating Label" labelPosition="float" ...></cz-select>`,
    typescript: `// Use the labelPosition property to change how labels are displayed.
// Valid values: 'none', 'over', 'in', 'float'.`
  };

  colorsCode: Code = {
    html: `<cz-select color="primary" ...></cz-select>
<cz-select color="secondary" ...></cz-select>
<cz-select color="dark" ...></cz-select>
<cz-select color="success" ...></cz-select>
<cz-select color="danger" ...></cz-select>`,
    typescript: `// Use the color property to change the component variant.
// Valid colors: 'primary', 'secondary', 'dark', 'success', 'danger', 'warning', 'info'.`
  };
}
