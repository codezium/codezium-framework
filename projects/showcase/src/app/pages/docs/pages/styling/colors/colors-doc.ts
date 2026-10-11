import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { COLORS_DOC_I18N } from './colors-doc.i18n';

@Component({
    selector: 'cz-colors-doc-page',
    imports: [AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="colors">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="semantic">{{ t().semantic }}</h2>
                <p>{{ t().semanticDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    @for (color of semanticColors; track color) {
                        <div class="cz-flex cz-flex-col cz-items-center cz-gap-xs">
                            <span class="cz-color-swatch" [style.background]="'var(--cz-color-' + color + ')'"></span>
                            <code class="cz-text-xs">cz-bg-{{ color }}</code>
                        </div>
                    }
                </div>
                <app-code [code]="semanticCode" />
            </section>

            <section>
                <h2 id="palettes">{{ t().palettes }}</h2>
                <p [innerHTML]="t().palettesDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    @for (palette of palettes; track palette) {
                        <div>
                            <code class="cz-text-xs cz-text-muted">{{ palette }}</code>
                            <div class="cz-flex cz-gap-none cz-mt-xs">
                                @for (weight of weights; track weight) {
                                    <span
                                        class="cz-color-swatch cz-color-swatch--flat"
                                        [style.background]="paletteVar(palette, weight)"
                                        [attr.title]="paletteVar(palette, weight)"
                                    ></span>
                                }
                            </div>
                        </div>
                    }
                </div>
                <app-code [code]="palettesCode" />
            </section>

            <section>
                <h2 id="patterns">{{ t().patterns }}</h2>
                <p>{{ t().patternsDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Family</th><th>Pattern</th><th>Example</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Text</td><td><code>.cz-text-&#123;palette&#125;-&#123;weight&#125;</code> · <code>.cz-text-color-&#123;intent&#125;-&#123;weight&#125;</code></td><td><code>cz-text-cyan-500, cz-text-color-success-600</code></td></tr>
                            <tr><td>Background</td><td><code>.cz-bg-&#123;palette&#125;-&#123;weight&#125;</code> · <code>.cz-bg-color-&#123;intent&#125;-&#123;weight&#125;</code></td><td><code>cz-bg-violet-100, cz-bg-color-danger-100</code></td></tr>
                            <tr><td>Border</td><td><code>.cz-border-&#123;palette&#125;-&#123;weight&#125;</code> · <code>.cz-border-color-&#123;intent&#125;-&#123;weight&#125;</code></td><td><code>cz-border-cyan-300, cz-border-color-primary-400</code></td></tr>
                            <tr><td>Semantic (no weight)</td><td><code>.cz-text-&#123;intent&#125;</code></td><td><code>cz-text-warning</code></td></tr>
                            <tr><td>Extended palettes</td><td><code>.cz-bg-&#123;palette&#125;-&#123;weight&#125;</code></td><td><code>cz-bg-slate-200, cz-bg-cyan-400, cz-bg-violet-500</code></td></tr>
                            <tr><td>Navy</td><td><code>.cz-bg-&#123;navy&#125;</code></td><td><code>cz-bg-dark-navy, cz-text-navy</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="patternsCode" />
            </section>

            <section>
                <h2 id="tints">{{ t().tints }}</h2>
                <p>{{ t().tintsDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    @for (tint of tints; track tint) {
                        <div class="cz-flex cz-flex-col cz-items-center cz-gap-xs">
                            <span class="cz-color-swatch cz-bg-tint-{{ tint }} cz-border"></span>
                            <code class="cz-text-xs">cz-bg-tint-{{ tint }}</code>
                        </div>
                    }
                </div>
                <app-code [code]="tintsCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Utility</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>.cz-bg-surface</code></td><td>Theme surface background</td></tr>
                            <tr><td><code>.cz-bg-card</code></td><td>Card background</td></tr>
                            <tr><td><code>.cz-bg-surface-contrast</code></td><td>Contrast surface (translucent)</td></tr>
                            <tr><td><code>.cz-bg-cool</code> / <code>.cz-bg-cool-transparent</code></td><td>Cool accent backgrounds</td></tr>
                            <tr><td><code>.cz-bg-code</code> / <code>.cz-bg-code-light</code></td><td>Code block backgrounds</td></tr>
                            <tr><td><code>.cz-text-code</code> / <code>.cz-text-code-dark</code></td><td>Code text colors</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
    styles: `
        .cz-color-swatch {
            display: inline-block;
            width: 3rem;
            height: 3rem;
            border-radius: var(--cz-radius-sm);
        }

        .cz-color-swatch--flat {
            width: 2.25rem;
            height: 1.75rem;
            border-radius: 0;
            border: 1px solid var(--cz-theme-border-color);
        }
    `,
})
export class ColorsDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => COLORS_DOC_I18N[this.lang.currentLang()] || COLORS_DOC_I18N.es);

    /**
     * Intent palettes expose `--cz-color-{name}-{weight}`;
     * extended palettes expose `--cz-{name}-{weight}`.
     */
    private static readonly INTENT_PALETTES = new Set([
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'gray',
    ]);

    paletteVar(palette: string, weight: number): string {
        const prefix = ColorsDocPage.INTENT_PALETTES.has(palette) ? '--cz-color-' : '--cz-';
        return `var(${prefix}${palette}-${weight})`;
    }

    readonly semanticColors = [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
        'accent',
    ];

    readonly palettes = [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'cyan',
        'violet',
        'gray',
        'slate',
        'blue',
        'green',
        'eucalyptus',
        'tertiary',
        'quaternary',
        'quinary',
    ];

    readonly weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    readonly tints = [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
        'white',
        'black',
    ];

    semanticCode: Code = {
        html: `<span class="cz-text-success">Success text</span>
<div class="cz-bg-danger cz-text-white">Danger background</div>
<div class="cz-border cz-border-primary">Primary border</div>`,
    };

    palettesCode: Code = {
        html: `<div class="cz-bg-primary-500 cz-text-white">primary-500</div>
<div class="cz-bg-success-100 cz-text-success-700">success-100</div>
<div class="cz-bg-slate-200 cz-border cz-border-slate-400">slate</div>`,
    };

    patternsCode: Code = {
        html: `<p class="cz-text-gray-600">Weighted text color</p>
<div class="cz-bg-warning-100">Warning background</div>
<div class="cz-border-2 cz-border-danger-400">Danger border</div>
<div class="cz-bg-dark-navy cz-text-white">Navy surface</div>`,
    };

    tintsCode: Code = {
        html: `<div class="cz-bg-tint-primary cz-p-md">Primary tint</div>
<div class="cz-bg-tint-success cz-p-md">Success tint</div>`,
    };
}
