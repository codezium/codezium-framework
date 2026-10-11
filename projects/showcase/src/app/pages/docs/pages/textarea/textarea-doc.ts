import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CzTextAreaComponent, CzMessageComponent, CzButtonComponent, CzKeyFilterDirective, CzToastService } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TEXTAREA_DOC_I18N } from './textarea-doc.i18n';

@Component({
    selector: 'cz-textarea-doc-page',
    imports: [CommonModule, CzTextAreaComponent, CzMessageComponent, CzButtonComponent, CzKeyFilterDirective, AppCodeComponent, ReactiveFormsModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="textarea">{{ t().title }}</h1>
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
                    <cz-textarea 
                        label="Comments" 
                        placeholder="Write your comments here..."
                        [ngModel]="basicValue"
                        (ngModelChange)="basicValue = $event">
                    </cz-textarea>
                    <p class="cz-mt-xs cz-text-sm cz-text-secondary">Value: {{ basicValue }}</p>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── AUTO RESIZE ── -->
            <section>
                <h2 id="auto-resize">{{ t().resizeTitle }}</h2>
                <p [innerHTML]="t().resizeDesc"></p>
                <div class="cz-mb-md">
                    <cz-textarea 
                        label="Auto Resizing" 
                        [autoResize]="true"
                        placeholder="This area grows as you type...">
                    </cz-textarea>
                </div>
                <app-code [code]="resizeCode" />
            </section>

            <!-- ── THEMES ── -->
            <section>
                <h2 id="themes">{{ t().themesTitle }}</h2>
                <p [innerHTML]="t().themesDesc"></p>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-3 cz-gap-md cz-mb-md">
                    <div class="cz-p-md cz-border cz-rounded-lg" style="background: var(--cz-theme-surface);">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Base</small>
                        <cz-textarea label="Base Theme" placeholder="Default style"></cz-textarea>
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg" data-theme="glass">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Glass</small>
                        <cz-textarea label="Glass Theme" placeholder="Glassmorphism style"></cz-textarea>
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg" data-theme="neo">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Neo</small>
                        <cz-textarea label="Neo Theme" placeholder="Neumorphic style"></cz-textarea>
                    </div>
                </div>
                <app-code [code]="themesCode" />
            </section>

            <!-- ── LABELS ── -->
            <section>
                <h2 id="labels">{{ t().labelsTitle }}</h2>
                <p [innerHTML]="t().labelsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md cz-items-end">
                    <cz-textarea label="Static (Default)" labelPosition="none" placeholder="No animation"></cz-textarea>
                    <cz-textarea label="Over Label" labelPosition="over" placeholder="Outside above"></cz-textarea>
                    <cz-textarea label="Inner Label" labelPosition="in" placeholder="Inside top"></cz-textarea>
                    <cz-textarea label="Floating Label" labelPosition="float" placeholder="Moves up on focus"></cz-textarea>
                </div>
                <app-code [code]="labelsCode" />
            </section>

            <!-- ── COLORS & STATES ── -->
            <section>
                <h2 id="colors">{{ t().colorsTitle }}</h2>
                <p [innerHTML]="t().colorsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-textarea label="Primary Filled" color="primary" [filled]="true" labelPosition="float"></cz-textarea>
                    <cz-textarea label="Success" color="success" labelPosition="over"></cz-textarea>
                    <cz-textarea label="Disabled" [disabled]="true" placeholder="Cannot edit this"></cz-textarea>
                    <cz-textarea label="Fluid TextArea" [fluid]="true" labelPosition="float"></cz-textarea>
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── VALIDATION ── -->
            <section>
                <h2 id="validation">{{ t().validationTitle }}</h2>
                <p [innerHTML]="t().validationDesc"></p>
                <div class="cz-mb-md">
                    <form [formGroup]="testForm">
                        <cz-textarea 
                            formControlName="requiredField"
                            label="Required Field"
                            placeholder="Leave empty to see error"
                            [locale]="currentLang() === 'es' ? 'es' : 'en'">
                        </cz-textarea>
                    </form>
                </div>
                <app-code [code]="validationCode" />
            </section>


            <!-- ── FILLED ── -->
            <section>
                <h2 id="filled">{{ t().filledTitle }}</h2>
                <p>{{ t().filledDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-textarea label="Filled" variant="filled" placeholder="Filled variant" labelPosition="float"></cz-textarea>
                    <cz-textarea label="Outlined" variant="outlined" placeholder="Outlined variant" labelPosition="float"></cz-textarea>
                </div>
                <app-code [code]="filledCode" />
            </section>

            <!-- ── SIZES ── -->
            <section>
                <h2 id="sizes">{{ t().sizesTitle }}</h2>
                <p>{{ t().sizesDesc }}</p>
                <div class="cz-flex cz-flex-col cz-items-start cz-gap-md cz-mb-md">
                    <cz-textarea [(ngModel)]="sizeValue1" size="sm" placeholder="Small" [rows]="2"></cz-textarea>
                    <cz-textarea [(ngModel)]="sizeValue2" placeholder="Normal" [rows]="2"></cz-textarea>
                    <cz-textarea [(ngModel)]="sizeValue3" size="lg" placeholder="Large" [rows]="2"></cz-textarea>
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <!-- ── INVALID ── -->
            <section>
                <h2 id="invalid">{{ t().invalidTitle }}</h2>
                <p>{{ t().invalidDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-textarea [ngModel]="invalidValue" (ngModelChange)="invalidValue = $event"
                        [invalid]="!invalidValue" placeholder="Address" label="Address" labelPosition="float"></cz-textarea>
                    <cz-textarea [invalid]="true" variant="filled" placeholder="Filled invalid" label="Filled" labelPosition="float"></cz-textarea>
                </div>
                <app-code [code]="invalidCode" />
            </section>

            <!-- ── KEY FILTER ── -->
            <section>
                <h2 id="keyfilter">{{ t().keyFilterTitle }}</h2>
                <p [innerHTML]="t().keyFilterDesc"></p>
                <div class="cz-mb-md">
                    <cz-textarea czKeyFilter="integer" label="Only integers" [autoResize]="true"
                        placeholder="Type letters to see them blocked" labelPosition="float"></cz-textarea>
                </div>
                <app-code [code]="keyFilterCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().formsTitle }}</h2>
                <p>{{ t().formsDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="cz-flex cz-flex-col cz-gap-sm" style="width: 18rem">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-textarea formControlName="address" [invalid]="isInvalid('address')" [rows]="3"
                            placeholder="Address" label="Address" labelPosition="float"></cz-textarea>
                        @if (isInvalid('address')) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)" class="cz-flex cz-flex-col cz-gap-sm" style="width: 18rem">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-textarea name="address" [(ngModel)]="templateValue" required [rows]="3"
                            placeholder="Address" label="Address" labelPosition="float"
                            [invalid]="!!(addressModel.invalid && (addressModel.touched || tdForm.submitted))" #addressModel="ngModel"></cz-textarea>
                        @if (addressModel.invalid && (addressModel.touched || tdForm.submitted)) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>
                </div>
                <app-code [code]="formsCode" />
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibilityTitle }}</h2>
                <h3 id="screenreader">{{ t().screenReader }}</h3>
                <p>{{ t().screenReaderDesc }}</p>
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
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Label text.</td></tr>
                            <tr><td><code>labelPosition</code></td><td><code>'none' | 'over' | 'in' | 'float'</code></td><td><code>'none'</code></td><td>Label placement.</td></tr>
                            <tr><td><code>autoResize</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Automatically grows height with content.</td></tr>
                            <tr><td><code>rows</code></td><td><code>number</code></td><td><code>3</code></td><td>Initial rows of the textarea.</td></tr>
                            <tr><td><code>cols</code></td><td><code>number</code></td><td><code>20</code></td><td>Initial columns of the textarea.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>TextArea size.</td></tr>
                            <tr><td><code>color</code></td><td><code>CzInputColor</code></td><td><code>''</code></td><td>Color variant.</td></tr>
                            <tr><td><code>filled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Filled background style.</td></tr>
                            <tr><td><code>fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Full width.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Readonly state.</td></tr>
                            <tr><td><code>variant</code></td><td><code>'outlined' | 'filled'</code></td><td><code>'outlined'</code></td><td>Input variant.</td></tr>
                            <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Invalid state for failed validation.</td></tr>
                            <tr><td><code>autofocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Automatically gets focus on load.</td></tr>
                            <tr><td><code>inputId / name / tabindex</code></td><td><code>string / string / number</code></td><td><code>—</code></td><td>Native input attributes.</td></tr>
                            <tr><td><code>ariaLabel / ariaLabelledBy</code></td><td><code>string</code></td><td><code>null</code></td><td>Accessibility labels.</td></tr>
                            <tr><td><code>onResize</code></td><td><code>output&lt;Event&gt;</code></td><td><code>—</code></td><td>Emitted on textarea resize.</td></tr>
                            <tr><td><code>onFocus / onBlur</code></td><td><code>output&lt;Event&gt;</code></td><td><code>—</code></td><td>Focus events.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TextareaDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => (TEXTAREA_DOC_I18N as any)[this.lang.currentLang()] || TEXTAREA_DOC_I18N.es);
    readonly currentLang = this.lang.currentLang;

    basicValue = '';
    sizeValue1 = '';
    sizeValue2 = '';
    sizeValue3 = '';
    invalidValue = '';
    templateValue = '';
    private readonly toast = inject(CzToastService);

    testForm = new FormGroup({
        requiredField: new FormControl('', Validators.required)
    });

    exampleForm = new FormGroup({
        address: new FormControl('', Validators.required)
    });
    formSubmitted = false;

    onSubmit(): void {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.toast.success(this.t().formSubmitted, 'Textarea');
        }
    }

    onTemplateSubmit(form: any): void {
        if (form.valid && this.templateValue) {
            this.toast.success(this.t().formSubmitted, 'Textarea');
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!control?.invalid && (control.touched || this.formSubmitted);
    }

    importCode: Code = {
        typescript: `import { CzTextAreaComponent, CzMessageComponent, CzButtonComponent, CzKeyFilterDirective, CzToastService } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-textarea 
    label="Comments" 
    placeholder="Write your comments here..."
    [(ngModel)]="basicValue">
</cz-textarea>`,
        typescript: `import { FormsModule } from '@angular/forms';
import { CzTextAreaComponent, CzMessageComponent, CzButtonComponent, CzKeyFilterDirective, CzToastService } from 'codezium-ui';

@Component({
    imports: [CzTextAreaComponent, FormsModule],
    template: '...'
})
export class MyComponent {
    basicValue = '';
}`
    };

    resizeCode: Code = {
        html: `<cz-textarea 
    label="Auto Resizing" 
    [autoResize]="true"
    placeholder="This area grows as you type...">
</cz-textarea>`,
        typescript: `import { CzTextAreaComponent, CzMessageComponent, CzButtonComponent, CzKeyFilterDirective, CzToastService } from 'codezium-ui';

@Component({
    imports: [CzTextAreaComponent],
    template: '...'
})
export class MyComponent {
    // Just add [autoResize]="true" to the template
}`
    };

    themesCode: Code = {
        html: `<!-- Base Theme (Default) -->
<cz-textarea label="Base" />

<!-- Glass Theme -->
<div data-theme="glass">
    <cz-textarea label="Glass" />
</div>

<!-- Neo Theme -->
<div data-theme="neo">
    <cz-textarea label="Neo" />
</div>`,
        typescript: `// Themes are applied using the [data-theme] attribute 
// on a parent element or the component itself.`
    };

    labelsCode: Code = {
        html: `<cz-textarea label="Static" labelPosition="none"></cz-textarea>
<cz-textarea label="Over Label" labelPosition="over"></cz-textarea>
<cz-textarea label="Inner Label" labelPosition="in"></cz-textarea>
<cz-textarea label="Floating Label" labelPosition="float"></cz-textarea>`,
        typescript: `// The labelPosition property accepts: 'none', 'over', 'in', 'float'
// Default is 'none'`
    };

    colorsCode: Code = {
        html: `<cz-textarea label="Primary Filled" color="primary" [filled]="true"></cz-textarea>
<cz-textarea label="Success" color="success" labelPosition="over"></cz-textarea>
<cz-textarea label="Disabled" [disabled]="true"></cz-textarea>
<cz-textarea label="Fluid" [fluid]="true"></cz-textarea>`,
        typescript: `/* Supported colors: 
   'primary', 'secondary', 'success', 
   'warning', 'danger', 'info', 'dark' */

// Use [fluid]="true" for full-width components`
    };

    filledCode: Code = {
        html: `<cz-textarea label="Filled" variant="filled" labelPosition="float" />
<cz-textarea label="Outlined" variant="outlined" labelPosition="float" />`
    };

    sizesCode: Code = {
        html: `<cz-textarea [(ngModel)]="value1" size="sm" placeholder="Small" [rows]="2" />
<cz-textarea [(ngModel)]="value2" placeholder="Normal" [rows]="2" />
<cz-textarea [(ngModel)]="value3" size="lg" placeholder="Large" [rows]="2" />`
    };

    invalidCode: Code = {
        html: `<cz-textarea [(ngModel)]="value" [invalid]="!value" placeholder="Address" label="Address" labelPosition="float" />
<cz-textarea [invalid]="true" variant="filled" placeholder="Filled invalid" />`
    };

    keyFilterCode: Code = {
        html: `<textarea pTextarea czKeyFilter="integer" rows="3" placeholder="Only integers"></textarea>`
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-textarea formControlName="address" [invalid]="isInvalid('address')"
        placeholder="Address" label="Address" labelPosition="float" />
    @if (isInvalid('address')) {
        <cz-message severity="danger" text="Address is required." />
    }
    <cz-button label="Submit" type="submit" />
</form>

<!-- Template-driven forms -->
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
    <cz-textarea name="address" [(ngModel)]="value" required
        [invalid]="!!(address.invalid && (address.touched || form.submitted))" #address="ngModel" />
</form>`
    };

    validationCode: Code = {
        html: `<form [formGroup]="myForm">
    <cz-textarea 
        formControlName="comment"
        label="Required Comment"
        [locale]="'es'">
    </cz-textarea>
</form>`,
        typescript: `import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CzTextAreaComponent, CzMessageComponent, CzButtonComponent, CzKeyFilterDirective, CzToastService } from 'codezium-ui';

@Component({
    imports: [CzTextAreaComponent, ReactiveFormsModule],
    template: '...'
})
export class MyComponent {
    myForm = new FormGroup({
        comment: new FormControl('', Validators.required)
    });
}`
    };
}
