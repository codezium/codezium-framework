import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { INSTALL_I18N } from './installation.i18n';

@Component({
    selector: 'cz-installation-page',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="installation">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <h2 id="requirements">{{ t().reqs.title }}</h2>
            <p>{{ t().reqs.p1 }}</p>
            <ul>
                <li [innerHTML]="t().reqs.li1"></li>
                <li [innerHTML]="t().reqs.li2"></li>
            </ul>

            <h2 id="npm">{{ t().npm.title }}</h2>
            <p>{{ t().npm.p1 }}</p>
            <pre><code>{{ t().npm.code }}</code></pre>

            <h2 id="styles">{{ t().styles.title }}</h2>
            <p [innerHTML]="t().styles.p1"></p>
            <pre><code>{{ t().styles.code }}</code></pre>

            <h2 id="icons">{{ t().icons.title }}</h2>
            <p [innerHTML]="t().icons.p1"></p>
            <pre><code>{{ t().icons.code }}</code></pre>

            <h2 id="usage">{{ t().usage.title }}</h2>
            <p>{{ t().usage.p1 }}</p>
            <pre><code>{{ t().usage.code }}</code></pre>

            <h2 id="next-steps">{{ t().nextSteps.title }}</h2>
            <p>{{ t().nextSteps.p1 }}</p>
        </div>
    `,
})
export class InstallationPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => INSTALL_I18N[this.lang.currentLang() as keyof typeof INSTALL_I18N]);
}
