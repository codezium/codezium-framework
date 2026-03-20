import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CzKnobComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { KNOB_DOC_I18N } from './knob-doc.i18n';

@Component({
    selector: 'cz-knob-doc-page',
    standalone: true,
    imports: [CommonModule, CzKnobComponent, AppCodeComponent, FormsModule, ReactiveFormsModule],
    template: `
        <div class="doc-page">
            <header class="cz-mb-xl">
                <h1 id="knob" class="cz-display-4 cz-font-bold">{{ t().title }}</h1>
                <p class="doc-lead cz-text-xl cz-text-muted">{{ t().description }}</p>
            </header>

            <!-- ── IMPORT ── -->
            <section class="cz-mb-xl">
                <h2 id="import" class="cz-h2 cz-mb-md">{{ t().import }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section class="cz-mb-xl">
                <h2 id="basic" class="cz-h2 cz-mb-sm">{{ t().basic }}</h2>
                <p class="cz-mb-md">{{ t().basicDescription }}</p>
                <div class="cz-flex cz-flex-col cz-items-center cz-gap-md cz-mb-md">
                    <cz-knob [(ngModel)]="value1" [theme]="themeService.currentTheme()" />
                    <div class="cz-badge cz-badge--info">Value: {{ value1() }}</div>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── MIN/MAX & STEP ── -->
            <section class="cz-mb-xl">
                <h2 id="minmax" class="cz-h2 cz-mb-sm">{{ t().minMax }} & {{ t().step }}</h2>
                <p class="cz-mb-md">{{ t().minMaxDescription }} y {{ t().stepDescription }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <div class="cz-flex cz-flex-col cz-items-center cz-gap-sm">
                        <small class="cz-text-muted">Min: -50, Max: 50</small>
                        <cz-knob [(ngModel)]="value2" [min]="-50" [max]="50" [theme]="themeService.currentTheme()" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-items-center cz-gap-sm">
                        <small class="cz-text-muted">Step: 10</small>
                        <cz-knob [(ngModel)]="value3" [step]="10" [theme]="themeService.currentTheme()" />
                    </div>
                </div>
                <app-code [code]="minMaxStepCode" />
            </section>


            <!-- ── COLORS ── -->
            <section class="cz-mb-xl">
                <h2 id="colors" class="cz-h2 cz-mb-sm">{{ t().colors }}</h2>
                <p class="cz-mb-md">{{ t().colorsDescription }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                        <cz-knob [(ngModel)]="value1" color="primary" [theme]="themeService.currentTheme()" />
                        <cz-knob [(ngModel)]="value1" color="success" [theme]="themeService.currentTheme()" />
                        <cz-knob [(ngModel)]="value1" color="warning" [theme]="themeService.currentTheme()" />
                        <cz-knob [(ngModel)]="value1" color="danger" [theme]="themeService.currentTheme()" />
                        <cz-knob [(ngModel)]="value1" color="info" [theme]="themeService.currentTheme()" />
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── SIZES & STROKE ── -->
            <section class="cz-mb-xl">
                <h2 id="sizes" class="cz-h2 cz-mb-sm">{{ t().size }} & {{ t().stroke }}</h2>
                <p class="cz-mb-md">{{ t().sizeDescription }} y {{ t().strokeDescription }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-items-end cz-gap-xl cz-mb-md">
                    <cz-knob [(ngModel)]="value1" [size]="60" [strokeWidth]="8" [theme]="themeService.currentTheme()" />
                    <cz-knob [(ngModel)]="value1" [size]="100" [strokeWidth]="14" [theme]="themeService.currentTheme()" />
                    <cz-knob [(ngModel)]="value1" [size]="150" [strokeWidth]="20" [theme]="themeService.currentTheme()" />
                </div>
                <app-code [code]="sizeStrokeCode" />
            </section>

            <!-- ── STATES ── -->
            <section class="cz-mb-xl">
                <h2 id="states" class="cz-h2 cz-mb-sm">{{ t().readOnly }} & {{ t().disabled }}</h2>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <div class="cz-flex cz-flex-col cz-items-center cz-gap-sm">
                        <small class="cz-text-muted">ReadOnly</small>
                        <cz-knob [(ngModel)]="value4" [readOnly]="true" [theme]="themeService.currentTheme()" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-items-center cz-gap-sm">
                        <small class="cz-text-muted">Disabled</small>
                        <cz-knob [(ngModel)]="value4" [disabled]="true" [theme]="themeService.currentTheme()" />
                    </div>
                </div>
                <app-code [code]="statesCode" />
            </section>

            <!-- ── TEMPLATE ── -->
            <section class="cz-mb-xl">
                <h2 id="template" class="cz-h2 cz-mb-sm">{{ t().template }}</h2>
                <p class="cz-mb-md">{{ t().templateDescription }}</p>
                <div class="cz-flex cz-flex-col cz-items-center cz-gap-md cz-mb-md">
                    <cz-knob [(ngModel)]="value1" valueTemplate="{value}%" [theme]="themeService.currentTheme()" />
                </div>
                <app-code [code]="templateCode" />
            </section>

            <!-- ── VALIDATION ── -->
            <section class="cz-mb-xl">
                <h2 id="validation" class="cz-h2 cz-mb-sm">{{ t().validation }}</h2>
                <p class="cz-mb-md">{{ t().validationDescription }}</p>
                <div class="cz-flex cz-flex-col cz-items-center cz-gap-md cz-mb-md">
                    <form [formGroup]="testForm" class="cz-flex cz-flex-col cz-items-center cz-gap-md">
                        <cz-knob 
                            formControlName="knobValue" 
                            [theme]="themeService.currentTheme()"
                            helperText="Please select a value between 40 and 80" />
                        
                        <div class="cz-flex cz-gap-sm">
                            <button class="cz-btn cz-btn--outline cz-btn--sm" (click)="testForm.markAllAsTouched()">
                                Validate
                            </button>
                            <button class="cz-btn cz-btn--ghost cz-btn--sm" (click)="testForm.reset({knobValue: 0})">
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
                <app-code [code]="validationCode" />
            </section>

            <!-- ── API ── -->
            <section class="cz-mb-xl">
                <h2 id="api" class="cz-h2 cz-mb-md">API Reference</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>{{ t().propName }}</th><th>{{ t().propType }}</th><th>{{ t().propDefault }}</th><th>{{ t().propDescription }}</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>value</code></td><td><code>number</code></td><td><code>0</code></td><td>Current value of the component.</td></tr>
                            <tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>Minimum boundary value.</td></tr>
                            <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Maximum boundary value.</td></tr>
                            <tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>Step factor to increment/decrement the value.</td></tr>
                            <tr><td><code>size</code></td><td><code>number</code></td><td><code>100</code></td><td>Diameter of the knob in pixels.</td></tr>
                            <tr><td><code>strokeWidth</code></td><td><code>number</code></td><td><code>14</code></td><td>Width of the stroke.</td></tr>
                            <tr><td><code>showValue</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether to display the value text in the center.</td></tr>
                            <tr><td><code>valueTemplate</code></td><td><code>string</code></td><td><code>'{{ '{' }}value{{ '}' }}'</code></td><td>Template string for the displayed value.</td></tr>
                            <tr><td><code>theme</code></td><td><code>'base' | 'glass' | 'neo'</code></td><td><code>'base'</code></td><td>Design theme of the component.</td></tr>
                            <tr><td><code>color</code></td><td><code>string</code></td><td><code>'primary'</code></td><td>Color variant of the arc.</td></tr>
                            <tr><td><code>readOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When specified, disables the interaction but keeps visual state.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When specified, disables the component.</td></tr>
                            <tr><td><code>helperText</code></td><td><code>string</code></td><td><code>''</code></td><td>Supporting text below the component.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
    styles: [`
        .doc-page { padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .doc-table { width: 100%; border-collapse: collapse; }
        .doc-table th, .doc-table td { padding: 12px; border-bottom: 1px solid var(--cz-theme-border); text-align: left; }
        .doc-table th { background: var(--cz-theme-surface); font-weight: 600; }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KnobDocPage {
    private readonly langService = inject(LanguageService);
    readonly themeService = inject(ThemeService);
    readonly t = computed(() => KNOB_DOC_I18N[this.langService.currentLang()] || KNOB_DOC_I18N.es);

    value1 = signal<number>(40);
    value2 = signal<number>(0);
    value3 = signal<number>(50);
    value4 = signal<number>(75);

    private readonly fb = inject(FormBuilder);
    testForm = this.fb.group({
        knobValue: [0, [Validators.required, Validators.min(40), Validators.max(80)]]
    });

    importCode: Code = {
        typescript: `import { CzKnobComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-knob [(ngModel)]="value" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzKnobComponent } from 'codezium-ui';

@Component({
    selector: 'knob-basic-demo',
    standalone: true,
    imports: [FormsModule, CzKnobComponent],
    template: \`<cz-knob [(ngModel)]="value" />\`
})
export class KnobBasicDemo {
    value = signal(40);
}`
    };

    minMaxStepCode: Code = {
        html: `<cz-knob [(ngModel)]="value" [min]="-50" [max]="50" />
<cz-knob [(ngModel)]="value" [step]="10" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzKnobComponent } from 'codezium-ui';

@Component({
    selector: 'knob-minmax-demo',
    standalone: true,
    imports: [FormsModule, CzKnobComponent],
    template: \`
        <cz-knob [(ngModel)]="value1" [min]="-50" [max]="50" />
        <cz-knob [(ngModel)]="value2" [step]="10" />
    \`
})
export class KnobMinMaxDemo {
    value1 = signal(0);
    value2 = signal(50);
}`
    };


    colorsCode: Code = {
        html: `<cz-knob [(ngModel)]="value" color="primary" />
<cz-knob [(ngModel)]="value" color="success" />
<cz-knob [(ngModel)]="value" color="warning" />
<cz-knob [(ngModel)]="value" color="danger" />
<cz-knob [(ngModel)]="value" color="info" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzKnobComponent } from 'codezium-ui';

@Component({
    selector: 'knob-colors-demo',
    standalone: true,
    imports: [FormsModule, CzKnobComponent],
    template: \`
        <cz-knob [(ngModel)]="value" color="primary" />
        <cz-knob [(ngModel)]="value" color="success" />
        <cz-knob [(ngModel)]="value" color="warning" />
        <cz-knob [(ngModel)]="value" color="danger" />
        <cz-knob [(ngModel)]="value" color="info" />
    \`
})
export class KnobColorsDemo {
    value = signal(40);
}`
    };

    sizeStrokeCode: Code = {
        html: `<cz-knob [(ngModel)]="value" [size]="60" [strokeWidth]="8" />
<cz-knob [(ngModel)]="value" [size]="150" [strokeWidth]="20" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzKnobComponent } from 'codezium-ui';

@Component({
    selector: 'knob-sizes-demo',
    standalone: true,
    imports: [FormsModule, CzKnobComponent],
    template: \`
        <cz-knob [(ngModel)]="value" [size]="60" [strokeWidth]="8" />
        <cz-knob [(ngModel)]="value" [size]="150" [strokeWidth]="20" />
    \`
})
export class KnobSizesDemo {
    value = signal(40);
}`
    };

    statesCode: Code = {
        html: `<cz-knob [(ngModel)]="value" [readOnly]="true" />
<cz-knob [(ngModel)]="value" [disabled]="true" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzKnobComponent } from 'codezium-ui';

@Component({
    selector: 'knob-states-demo',
    standalone: true,
    imports: [FormsModule, CzKnobComponent],
    template: \`
        <cz-knob [(ngModel)]="value" [readOnly]="true" />
        <cz-knob [(ngModel)]="value" [disabled]="true" />
    \`
})
export class KnobStatesDemo {
    value = signal(75);
}`
    };

    templateCode: Code = {
        html: `<cz-knob [(ngModel)]="value" valueTemplate="{value}%" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzKnobComponent } from 'codezium-ui';

@Component({
    selector: 'knob-template-demo',
    standalone: true,
    imports: [FormsModule, CzKnobComponent],
    template: \`<cz-knob [(ngModel)]="value" valueTemplate="{value}%" />\`
})
export class KnobTemplateDemo {
    value = signal(40);
}`
    };

    validationCode: Code = {
        html: `<form [formGroup]="testForm">
    <cz-knob formControlName="knobValue" helperText="Select between 40 and 80" />
</form>`,
        typescript: `import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CzKnobComponent } from 'codezium-ui';

@Component({
    selector: 'knob-validation-demo',
    standalone: true,
    imports: [ReactiveFormsModule, CzKnobComponent],
    template: \`
        <form [formGroup]="testForm">
            <cz-knob formControlName="knobValue" helperText="Select between 40 and 80" />
        </form>
    \`
})
export class KnobValidationDemo {
    private readonly fb = inject(FormBuilder);
    testForm = this.fb.group({
        knobValue: [0, [Validators.required, Validators.min(40), Validators.max(80)]]
    });
}`
    };
}
