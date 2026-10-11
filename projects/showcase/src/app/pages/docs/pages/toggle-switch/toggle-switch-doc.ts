import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CzToggleSwitchComponent, CzMessageComponent, CzButtonComponent, CzDividerComponent, CzToastService } from 'codezium-ui';
import { LucideDynamicIcon, LucideCheck, LucideX } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TOGGLE_SWITCH_DOC_I18N } from './toggle-switch-doc.i18n';

@Component({
    selector: 'cz-toggle-switch-doc-page',
    imports: [CzToggleSwitchComponent, CzMessageComponent, CzButtonComponent, CzDividerComponent, LucideDynamicIcon, AppCodeComponent, FormsModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="toggle-switch">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-toggle-switch [(ngModel)]="value" ariaLabel="Basic switch" />
                    <span class="cz-text-sm">Value: {{ value() }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-toggle-switch label="Small" size="sm" [(ngModel)]="value" />
                    <cz-toggle-switch label="Medium" size="md" [(ngModel)]="value" />
                    <cz-toggle-switch label="Large" size="lg" [(ngModel)]="value" />
                </div>
                <app-code [code]="optionsCode" />
            </section>

            <section>
                <h2 id="states">{{ t().states }}</h2>
                <p [innerHTML]="t().statesDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-toggle-switch label="Disabled" [disabled]="true" [ngModel]="true" />
                    <cz-toggle-switch label="Readonly" [readonly]="true" [ngModel]="true" />
                    <cz-toggle-switch label="On/Off mapping" [trueValue]="'on'" [falseValue]="'off'" [(ngModel)]="mapped" />
                    <span class="cz-text-sm">Mapped value: {{ mapped() }}</span>
                </div>
                <app-code [code]="statesCode" />
            </section>


            <section>
                <h2 id="template">{{ t().template }}</h2>
                <p [innerHTML]="t().templateDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-toggle-switch [(ngModel)]="templateValue" ariaLabel="Template switch">
                        <ng-template #handleTemplate let-checked>
                            @if (checked) {
                                <svg [lucideIcon]="CheckIcon" [size]="10"></svg>
                            } @else {
                                <svg [lucideIcon]="XIcon" [size]="10"></svg>
                            }
                        </ng-template>
                    </cz-toggle-switch>
                </div>
                <app-code [code]="templateCode" />
            </section>

            <section>
                <h2 id="invalid">{{ t().invalid }}</h2>
                <p>{{ t().invalidDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-toggle-switch [ngModel]="invalidValue" (ngModelChange)="invalidValue.set($event)"
                        [invalid]="!invalidValue()" ariaLabel="Invalid switch" />
                </div>
                <app-code [code]="invalidCode" />
            </section>

            <section>
                <h2 id="preview">{{ t().preview }}</h2>
                <p>{{ t().previewDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md" style="max-width: 22rem">
                    <label class="cz-flex cz-items-center cz-justify-between cz-gap-lg" style="cursor: pointer">
                        <span class="cz-flex cz-flex-col">
                            <strong class="cz-text-sm">Email address</strong>
                            <span class="cz-text-xs cz-text-muted">Users can add email addresses to their account</span>
                        </span>
                        <cz-toggle-switch [(ngModel)]="emailEnabled" />
                    </label>
                    <cz-divider />
                    <label class="cz-flex cz-items-center cz-justify-between cz-gap-lg" style="cursor: pointer">
                        <span class="cz-flex cz-flex-col">
                            <strong class="cz-text-sm">Two-factor authentication</strong>
                            <span class="cz-text-xs cz-text-muted">Require a verification code when signing in</span>
                        </span>
                        <cz-toggle-switch [(ngModel)]="twoFactorEnabled" />
                    </label>
                </div>
                <app-code [code]="previewCode" />
            </section>

            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p>{{ t().formsDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="cz-flex cz-flex-col cz-items-start cz-gap-sm">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-toggle-switch name="activation" formControlName="activation" [invalid]="isInvalid('activation')" />
                        @if (isInvalid('activation')) {
                            <cz-message severity="danger" [text]="t().activationRequired" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)" class="cz-flex cz-flex-col cz-items-start cz-gap-sm">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-toggle-switch #model="ngModel" name="activation" [(ngModel)]="templateChecked" required
                            [invalid]="!!(model.invalid && tdForm.submitted)" />
                        @if (model.invalid && tdForm.submitted) {
                            <cz-message severity="danger" [text]="t().activationRequired" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>
                </div>
                <app-code [code]="formsCode" />
            </section>

            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <p>{{ t().accessibilityDesc }}</p>
            </section>

            <section>
                <h2 id="themes">{{ t().themes }}</h2>
                <p>{{ t().themesDesc }}</p>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-3 cz-gap-md cz-mb-md">
                    <div class="cz-p-md cz-border cz-rounded-lg" style="background: var(--cz-theme-surface);">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Base</small>
                        <cz-toggle-switch [(ngModel)]="value" label="Base" />
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg" data-theme="glass">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Glass</small>
                        <cz-toggle-switch [(ngModel)]="value" label="Glass" />
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg" data-theme="neo">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Neo</small>
                        <cz-toggle-switch [(ngModel)]="value" label="Neo" />
                    </div>
                </div>
                <app-code [code]="themesCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Label next to the switch.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Switch size.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Readonly state.</td></tr>
                            <tr><td><code>trueValue</code></td><td><code>any</code></td><td><code>true</code></td><td>Value when checked.</td></tr>
                            <tr><td><code>falseValue</code></td><td><code>any</code></td><td><code>false</code></td><td>Value when unchecked.</td></tr>
                            <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Invalid state for failed validation.</td></tr>
                            <tr><td><code>inputId</code></td><td><code>string</code></td><td><code>''</code></td><td>Identifier of the input element to match a label.</td></tr>
                            <tr><td><code>tabindex / autofocus</code></td><td><code>number / boolean</code></td><td><code>0 / false</code></td><td>Native and accessibility attributes.</td></tr>
                            <tr><td><code>ariaLabel / ariaLabelledBy</code></td><td><code>string</code></td><td><code>''</code></td><td>Accessibility labels.</td></tr>
                            <tr><td><code>onChange</code></td><td><code>output&lt;any&gt;</code></td><td>-</td><td>Emitted on change with the mapped value.</td></tr>
                            <tr><td><code>#handleTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Custom handle template (context: checked).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ToggleSwitchDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TOGGLE_SWITCH_DOC_I18N[this.lang.currentLang()] || TOGGLE_SWITCH_DOC_I18N.es);

    readonly value = signal(true);
    readonly mapped = signal<'on' | 'off'>('off');
    readonly templateValue = signal(false);
    readonly invalidValue = signal(false);
    readonly emailEnabled = signal(false);
    readonly twoFactorEnabled = signal(true);
    templateChecked = false;

    readonly CheckIcon = LucideCheck;
    readonly XIcon = LucideX;

    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(CzToastService);

    exampleForm = this.fb.group({
        activation: [false, [Validators.requiredTrue]]
    });
    formSubmitted = false;

    onSubmit(): void {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.toast.success(this.t().formSubmitted, 'ToggleSwitch');
        }
    }

    onTemplateSubmit(form: any): void {
        if (form.valid && this.templateChecked) {
            this.toast.success(this.t().formSubmitted, 'ToggleSwitch');
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!control?.invalid && (control.touched || this.formSubmitted);
    }

    importCode: Code = {
        typescript: `import { CzToggleSwitchComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-toggle-switch [(ngModel)]="value" ariaLabel="Basic switch" />`,
        typescript: `value = signal(true);`,
    };

    optionsCode: Code = {
        html: `<cz-toggle-switch label="Small" size="sm" [(ngModel)]="value" />
<cz-toggle-switch label="Medium" size="md" [(ngModel)]="value" />
<cz-toggle-switch label="Large" size="lg" [(ngModel)]="value" />`,
    };

    templateCode: Code = {
        html: `<cz-toggle-switch [(ngModel)]="checked">
    <ng-template #handleTemplate let-checked>
        @if (checked) {
            <svg [lucideIcon]="CheckIcon" [size]="10"></svg>
        } @else {
            <svg [lucideIcon]="XIcon" [size]="10"></svg>
        }
    </ng-template>
</cz-toggle-switch>`,
    };

    invalidCode: Code = {
        html: `<cz-toggle-switch [(ngModel)]="checked" [invalid]="!checked" />`,
    };

    previewCode: Code = {
        html: `<label class="flex items-center justify-between gap-12">
    <div class="flex-1">
        <div class="font-bold">Email address</div>
        <div class="text-muted-color">Users can add email addresses to their account</div>
    </div>
    <cz-toggle-switch [(ngModel)]="emailEnabled" />
</label>`,
    };

    themesCode: Code = {
        html: `<!-- Base theme (default) -->
<cz-toggle-switch [(ngModel)]="value" />

<!-- Glass theme -->
<div data-theme="glass">
    <cz-toggle-switch [(ngModel)]="value" />
</div>

<!-- Neo theme -->
<div data-theme="neo">
    <cz-toggle-switch [(ngModel)]="value" />
</div>`,
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-toggle-switch name="activation" formControlName="activation"
        [invalid]="isInvalid('activation')" />
    @if (isInvalid('activation')) {
        <cz-message severity="danger" text="Activation is required." />
    }
    <cz-button label="Submit" type="submit" />
</form>

<!-- Template-driven forms -->
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
    <cz-toggle-switch #model="ngModel" name="activation" [(ngModel)]="checked" required
        [invalid]="!!(model.invalid && form.submitted)" />
</form>`,
    };

    statesCode: Code = {
        html: `<cz-toggle-switch label="Disabled" [disabled]="true" [ngModel]="true" />
<cz-toggle-switch label="Readonly" [readonly]="true" [ngModel]="true" />
<cz-toggle-switch label="On/Off mapping" [trueValue]="'on'" [falseValue]="'off'" [(ngModel)]="mapped" />`,
    };
}
