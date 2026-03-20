import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CzSliderComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { SLIDER_DOC_I18N } from './slider-doc.i18n';

@Component({
    selector: 'cz-slider-doc-page',
    standalone: true,
    imports: [CommonModule, CzSliderComponent, AppCodeComponent, FormsModule, ReactiveFormsModule],
    template: `
        <div class="doc-page">
            <header class="cz-mb-xl">
                <h1 id="slider" class="cz-display-4 cz-font-bold">{{ t().title }}</h1>
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
                    <cz-slider [(ngModel)]="value1" [theme]="themeService.currentTheme()" label="Single Value" />
                    <div class="cz-badge cz-badge--info cz-align-self-start">
                        Selected Value: {{ value1() }}
                    </div>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── RANGE ── -->
            <section class="cz-mb-xl">
                <h2 id="range" class="cz-h2 cz-mb-sm">{{ t().range }}</h2>
                <p class="cz-mb-md">{{ t().rangeDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-slider [(ngModel)]="value2" [range]="true" [theme]="themeService.currentTheme()" label="Range Value" />
                    <div class="cz-badge cz-badge--secondary cz-align-self-start">
                        Selected Range: {{ value2() | json }}
                    </div>
                </div>
                <app-code [code]="rangeCode" />
            </section>

            <!-- ── STEP & LIMITS ── -->
            <section class="cz-mb-xl">
                <h2 id="step" class="cz-h2 cz-mb-sm">{{ t().step }} & {{ t().minMax }}</h2>
                <p class="cz-mb-md">{{ t().stepDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-xl cz-mb-md">
                    <cz-slider [(ngModel)]="value3" [step]="20" [theme]="themeService.currentTheme()" label="Step 20" />
                    <cz-slider [(ngModel)]="value4" [min]="-50" [max]="50" [theme]="themeService.currentTheme()" label="Limits -50 to 50" />
                </div>
                <app-code [code]="stepCode" />
            </section>

            <!-- ── THEMES ── -->
            <section class="cz-mb-xl">
                <h2 id="themes" class="cz-h2 cz-mb-sm">{{ t().themes }}</h2>
                <p class="cz-mb-md">{{ t().themesDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-xl cz-mb-md">
                    <div>
                        <small class="cz-text-muted cz-mb-sm cz-block">Base Theme</small>
                        <cz-slider [(ngModel)]="value1" theme="base" />
                    </div>
                    <div>
                        <small class="cz-text-muted cz-mb-sm cz-block">Neo Theme</small>
                        <cz-slider [(ngModel)]="value1" theme="neo" />
                    </div>
                    <div class="cz-p-md" style="background: #f0f4f8; border-radius: 12px;">
                        <small class="cz-text-muted cz-mb-sm cz-block">Glass Theme</small>
                        <cz-slider [(ngModel)]="value1" theme="glass" />
                    </div>
                </div>
                <app-code [code]="themesCode" />
            </section>

            <!-- ── ORIENTATION ── -->
            <section class="cz-mb-xl">
                <h2 id="vertical" class="cz-h2 cz-mb-sm">{{ t().vertical }}</h2>
                <p class="cz-mb-md">{{ t().verticalDescription }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-mb-md" style="min-height: 300px;">
                    <div style="height: 250px;">
                        <cz-slider [(ngModel)]="value5" orientation="vertical" [theme]="themeService.currentTheme()" label="Vertical Dynamic" />
                    </div>
                    <div style="height: 250px;">
                        <cz-slider [(ngModel)]="value5" orientation="vertical" theme="neo" label="Vertical Neo" />
                    </div>
                    <div class="cz-p-md" style="background: #f0f4f8; border-radius: 12px; height: 250px; display: flex;">
                        <cz-slider [(ngModel)]="value5" orientation="vertical" theme="glass" label="Vertical Glass" />
                    </div>
                </div>
                <app-code [code]="verticalCode" />
            </section>
            
            <!-- ── COLORS ── -->
            <section class="cz-mb-xl">
                <h2 id="colors" class="cz-h2 cz-mb-sm">{{ t().colors }}</h2>
                <p class="cz-mb-md">{{ t().colorsDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-xl cz-mb-md">
                    <cz-slider [(ngModel)]="value1" color="primary" [theme]="themeService.currentTheme()" label="Primary" />
                    <cz-slider [(ngModel)]="value1" color="secondary" [theme]="themeService.currentTheme()" label="Secondary" />
                    <cz-slider [(ngModel)]="value1" color="success" [theme]="themeService.currentTheme()" label="Success" />
                    <cz-slider [(ngModel)]="value1" color="info" [theme]="themeService.currentTheme()" label="Info" />
                    <cz-slider [(ngModel)]="value1" color="warning" [theme]="themeService.currentTheme()" label="Warning" />
                    <cz-slider [(ngModel)]="value1" color="danger" [theme]="themeService.currentTheme()" label="Danger" />
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── VALIDATION ── -->
            <section class="cz-mb-xl">
                <h2 id="validation" class="cz-h2 cz-mb-sm">{{ t().validation }}</h2>
                <p class="cz-mb-md">{{ t().validationDescription }}</p>
                <div class="cz-mb-md">
                    <form [formGroup]="testForm" class="cz-flex cz-flex-col cz-gap-md">
                        <cz-slider 
                            formControlName="val" 
                            label="Required Value" 
                            [theme]="themeService.currentTheme()"
                            helperText="Value must be greater than 0" />
                        
                        <div class="cz-flex cz-gap-sm">
                            <button class="cz-button cz-button--outline cz-button--sm" (click)="testForm.markAllAsTouched()">
                                Validate Form
                            </button>
                            <button class="cz-button cz-button--ghost cz-button--sm" (click)="testForm.reset({val: 0})">
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
                <h3 id="props" class="cz-h3 cz-mb-sm">{{ t().props }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>Minimum boundary value.</td></tr>
                            <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Maximum boundary value.</td></tr>
                            <tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>Step factor to increment/decrement the value.</td></tr>
                            <tr><td><code>range</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When specified, allows selecting a range.</td></tr>
                            <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Orientation of the slider.</td></tr>
                            <tr><td><code>theme</code></td><td><code>'base' | 'glass' | 'neo'</code></td><td><code>'base'</code></td><td>Design theme of the component.</td></tr>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Label for the slider.</td></tr>
                             <tr><td><code>helperText</code></td><td><code>string</code></td><td><code>''</code></td><td>Supporting text below the component.</td></tr>
                            <tr><td><code>color</code></td><td><code>string</code></td><td><code>'primary'</code></td><td>Color variant of the component.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When specified, disables the interaction.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderDocPage {
    private readonly langService = inject(LanguageService);
    readonly themeService = inject(ThemeService);
    readonly t = computed(() => SLIDER_DOC_I18N[this.langService.currentLang()] || SLIDER_DOC_I18N.es);

    value1 = signal<number>(50);
    value2 = signal<number[]>([20, 80]);
    value3 = signal<number>(40);
    value4 = signal<number>(0);
    value5 = signal<number>(30);

    private readonly fb = inject(FormBuilder);

    testForm = this.fb.group({
        val: [0, [Validators.required, Validators.min(1)]]
    });

    importCode: Code = {
        typescript: `import { CzSliderComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-slider [(ngModel)]="value" label="Rate your experience" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzSliderComponent } from 'codezium-ui';

@Component({
    selector: 'slider-basic-demo',
    standalone: true,
    imports: [FormsModule, CzSliderComponent],
    template: \`<cz-slider [(ngModel)]="value" label="Rate your experience" />\`
})
export class SliderBasicDemo {
    value = signal(50);
}`
    };

    rangeCode: Code = {
        html: `<cz-slider [(ngModel)]="rangeValue" [range]="true" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CzSliderComponent } from 'codezium-ui';

@Component({
    selector: 'slider-range-demo',
    standalone: true,
    imports: [CommonModule, FormsModule, CzSliderComponent],
    template: \`<cz-slider [(ngModel)]="rangeValue" [range]="true" />\`
})
export class SliderRangeDemo {
    rangeValue = signal([20, 80]);
}`
    };

    stepCode: Code = {
        html: `<cz-slider [(ngModel)]="value" [step]="20" />
<cz-slider [(ngModel)]="value" [min]="-50" [max]="50" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzSliderComponent } from 'codezium-ui';

@Component({
    selector: 'slider-step-demo',
    standalone: true,
    imports: [FormsModule, CzSliderComponent],
    template: \`
        <cz-slider [(ngModel)]="value" [step]="20" />
        <cz-slider [(ngModel)]="value" [min]="-50" [max]="50" />
    \`
})
export class SliderStepDemo {
    value = signal(0);
}`
    };

    themesCode: Code = {
        html: `<cz-slider [(ngModel)]="val" theme="base" />
<cz-slider [(ngModel)]="val" theme="glass" />
<cz-slider [(ngModel)]="val" theme="neo" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzSliderComponent } from 'codezium-ui';

@Component({
    selector: 'slider-themes-demo',
    standalone: true,
    imports: [FormsModule, CzSliderComponent],
    template: \`
        <cz-slider [(ngModel)]="val" theme="base" />
        <cz-slider [(ngModel)]="val" theme="glass" />
        <cz-slider [(ngModel)]="val" theme="neo" />
    \`
})
export class SliderThemesDemo {
    val = signal(50);
}`
    };

    verticalCode: Code = {
        html: `<cz-slider [(ngModel)]="val" orientation="vertical" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzSliderComponent } from 'codezium-ui';

@Component({
    selector: 'slider-vertical-demo',
    standalone: true,
    imports: [FormsModule, CzSliderComponent],
    template: \`
        <div style="height: 250px">
            <cz-slider [(ngModel)]="val" orientation="vertical" />
        </div>
    \`
})
export class SliderVerticalDemo {
    val = signal(50);
}`
    };

    colorsCode: Code = {
        html: `<cz-slider [(ngModel)]="val" color="primary" label="Primary" />
<cz-slider [(ngModel)]="val" color="secondary" label="Secondary" />
<cz-slider [(ngModel)]="val" color="success" label="Success" />
<cz-slider [(ngModel)]="val" color="info" label="Info" />
<cz-slider [(ngModel)]="val" color="warning" label="Warning" />
<cz-slider [(ngModel)]="val" color="danger" label="Danger" />`,
        typescript: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzSliderComponent } from 'codezium-ui';

@Component({
    selector: 'slider-colors-demo',
    standalone: true,
    imports: [FormsModule, CzSliderComponent],
    template: \`
        <div class="cz-flex cz-flex-col cz-gap-md">
            <cz-slider [(ngModel)]="val" color="primary" label="Primary" />
            <cz-slider [(ngModel)]="val" color="secondary" label="Secondary" />
            <cz-slider [(ngModel)]="val" color="success" label="Success" />
            <cz-slider [(ngModel)]="val" color="info" label="Info" />
            <cz-slider [(ngModel)]="val" color="warning" label="Warning" />
            <cz-slider [(ngModel)]="val" color="danger" label="Danger" />
        </div>
    \`
})
export class SliderColorsDemo {
    val = signal(50);
}`
    };

    validationCode: Code = {
        html: `<form [formGroup]="testForm">
    <cz-slider formControlName="val" label="Required Value" />
</form>`,
        typescript: `import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CzSliderComponent } from 'codezium-ui';

@Component({
    selector: 'slider-validation-demo',
    standalone: true,
    imports: [ReactiveFormsModule, CzSliderComponent],
    template: \`
        <form [formGroup]="testForm">
            <cz-slider formControlName="val" label="Required Value" />
        </form>
    \`
})
export class SliderValidationDemo {
    private readonly fb = inject(FormBuilder);
    
    testForm = this.fb.group({
        val: [0, [Validators.required, Validators.min(1)]]
    });
}`
    };
}
