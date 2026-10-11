import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzBadgeComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { BADGE_DOC_I18N } from './badge-doc.i18n';

@Component({
    selector: 'cz-badge-doc-page',
    imports: [CzBadgeComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="badge">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-mb-md">
                    <cz-badge [value]="8" />
                    <cz-badge value="New" severity="success" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="severities">{{ t().severities }}</h2>
                <p [innerHTML]="t().severitiesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-mb-md">
                    <cz-badge [value]="1" severity="primary" />
                    <cz-badge [value]="2" severity="secondary" />
                    <cz-badge [value]="3" severity="success" />
                    <cz-badge [value]="4" severity="info" />
                    <cz-badge [value]="5" severity="warning" />
                    <cz-badge [value]="6" severity="danger" />
                    <cz-badge [value]="7" severity="dark" />
                </div>
                <app-code [code]="severitiesCode" />
            </section>

            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p [innerHTML]="t().sizesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-badge [value]="'sm'" size="sm" />
                    <cz-badge [value]="'md'" size="md" />
                    <cz-badge [value]="'lg'" size="lg" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <section>
                <h2 id="dot">{{ t().dot }}</h2>
                <p [innerHTML]="t().dotDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-badge [dot]="true" severity="success" />
                    <cz-badge [dot]="true" severity="danger" />
                </div>
                <app-code [code]="dotCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>value</code></td><td><code>string | number | null</code></td><td><code>null</code></td><td>Badge value.</td></tr>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'primary'</code></td><td>Semantic color.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Badge size.</td></tr>
                            <tr><td><code>dot</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Renders a dot instead of the value.</td></tr>
                            <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>''</code></td><td>Accessible label.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class BadgeDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => BADGE_DOC_I18N[this.lang.currentLang()] || BADGE_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzBadgeComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-badge [value]="8" />
<cz-badge value="New" severity="success" />`,
    };

    severitiesCode: Code = {
        html: `<cz-badge [value]="1" severity="primary" />
<cz-badge [value]="3" severity="success" />
<cz-badge [value]="5" severity="warning" />
<cz-badge [value]="6" severity="danger" />`,
    };

    sizesCode: Code = {
        html: `<cz-badge value="sm" size="sm" />
<cz-badge value="md" size="md" />
<cz-badge value="lg" size="lg" />`,
    };

    dotCode: Code = {
        html: `<cz-badge [dot]="true" severity="success" />
<cz-badge [dot]="true" severity="danger" />`,
    };
}
