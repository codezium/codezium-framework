import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CzToggleButtonComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TOGGLE_BUTTON_DOC_I18N } from './toggle-button-doc.i18n';

@Component({
    selector: 'cz-toggle-button-doc-page',
    imports: [CommonModule, CzToggleButtonComponent, AppCodeComponent, FormsModule, ReactiveFormsModule],
    template: `
        <div class="doc-page">
            <header class="cz-mb-xl">
                <h1 id="toggle-button" class="cz-display-4 cz-font-bold">{{ t().title }}</h1>
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
                    <cz-toggle-button [(ngModel)]="checked1" />
                    <div class="cz-badge cz-badge--info cz-align-self-start">
                        Checked: {{ checked1() }}
                    </div>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── CUSTOMIZED ── -->
            <section class="cz-mb-xl">
                <h2 id="customized" class="cz-h2 cz-mb-sm">{{ t().customized }}</h2>
                <p class="cz-mb-md">{{ t().customizedDescription }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-toggle-button 
                        [(ngModel)]="checked2" 
                        onLabel="I confirm" 
                        offLabel="I reject" 
                        onIcon="pi pi-check" 
                        offIcon="pi pi-times" />
                </div>
                <app-code [code]="customizedCode" />
            </section>

            <!-- ── ICONS ONLY ── -->
            <section class="cz-mb-xl">
                <h2 id="icons" class="cz-h2 cz-mb-sm">{{ t().icons }}</h2>
                <p class="cz-mb-md">{{ t().iconsDescription }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-toggle-button 
                        [(ngModel)]="checked3" 
                        onIcon="pi pi-check" 
                        offIcon="pi pi-times" 
                        onLabel="" 
                        offLabel="" />
                </div>
                <app-code [code]="iconsCode" />
            </section>

            <!-- ── COLORS ── -->
            <section class="cz-mb-xl">
                <h2 id="colors" class="cz-h2 cz-mb-sm">{{ t().colors }}</h2>
                <p class="cz-mb-md" [innerHTML]="t().colorsDescription"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-toggle-button [(ngModel)]="checked4" color="primary" label="Primary" />
                    <cz-toggle-button [(ngModel)]="checked4" color="secondary" label="Secondary" />
                    <cz-toggle-button [(ngModel)]="checked4" color="success" label="Success" />
                    <cz-toggle-button [(ngModel)]="checked4" color="info" label="Info" />
                    <cz-toggle-button [(ngModel)]="checked4" color="warning" label="Warning" />
                    <cz-toggle-button [(ngModel)]="checked4" color="danger" label="Danger" />
                    <cz-toggle-button [(ngModel)]="checked4" color="dark" label="Dark" />
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── SIZES ── -->
            <section class="cz-mb-xl">
                <h2 id="sizes" class="cz-h2 cz-mb-sm">{{ t().sizes }}</h2>
                <p class="cz-mb-md">{{ t().sizesDescription }}</p>
                <div class="cz-flex cz-items-end cz-gap-md cz-mb-md">
                    <cz-toggle-button [(ngModel)]="checked1" size="sm" label="Small" />
                    <cz-toggle-button [(ngModel)]="checked1" size="md" label="Medium" />
                    <cz-toggle-button [(ngModel)]="checked1" size="lg" label="Large" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <!-- ── THEMES ── -->
            <section class="cz-mb-xl">
                <h2 id="themes" class="cz-h2 cz-mb-sm">{{ t().themes }}</h2>
                <p class="cz-mb-md">{{ t().themesDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <div class="cz-flex cz-gap-md">
                        <cz-toggle-button [(ngModel)]="checked5" theme="base" label="Base Theme" />
                        <cz-toggle-button [(ngModel)]="checked5" theme="neo" label="Neo Theme" />
                    </div>
                    <div class="cz-p-lg cz-bg-color-gray-200" style="border-radius: 12px;">
                        <cz-toggle-button [(ngModel)]="checked5" theme="glass" label="Glass Theme" />
                    </div>
                </div>
                <app-code [code]="themesCode" />
            </section>

            <!-- ── VALIDATION ── -->
            <section class="cz-mb-xl">
                <h2 id="validation" class="cz-h2 cz-mb-sm">{{ t().validation }}</h2>
                <p class="cz-mb-md">{{ t().validationDescription }}</p>
                <div class="cz-mb-md">
                    <form [formGroup]="testForm" class="cz-flex cz-flex-col cz-gap-md">
                        <cz-toggle-button 
                            formControlName="required" 
                            label="Terms of Service" 
                            onLabel="Accepted" 
                            offLabel="Accept Terms" 
                            onIcon="pi pi-check" 
                            helperText="You must accept the terms to continue" />
                        
                        <div class="cz-flex cz-gap-sm">
                            <button class="cz-button cz-button--outline cz-button--sm" (click)="testForm.markAllAsTouched()">
                                Validate Form
                            </button>
                            <button class="cz-button cz-button--ghost cz-button--sm" (click)="testForm.reset({required: false})">
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
                            <tr>
                                <th>{{ t().table.name }}</th>
                                <th>{{ t().table.type }}</th>
                                <th>{{ t().table.default }}</th>
                                <th>{{ t().table.description }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><code>onLabel</code></td><td><code>string</code></td><td><code>'On'</code></td><td>Label for the On state.</td></tr>
                            <tr><td><code>offLabel</code></td><td><code>string</code></td><td><code>'Off'</code></td><td>Label for the Off state.</td></tr>
                            <tr><td><code>onIcon</code></td><td><code>string</code></td><td><code>''</code></td><td>Icon class for the On state.</td></tr>
                            <tr><td><code>offIcon</code></td><td><code>string</code></td><td><code>''</code></td><td>Icon class for the Off state.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size of the component.</td></tr>
                            <tr><td><code>color</code></td><td><code>string</code></td><td><code>'primary'</code></td><td>Color variant of the component.</td></tr>
                            <tr><td><code>theme</code></td><td><code>'base' | 'glass' | 'neo'</code></td><td><code>'base'</code></td><td>Design theme of the component.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When specified, disables interaction.</td></tr>
                            <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When specified, makes the component readonly.</td></tr>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Top label for the component.</td></tr>
                            <tr><td><code>helperText</code></td><td><code>string</code></td><td><code>''</code></td><td>Supporting text below the component.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleButtonDocPage {
    private readonly langService = inject(LanguageService);
    readonly t = computed(() => TOGGLE_BUTTON_DOC_I18N[this.langService.currentLang()] || TOGGLE_BUTTON_DOC_I18N.es);

    checked1 = signal<boolean>(false);
    checked2 = signal<boolean>(true);
    checked3 = signal<boolean>(false);
    checked4 = signal<boolean>(true);
    checked5 = signal<boolean>(false);

    private readonly fb = inject(FormBuilder);
    testForm = this.fb.group({
        required: [false, [Validators.requiredTrue]]
    });

    importCode: Code = {
        typescript: `import { CzToggleButtonComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-toggle-button [(ngModel)]="checked" />`,
        typescript: `checked = signal(false);`
    };

    customizedCode: Code = {
        html: `<cz-toggle-button 
    [(ngModel)]="checked" 
    onLabel="I confirm" 
    offLabel="I reject" 
    onIcon="pi pi-check" 
    offIcon="pi pi-times" />`
    };

    iconsCode: Code = {
        html: `<cz-toggle-button 
    [(ngModel)]="checked" 
    onIcon="pi pi-check" 
    offIcon="pi pi-times" 
    onLabel="" 
    offLabel="" />`
    };

    colorsCode: Code = {
        html: `<cz-toggle-button [(ngModel)]="checked" color="success" />
<cz-toggle-button [(ngModel)]="checked" color="danger" />`
    };

    sizesCode: Code = {
        html: `<cz-toggle-button [(ngModel)]="checked" size="sm" />
<cz-toggle-button [(ngModel)]="checked" size="lg" />`
    };

    themesCode: Code = {
        html: `<cz-toggle-button [(ngModel)]="checked" theme="neo" />
<cz-toggle-button [(ngModel)]="checked" theme="glass" />`
    };

    validationCode: Code = {
        html: `<form [formGroup]="testForm">
    <cz-toggle-button 
        formControlName="required" 
        label="Terms of Service" 
        onLabel="Accepted" 
        offLabel="Accept Terms" 
        helperText="You must accept the terms" />
</form>`,
        typescript: `testForm = inject(FormBuilder).group({
    required: [false, [Validators.requiredTrue]]
});`
    };
}
