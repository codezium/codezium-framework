import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CzSelectButtonComponent, CzButtonComponent, CzMessageComponent, CzToastService } from 'codezium-ui';
import {
    LucideDynamicIcon,
    LucideAlignLeft,
    LucideAlignRight,
    LucideAlignCenter,
    LucideAlignJustify
} from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SELECT_BUTTON_DOC_I18N } from './select-button-doc.i18n';

@Component({
    selector: 'cz-select-button-doc-page',
    imports: [
        CommonModule, LucideDynamicIcon, CzSelectButtonComponent, CzButtonComponent, CzMessageComponent,
        AppCodeComponent, ReactiveFormsModule, FormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="selectbutton">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().description }}</p>

            <!-- ── IMPORT ── -->
            <section>
                <h2 id="import">{{ t().import }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDescription }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <span id="basic-label" class="cz-sr-only">Basic</span>
                    <cz-select-button [options]="stateOptions" [(ngModel)]="basicValue" optionLabel="label"
                        optionValue="value" ariaLabelledBy="basic-label" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── DISABLED ── -->
            <section>
                <h2 id="disabled">{{ t().disabled }}</h2>
                <p>{{ t().disabledDescription }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-lg cz-mb-md">
                    <cz-select-button [options]="stateOptions" [(ngModel)]="disabledValue" optionLabel="label"
                        optionValue="value" [disabled]="true" />
                    <cz-select-button [options]="constantOptions" [(ngModel)]="constantValue" optionLabel="label"
                        optionValue="value" optionDisabled="constant" />
                </div>
                <app-code [code]="disabledCode" />
            </section>

            <!-- ── FLUID ── -->
            <section>
                <h2 id="fluid">{{ t().fluid }}</h2>
                <p>{{ t().fluidDescription }}</p>
                <cz-select-button [options]="stateOptions" [(ngModel)]="fluidValue" optionLabel="label"
                    optionValue="value" [fluid]="true" class="cz-mb-md" />
                <app-code [code]="fluidCode" />
            </section>

            <!-- ── INVALID ── -->
            <section>
                <h2 id="invalid">{{ t().invalid }}</h2>
                <p>{{ t().invalidDescription }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select-button [options]="stateOptions" [ngModel]="invalidValue()"
                        (ngModelChange)="invalidValue.set($event)" optionLabel="label"
                        optionValue="value" [invalid]="invalidValue() === null" />
                </div>
                <app-code [code]="invalidCode" />
            </section>

            <!-- ── MULTIPLE ── -->
            <section>
                <h2 id="multiple">{{ t().multiple }}</h2>
                <p>{{ t().multipleDescription }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select-button [options]="paymentOptions" [(ngModel)]="multipleValue" [multiple]="true"
                        optionLabel="name" optionValue="value" />
                </div>
                <app-code [code]="multipleCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p>{{ t().formsDescription }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="cz-flex cz-flex-col cz-gap-sm">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-select-button [options]="stateOptions" formControlName="value"
                            [invalid]="isInvalid('value')" optionLabel="label" optionValue="value" />
                        @if (isInvalid('value')) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)" class="cz-flex cz-flex-col cz-gap-sm">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-select-button #model="ngModel" name="value" [(ngModel)]="templateValue"
                            [options]="stateOptions" optionLabel="label" optionValue="value" required
                            [invalid]="!!(model.invalid && (model.touched || tdForm.submitted))" />
                        @if (model.invalid && (model.touched || tdForm.submitted)) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>
                </div>
                <app-code [code]="formsCode" />
            </section>

            <!-- ── SIZES ── -->
            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p>{{ t().sizesDescription }}</p>
                <div class="cz-flex cz-flex-col cz-items-center cz-gap-lg cz-mb-md">
                    <cz-select-button [(ngModel)]="sizeValue1" [options]="sizeOptions" size="sm" />
                    <cz-select-button [(ngModel)]="sizeValue2" [options]="sizeOptions" />
                    <cz-select-button [(ngModel)]="sizeValue3" [options]="sizeOptions" size="lg" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <!-- ── TEMPLATE ── -->
            <section>
                <h2 id="template">{{ t().template }}</h2>
                <p>{{ t().templateDescription }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select-button [options]="justifyOptions" [(ngModel)]="justifyValue" optionLabel="justify">
                        <ng-template #itemTemplate let-item>
                            <svg [lucideIcon]="item.icon" [size]="18"></svg>
                        </ng-template>
                    </cz-select-button>
                </div>
                <app-code [code]="templateCode" />
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <h3 id="screenreader">{{ t().screenReader }}</h3>
                <p>{{ t().screenReaderDescription }}</p>
                <h3 id="keyboardsupport">{{ t().keyboardSupport }}</h3>
                <p>{{ t().keyboardDescription }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Key</th><th>Function</th></tr></thead>
                        <tbody>
                            <tr><td><code>tab</code></td><td>{{ t().keyTab }}</td></tr>
                            <tr><td><code>enter</code> <code>space</code></td><td>{{ t().keyEnter }}</td></tr>
                            <tr><td><code>left arrow</code> <code>right arrow</code> <code>up</code> <code>down</code></td><td>{{ t().keyArrows }}</td></tr>
                            <tr><td><code>home</code> <code>end</code></td><td>{{ t().keyHomeEnd }}</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- ── LABELS ── -->
            <section>
                <h2 id="labels">{{ t().labels }}</h2>
                <p>{{ t().labelsDescription }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-mb-md">
                    <cz-select-button [options]="stateOptions" [(ngModel)]="labelValue" optionLabel="label"
                        optionValue="value" [label]="t().labelLeft" labelPosition="left" />
                    <cz-select-button [options]="stateOptions" [(ngModel)]="labelValue" optionLabel="label"
                        optionValue="value" [label]="t().labelTop" labelPosition="top" />
                </div>
                <app-code [code]="labelsCode" />
            </section>

            <!-- ── COLORS ── -->
            <section>
                <h2 id="colors">{{ t().colors }}</h2>
                <p>{{ t().colorsDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-select-button [options]="stateOptions" [(ngModel)]="colorValue" optionLabel="label"
                        optionValue="value" color="primary" />
                    <cz-select-button [options]="stateOptions" [(ngModel)]="colorValue" optionLabel="label"
                        optionValue="value" color="success" />
                    <cz-select-button [options]="stateOptions" [(ngModel)]="colorValue" optionLabel="label"
                        optionValue="value" color="danger" />
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── THEMES ── -->
            <section>
                <h2 id="themes">{{ t().neoTheme }} / {{ t().glassTheme }}</h2>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-2 cz-gap-md cz-mb-md">
                    <div class="cz-p-md cz-border cz-rounded-lg" data-theme="neo">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Neo Theme</small>
                        <cz-select-button [options]="stateOptions" [(ngModel)]="themeValue" optionLabel="label" optionValue="value" />
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg cz-bg-dark" data-theme="glass">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Glass Theme</small>
                        <cz-select-button [options]="stateOptions" [(ngModel)]="themeValue" optionLabel="label" optionValue="value" />
                    </div>
                </div>
                <app-code [code]="themesCode" />
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">API</h2>
                <h3 id="props">{{ t().props }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>options</code></td><td><code>any[]</code></td><td><code>—</code></td><td>An array of selectitems to display as the available options.</td></tr>
                            <tr><td><code>optionLabel / optionValue</code></td><td><code>string</code></td><td><code>—</code></td><td>Field names for the option label and value.</td></tr>
                            <tr><td><code>optionDisabled</code></td><td><code>string | (item) =&gt; boolean</code></td><td><code>null</code></td><td>Name of the disabled field of an option or function to determine disabled state.</td></tr>
                            <tr><td><code>multiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When specified, allows selecting multiple values.</td></tr>
                            <tr><td><code>unselectable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether selection can be cleared when clicking the selected option.</td></tr>
                            <tr><td><code>allowEmpty</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether selection can be cleared (single mode and last value in multiple mode).</td></tr>
                            <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When present, it specifies that the component should have invalid state style.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When present, it specifies that the component should have disabled state style.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Specifies the size of the component.</td></tr>
                            <tr><td><code>fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Spans 100% width of the container when enabled.</td></tr>
                            <tr><td><code>tabindex</code></td><td><code>number</code></td><td><code>0</code></td><td>Index of the element in tabbing order.</td></tr>
                            <tr><td><code>autofocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When present, the component automatically gets focus on load.</td></tr>
                            <tr><td><code>ariaLabelledBy</code></td><td><code>string</code></td><td><code>null</code></td><td>Establishes relationships between the component and label(s).</td></tr>
                            <tr><td><code>dataKey</code></td><td><code>string</code></td><td><code>''</code></td><td>A property to uniquely identify a value in options.</td></tr>
                            <tr><td><code>styleClass</code></td><td><code>string</code></td><td><code>''</code></td><td>Style class of the component.</td></tr>
                            <tr><td><code>label / labelPosition</code></td><td><code>string / 'left' | 'right' | 'top'</code></td><td><code>'' / 'right'</code></td><td>Optional inline group label (Codezium extra).</td></tr>
                            <tr><td><code>color</code></td><td><code>CzSelectButtonColor</code></td><td><code>'primary'</code></td><td>Color variant (Codezium extra).</td></tr>
                            <tr><td><code>helperText</code></td><td><code>string</code></td><td><code>''</code></td><td>Helper text below the component (Codezium extra).</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="emits">{{ t().emits }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>onChange</code></td><td><code>CzSelectButtonChangeEvent</code></td><td>Callback to invoke on selection change.</td></tr>
                            <tr><td><code>onOptionClick</code></td><td><code>CzSelectButtonOptionClickEvent</code></td><td>Callback to invoke on input click.</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="templates">{{ t().templates }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Context</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>#itemTemplate</code></td><td><code>&#123; $implicit: option, index &#125;</code></td><td>Custom item template.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
})
export class SelectButtonDocPage {
    private readonly langService = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => SELECT_BUTTON_DOC_I18N[this.langService.currentLang()] || SELECT_BUTTON_DOC_I18N.es);

    readonly stateOptions = [
        { label: 'One-Way', value: 'one-way' },
        { label: 'Return', value: 'return' },
    ];

    readonly constantOptions = [
        { label: 'Option 1', value: 'Option 1' },
        { label: 'Option 2', value: 'Option 2', constant: true },
    ];

    readonly paymentOptions = [
        { name: 'Option 1', value: 1 },
        { name: 'Option 2', value: 2 },
        { name: 'Option 3', value: 3 },
    ];

    readonly sizeOptions = [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Expert', value: 'Expert' },
    ];

    readonly justifyOptions = [
        { icon: LucideAlignLeft, justify: 'Left' },
        { icon: LucideAlignRight, justify: 'Right' },
        { icon: LucideAlignCenter, justify: 'Center' },
        { icon: LucideAlignJustify, justify: 'Justify' },
    ];

    basicValue = 'one-way';
    disabledValue = 'off';
    constantValue = 'Option 1';
    fluidValue = 'one-way';
    invalidValue = signal<string | null>(null);
    multipleValue: number[] = [];
    templateValue: string | undefined;
    sizeValue1: string | undefined;
    sizeValue2 = 'Beginner';
    sizeValue3 = 'Expert';
    justifyValue: string | undefined;
    labelValue = 'one-way';
    colorValue = 'one-way';
    themeValue = 'one-way';

    readonly exampleForm = new FormGroup({
        value: new FormControl<string | null>(null, Validators.required),
    });
    formSubmitted = false;

    onSubmit(): void {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.toast.success(this.t().formSubmitted, 'SelectButton');
        }
    }

    onTemplateSubmit(form: NgForm): void {
        if (form.valid && this.templateValue) {
            this.toast.success(this.t().formSubmitted, 'SelectButton');
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!control?.invalid && (control.touched || this.formSubmitted);
    }

    importCode: Code = {
        typescript: `import { CzSelectButtonComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-select-button [options]="stateOptions" [(ngModel)]="value"
    optionLabel="label" optionValue="value" ariaLabelledBy="basic-label" />`,
        typescript: `stateOptions = [
    { label: 'One-Way', value: 'one-way' },
    { label: 'Return', value: 'return' }
];
value = 'one-way';`
    };

    disabledCode: Code = {
        html: `<!-- Whole component disabled -->
<cz-select-button [options]="stateOptions" [(ngModel)]="value1" optionLabel="label"
    optionValue="value" [disabled]="true" />

<!-- Certain options disabled -->
<cz-select-button [options]="stateOptions2" [(ngModel)]="value2" optionLabel="label"
    optionValue="value" optionDisabled="constant" />`,
        typescript: `stateOptions2 = [
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2', constant: true }
];`
    };

    fluidCode: Code = {
        html: `<cz-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label"
    optionValue="value" [fluid]="true" />`
    };

    invalidCode: Code = {
        html: `<cz-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label"
    optionValue="value" [invalid]="value === null" />`
    };

    multipleCode: Code = {
        html: `<cz-select-button [options]="paymentOptions" [(ngModel)]="value" [multiple]="true"
    optionLabel="name" optionValue="value" />`,
        typescript: `paymentOptions = [
    { name: 'Option 1', value: 1 },
    { name: 'Option 2', value: 2 },
    { name: 'Option 3', value: 3 }
];
value: number[] = [];`
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-select-button [options]="stateOptions" formControlName="value"
        [invalid]="isInvalid('value')" optionLabel="label" optionValue="value" />
    @if (isInvalid('value')) {
        <cz-message severity="danger" text="Selection is required." />
    }
    <button type="submit">Submit</button>
</form>

<!-- Template-driven forms -->
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
    <cz-select-button #model="ngModel" name="value" [(ngModel)]="value"
        [options]="stateOptions" optionLabel="label" optionValue="value" required
        [invalid]="!!(model.invalid && (model.touched || form.submitted))" />
</form>`
    };

    sizesCode: Code = {
        html: `<cz-select-button [(ngModel)]="value1" [options]="options" size="sm" />
<cz-select-button [(ngModel)]="value2" [options]="options" />
<cz-select-button [(ngModel)]="value3" [options]="options" size="lg" />`
    };

    templateCode: Code = {
        html: `<cz-select-button [options]="justifyOptions" [(ngModel)]="value" optionLabel="justify">
    <ng-template #itemTemplate let-item>
        <svg [lucideIcon]="item.icon" [size]="18"></svg>
    </ng-template>
</cz-select-button>`,
        typescript: `import { LucideAlignLeft, LucideAlignRight, LucideAlignCenter, LucideAlignJustify } from '@lucide/angular';

justifyOptions = [
    { icon: LucideAlignLeft, justify: 'Left' },
    { icon: LucideAlignRight, justify: 'Right' },
    { icon: LucideAlignCenter, justify: 'Center' },
    { icon: LucideAlignJustify, justify: 'Justify' }
];`
    };

    labelsCode: Code = {
        html: `<cz-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label"
    optionValue="value" label="Return" labelPosition="left" />
<cz-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label"
    optionValue="value" label="Return" labelPosition="top" />`
    };

    colorsCode: Code = {
        html: `<cz-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label"
    optionValue="value" color="primary" />
<cz-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label"
    optionValue="value" color="success" />
<cz-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label"
    optionValue="value" color="danger" />`
    };

    themesCode: Code = {
        html: `<div data-theme="neo">
    <cz-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label" optionValue="value" />
</div>

<div data-theme="glass">
    <cz-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label" optionValue="value" />
</div>`
    };
}
