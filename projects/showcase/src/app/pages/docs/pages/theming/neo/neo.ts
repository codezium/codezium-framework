import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../../../core/services/language.service';
import { NEO_THEME_I18N } from './neo.i18n';

@Component({
    selector: 'cz-theming-neo-page',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="neo-theme">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <h2 id="what-is">{{ t().whatIs.title }}</h2>
            <p [innerHTML]="t().whatIs.p1"></p>
            <p [innerHTML]="t().whatIs.p2"></p>

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
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: #f4f3f3"></div>var(--cz-neo-bg)</div></td>
                            <td><div class="cz-flex cz-items-center cz-gap-sm"><div class="cz-w-4 cz-h-4 cz-rounded-sm cz-border cz-border-light" style="background-color: #1e293b"></div>var(--cz-navy)</div></td>
                            <td>{{ t().variables.surface.desc }}</td>
                        </tr>
                        <tr>
                            <td><code>--cz-theme-radius-base</code></td>
                            <td><code>12px</code> (md)</td>
                            <td><code>12px</code> (md)</td>
                            <td>{{ t().variables.radius.desc }}</td>
                        </tr>
                        <tr>
                            <td><code>--cz-theme-shadow-base</code></td>
                            <td><code>8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff</code></td>
                            <td><code>6px 6px 12px rgba(0,0,0,0.5), -6px -6px 12px rgba(255,255,255,0.05)</code></td>
                            <td>{{ t().variables.shadowBase.desc }}</td>
                        </tr>
                        <tr>
                            <td><code>--cz-theme-shadow-hover</code></td>
                            <td><code>inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff</code></td>
                            <td><code>inset 6px 6px 12px rgba(0,0,0,0.5), inset -6px -6px 12px rgba(255,255,255,0.05)</code></td>
                            <td>{{ t().variables.shadowHover.desc }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
})
export class ThemingNeoPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => NEO_THEME_I18N[this.lang.currentLang() as keyof typeof NEO_THEME_I18N]);
}
