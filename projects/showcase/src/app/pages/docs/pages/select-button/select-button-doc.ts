import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CzSelectButtonComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SELECT_BUTTON_DOC_I18N } from './select-button-doc.i18n';

@Component({
    selector: 'cz-select-button-doc-page',
    standalone: true,
    imports: [CommonModule, CzSelectButtonComponent, AppCodeComponent, FormsModule, ReactiveFormsModule],
    template: `
        <div class="doc-page">
            <header class="cz-mb-xl">
                <h1 id="select-button" class="cz-display-4 cz-font-bold">{{ t().title }}</h1>
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
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-select-button 
                        [options]="paymentOptions" 
                        [(ngModel)]="basicValue" 
                        optionLabel="name" 
                        optionValue="value" 
                        label="Payment Method" />
                    <div class="cz-badge cz-badge--info cz-align-self-start">
                        Selected Value: {{ basicValue() | json }}
                    </div>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── MULTIPLE ── -->
            <section class="cz-mb-xl">
                <h2 id="multiple" class="cz-h2 cz-mb-sm">{{ t().multiple }}</h2>
                <p class="cz-mb-md">{{ t().multipleDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-select-button 
                        [options]="justifyOptions" 
                        [(ngModel)]="multipleValue" 
                        [multiple]="true" 
                        optionLabel="icon" 
                        optionValue="value" />
                    <div class="cz-badge cz-badge--secondary cz-align-self-start">
                        Selected Array: {{ multipleValue() | json }}
                    </div>
                </div>
                <app-code [code]="multipleCode" />
            </section>

            <!-- ── LABELS & ORIENTATION ── -->
            <section class="cz-mb-xl">
                <h2 id="labels" class="cz-h2 cz-mb-sm">{{ t().labels }}</h2>
                <p class="cz-mb-md">{{ t().labelsDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-xl cz-mb-md">
                    <cz-select-button 
                        [options]="paymentOptions" 
                        [(ngModel)]="labelRightValue" 
                        optionLabel="name" 
                        label="Label Right" 
                        labelPosition="right" />
                    
                    <cz-select-button 
                        [options]="paymentOptions" 
                        [(ngModel)]="labelLeftValue" 
                        optionLabel="name" 
                        label="Label Left" 
                        labelPosition="left" />

                    <cz-select-button 
                        [options]="paymentOptions" 
                        [(ngModel)]="labelTopValue" 
                        optionLabel="name" 
                        label="Label Top (Default)" 
                        labelPosition="top" />
                </div>
                <app-code [code]="labelsCode" />
            </section>

            <!-- ── VALIDATION ── -->
            <section class="cz-mb-xl">
                <h2 id="validation" class="cz-h2 cz-mb-sm">{{ t().validation }}</h2>
                <p class="cz-mb-md">{{ t().validationDescription }}</p>
                <div class="cz-mb-md">
                    <form [formGroup]="testForm" class="cz-flex cz-flex-col cz-gap-md">
                        <cz-select-button 
                            [options]="paymentOptions" 
                            formControlName="payment" 
                            optionLabel="name" 
                            label="Required Selection" 
                            helperText="Please select an option to enable the form" />
                        
                        <div class="cz-flex cz-gap-sm">
                            <button class="cz-button cz-button--outline cz-button--sm" (click)="testForm.markAllAsTouched()">
                                Validate Form
                            </button>
                            <button class="cz-button cz-button--ghost cz-button--sm" (click)="testForm.reset()">
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
                <app-code [code]="validationCode" />
            </section>

            <!-- ── SIZES ── -->
            <section class="cz-mb-xl">
                <h2 id="sizes" class="cz-h2 cz-mb-sm">{{ t().sizes }}</h2>
                <p class="cz-mb-md" [innerHTML]="t().sizesDescription"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <small class="cz-text-muted">Small (sm)</small>
                        <cz-select-button [options]="paymentOptions" [(ngModel)]="sizeSmValue" optionLabel="name" size="sm" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <small class="cz-text-muted">Medium (md - Default)</small>
                        <cz-select-button [options]="paymentOptions" [(ngModel)]="sizeMdValue" optionLabel="name" size="md" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <small class="cz-text-muted">Large (lg)</small>
                        <cz-select-button [options]="paymentOptions" [(ngModel)]="sizeLgValue" optionLabel="name" size="lg" />
                    </div>
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <!-- ── COLORS ── -->
            <section class="cz-mb-xl">
                <h2 id="colors" class="cz-h2 cz-mb-sm">{{ t().colors }}</h2>
                <p class="cz-mb-md" [innerHTML]="t().colorsDescription"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <small class="cz-text-muted">Secondary</small>
                        <cz-select-button [options]="paymentOptions" [(ngModel)]="colorSecondaryValue" optionLabel="name" color="secondary" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <small class="cz-text-muted">Success</small>
                        <cz-select-button [options]="paymentOptions" [(ngModel)]="colorSuccessValue" optionLabel="name" color="success" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <small class="cz-text-muted">Warning</small>
                        <cz-select-button [options]="paymentOptions" [(ngModel)]="colorWarningValue" optionLabel="name" color="warning" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <small class="cz-text-muted">Danger</small>
                        <cz-select-button [options]="paymentOptions" [(ngModel)]="colorDangerValue" optionLabel="name" color="danger" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <small class="cz-text-muted">Info</small>
                        <cz-select-button [options]="paymentOptions" [(ngModel)]="colorInfoValue" optionLabel="name" color="info" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <small class="cz-text-muted">Dark</small>
                        <cz-select-button [options]="paymentOptions" [(ngModel)]="colorDarkValue" optionLabel="name" color="dark" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <small class="cz-text-muted">Fluid (100% Width)</small>
                        <cz-select-button [options]="paymentOptions" [(ngModel)]="colorFluidValue" optionLabel="name" [fluid]="true" />
                    </div>
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── API ── -->
            <section class="cz-mb-xl">
                <h2 id="api" class="cz-h2 cz-mb-md">API Reference</h2>
                <h3 id="props" class="cz-h3 cz-mb-sm">{{ t().props }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>options</code></td><td><code>any[]</code></td><td><code>undefined</code></td><td>An array of objects to display as options.</td></tr>
                            <tr><td><code>optionLabel</code></td><td><code>string</code></td><td><code>undefined</code></td><td>Property name or getter function to use as the label of an option.</td></tr>
                            <tr><td><code>optionValue</code></td><td><code>string</code></td><td><code>undefined</code></td><td>Property name or getter function to use as the value of an option.</td></tr>
                            <tr><td><code>multiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When specified, allows selecting multiple values.</td></tr>
                            <tr><td><code>fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When specified, the component takes 100% width of its parent container.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size of the component.</td></tr>
                            <tr><td><code>color</code></td><td><code>string</code></td><td><code>'primary'</code></td><td>Color variant from the design system.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When specified, disables the component interaction.</td></tr>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Main label for the group.</td></tr>
                            <tr><td><code>labelPosition</code></td><td><code>'top' | 'left' | 'right'</code></td><td><code>'top'</code></td><td>Position of the main label.</td></tr>
                            <tr><td><code>helperText</code></td><td><code>string</code></td><td><code>''</code></td><td>Supporting text below the component.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectButtonDocPage {
    private readonly langService = inject(LanguageService);
    readonly t = computed(() => SELECT_BUTTON_DOC_I18N[this.langService.currentLang()] || SELECT_BUTTON_DOC_I18N.es);

    paymentOptions = [
        { name: 'Option 1', value: 1 },
        { name: 'Option 2', value: 2 },
        { name: 'Option 3', value: 3 }
    ];

    justifyOptions = [
        { icon: 'Left', value: 'left' },
        { icon: 'Center', value: 'center' },
        { icon: 'Right', value: 'right' },
        { icon: 'Justify', value: 'justify' }
    ];

    basicValue = signal<number>(1);
    multipleValue = signal<string[]>(['left', 'right']);
    
    labelRightValue = signal<number>(1);
    labelLeftValue = signal<number>(1);
    labelTopValue = signal<number>(1);

    sizeSmValue = signal<number>(1);
    sizeMdValue = signal<number>(1);
    sizeLgValue = signal<number>(1);

    colorSecondaryValue = signal<number>(1);
    colorSuccessValue = signal<number>(1);
    colorWarningValue = signal<number>(1);
    colorDangerValue = signal<number>(1);
    colorInfoValue = signal<number>(1);
    colorDarkValue = signal<number>(1);
    colorFluidValue = signal<number>(1);

    private readonly fb = inject(FormBuilder);

    testForm = this.fb.group({
        payment: [null, [Validators.required]]
    });

    importCode: Code = {
        typescript: `import { CzSelectButtonComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-select-button 
    [options]="paymentOptions" 
    [(ngModel)]="value" 
    optionLabel="name" 
    optionValue="value" 
    label="Payment Method" />`,
        typescript: `paymentOptions = [
    { name: 'Option 1', value: 1 },
    { name: 'Option 2', value: 2 },
    { name: 'Option 3', value: 3 }
];
value = signal(1);`
    };

    multipleCode: Code = {
        html: `<cz-select-button 
    [options]="justifyOptions" 
    [(ngModel)]="selectedValues" 
    [multiple]="true" 
    optionLabel="icon" 
    optionValue="value" />`,
        typescript: `justifyOptions = [
    { icon: 'Left', value: 'left' },
    { icon: 'Center', value: 'center' },
    { icon: 'Right', value: 'right' },
    { icon: 'Justify', value: 'justify' }
];
selectedValues = signal(['left', 'right']);`
    };

    labelsCode: Code = {
        html: `<cz-select-button 
    [options]="options" 
    [(ngModel)]="val" 
    label="Label Left" 
    labelPosition="left" />

<cz-select-button 
    [options]="options" 
    [(ngModel)]="val" 
    label="Label Top" 
    labelPosition="top" />`,
        typescript: `val = signal(1);`
    };

    validationCode: Code = {
        html: `<form [formGroup]="testForm">
    <cz-select-button 
        [options]="options" 
        formControlName="payment" 
        label="Required Selection" 
        helperText="Please select an option" />
</form>`,
        typescript: `testForm = inject(FormBuilder).group({
    payment: [null, [Validators.required]]
});`
    };

    sizesCode: Code = {
        html: `<cz-select-button [options]="options" size="sm" />
<cz-select-button [options]="options" size="md" />
<cz-select-button [options]="options" size="lg" />`
    };
    
    colorsCode: Code = {
        html: `<cz-select-button [options]="options" color="secondary" />
<cz-select-button [options]="options" color="success" />
<cz-select-button [options]="options" color="warning" />
<cz-select-button [options]="options" color="danger" />
<cz-select-button [options]="options" color="info" />
<cz-select-button [options]="options" color="dark" />
<cz-select-button [options]="options" [fluid]="true" />`
    };
}
