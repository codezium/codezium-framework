import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { SPACING_DOC_I18N } from './spacing-doc.i18n';

@Component({
    selector: 'cz-spacing-doc-page',
    imports: [AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="spacing">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="scale">{{ t().scale }}</h2>
                <p [innerHTML]="t().scaleDesc"></p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Size</th><th>Token</th><th>Value</th><th></th></tr>
                        </thead>
                        <tbody>
                            @for (size of scale; track size.name) {
                                <tr>
                                    <td><code>{{ size.name }}</code></td>
                                    <td><code>--cz-spacing-{{ size.name }}</code></td>
                                    <td><code>{{ size.value }}</code></td>
                                    <td><span class="cz-bg-primary-200 cz-block" [style.height.px]="6" [style.width.px]="size.px"></span></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 id="directions">{{ t().directions }}</h2>
                <p [innerHTML]="t().directionsDesc"></p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Direction</th><th>Margin</th><th>Padding</th></tr>
                        </thead>
                        <tbody>
                            @for (dir of directions; track dir.code) {
                                <tr>
                                    <td>{{ dir.label }}</td>
                                    <td><code>cz-m{{ dir.code }}-{{ '{size}' }}</code></td>
                                    <td><code>cz-p{{ dir.code }}-{{ '{size}' }}</code></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <app-code [code]="directionsCode" />
            </section>

            <section>
                <h2 id="stacking">{{ t().stacking }}</h2>
                <p [innerHTML]="t().stackingDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <div class="cz-space-y-sm cz-border cz-p-sm">
                        <div class="cz-bg-primary-100 cz-p-sm">Child 1</div>
                        <div class="cz-bg-primary-100 cz-p-sm">Child 2</div>
                        <div class="cz-bg-primary-100 cz-p-sm">Child 3</div>
                    </div>
                </div>
                <app-code [code]="stackingCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-2 cz-gap-md">
                    <div class="cz-border cz-rounded-lg cz-overflow-hidden">
                        <div class="cz-bg-primary-500 cz-text-white cz-p-md">cz-p-md (16px padding)</div>
                        <div class="cz-p-md">Content</div>
                    </div>
                    <div class="cz-border cz-rounded-lg cz-overflow-hidden">
                        <div class="cz-bg-success-500 cz-text-white cz-p-md cz-mb-lg">cz-mb-lg (24px margin)</div>
                        <div class="cz-p-md">Content</div>
                    </div>
                </div>
            </section>
        </div>
    `,
})
export class SpacingDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => SPACING_DOC_I18N[this.lang.currentLang()] || SPACING_DOC_I18N.es);

    readonly scale = [
        { name: 'none', value: '0', px: 0 },
        { name: 'xxs', value: '2px', px: 2 },
        { name: 'xs', value: '4px', px: 4 },
        { name: 'sm', value: '8px', px: 8 },
        { name: 'md', value: '16px', px: 16 },
        { name: 'lg', value: '24px', px: 24 },
        { name: 'xl', value: '32px', px: 32 },
        { name: '2xl', value: '48px', px: 48 },
        { name: '3xl', value: '64px', px: 64 },
        { name: '4xl', value: '96px', px: 96 },
        { name: '5xl', value: '128px', px: 128 },
    ];

    readonly directions = [
        { code: '', label: 'All sides' },
        { code: 't', label: 'Top' },
        { code: 'b', label: 'Bottom' },
        { code: 'l', label: 'Left' },
        { code: 'r', label: 'Right' },
        { code: 'x', label: 'Horizontal (left + right)' },
        { code: 'y', label: 'Vertical (top + bottom)' },
    ];

    directionsCode: Code = {
        html: `<div class="cz-p-md">Padding all sides</div>
<div class="cz-px-lg cz-py-sm">Horizontal lg, vertical sm</div>
<div class="cz-mt-2xl">Top margin 2xl</div>
<div class="cz-mb-none">No bottom margin</div>`,
    };

    stackingCode: Code = {
        html: `<div class="cz-space-y-sm">
    <div>Child 1</div>
    <div>Child 2</div>
    <div>Child 3</div>
</div>

<div class="cz-flex cz-space-x-sm">
    <span>Inline 1</span>
    <span>Inline 2</span>
</div>`,
    };
}
