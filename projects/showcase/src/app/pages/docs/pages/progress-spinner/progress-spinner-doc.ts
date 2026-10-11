import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzProgressSpinnerComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { PROGRESS_SPINNER_DOC_I18N } from './progress-spinner-doc.i18n';

@Component({
    selector: 'cz-progress-spinner-doc-page',
    imports: [CzProgressSpinnerComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="progress-spinner">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-progress-spinner />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p [innerHTML]="t().sizesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-progress-spinner [size]="24" [strokeWidth]="3" />
                    <cz-progress-spinner [size]="50" [strokeWidth]="4" />
                    <cz-progress-spinner [size]="80" [strokeWidth]="6" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <section>
                <h2 id="severities">{{ t().severities }}</h2>
                <p [innerHTML]="t().severitiesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-progress-spinner severity="primary" />
                    <cz-progress-spinner severity="success" />
                    <cz-progress-spinner severity="warning" [animationDuration]="'1s'" />
                    <cz-progress-spinner severity="danger" [animationDuration]="'3s'" />
                </div>
                <app-code [code]="severitiesCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>size</code></td><td><code>number</code></td><td><code>50</code></td><td>Diameter in pixels.</td></tr>
                            <tr><td><code>strokeWidth</code></td><td><code>number</code></td><td><code>4</code></td><td>Circle stroke width.</td></tr>
                            <tr><td><code>fill</code></td><td><code>'none' | 'solid'</code></td><td><code>'none'</code></td><td>Fill of the inner circle.</td></tr>
                            <tr><td><code>animationDuration</code></td><td><code>string</code></td><td><code>'2s'</code></td><td>Spin duration.</td></tr>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'primary'</code></td><td>Semantic color.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ProgressSpinnerDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(
        () => PROGRESS_SPINNER_DOC_I18N[this.lang.currentLang()] || PROGRESS_SPINNER_DOC_I18N.es,
    );

    importCode: Code = {
        typescript: `import { CzProgressSpinnerComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-progress-spinner />`,
    };

    sizesCode: Code = {
        html: `<cz-progress-spinner [size]="24" [strokeWidth]="3" />
<cz-progress-spinner [size]="50" [strokeWidth]="4" />
<cz-progress-spinner [size]="80" [strokeWidth]="6" />`,
    };

    severitiesCode: Code = {
        html: `<cz-progress-spinner severity="primary" />
<cz-progress-spinner severity="success" />
<cz-progress-spinner severity="warning" animationDuration="1s" />
<cz-progress-spinner severity="danger" animationDuration="3s" />`,
    };
}
