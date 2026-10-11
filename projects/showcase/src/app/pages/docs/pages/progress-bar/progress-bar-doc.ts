import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzProgressBarComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { PROGRESS_BAR_DOC_I18N } from './progress-bar-doc.i18n';

@Component({
    selector: 'cz-progress-bar-doc-page',
    imports: [CzProgressBarComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="progress-bar">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-progress-bar [value]="50" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="value">{{ t().value }}</h2>
                <p [innerHTML]="t().valueDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-progress-bar [value]="25" [showValue]="true" />
                    <cz-progress-bar [value]="75" [showValue]="true" severity="success" />
                </div>
                <app-code [code]="valueCode" />
            </section>

            <section>
                <h2 id="indeterminate">{{ t().indeterminate }}</h2>
                <p [innerHTML]="t().indeterminateDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-progress-bar mode="indeterminate" />
                    <div class="cz-flex cz-flex-col cz-gap-sm">
                        <cz-progress-bar [value]="40" severity="info" size="sm" />
                        <cz-progress-bar [value]="60" severity="warning" size="md" />
                        <cz-progress-bar [value]="80" severity="danger" size="lg" />
                    </div>
                </div>
                <app-code [code]="indeterminateCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>value</code></td><td><code>number</code></td><td><code>0</code></td><td>Current value (0-100).</td></tr>
                            <tr><td><code>mode</code></td><td><code>'determinate' | 'indeterminate'</code></td><td><code>'determinate'</code></td><td>Progress mode.</td></tr>
                            <tr><td><code>showValue</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the percentage label.</td></tr>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'primary'</code></td><td>Semantic color.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Bar thickness.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ProgressBarDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => PROGRESS_BAR_DOC_I18N[this.lang.currentLang()] || PROGRESS_BAR_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzProgressBarComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-progress-bar [value]="50" />`,
    };

    valueCode: Code = {
        html: `<cz-progress-bar [value]="25" [showValue]="true" />
<cz-progress-bar [value]="75" [showValue]="true" severity="success" />`,
    };

    indeterminateCode: Code = {
        html: `<cz-progress-bar mode="indeterminate" />
<cz-progress-bar [value]="40" severity="info" size="sm" />`,
    };
}
