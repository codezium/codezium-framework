import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CzRadioButtonComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { RADIO_BUTTON_DOC_I18N } from './radio-button-doc.i18n';

@Component({
    selector: 'cz-radio-button-doc-page',
    standalone: true,
    imports: [CommonModule, CzRadioButtonComponent, AppCodeComponent, ReactiveFormsModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="radio-button">{{ t().title }}</h1>
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
                <div class="cz-flex cz-gap-md cz-mb-md">
                    <cz-radio-button label="Option 1" name="basic" [value]="1" [(ngModel)]="basicValue" />
                    <cz-radio-button label="Option 2" name="basic" [value]="2" [(ngModel)]="basicValue" />
                </div>
                <p class="cz-mb-md cz-text-sm">Value: {{ basicValue }}</p>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── THEMES ── -->
            <section>
                <h2 id="themes">{{ t().themesTitle }}</h2>
                <p [innerHTML]="t().themesDesc"></p>
                <div class="cz-grid cz-grid-cols-1 md:cz-grid-cols-3 cz-gap-md cz-mb-md">
                    <div class="cz-p-md cz-border cz-rounded-lg">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Base</small>
                        <cz-radio-button label="Base Theme" name="theme-base" value="1" [(ngModel)]="themeValue" />
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg" data-theme="glass">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Glass</small>
                        <cz-radio-button label="Glass Theme" name="theme-glass" value="glass" [(ngModel)]="themeValue" />
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg" data-theme="neo">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Neo</small>
                        <cz-radio-button label="Neo Theme" name="theme-neo" value="neo" [(ngModel)]="themeValue" />
                    </div>
                </div>
                <app-code [code]="themesCode" />
            </section>

            <!-- ── LABELS ── -->
            <section>
                <h2 id="labels">{{ t().labelsTitle }}</h2>
                <p [innerHTML]="t().labelsDesc"></p>
                <div class="cz-flex cz-gap-md cz-mb-md">
                    <cz-radio-button label="Label Right" labelPosition="right" name="label" value="r" [(ngModel)]="labelValue" />
                    <cz-radio-button label="Label Left" labelPosition="left" name="label" value="l" [(ngModel)]="labelValue" />
                </div>
                <app-code [code]="labelsCode" />
            </section>

            <!-- ── COLORS & SIZES ── -->
            <section>
                <h2 id="colors">{{ t().colorsTitle }}</h2>
                <p [innerHTML]="t().colorsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md cz-items-center">
                    <cz-radio-button label="Small" size="sm" color="success" name="size" value="sm" [(ngModel)]="sizeValue" />
                    <cz-radio-button label="Medium" size="md" color="warning" name="size" value="md" [(ngModel)]="sizeValue" />
                    <cz-radio-button label="Large" size="lg" color="danger" name="size" value="lg" [(ngModel)]="sizeValue" />
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── VALIDATION ── -->
            <section>
                <h2 id="validation">{{ t().validationTitle }}</h2>
                <p [innerHTML]="t().validationDesc"></p>
                <form [formGroup]="testForm" class="cz-mb-md">
                    <cz-radio-button 
                        label="Required Option" 
                        formControlName="requiredRadio" 
                        [value]="true" 
                        helperText="Please select this option" />
                </form>
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
                            <tr><td><code>value</code></td><td><code>any</code></td><td><code>undefined</code></td><td>Value of the radiobutton.</td></tr>
                            <tr><td><code>name</code></td><td><code>string</code></td><td><code>''</code></td><td>Name of the radio group.</td></tr>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Label text.</td></tr>
                            <tr><td><code>labelPosition</code></td><td><code>'left' | 'right'</code></td><td><code>'right'</code></td><td>Label placement.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Component size.</td></tr>
                            <tr><td><code>color</code></td><td><code>CzRadioButtonColor</code></td><td><code>'primary'</code></td><td>Color variant.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Readonly state.</td></tr>
                            <tr><td><code>helperText</code></td><td><code>string</code></td><td><code>''</code></td><td>Helper text at the bottom.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class RadioButtonDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => (RADIO_BUTTON_DOC_I18N as any)[this.lang.currentLang()] || RADIO_BUTTON_DOC_I18N.es);

    basicValue = 1;
    themeValue = 'neo';
    labelValue = 'r';
    sizeValue = 'md';

    testForm = new FormGroup({
        requiredRadio: new FormControl(null, Validators.required)
    });

    importCode: Code = {
        typescript: `import { CzRadioButtonComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-radio-button label="Option 1" name="basic" [value]="1" [(ngModel)]="val" />
<cz-radio-button label="Option 2" name="basic" [value]="2" [(ngModel)]="val" />`,
        typescript: `export class MyComponent {
    val = 1;
}`
    };

    themesCode: Code = {
        html: `<!-- Base Theme -->
<cz-radio-button label="Base" value="1" />

<!-- Glass Theme -->
<div data-theme="glass">
    <cz-radio-button label="Glass" value="2" />
</div>

<!-- Neo Theme -->
<div data-theme="neo">
    <cz-radio-button label="Neo" value="3" />
</div>`
    };

    labelsCode: Code = {
        html: `<cz-radio-button label="Right" labelPosition="right" value="1" />
<cz-radio-button label="Left" labelPosition="left" value="2" />`
    };

    colorsCode: Code = {
        html: `<cz-radio-button color="success" size="sm" value="1" />
<cz-radio-button color="warning" size="md" value="2" />
<cz-radio-button color="danger" size="lg" value="3" />`
    };

    validationCode: Code = {
        html: `<form [formGroup]="myForm">
    <cz-radio-button 
        label="Accept terms" 
        formControlName="terms" 
        [value]="true" 
        helperText="Required" />
</form>`,
        typescript: `myForm = new FormGroup({
    terms: new FormControl(null, Validators.required)
});`
    };
}
