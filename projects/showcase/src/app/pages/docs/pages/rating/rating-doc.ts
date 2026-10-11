import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CzRatingComponent, CzButtonComponent, CzMessageComponent, CzToastService } from 'codezium-ui';
import { LucideHeart, LucideHeartOff, LucideZap } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { RATING_DOC_I18N } from './rating-doc.i18n';

@Component({
    selector: 'cz-rating-doc-page',
    imports: [CommonModule, CzRatingComponent, CzButtonComponent, CzMessageComponent, AppCodeComponent, ReactiveFormsModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="rating">{{ t().title }}</h1>
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
                <div class="cz-flex cz-items-center cz-gap-md cz-mb-md">
                    <cz-rating [(ngModel)]="val" />
                    <span class="cz-text-sm cz-flex cz-items-center">{{ t().value }}: {{ val() }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── HALF STARS ── -->
            <section>
                <h2 id="half">{{ t().halfStars }}</h2>
                <p>{{ t().halfStarsDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-rating [(ngModel)]="halfFull" [label]="t().fullStar" />
                    <cz-rating [(ngModel)]="halfHalf" [allowHalf]="true" [label]="t().halfStar" />
                </div>
                <app-code [code]="halfCode" />
            </section>

            <!-- ── CONTROLLED ── -->
            <section>
                <h2 id="controlled">{{ t().controlled }}</h2>
                <p>{{ t().controlledDescription }}</p>
                <div class="cz-flex cz-flex-col cz-items-center cz-justify-center cz-gap-lg cz-mb-md">
                    <cz-rating [(ngModel)]="controlled" [allowHalf]="true" />
                    <div class="cz-flex cz-items-center cz-gap-sm">
                        <cz-button [label]="'2.5 Star'" severity="secondary" variant="outlined" size="sm" (onClick)="controlled.set(2.5)" />
                        <cz-button [label]="'3 Star'" severity="secondary" variant="outlined" size="sm" (onClick)="controlled.set(3)" />
                        <cz-button [label]="'3.5 Star'" severity="secondary" variant="outlined" size="sm" (onClick)="controlled.set(3.5)" />
                    </div>
                </div>
                <app-code [code]="controlledCode" />
            </section>

            <!-- ── NUMBER OF STARS ── -->
            <section>
                <h2 id="numberofstars">{{ t().numberOfStars }}</h2>
                <p>{{ t().numberOfStarsDescription }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-rating [(ngModel)]="stars10" [stars]="10" />
                </div>
                <app-code [code]="numberOfStarsCode" />
            </section>

            <!-- ── VERTICAL ── -->
            <section>
                <h2 id="vertical">{{ t().vertical }}</h2>
                <p>{{ t().verticalDescription }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-rating [(ngModel)]="verticalVal" orientation="vertical" />
                </div>
                <app-code [code]="verticalCode" />
            </section>

            <!-- ── TEMPLATE ── -->
            <section>
                <h2 id="template">{{ t().template }}</h2>
                <p>{{ t().templateDescription }}</p>
                <div class="cz-flex cz-flex-col cz-items-center cz-justify-center cz-gap-lg cz-mb-md">
                    <cz-rating [(ngModel)]="templateVal1" [allowHalf]="true">
                        <ng-template #onicon>
                            <span class="cz-font-medium cz-select-none" style="font-size: 2rem">A</span>
                        </ng-template>
                        <ng-template #officon>
                            <span class="cz-select-none" style="font-size: 2rem; color: var(--cz-color-gray-300)">A</span>
                        </ng-template>
                    </cz-rating>
                    <cz-rating [(ngModel)]="templateVal2">
                        <ng-template #onicon>
                            <img [src]="imgOn" width="24" height="24" alt="" />
                        </ng-template>
                        <ng-template #officon>
                            <img [src]="imgOff" width="24" height="24" alt="" />
                        </ng-template>
                    </cz-rating>
                </div>
                <app-code [code]="templateCode" />
            </section>

            <!-- ── EMOJI ── -->
            <section>
                <h2 id="emoji">{{ t().emoji }}</h2>
                <p>{{ t().emojiDescription }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-rating [(ngModel)]="emojiVal" [allowHalf]="false" [stars]="5">
                        <ng-template #onicon let-index>
                            <span class="cz-select-none" style="font-size: 2rem">{{ emojis[index - 1] }}</span>
                        </ng-template>
                        <ng-template #officon let-index>
                            <span class="cz-select-none" style="font-size: 2rem; filter: grayscale(1); opacity: 0.5">{{ emojis[index - 1] }}</span>
                        </ng-template>
                    </cz-rating>
                </div>
                <app-code [code]="emojiCode" />
            </section>

            <!-- ── READONLY ── -->
            <section>
                <h2 id="readonly">{{ t().readonly }}</h2>
                <p>{{ t().readonlyDescription }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-rating [ngModel]="4" [readonly]="true" />
                </div>
                <app-code [code]="readonlyCode" />
            </section>

            <!-- ── DISABLED ── -->
            <section>
                <h2 id="disabled">{{ t().disabled }}</h2>
                <p>{{ t().disabledDescription }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-rating [ngModel]="3" [disabled]="true" />
                </div>
                <app-code [code]="disabledCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p>{{ t().formsDescription }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="cz-flex cz-flex-col cz-items-center cz-gap-sm" style="width: 12rem">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-rating formControlName="ratingValue" [invalid]="isInvalid('ratingValue')" />
                        @if (isInvalid('ratingValue')) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)" class="cz-flex cz-flex-col cz-items-center cz-gap-sm" style="width: 12rem">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-rating #ratingValue="ngModel" name="ratingValue" [(ngModel)]="templateValue" required
                            [invalid]="!!(ratingValue.invalid && (ratingValue.touched || tdForm.submitted))" />
                        @if (ratingValue.invalid && (ratingValue.touched || tdForm.submitted)) {
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
                <h3 id="screenreader">{{ t().screenReader }}</h3>
                <p>{{ t().screenReaderDescription }}</p>
                <h3 id="keyboardsupport">{{ t().keyboardSupport }}</h3>
                <p>{{ t().keyboardDescription }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Key</th><th>Function</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>tab</code></td><td>{{ t().keyTab }}</td></tr>
                            <tr><td><code>left arrow</code> <code>up arrow</code></td><td>{{ t().keyLeftUp }}</td></tr>
                            <tr><td><code>right arrow</code> <code>down arrow</code></td><td>{{ t().keyRightDown }}</td></tr>
                            <tr><td><code>space</code></td><td>{{ t().keySpace }}</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- ── LABELS ── -->
            <section>
                <h2 id="labels">{{ t().labels }}</h2>
                <p>{{ t().labelsDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-rating [(ngModel)]="valLabel1" [label]="t().labelsRight" labelPosition="right" />
                    <cz-rating [(ngModel)]="valLabel2" [label]="t().labelsLeft" labelPosition="left" />
                </div>
                <app-code [code]="labelsCode" />
            </section>

            <!-- ── SIZES ── -->
            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p>{{ t().sizesDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-rating [(ngModel)]="valSize" size="sm" label="Small" />
                    <cz-rating [(ngModel)]="valSize" size="md" label="Medium" />
                    <cz-rating [(ngModel)]="valSize" size="lg" label="Large" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <!-- ── COLORS ── -->
            <section>
                <h2 id="colors">{{ t().colors }}</h2>
                <p>{{ t().colorsDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-rating [(ngModel)]="valColor" color="primary" label="Primary" />
                    <cz-rating [(ngModel)]="valColor" color="success" label="Success" />
                    <cz-rating [(ngModel)]="valColor" color="warning" label="Warning" />
                    <cz-rating [(ngModel)]="valColor" color="danger" label="Danger" />
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── CUSTOM ICONS ── -->
            <section>
                <h2 id="custom-icons">{{ t().customIcons }}</h2>
                <p>{{ t().customIconsDescription }}</p>
                <div class="cz-flex cz-gap-md cz-mb-md">
                    <cz-rating [(ngModel)]="val4" [iconOn]="HeartIcon" [iconOff]="HeartOffIcon" color="danger" />
                    <cz-rating [(ngModel)]="val5" [iconOn]="ZapIcon" color="warning" />
                </div>
                <app-code [code]="customIconsCode" />
            </section>

            <!-- ── THEMES ── -->
            <section>
                <h2 id="themes">{{ t().neoTheme }} / {{ t().glassTheme }}</h2>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-2 cz-gap-md cz-mb-md">
                    <div class="cz-p-md cz-border cz-rounded-lg" data-theme="neo">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Neo Theme</small>
                        <cz-rating [(ngModel)]="val3" />
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg cz-bg-dark" data-theme="glass">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Glass Theme</small>
                        <cz-rating [(ngModel)]="val3" />
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
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>stars</code></td><td><code>number</code></td><td><code>5</code></td><td>Number of stars to display.</td></tr>
                            <tr><td><code>allowHalf</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When present, selecting half stars is allowed.</td></tr>
                            <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Orientation of the component.</td></tr>
                            <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When present, changing the value is not possible.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When present, it specifies that the component should have disabled state style.</td></tr>
                            <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When present, it specifies that the component should have invalid state style.</td></tr>
                            <tr><td><code>name</code></td><td><code>string</code></td><td><code>undefined</code></td><td>Name of the radio group.</td></tr>
                            <tr><td><code>autofocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When present, the component automatically gets focus on load.</td></tr>
                            <tr><td><code>iconOnClass</code></td><td><code>string</code></td><td><code>undefined</code></td><td>Style class of the on icon.</td></tr>
                            <tr><td><code>iconOnStyle</code></td><td><code>&#123; [klass: string]: any &#125;</code></td><td><code>undefined</code></td><td>Inline style of the on icon.</td></tr>
                            <tr><td><code>iconOffClass</code></td><td><code>string</code></td><td><code>undefined</code></td><td>Style class of the off icon.</td></tr>
                            <tr><td><code>iconOffStyle</code></td><td><code>&#123; [klass: string]: any &#125;</code></td><td><code>undefined</code></td><td>Inline style of the off icon.</td></tr>
                            <tr><td><code>iconOn</code></td><td><code>LucideIconInput</code></td><td><code>LucideStar</code></td><td>Icon for active state (Codezium extra).</td></tr>
                            <tr><td><code>iconOff</code></td><td><code>LucideIconInput</code></td><td><code>LucideStarOff</code></td><td>Icon for inactive state (Codezium extra).</td></tr>
                            <tr><td><code>color</code></td><td><code>CzRatingColor</code></td><td><code>'primary'</code></td><td>Color variant (Codezium extra).</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Component size (Codezium extra).</td></tr>
                            <tr><td><code>label / labelPosition</code></td><td><code>string / 'left' | 'right'</code></td><td><code>'' / 'right'</code></td><td>Optional inline label (Codezium extra).</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="emits">{{ t().emits }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Parameters</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>onRate</code></td><td><code>CzRatingRateEvent</code></td><td>Emitted on value change.</td></tr>
                            <tr><td><code>onFocus</code></td><td><code>FocusEvent</code></td><td>Emitted when the rating receives focus.</td></tr>
                            <tr><td><code>onBlur</code></td><td><code>FocusEvent</code></td><td>Emitted when the rating loses focus.</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="templates">{{ t().templates }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>onicon</code></td><td><code>TemplateRef</code></td><td>Custom on icon template. Context: <code>&#123; $implicit: index, class &#125;</code>.</td></tr>
                            <tr><td><code>officon</code></td><td><code>TemplateRef</code></td><td>Custom off icon template. Context: <code>&#123; $implicit: index, class &#125;</code>.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
})
export class RatingDocPage {
    private readonly langService = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => RATING_DOC_I18N[this.langService.currentLang()] || RATING_DOC_I18N.es);

    val = signal<number>(3);
    halfFull = signal<number>(3);
    halfHalf = signal<number>(3.5);
    controlled = signal<number>(4);
    stars10 = signal<number>(5);
    verticalVal = signal<number>(3);
    templateVal1 = signal<number>(3);
    templateVal2 = signal<number>(3);
    emojiVal = signal<number>(3);
    val3 = signal<number>(2);
    val4 = signal<number>(3);
    val5 = signal<number>(5);
    valLabel1 = signal<number>(4);
    valLabel2 = signal<number>(5);
    valSize = signal<number>(3);
    valColor = signal<number>(4);

    templateValue: number | undefined;

    readonly emojis: string[] = ['😡', '😕', '😐', '🙂', '😍'];

    readonly imgOn = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%232235E4'/%3E%3C/svg%3E";
    readonly imgOff = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='9' fill='none' stroke='%2394a3b8' stroke-width='2'/%3E%3C/svg%3E";

    HeartIcon = LucideHeart;
    HeartOffIcon = LucideHeartOff;
    ZapIcon = LucideZap;

    readonly exampleForm = new FormGroup({
        ratingValue: new FormControl<number | null>(null, Validators.required),
    });
    formSubmitted = false;

    onSubmit(): void {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.toast.success(this.t().formSubmitted, 'Rating');
        }
    }

    onTemplateSubmit(form: NgForm): void {
        if (form.valid && this.templateValue) {
            this.toast.success(this.t().formSubmitted, 'Rating');
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!control?.invalid && (control.touched || this.formSubmitted);
    }

    importCode: Code = {
        typescript: `import { CzRatingComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-rating [(ngModel)]="value" />`,
        typescript: `value = signal(3); // click the selected star again to clear it`
    };

    halfCode: Code = {
        html: `<cz-rating [(ngModel)]="full" label="Full Star" />
<cz-rating [(ngModel)]="half" [allowHalf]="true" label="Half Star" />`,
        typescript: `full = signal(3);
half = signal(3.5);`
    };

    controlledCode: Code = {
        html: `<cz-rating [(ngModel)]="value" [allowHalf]="true" />

<cz-button label="2.5 Star" (onClick)="value.set(2.5)" />
<cz-button label="3 Star" (onClick)="value.set(3)" />
<cz-button label="3.5 Star" (onClick)="value.set(3.5)" />`,
        typescript: `value = signal(4);`
    };

    numberOfStarsCode: Code = {
        html: `<cz-rating [(ngModel)]="value" [stars]="10" />`,
        typescript: `value = signal(5);`
    };

    verticalCode: Code = {
        html: `<cz-rating [(ngModel)]="value" orientation="vertical" />`,
        typescript: `value = signal(3);`
    };

    templateCode: Code = {
        html: `<cz-rating [(ngModel)]="value" [allowHalf]="true">
    <ng-template #onicon>
        <span style="font-size: 2rem">A</span>
    </ng-template>
    <ng-template #officon>
        <span style="font-size: 2rem; color: var(--cz-color-gray-300)">A</span>
    </ng-template>
</cz-rating>

<cz-rating [(ngModel)]="value2">
    <ng-template #onicon>
        <img [src]="imgOn" width="24" height="24" alt="" />
    </ng-template>
    <ng-template #officon>
        <img [src]="imgOff" width="24" height="24" alt="" />
    </ng-template>
</cz-rating>`
    };

    emojiCode: Code = {
        html: `<cz-rating [(ngModel)]="value" [allowHalf]="false">
    <ng-template #onicon let-index>
        <span style="font-size: 2rem">{{ emojis[index - 1] }}</span>
    </ng-template>
    <ng-template #officon let-index>
        <span style="font-size: 2rem; filter: grayscale(1); opacity: 0.5">{{ emojis[index - 1] }}</span>
    </ng-template>
</cz-rating>`,
        typescript: `emojis = ['😡', '😕', '😐', '🙂', '😍'];`
    };

    readonlyCode: Code = {
        html: `<cz-rating [ngModel]="4" [readonly]="true" />`
    };

    disabledCode: Code = {
        html: `<cz-rating [ngModel]="3" [disabled]="true" />`
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-rating formControlName="ratingValue" [invalid]="isInvalid('ratingValue')" />
    @if (isInvalid('ratingValue')) {
        <cz-message severity="danger" text="Value is required." />
    }
    <cz-button label="Submit" type="submit" />
</form>

<!-- Template-driven forms -->
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
    <cz-rating #ratingValue="ngModel" name="ratingValue" [(ngModel)]="value" required
        [invalid]="ratingValue.invalid && (ratingValue.touched || form.submitted)" />
    <cz-button label="Submit" type="submit" />
</form>`
    };

    labelsCode: Code = {
        html: `<cz-rating [label]="'Rate your experience'" labelPosition="right" [(ngModel)]="val" />
<cz-rating [label]="'Calificación'" labelPosition="left" [(ngModel)]="val" />`
    };

    sizesCode: Code = {
        html: `<cz-rating size="sm" label="Small" [(ngModel)]="val" />
<cz-rating size="md" label="Medium" [(ngModel)]="val" />
<cz-rating size="lg" label="Large" [(ngModel)]="val" />`
    };

    colorsCode: Code = {
        html: `<cz-rating color="primary" label="Primary" [(ngModel)]="val" />
<cz-rating color="success" label="Success" [(ngModel)]="val" />
<cz-rating color="warning" label="Warning" [(ngModel)]="val" />
<cz-rating color="danger" label="Danger" [(ngModel)]="val" />`
    };

    customIconsCode: Code = {
        html: `<cz-rating [(ngModel)]="valHeart" [iconOn]="HeartIcon" [iconOff]="HeartOffIcon" color="danger" />
<cz-rating [(ngModel)]="valZap" [iconOn]="ZapIcon" color="warning" />`,
        typescript: `import { LucideHeart, LucideHeartOff, LucideZap } from '@lucide/angular';

export class MyComponent {
    HeartIcon = LucideHeart;
    HeartOffIcon = LucideHeartOff;
    ZapIcon = LucideZap;

    valHeart = signal(3);
    valZap = signal(5);
}`
    };

    themesCode: Code = {
        html: `<!-- Neo Theme -->
<div data-theme="neo">
    <cz-rating [(ngModel)]="val" />
</div>

<!-- Glass Theme -->
<div data-theme="glass">
    <cz-rating [(ngModel)]="val" />
</div>`,
        typescript: `val = signal(2);`
    };
}
