import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {
    CzButtonComponent,
    CzMessageComponent,
    CzRadioButtonComponent,
    CzTagComponent,
} from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { RADIO_BUTTON_DOC_I18N } from './radio-button-doc.i18n';

@Component({
    selector: 'cz-radio-button-doc-page',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CzRadioButtonComponent,
        CzButtonComponent,
        CzTagComponent,
        CzMessageComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="radio-button">{{ t().title }}</h1>
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
                    <div class="cz-flex cz-flex-col cz-gap-md">
                        @for (fruit of fruits; track fruit.value) {
                            <div class="cz-flex cz-items-center cz-gap-md">
                                <cz-radio-button name="fruit" [value]="fruit.value" [(ngModel)]="ingredient"
                                    [inputId]="'ingredient-' + fruit.value" />
                                <label [attr.for]="'ingredient-' + fruit.value" class="cz-text-sm">
                                    {{ fruit.emoji }} {{ fruit.label }}
                                </label>
                            </div>
                        }
                    </div>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── GROUP ── -->
            <section>
                <h2 id="group">{{ t().group }}</h2>
                <p [innerHTML]="t().groupDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-lg">
                    @for (topping of toppings; track topping) {
                        <div class="cz-flex cz-items-center cz-gap-sm">
                            <cz-radio-button name="pizza" [value]="topping" [(ngModel)]="pizza"
                                [inputId]="'pizza-' + topping" />
                            <label [attr.for]="'pizza-' + topping" class="cz-text-sm">{{ topping }}</label>
                        </div>
                    }
                </div>
                <span class="cz-text-sm">{{ t().selected }}: {{ pizza || '-' }}</span>
                <app-code [code]="groupCode" />
            </section>

            <!-- ── DYNAMIC ── -->
            <section>
                <h2 id="dynamic">{{ t().dynamic }}</h2>
                <p [innerHTML]="t().dynamicDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-lg">
                    @for (category of categories; track category.key) {
                        <div class="cz-flex cz-items-center cz-gap-sm">
                            <cz-radio-button name="category" [value]="category.key" [(ngModel)]="selectedCategory"
                                [inputId]="category.key" />
                            <label [attr.for]="category.key" class="cz-text-sm">{{ category.name }}</label>
                        </div>
                    }
                </div>
                <app-code [code]="dynamicCode" />
            </section>

            <!-- ── CARD ── -->
            <section>
                <h2 id="card">{{ t().card }}</h2>
                <p [innerHTML]="t().cardDesc"></p>
                <div class="cz-mb-md" style="max-width: 22rem; margin-inline: auto;">
                    <div class="cz-flex cz-flex-col cz-gap-md">
                        @for (plan of plans; track plan.id) {
                            <label [attr.for]="'plan-' + plan.id" class="cz-flex cz-items-start cz-gap-md cz-p-md cz-rounded-md cz-border"
                                style="cursor: pointer;"
                                [style.border-color]="selectedPlan === plan.id ? 'var(--cz-color-primary)' : null">
                                <span class="cz-flex-1 cz-flex cz-flex-col cz-gap-xs">
                                    <span class="cz-flex cz-items-center cz-justify-between cz-gap-sm">
                                        <span class="cz-flex cz-items-center cz-gap-sm">
                                            <strong class="cz-text-sm">{{ plan.name }}</strong>
                                            @if (plan.tag) {
                                                <cz-tag [value]="plan.tag" severity="info" size="sm" />
                                            }
                                        </span>
                                        <span class="cz-text-sm">
                                            <strong>{{ plan.price }}</strong><span class="cz-text-muted">{{ plan.period }}</span>
                                        </span>
                                    </span>
                                    <span class="cz-text-sm cz-text-muted">{{ plan.description }}</span>
                                </span>
                                <cz-radio-button [inputId]="'plan-' + plan.id" name="plan" [value]="plan.id"
                                    [(ngModel)]="selectedPlan" />
                            </label>
                        }
                    </div>
                </div>
                <app-code [code]="cardCode" />
            </section>

            <!-- ── PREVIEW ── -->
            <section>
                <h2 id="preview">{{ t().preview }}</h2>
                <p [innerHTML]="t().previewDesc"></p>
                <div class="cz-mb-md" style="max-width: 22rem; margin-inline: auto;">
                    <div class="cz-flex cz-flex-col cz-gap-md">
                        @for (env of environments; track env.id) {
                            <label [attr.for]="'env-' + env.id" class="cz-flex cz-items-start cz-gap-md cz-p-md cz-rounded-md cz-border"
                                style="cursor: pointer;"
                                [style.border-color]="selectedEnv === env.id ? 'var(--cz-color-primary)' : null">
                                <span class="cz-flex-1 cz-flex cz-flex-col cz-gap-xs">
                                    <strong class="cz-text-sm">{{ env.name }}</strong>
                                    <span class="cz-text-sm cz-text-muted">{{ env.description }}</span>
                                </span>
                                <cz-radio-button [inputId]="'env-' + env.id" name="env" [value]="env.id"
                                    [(ngModel)]="selectedEnv" />
                            </label>
                        }
                    </div>
                </div>
                <app-code [code]="previewCode" />
            </section>

            <!-- ── STATES & SIZES ── -->
            <section>
                <h2 id="states">{{ t().states }}</h2>
                <p [innerHTML]="t().statesDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-col cz-items-center cz-gap-lg">
                    <div class="cz-flex cz-items-center cz-gap-lg">
                        <strong class="cz-text-sm">{{ t().disabled }}</strong>
                        <cz-radio-button name="disabled-group" [value]="1" [(ngModel)]="disabledValue" [disabled]="true" />
                        <cz-radio-button name="disabled-group" [value]="2" [(ngModel)]="disabledValue" [disabled]="true" />
                    </div>
                    <div class="cz-flex cz-items-center cz-gap-lg">
                        <strong class="cz-text-sm">{{ t().invalid }}</strong>
                        <cz-radio-button [value]="true" [(ngModel)]="invalidValue" [invalid]="!invalidValue" />
                    </div>
                    <div class="cz-flex cz-items-center cz-gap-lg">
                        <strong class="cz-text-sm">{{ t().filled }}</strong>
                        <cz-radio-button name="filled-group" [value]="'a'" variant="filled" [(ngModel)]="filledValue" />
                        <cz-radio-button name="filled-group" [value]="'b'" variant="filled" [(ngModel)]="filledValue" />
                    </div>
                    <div class="cz-flex cz-flex-wrap cz-items-center cz-gap-lg">
                        <strong class="cz-text-sm">{{ t().sizes }}</strong>
                        @for (size of sizes; track size.value) {
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <cz-radio-button name="size" [value]="size.value" [(ngModel)]="selectedSize"
                                    [inputId]="'size-' + size.value" [size]="size.value" />
                                <label [attr.for]="'size-' + size.value" class="cz-text-sm">{{ size.label }}</label>
                            </div>
                        }
                    </div>
                    <div class="cz-flex cz-items-center cz-gap-lg">
                        <strong class="cz-text-sm">{{ t().binary }}</strong>
                        <cz-radio-button [binary]="true" [(ngModel)]="binaryValue" />
                    </div>
                </div>
                <app-code [code]="statesCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p [innerHTML]="t().formsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()"
                        class="cz-flex cz-flex-col cz-gap-sm">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <div class="cz-flex cz-flex-wrap cz-gap-md">
                            @for (category of categories; track category.key) {
                                <div class="cz-flex cz-items-center cz-gap-sm">
                                    <cz-radio-button formControlName="selectedCategory" name="selectedCategory"
                                        [value]="category" [inputId]="'rf-' + category.key"
                                        [invalid]="isInvalid('selectedCategory')" />
                                    <label [attr.for]="'rf-' + category.key" class="cz-text-sm">{{ category.name }}</label>
                                </div>
                            }
                        </div>
                        @if (isInvalid('selectedCategory')) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)"
                        class="cz-flex cz-flex-col cz-gap-sm">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <div class="cz-flex cz-flex-wrap cz-gap-md">
                            @for (category of categories; track category.key) {
                                <div class="cz-flex cz-items-center cz-gap-sm">
                                    <cz-radio-button name="ingredient" [(ngModel)]="templateIngredient"
                                        [value]="category" [inputId]="'td-' + category.key"
                                        [invalid]="!templateIngredient && tdForm.submitted" />
                                    <label [attr.for]="'td-' + category.key" class="cz-text-sm">{{ category.name }}</label>
                                </div>
                            }
                        </div>
                        @if (!templateIngredient && tdForm.submitted) {
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
                            <tr><td><code>value</code></td><td><code>any</code></td><td><code>—</code></td><td>Value of the radio button (required).</td></tr>
                            <tr><td><code>name</code></td><td><code>string</code></td><td><code>''</code></td><td>Name of the radio group.</td></tr>
                            <tr><td><code>inputId</code></td><td><code>string</code></td><td><code>''</code></td><td>Identifier of the input to match a label.</td></tr>
                            <tr><td><code>binary</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Allows selecting a boolean value (checked when the model is <code>true</code>).</td></tr>
                            <tr><td><code>variant</code></td><td><code>'outlined' | 'filled'</code></td><td><code>'outlined'</code></td><td>Input variant.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size of the radio button.</td></tr>
                            <tr><td><code>color</code></td><td><code>CzRadioButtonColor</code></td><td><code>'primary'</code></td><td>Color of the checked state.</td></tr>
                            <tr><td><code>label / labelPosition</code></td><td><code>string / 'left' | 'right'</code></td><td><code>'' / 'right'</code></td><td>Optional inline label.</td></tr>
                            <tr><td><code>disabled / readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>States.</td></tr>
                            <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Invalid state for failed validation.</td></tr>
                            <tr><td><code>tabindex / autofocus</code></td><td><code>number | null / boolean</code></td><td><code>null / false</code></td><td>Native input attributes.</td></tr>
                            <tr><td><code>ariaLabel / ariaLabelledBy</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Accessibility labels.</td></tr>
                            <tr><td><code>helperText</code></td><td><code>string</code></td><td><code>''</code></td><td>Helper text below the component.</td></tr>
                            <tr><td><code>onChange</code></td><td><code>output&lt;&#123; value, originalEvent &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when the value is selected.</td></tr>
                            <tr><td><code>onClick</code></td><td><code>output&lt;&#123; originalEvent, value &#125;&gt;</code></td><td><code>—</code></td><td>Emitted on radio click.</td></tr>
                            <tr><td><code>onFocus / onBlur</code></td><td><code>output&lt;Event&gt;</code></td><td><code>—</code></td><td>Focus events.</td></tr>
                            <tr><td><code>focus()</code></td><td><code>method</code></td><td><code>—</code></td><td>Applies focus to the input.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class RadioButtonDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => RADIO_BUTTON_DOC_I18N[this.lang.currentLang()] || RADIO_BUTTON_DOC_I18N.es);

    readonly fruits = [
        { label: 'Strawberry', emoji: '🍓', value: 'strawberry' },
        { label: 'Banana', emoji: '🍌', value: 'banana' },
        { label: 'Watermelon', emoji: '🍉', value: 'watermelon' },
    ];

    readonly toppings = ['Cheese', 'Mushroom', 'Pepper', 'Onion'];

    readonly categories = [
        { name: 'Accounting', key: 'A' },
        { name: 'Marketing', key: 'M' },
        { name: 'Production', key: 'P' },
        { name: 'Research', key: 'R' },
    ];

    readonly plans = [
        { id: 'starter', name: 'Starter', price: '$0', period: '/month', description: 'For solo developers exploring the platform.', tag: null },
        { id: 'pro', name: 'Pro', price: '$29', period: '/month', description: 'For growing teams shipping in production.', tag: 'Popular' },
        { id: 'enterprise', name: 'Enterprise', price: 'Custom', period: '', description: 'For large organizations with custom needs.', tag: null },
    ];

    readonly environments = [
        { id: '1', name: 'US East — Virginia', description: 'Low latency, auto-scaling enabled.' },
        { id: '2', name: 'EU West — Frankfurt', description: 'CI/CD pipeline, daily backups.' },
        { id: '3', name: 'EU East — Poland', description: 'GDPR compliant, secure.' },
    ];

    readonly sizes: { label: string; value: 'sm' | 'md' | 'lg' }[] = [
        { label: 'Small', value: 'sm' },
        { label: 'Normal', value: 'md' },
        { label: 'Large', value: 'lg' },
    ];

    ingredient: string | undefined;
    pizza: string | undefined;
    selectedCategory: string | undefined;
    selectedPlan = 'pro';
    selectedEnv: string | undefined;
    disabledValue = 2;
    invalidValue = false;
    filledValue = 'a';
    selectedSize = 'md';
    binaryValue = false;
    templateIngredient: any;

    readonly exampleForm = new FormGroup({
        selectedCategory: new FormControl(null, Validators.required),
    });
    formSubmitted = false;

    onSubmit(): void {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.notify(this.t().formSubmitted);
        }
    }

    onTemplateSubmit(form: NgForm): void {
        if (form.valid && this.templateIngredient) {
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
        typescript: `import { CzRadioButtonComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `@for (fruit of fruits; track fruit.value) {
    <div class="flex items-center gap-3">
        <cz-radio-button name="fruit" [value]="fruit.value" [(ngModel)]="ingredient"
            [inputId]="'ingredient-' + fruit.value" />
        <label [for]="'ingredient-' + fruit.value">{{ fruit.emoji }} {{ fruit.label }}</label>
    </div>
}`,
        typescript: `ingredient: string | undefined;`,
    };

    groupCode: Code = {
        html: `<!-- Radio group: same name, different values, shared ngModel -->
<cz-radio-button name="pizza" value="Cheese" [(ngModel)]="ingredient" inputId="pizza-cheese" />
<label for="pizza-cheese">Cheese</label>

<cz-radio-button name="pizza" value="Mushroom" [(ngModel)]="ingredient" inputId="pizza-mushroom" />
<label for="pizza-mushroom">Mushroom</label>`,
    };

    dynamicCode: Code = {
        html: `@for (category of categories; track category.key) {
    <cz-radio-button name="category" [value]="category.key" [(ngModel)]="selectedCategory"
        [inputId]="category.key" />
    <label [for]="category.key">{{ category.name }}</label>
}`,
        typescript: `categories = [
    { name: 'Accounting', key: 'A' },
    { name: 'Marketing', key: 'M' },
];`,
    };

    cardCode: Code = {
        html: `@for (plan of plans; track plan.id) {
    <label [for]="'plan-' + plan.id" class="plan-card" [class.selected]="selectedPlan === plan.id">
        <span class="flex-1">
            <strong>{{ plan.name }}</strong>
            <span>{{ plan.description }}</span>
        </span>
        <cz-radio-button [inputId]="'plan-' + plan.id" name="plan" [value]="plan.id"
            [(ngModel)]="selectedPlan" />
    </label>
}`,
        typescript: `// The whole card is a <label>: clicking anywhere selects the plan`,
    };

    previewCode: Code = {
        html: `<label [for]="'env-' + env.id" class="env-card">
    <span class="flex-1">
        <strong>{{ env.name }}</strong>
        <span class="text-sm">{{ env.description }}</span>
    </span>
    <cz-radio-button [inputId]="'env-' + env.id" name="env" [value]="env.id" [(ngModel)]="selectedEnv" />
</label>`,
    };

    statesCode: Code = {
        html: `<!-- Disabled -->
<cz-radio-button [value]="1" [(ngModel)]="value" [disabled]="true" />

<!-- Invalid -->
<cz-radio-button [value]="true" [(ngModel)]="value" [invalid]="!value" />

<!-- Filled variant -->
<cz-radio-button name="g" value="a" variant="filled" [(ngModel)]="value" />

<!-- Sizes: sm | md | lg -->
<cz-radio-button name="size" value="Small" size="sm" [(ngModel)]="size" />
<cz-radio-button name="size" value="Large" size="lg" [(ngModel)]="size" />

<!-- Binary (boolean) -->
<cz-radio-button [binary]="true" [(ngModel)]="checked" />`,
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    @for (category of categories; track category.key) {
        <cz-radio-button formControlName="selectedCategory" name="selectedCategory"
            [value]="category" [invalid]="isInvalid('selectedCategory')" />
        <label>{{ category.name }}</label>
    }
</form>

<!-- Template-driven forms -->
<cz-radio-button name="ingredient" [(ngModel)]="ingredient" [value]="category"
    [invalid]="!ingredient && form.submitted" />`,
    };
}
