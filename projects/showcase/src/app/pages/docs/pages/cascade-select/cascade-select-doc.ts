import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {
    CzButtonComponent,
    CzCascadeSelectComponent,
    CzIconComponent,
    CzMessageComponent,
} from 'codezium-ui';
import { LucideMap, LucidePlus } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { CASCADE_SELECT_DOC_I18N } from './cascade-select-doc.i18n';

const COUNTRIES = [
    {
        name: 'Australia',
        code: 'AU',
        states: [
            {
                name: 'New South Wales',
                cities: [
                    { cname: 'Sydney', code: 'A-SY' },
                    { cname: 'Newcastle', code: 'A-NE' },
                    { cname: 'Wollongong', code: 'A-WO' },
                ],
            },
            {
                name: 'Queensland',
                cities: [
                    { cname: 'Brisbane', code: 'A-BR' },
                    { cname: 'Townsville', code: 'A-TO' },
                ],
            },
        ],
    },
    {
        name: 'Canada',
        code: 'CA',
        states: [
            {
                name: 'Quebec',
                cities: [
                    { cname: 'Montreal', code: 'C-MO' },
                    { cname: 'Quebec City', code: 'C-QU' },
                ],
            },
            {
                name: 'Ontario',
                cities: [
                    { cname: 'Ottawa', code: 'C-OT' },
                    { cname: 'Toronto', code: 'C-TO' },
                ],
            },
        ],
    },
    {
        name: 'United States',
        code: 'US',
        states: [
            {
                name: 'California',
                cities: [
                    { cname: 'Los Angeles', code: 'US-LA' },
                    { cname: 'San Diego', code: 'US-SD' },
                    { cname: 'San Francisco', code: 'US-SF' },
                ],
            },
            {
                name: 'Florida',
                cities: [
                    { cname: 'Jacksonville', code: 'US-JA' },
                    { cname: 'Miami', code: 'US-MI' },
                    { cname: 'Tampa', code: 'US-TA' },
                    { cname: 'Orlando', code: 'US-OR' },
                ],
            },
            {
                name: 'Texas',
                cities: [
                    { cname: 'Austin', code: 'US-AU' },
                    { cname: 'Dallas', code: 'US-DA' },
                    { cname: 'Houston', code: 'US-HO' },
                ],
            },
        ],
    },
];

@Component({
    selector: 'cz-cascade-select-doc-page',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CzCascadeSelectComponent,
        CzButtonComponent,
        CzIconComponent,
        CzMessageComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="cascade-select">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-cascade-select [(ngModel)]="selectedCity" [options]="countries" optionLabel="cname"
                        optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']" optionValue="code"
                        [placeholder]="t().selectCity" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── CLEAR ICON ── -->
            <section>
                <h2 id="clear-icon">{{ t().clearIcon }}</h2>
                <p [innerHTML]="t().clearIconDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-cascade-select [(ngModel)]="selectedCity" [options]="countries" optionLabel="cname"
                        optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']" optionValue="code"
                        [placeholder]="t().selectCity" [showClear]="true" />
                </div>
                <app-code [code]="clearIconCode" />
            </section>

            <!-- ── DISABLED ── -->
            <section>
                <h2 id="disabled">{{ t().disabled }}</h2>
                <p [innerHTML]="t().disabledDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-cascade-select [disabled]="true" [placeholder]="t().disabled" />
                </div>
                <app-code [code]="disabledCode" />
            </section>

            <!-- ── FILLED ── -->
            <section>
                <h2 id="filled">{{ t().filled }}</h2>
                <p [innerHTML]="t().filledDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-cascade-select [(ngModel)]="filledCity" variant="filled" [options]="countries"
                        optionLabel="cname" optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']"
                        optionValue="code" [placeholder]="t().selectCity" />
                </div>
                <app-code [code]="filledCode" />
            </section>

            <!-- ── FLOAT LABEL ── -->
            <section>
                <h2 id="float-label">{{ t().floatLabel }}</h2>
                <p [innerHTML]="t().floatLabelDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-items-end cz-justify-center cz-gap-lg">
                    <cz-cascade-select [(ngModel)]="floatCity1" [label]="t().overLabel" labelPosition="over"
                        [options]="countries" optionLabel="cname" optionGroupLabel="name"
                        [optionGroupChildren]="['states', 'cities']" optionValue="code" />
                    <cz-cascade-select [(ngModel)]="floatCity2" [label]="t().inLabel" labelPosition="in"
                        [options]="countries" optionLabel="cname" optionGroupLabel="name"
                        [optionGroupChildren]="['states', 'cities']" optionValue="code" />
                    <cz-cascade-select [(ngModel)]="floatCity3" [label]="t().floatLabelText" labelPosition="float"
                        [options]="countries" optionLabel="cname" optionGroupLabel="name"
                        [optionGroupChildren]="['states', 'cities']" optionValue="code" />
                </div>
                <app-code [code]="floatLabelCode" />
            </section>

            <!-- ── FLUID ── -->
            <section>
                <h2 id="fluid">{{ t().fluid }}</h2>
                <p [innerHTML]="t().fluidDesc"></p>
                <div class="cz-mb-md">
                    <cz-cascade-select [(ngModel)]="fluidCity" [fluid]="true" [options]="countries"
                        optionLabel="cname" optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']"
                        optionValue="code" [placeholder]="t().selectCity" />
                </div>
                <app-code [code]="fluidCode" />
            </section>

            <!-- ── INVALID ── -->
            <section>
                <h2 id="invalid">{{ t().invalid }}</h2>
                <p [innerHTML]="t().invalidDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-lg">
                    <cz-cascade-select [(ngModel)]="invalidCity1" [invalid]="!invalidCity1" [options]="countries"
                        optionLabel="cname" optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']"
                        optionValue="code" [placeholder]="t().selectCity" />
                    <cz-cascade-select [(ngModel)]="invalidCity2" [invalid]="!invalidCity2" variant="filled"
                        [options]="countries" optionLabel="cname" optionGroupLabel="name"
                        [optionGroupChildren]="['states', 'cities']" optionValue="code"
                        [placeholder]="t().selectCity" />
                </div>
                <app-code [code]="invalidCode" />
            </section>

            <!-- ── LOADING ── -->
            <section>
                <h2 id="loading">{{ t().loading }}</h2>
                <p [innerHTML]="t().loadingDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-cascade-select [loading]="true" [placeholder]="t().loadingPlaceholder" />
                </div>
                <app-code [code]="loadingCode" />
            </section>

            <!-- ── SIZES ── -->
            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p [innerHTML]="t().sizesDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-col cz-items-center cz-gap-md">
                    <div style="width: 14rem;">
                        <cz-cascade-select [(ngModel)]="sizeSmall" [size]="'sm'" [fluid]="true"
                            [options]="countries" optionLabel="cname" optionGroupLabel="name"
                            [optionGroupChildren]="['states', 'cities']" optionValue="code"
                            [placeholder]="t().small" />
                    </div>
                    <div style="width: 14rem;">
                        <cz-cascade-select [(ngModel)]="sizeNormal" [fluid]="true" [options]="countries"
                            optionLabel="cname" optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']"
                            optionValue="code" [placeholder]="t().normal" />
                    </div>
                    <div style="width: 14rem;">
                        <cz-cascade-select [(ngModel)]="sizeLarge" [size]="'lg'" [fluid]="true"
                            [options]="countries" optionLabel="cname" optionGroupLabel="name"
                            [optionGroupChildren]="['states', 'cities']" optionValue="code"
                            [placeholder]="t().large" />
                    </div>
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <!-- ── TEMPLATE ── -->
            <section>
                <h2 id="template">{{ t().template }}</h2>
                <p [innerHTML]="t().templateDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-cascade-select [(ngModel)]="templateCity" [options]="countries" optionLabel="cname"
                        optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']" optionValue="code"
                        [placeholder]="t().selectCity">
                        <ng-template #optionTemplate let-option let-level="level">
                            <span class="cz-flex cz-items-center cz-gap-sm">
                                @if (level === 0) {
                                    <span class="cz-text-xs cz-font-semibold" style="color: var(--cz-color-primary);">
                                        {{ option.code }}
                                    </span>
                                }
                                <span>{{ option.cname || option.name }}</span>
                            </span>
                        </ng-template>
                        <ng-template #triggerIconTemplate>
                            <cz-icon [icon]="MapIcon" [size]="16" />
                        </ng-template>
                        <ng-template #headerTemplate>
                            <div class="cz-font-medium">{{ t().availableCountries }}</div>
                        </ng-template>
                        <ng-template #footerTemplate>
                            <cz-button [label]="t().addNew" size="sm" variant="text" [icon]="PlusIcon"
                                (onClick)="notify(t().addNew)" />
                        </ng-template>
                    </cz-cascade-select>
                </div>
                <app-code [code]="templateCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p [innerHTML]="t().formsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()"
                        class="cz-flex cz-flex-col cz-gap-sm" style="width: 15rem;">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-cascade-select formControlName="selectedCity" [options]="countries" optionLabel="cname"
                            optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']" optionValue="code"
                            [invalid]="isInvalid('selectedCity')" [fluid]="true" [placeholder]="t().selectCity" />
                        @if (isInvalid('selectedCity')) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)"
                        class="cz-flex cz-flex-col cz-gap-sm" style="width: 15rem;">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-cascade-select #city="ngModel" name="city" [(ngModel)]="templateFormCity"
                            [options]="countries" optionLabel="cname" optionGroupLabel="name"
                            [optionGroupChildren]="['states', 'cities']" optionValue="code" required
                            [invalid]="!!city.invalid && (city.touched || tdForm.submitted)" [fluid]="true"
                            [placeholder]="t().selectCity" />
                        @if (!!city.invalid && (city.touched || tdForm.submitted)) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>
                </div>
                <app-code [code]="formsCode" />
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <p [innerHTML]="t().accessibilityDesc"></p>
                <ul>
                    <li [innerHTML]="t().a11yList"></li>
                    <li [innerHTML]="t().a11yTree"></li>
                    <li [innerHTML]="t().a11yKeyboard"></li>
                </ul>
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>options</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>Hierarchical options with a nested structure.</td></tr>
                            <tr><td><code>optionLabel</code></td><td><code>string</code></td><td><code>'label'</code></td><td>Property used as the visible label of a leaf option.</td></tr>
                            <tr><td><code>optionValue</code></td><td><code>string</code></td><td><code>'value'</code></td><td>Property used as the value.</td></tr>
                            <tr><td><code>optionGroupLabel</code></td><td><code>string</code></td><td><code>'name'</code></td><td>Property used as the label of a category.</td></tr>
                            <tr><td><code>optionGroupChildren</code></td><td><code>string | string[]</code></td><td><code>[]</code></td><td>Nested keys of the hierarchy in order (e.g. <code>['states', 'cities']</code>).</td></tr>
                            <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Select...'</code></td><td>Placeholder of the trigger.</td></tr>
                            <tr><td><code>label / labelPosition</code></td><td><code>string / 'none' | 'over' | 'in' | 'float'</code></td><td><code>'' / 'none'</code></td><td>Visible label and its position (over = infield top, float = floating label).</td></tr>
                            <tr><td><code>disabled / readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled and readonly states.</td></tr>
                            <tr><td><code>showClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays a clear icon to reset the value.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Component size.</td></tr>
                            <tr><td><code>variant</code></td><td><code>'outlined' | 'filled'</code></td><td><code>'outlined'</code></td><td>Input variant.</td></tr>
                            <tr><td><code>fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Spans 100% width of the container.</td></tr>
                            <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Invalid state.</td></tr>
                            <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Loading state with spinner in the trigger and the panel.</td></tr>
                            <tr><td><code>emptyMessage</code></td><td><code>string</code></td><td><code>'No results found'</code></td><td>Empty state message.</td></tr>
                            <tr><td><code>inputId / ariaLabel / ariaLabelledBy</code></td><td><code>string | null</code></td><td><code>—</code></td><td>Native id and accessibility labels.</td></tr>
                            <tr><td><code>styleClass / zIndex</code></td><td><code>string / CzOverlayZIndex</code></td><td><code>'' / null</code></td><td>Host style class and overlay z-index.</td></tr>
                            <tr><td><code>optionTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Custom option template (<code>$implicit</code> option, <code>level</code>).</td></tr>
                            <tr><td><code>valueTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Custom selected value template.</td></tr>
                            <tr><td><code>triggerIconTemplate / loadingIconTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Custom trigger and loading icons.</td></tr>
                            <tr><td><code>headerTemplate / footerTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Panel header and footer templates.</td></tr>
                            <tr><td><code>onChange</code></td><td><code>output&lt;&#123; value, originalEvent &#125;&gt;</code></td><td><code>—</code></td><td>Emitted on value change.</td></tr>
                            <tr><td><code>onClear / onShow / onHide</code></td><td><code>output</code></td><td><code>—</code></td><td>Clear and panel visibility events.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class CascadeSelectDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => CASCADE_SELECT_DOC_I18N[this.lang.currentLang()] || CASCADE_SELECT_DOC_I18N.es);

    readonly MapIcon = LucideMap;
    readonly PlusIcon = LucidePlus;

    readonly countries = COUNTRIES;

    selectedCity: any;
    filledCity: any;
    floatCity1: any;
    floatCity2: any;
    floatCity3: any;
    fluidCity: any;
    invalidCity1: any;
    invalidCity2: any;
    sizeSmall: any;
    sizeNormal: any;
    sizeLarge: any;
    templateCity: any;
    templateFormCity: any;

    readonly exampleForm = new FormGroup({
        selectedCity: new FormControl('', Validators.required),
    });
    formSubmitted = false;

    onSubmit(): void {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.notify(this.t().formSubmitted);
        }
    }

    onTemplateSubmit(form: NgForm): void {
        if (form.valid) {
            this.notify(this.t().formSubmitted);
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!control?.invalid && (control.touched || this.formSubmitted);
    }

    notify(message: string): void {
        console.log(message);
    }

    importCode: Code = {
        typescript: `import { CzCascadeSelectComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-cascade-select
    [(ngModel)]="selectedCity"
    [options]="countries"
    optionLabel="cname"
    optionGroupLabel="name"
    [optionGroupChildren]="['states', 'cities']"
    optionValue="code"
    placeholder="Select a City"
/>`,
        typescript: `// options: [{ name: 'Australia', states: [{ name: 'NSW', cities: [{ cname: 'Sydney', code: 'A-SY' }] }] }]
// optionGroupChildren order must match the data hierarchy`,
    };

    clearIconCode: Code = {
        html: `<cz-cascade-select [(ngModel)]="selectedCity" [options]="countries" [showClear]="true" ... />`,
    };

    disabledCode: Code = {
        html: `<cz-cascade-select [disabled]="true" placeholder="Disabled" />`,
    };

    filledCode: Code = {
        html: `<cz-cascade-select [(ngModel)]="selectedCity" variant="filled" [options]="countries" ... />`,
    };

    floatLabelCode: Code = {
        html: `<cz-cascade-select label="Over Label" labelPosition="over" ... />
<cz-cascade-select label="In Label" labelPosition="in" ... />
<cz-cascade-select label="Float Label" labelPosition="float" ... />`,
    };

    fluidCode: Code = {
        html: `<cz-cascade-select [(ngModel)]="selectedCity" [fluid]="true" [options]="countries" ... />`,
    };

    invalidCode: Code = {
        html: `<cz-cascade-select [(ngModel)]="selectedCity" [invalid]="!selectedCity" [options]="countries" ... />`,
    };

    loadingCode: Code = {
        html: `<cz-cascade-select [loading]="true" placeholder="Loading..." />`,
    };

    sizesCode: Code = {
        html: `<cz-cascade-select size="sm" [options]="countries" ... />
<cz-cascade-select [options]="countries" ... />
<cz-cascade-select size="lg" [options]="countries" ... />`,
    };

    templateCode: Code = {
        html: `<cz-cascade-select [(ngModel)]="selectedCity" [options]="countries" ...>
    <ng-template #optionTemplate let-option let-level="level">
        @if (level === 0) {
            <span class="code">{{ option.code }}</span>
        }
        <span>{{ option.cname || option.name }}</span>
    </ng-template>

    <ng-template #triggerIconTemplate>
        <cz-icon [icon]="MapIcon" [size]="16" />
    </ng-template>

    <ng-template #headerTemplate>
        <div class="font-medium">Available Countries</div>
    </ng-template>

    <ng-template #footerTemplate>
        <cz-button label="Add New" variant="text" (onClick)="add()" />
    </ng-template>
</cz-cascade-select>`,
        typescript: `// valueTemplate and loadingIconTemplate are also available`,
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-cascade-select formControlName="selectedCity" [options]="countries"
        [invalid]="isInvalid('selectedCity')" />
    @if (isInvalid('selectedCity')) {
        <cz-message severity="danger" text="City is required." />
    }
</form>

<!-- Template-driven forms -->
<cz-cascade-select #city="ngModel" name="city" [(ngModel)]="selectedCity" required
    [invalid]="city.invalid && city.touched" [options]="countries" />`,
    };
}
