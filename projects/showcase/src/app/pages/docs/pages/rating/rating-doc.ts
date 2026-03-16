import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CzRatingComponent } from 'codezium-ui';
import { LucideAngularModule, Heart, HeartOff, Zap } from 'lucide-angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { RATING_DOC_I18N } from './rating-doc.i18n';

@Component({
    selector: 'cz-rating-doc-page',
    standalone: true,
    imports: [CommonModule, CzRatingComponent, AppCodeComponent, ReactiveFormsModule, FormsModule, LucideAngularModule],
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
                <div class="cz-flex cz-gap-md cz-mb-md">
                    <cz-rating [(ngModel)]="val1" />
                    <span class="cz-text-sm cz-flex cz-items-center">Value: {{ val1() }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── LABELS ── -->
            <section>
                <h2 id="labels">{{ t().labels }}</h2>
                <p>{{ t().labelsDescription }}</p>
                <div class="cz-flex cz-flex-column cz-gap-md cz-mb-md">
                    <cz-rating [(ngModel)]="valLabel1" label="Rate your experience" labelPosition="right" />
                    <cz-rating [(ngModel)]="valLabel2" label="Calificación" labelPosition="left" />
                </div>
                <app-code [code]="labelsCode" />
            </section>

            <!-- ── SIZES ── -->
            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p>{{ t().sizesDescription }}</p>
                <div class="cz-flex cz-flex-column cz-gap-md cz-mb-md">
                    <cz-rating [(ngModel)]="valSize" size="sm" label="Small" />
                    <cz-rating [(ngModel)]="valSize" size="md" label="Medium" />
                    <cz-rating [(ngModel)]="valSize" size="lg" label="Large" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <!-- ── WITHOUT CANCEL ── -->
            <section>
                <h2 id="without-cancel">{{ t().withoutCancel }}</h2>
                <p>{{ t().withoutCancelDescription }}</p>
                <div class="cz-flex cz-gap-md cz-mb-md">
                    <cz-rating [(ngModel)]="val2" [cancel]="false" />
                </div>
                <app-code [code]="withoutCancelCode" />
            </section>

            <!-- ── THEMES ── -->
            <section>
                <h2 id="themes">{{ t().neoTheme }} / {{ t().glassTheme }}</h2>
                <div class="cz-grid cz-grid-cols-1 md:cz-grid-cols-2 cz-gap-md cz-mb-md">
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

            <!-- ── CUSTOM ICONS ── -->
            <section>
                <h2 id="custom-icons">{{ t().customIcons }}</h2>
                <p>{{ t().customIconsDescription }}</p>
                <div class="cz-flex cz-gap-md cz-mb-md">
                    <cz-rating [(ngModel)]="val4" [iconOn]="HeartIcon" [iconOff]="HeartOffIcon" color="danger" />
                    <cz-rating [(ngModel)]="val5" [iconOn]="ZapIcon" color="warning" [cancel]="false" />
                </div>
                <app-code [code]="customIconsCode" />
            </section>

            <!-- ── READONLY / DISABLED ── -->
            <section>
                <h2 id="states">{{ t().readonly }} / {{ t().disabled }}</h2>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <div class="cz-p-sm">
                        <small class="cz-display-block cz-mb-xs">Readonly</small>
                        <cz-rating [ngModel]="4" [readonly]="true" />
                    </div>
                    <div class="cz-p-sm">
                        <small class="cz-display-block cz-mb-xs">Disabled</small>
                        <cz-rating [ngModel]="3" [disabled]="true" />
                    </div>
                </div>
                <app-code [code]="statesCode" />
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
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Label text.</td></tr>
                            <tr><td><code>labelPosition</code></td><td><code>'left' | 'right'</code></td><td><code>'right'</code></td><td>Label position.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Component size.</td></tr>
                            <tr><td><code>cancel</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether to show the cancel button.</td></tr>
                            <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Readonly state.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>iconOn</code></td><td><code>any</code></td><td><code>Star</code></td><td>Icon for active state.</td></tr>
                            <tr><td><code>iconOff</code></td><td><code>any</code></td><td><code>StarOff</code></td><td>Icon for inactive state.</td></tr>
                            <tr><td><code>iconCancel</code></td><td><code>any</code></td><td><code>XCircle</code></td><td>Icon for cancel button.</td></tr>
                            <tr><td><code>color</code></td><td><code>string</code></td><td><code>'primary'</code></td><td>Color variant.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
})
export class RatingDocPage {
    private readonly langService = inject(LanguageService);
    readonly t = computed(() => RATING_DOC_I18N[this.langService.currentLang()] || RATING_DOC_I18N.es);

    val1 = signal<number>(3);
    val2 = signal<number>(4);
    val3 = signal<number>(2);
    val4 = signal<number>(3);
    val5 = signal<number>(5);
    valLabel1 = signal<number>(4);
    valLabel2 = signal<number>(5);
    valSize = signal<number>(3);

    HeartIcon = Heart;
    HeartOffIcon = HeartOff;
    ZapIcon = Zap;

    importCode: Code = {
        typescript: `import { CzRatingComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-rating [(ngModel)]="value" />`,
        typescript: `value = signal(3);`
    };

    labelsCode: Code = {
        html: `<cz-rating label="Rate your experience" labelPosition="right" [(ngModel)]="val" />
<cz-rating label="Calificación" labelPosition="left" [(ngModel)]="val" />`
    };

    sizesCode: Code = {
        html: `<cz-rating size="sm" label="Small" [(ngModel)]="val" />
<cz-rating size="md" label="Medium" [(ngModel)]="val" />
<cz-rating size="lg" label="Large" [(ngModel)]="val" />`
    };

    withoutCancelCode: Code = {
        html: `<cz-rating [(ngModel)]="value" [cancel]="false" />`,
        typescript: `value = signal(3);`
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

    customIconsCode: Code = {
        html: `<cz-rating [(ngModel)]="valHeart" [iconOn]="HeartIcon" [iconOff]="HeartOffIcon" color="danger" />
<cz-rating [(ngModel)]="valZap" [iconOn]="ZapIcon" color="warning" [cancel]="false" />`,
        typescript: `import { Heart, HeartOff, Zap } from 'lucide-angular';

export class MyComponent {
    HeartIcon = Heart;
    HeartOffIcon = HeartOff;
    ZapIcon = Zap;
    
    valHeart = signal(3);
    valZap = signal(5);
}`
    };

    statesCode: Code = {
        html: `<cz-rating [ngModel]="4" [readonly]="true" />
<cz-rating [ngModel]="3" [disabled]="true" />`,
        typescript: `// Readonly and Disabled states typically bind to signals or static values`
    };
}
