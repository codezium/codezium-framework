import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../../../core/services/language.service';
import { DARK_MODE_I18N } from './dark-mode.i18n';

@Component({
    selector: 'cz-theming-dark-mode-page',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="dark-mode">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <h2 id="what-is">{{ t().whatIs.title }}</h2>
            <p [innerHTML]="t().whatIs.p1"></p>
            <p [innerHTML]="t().whatIs.p2"></p>

            <h2 id="usage">{{ t().usage.title }}</h2>
            <p [innerHTML]="t().usage.p1"></p>
            <pre><code>{{ t().usage.code }}</code></pre>

            <h2 id="nesting">{{ t().nesting.title }}</h2>
            <p [innerHTML]="t().nesting.p1"></p>
            <pre><code>{{ t().nesting.code }}</code></pre>
        </div>
    `,
})
export class ThemingDarkModePage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => DARK_MODE_I18N[this.lang.currentLang() as keyof typeof DARK_MODE_I18N]);
}
