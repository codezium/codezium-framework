import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../../../core/services/language.service';
import { THEMING_I18N } from './overview.i18n';

@Component({
    selector: 'cz-theming-overview-page',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="theming">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <h2 id="themes">{{ t().themes.title }}</h2>
            <ul>
                <li [innerHTML]="t().themes.base"></li>
                <li [innerHTML]="t().themes.glass"></li>
                <li [innerHTML]="t().themes.neo"></li>
            </ul>

            <h2 id="architecture">{{ t().architecture.title }}</h2>
            <p [innerHTML]="t().architecture.p1"></p>
            <ul>
                <li [innerHTML]="t().architecture.li1"></li>
                <li [innerHTML]="t().architecture.li2"></li>
                <li [innerHTML]="t().architecture.li3"></li>
            </ul>

            <h2 id="usage">{{ t().usage.title }}</h2>
            <p [innerHTML]="t().usage.p1"></p>
            <pre><code>{{ t().usage.code }}</code></pre>

            <h2 id="dark-mode">{{ t().darkMode.title }}</h2>
            <p [innerHTML]="t().darkMode.p1"></p>
            <pre><code>{{ t().darkMode.code }}</code></pre>

            <h2 id="nesting">{{ t().nesting.title }}</h2>
            <p [innerHTML]="t().nesting.p1"></p>
            <pre><code>{{ t().nesting.code }}</code></pre>
        </div>
    `,
    styles: [`
        .doc-page { max-width: 720px; }
        h1 { font-size: 2rem; font-weight: 700; margin: 0 0 12px; }
        h2 { font-size: 1.25rem; font-weight: 600; margin: 32px 0 8px; }
        .doc-lead { font-size: 1.05rem; color: var(--cz-theme-text-secondary); margin-bottom: 32px; }
        ul { padding-left: 20px; line-height: 1.9; }
        pre {
            background: var(--cz-theme-surface, #f3f4f6);
            border: 1px solid var(--cz-theme-border-color, #e5e7eb);
            border-radius: 8px; padding: 16px; overflow-x: auto;
            font-size: 0.875rem; margin: 8px 0 16px;
        }
        code { font-family: 'Fira Code', monospace; }
    `],
})
export class ThemingOverviewPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => THEMING_I18N[this.lang.currentLang() as keyof typeof THEMING_I18N]);
}
