import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../../../core/services/language.service';
import { BASE_THEME_I18N } from './base.i18n';

@Component({
    selector: 'cz-theming-base-page',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="base-theme">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <h2 id="what-is">{{ t().whatIs.title }}</h2>
            <p [innerHTML]="t().whatIs.p1"></p>
            <p>{{ t().whatIs.p2 }}</p>

            <h2 id="usage">{{ t().usage.title }}</h2>
            <p [innerHTML]="t().usage.p1"></p>
            <pre><code>{{ t().usage.code }}</code></pre>

            <h2 id="variables">{{ t().variables.title }}</h2>
            <p [innerHTML]="t().variables.p1"></p>
            
            <div class="doc-table-wrapper cz-mt-md">
                <table class="doc-table">
                    <thead>
                        <tr>
                            <th>{{ t().variables.table.token }}</th>
                            <th>{{ t().variables.table.light }}</th>
                            <th>{{ t().variables.table.dark }}</th>
                            <th>{{ t().variables.table.desc }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>--cz-theme-surface</code></td>
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: #ffffff"></div>var(--cz-color-white)</div></td>
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: #1e293b"></div>var(--cz-navy)</div></td>
                            <td>{{ t().variables.surface.desc }}</td>
                        </tr>
                        <tr>
                            <td><code>--cz-theme-surface-hover</code></td>
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: #f9fafb"></div>var(--cz-color-gray-50)</div></td>
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: #334155"></div>var(--cz-light-navy)</div></td>
                            <td>{{ t().variables.surfaceHover.desc }}</td>
                        </tr>
                        <tr>
                            <td><code>--cz-theme-text-primary</code></td>
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: #111827"></div>var(--cz-color-gray-900)</div></td>
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: #ffffff"></div>var(--cz-color-white)</div></td>
                            <td>{{ t().variables.textPrimary.desc }}</td>
                        </tr>
                        <tr>
                            <td><code>--cz-theme-text-secondary</code></td>
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: #4b5563"></div>var(--cz-color-gray-600)</div></td>
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: #cbd5e1"></div>var(--cz-slate-300)</div></td>
                            <td>{{ t().variables.textSecondary.desc }}</td>
                        </tr>
                        <tr>
                            <td><code>--cz-theme-border-color</code></td>
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: #e5e7eb"></div>var(--cz-color-gray-200)</div></td>
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: rgba(255, 255, 255, 0.12)"></div>rgba(255, 255, 255, 0.12)</div></td>
                            <td>{{ t().variables.border.desc }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
})
export class ThemingBasePage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => BASE_THEME_I18N[this.lang.currentLang() as keyof typeof BASE_THEME_I18N]);
}
