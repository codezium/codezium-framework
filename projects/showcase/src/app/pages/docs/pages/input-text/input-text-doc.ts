import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CzInputTextComponent } from '../../../../../../../codezium-ui/src/public-api';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { INPUT_TEXT_DOC_I18N } from './input-text-doc.i18n';

@Component({
    selector: 'cz-input-text-doc-page',
    imports: [CzInputTextComponent, AppCodeComponent, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="input-text">{{ t().title }}</h1>
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
                    <cz-input-text label="Username" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── LABELS ── -->
            <section>
                <h2 id="labels">{{ t().labelsTitle }}</h2>
                <p [innerHTML]="t().labelsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md cz-items-end">
                    <cz-input-text label="No Position" labelPosition="none" placeholder="Type here" />
                    <cz-input-text label="Over Label" labelPosition="over" placeholder="Type here" />
                    <cz-input-text label="Inner Label" labelPosition="in" placeholder="Type here" />
                    <cz-input-text label="Floating Label" labelPosition="float" placeholder="Type here" />
                </div>
                <app-code [code]="labelsCode" />
            </section>

            <!-- ── SIZES ── -->
            <section>
                <h2 id="sizes">{{ t().sizesTitle }}</h2>
                <p [innerHTML]="t().sizesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md cz-items-end">
                    <cz-input-text label="Small" size="sm" labelPosition="float" />
                    <cz-input-text label="Medium" size="md" labelPosition="float" />
                    <cz-input-text label="Large" size="lg" labelPosition="float" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <!-- ── COLORS & STATES ── -->
            <section>
                <h2 id="colors">{{ t().colorsTitle }}</h2>
                <p [innerHTML]="t().colorsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-input-text label="Primary Filled" color="primary" [filled]="true" labelPosition="float" />
                    <cz-input-text label="Success" color="success" labelPosition="over" />
                    <cz-input-text label="Disabled & Filled" [disabled]="true" [filled]="true" labelPosition="float" />
                    <cz-input-text label="Fluid Width Component" [fluid]="true" labelPosition="float" />
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── VALIDATION ── -->
            <section>
                <h2 id="validation">{{ t().validationTitle }}</h2>
                <p [innerHTML]="t().validationDesc"></p>
                <div class="cz-mb-md">
                    <cz-input-text 
                        label="Email Address" 
                        labelPosition="float" 
                        color="primary"
                        [formControl]="emailControl" 
                        helpText="We'll never share your email with anyone else."
                        [locale]="t() === INPUT_TEXT_DOC_I18N.es ? 'es' : (t() === INPUT_TEXT_DOC_I18N.en ? 'en' : 'es')"
                    />
                </div>
                <app-code [code]="validationCode" />
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
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Label text</td></tr>
                            <tr><td><code>labelPosition</code></td><td><code>'none' | 'over' | 'in' | 'float'</code></td><td><code>'none'</code></td><td>Label placement</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Input size</td></tr>
                            <tr><td><code>color</code></td><td><code>'primary' | 'success' | 'warning' | 'danger' | 'info' | 'dark'</code></td><td><code>''</code></td><td>Color variant</td></tr>
                            <tr><td><code>filled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Filled background style</td></tr>
                            <tr><td><code>fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Full width</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
})
export class InputTextDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => INPUT_TEXT_DOC_I18N[this.lang.currentLang() as keyof typeof INPUT_TEXT_DOC_I18N]);
    readonly INPUT_TEXT_DOC_I18N = INPUT_TEXT_DOC_I18N; // To access in template

    emailControl = new FormControl('', [Validators.required, Validators.email]);

    importCode: Code = {
        typescript: `import { CzInputTextComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-input-text label="Username" />`
    };

    labelsCode: Code = {
        html: `<cz-input-text label="No Position" labelPosition="none" placeholder="Type here" />
<cz-input-text label="Over Label" labelPosition="over" placeholder="Type here" />
<cz-input-text label="Inner Label" labelPosition="in" placeholder="Type here" />
<cz-input-text label="Floating Label" labelPosition="float" placeholder="Type here" />`
    };

    sizesCode: Code = {
        html: `<cz-input-text label="Small" size="sm" labelPosition="float" />
<cz-input-text label="Medium" size="md" labelPosition="float" />
<cz-input-text label="Large" size="lg" labelPosition="float" />`
    };

    colorsCode: Code = {
        html: `<cz-input-text label="Primary Filled" color="primary" [filled]="true" labelPosition="float" />
<cz-input-text label="Success" color="success" labelPosition="over" />
<cz-input-text label="Disabled & Filled" [disabled]="true" [filled]="true" labelPosition="float" />
<cz-input-text label="Fluid Width Component" [fluid]="true" labelPosition="float" />`
    };

    validationCode: Code = {
        html: `<cz-input-text 
  label="Email Address" 
  labelPosition="float" 
  color="primary"
  [formControl]="emailControl" 
  helpText="We'll never share your email with anyone else."
/>`,
        typescript: `import { FormControl, Validators } from '@angular/forms';

export class MyComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
}`
    };
}
