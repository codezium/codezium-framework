import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { TOKENS_DOC_I18N } from './tokens-doc.i18n';

@Component({
    selector: 'cz-tokens-doc-page',
    imports: [AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="tokens">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="layers">{{ t().layers }}</h2>
                <p [innerHTML]="t().layersDesc"></p>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-3 cz-gap-md cz-mb-md">
                    @for (layer of layers; track layer.name) {
                        <div class="cz-p-md cz-border cz-rounded-lg">
                            <strong>{{ layer.name }}</strong>
                            <p class="cz-text-sm cz-mb-sm">{{ layer.desc }}</p>
                            @for (token of layer.tokens; track token) {
                                <code class="cz-block cz-mb-xs">{{ token }}</code>
                            }
                        </div>
                    }
                </div>
            </section>

            <section>
                <h2 id="theme">{{ t().theme }}</h2>
                <p [innerHTML]="t().themeDesc"></p>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-3 cz-gap-md cz-mb-md">
                    @for (theme of themes; track theme) {
                        <div [attr.data-theme]="theme" class="cz-p-lg cz-border cz-rounded-lg cz-bg-surface">
                            <strong class="cz-text-primary">data-theme="{{ theme }}"</strong>
                            <p class="cz-text-sm cz-text-muted cz-mb-none">--cz-theme-surface / --cz-theme-text-primary</p>
                        </div>
                    }
                </div>
                <app-code [code]="themeCode" />
            </section>

            <section>
                <h2 id="consume">{{ t().consume }}</h2>
                <p>{{ t().consumeDesc }}</p>
                <app-code [code]="consumeCode" />
            </section>

            <section>
                <h2 id="reference">{{ t().reference }}</h2>
                <p>{{ t().referenceDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Family</th><th>Pattern</th><th>Examples</th></tr>
                        </thead>
                        <tbody>
                            @for (row of tokenFamilies; track row.pattern) {
                                <tr>
                                    <td>{{ row.family }}</td>
                                    <td><code>{{ row.pattern }}</code></td>
                                    <td><code>{{ row.examples }}</code></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TokensDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TOKENS_DOC_I18N[this.lang.currentLang()] || TOKENS_DOC_I18N.es);

    readonly themes = ['base', 'glass', 'neo'];

    readonly layers = [
        {
            name: '1. Primitives',
            desc: 'Absolute values: palettes, sizes, shadows.',
            tokens: ['--cz-color-gray-900', '--cz-font-size-lg', '--cz-spacing-md'],
        },
        {
            name: '2. Semantics',
            desc: 'Intent-based: colors, surfaces, focus.',
            tokens: ['--cz-color-primary', '--cz-bg-surface', '--cz-focus-shadow-primary'],
        },
        {
            name: '3. Component',
            desc: 'Glass, Neo and form tokens.',
            tokens: ['--cz-glass-blur', '--cz-neo-box-shadow', '--cz-input-bg'],
        },
    ];

    readonly tokenFamilies = [
        { family: 'Colors', pattern: '--cz-color-{name}-{weight}', examples: '--cz-color-primary-500, --cz-color-gray-100' },
        { family: 'Semantic colors', pattern: '--cz-color-{intent}', examples: '--cz-color-success, --cz-color-danger' },
        { family: 'Brand accents', pattern: '--cz-{cyan|violet}-*', examples: '--cz-cyan-500, --cz-violet-500' },
        { family: 'Navy', pattern: '--cz-{dark-navy|navy|light-navy}', examples: '--cz-dark-navy, --cz-navy' },
        { family: 'Typography', pattern: '--cz-font-{size|weight|line-height}-*', examples: '--cz-font-size-xl, --cz-font-weight-semibold' },
        { family: 'Spacing', pattern: '--cz-spacing-*', examples: '--cz-spacing-xs … --cz-spacing-5xl' },
        { family: 'Radius', pattern: '--cz-radius-*', examples: '--cz-radius-sm, --cz-radius-lg' },
        { family: 'Shadows', pattern: '--cz-shadow-*', examples: '--cz-shadow-md, --cz-shadow-2xl' },
        { family: 'Transitions', pattern: '--cz-transition-*', examples: '--cz-transition-normal, --cz-transition-transform' },
        { family: 'Z-index', pattern: '--cz-z-*', examples: '--cz-z-glass-overlay' },
        { family: 'Theme', pattern: '--cz-theme-*', examples: '--cz-theme-surface, --cz-theme-text-primary' },
        { family: 'Glass', pattern: '--cz-glass-*', examples: '--cz-glass-blur, --cz-color-glass-bg' },
        { family: 'Neo', pattern: '--cz-neo-*', examples: '--cz-neo-bg, --cz-neo-box-shadow' },
        { family: 'Forms', pattern: '--cz-input-*', examples: '--cz-input-bg, --cz-input-radius' },
    ];

    themeCode: Code = {
        html: `<div data-theme="base">...</div>
<div data-theme="glass">...</div>
<div data-theme="neo">...</div>

<!-- Dark mode (combine with any theme) -->
<div class="dark" data-theme="neo">...</div>`,
    };

    consumeCode: Code = {
        scss: `.my-card {
    background: var(--cz-theme-surface);
    color: var(--cz-theme-text-primary);
    border-radius: var(--cz-theme-radius-base);
    padding: var(--cz-spacing-md);
    box-shadow: var(--cz-theme-shadow-base);
    transition: var(--cz-theme-transition-base);
}`,
    };
}
