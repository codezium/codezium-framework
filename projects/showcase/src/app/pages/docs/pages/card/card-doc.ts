import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzCardComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { CARD_DOC_I18N } from './card-doc.i18n';

@Component({
    selector: 'cz-card-doc-page',
    imports: [CzCardComponent, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="card">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-grid cz-grid-cols-1 md:cz-grid-cols-2 cz-gap-md cz-mb-md">
                    <cz-card>
                        <p>Simple card with a paragraph of content.</p>
                    </cz-card>
                    <cz-card header="Title" subheader="Subtitle">
                        <p>Card with header and subtitle.</p>
                    </cz-card>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="header">{{ t().header }}</h2>
                <p [innerHTML]="t().headerDesc"></p>
                <div class="cz-mb-md">
                    <cz-card header="Project" subheader="Design system">
                        <p>Card body content.</p>
                        <div class="cz-flex cz-gap-sm cz-mt-md" czCardFooter>
                            <cz-button label="Cancel" variant="text" />
                            <cz-button label="Save" />
                        </div>
                    </cz-card>
                </div>
                <app-code [code]="headerCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>header</code></td><td><code>string</code></td><td><code>''</code></td><td>Card title.</td></tr>
                            <tr><td><code>subheader</code></td><td><code>string</code></td><td><code>''</code></td><td>Card subtitle.</td></tr>
                            <tr><td><code>[czCardFooter]</code></td><td><code>attribute</code></td><td>-</td><td>Projects content into the footer.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class CardDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => CARD_DOC_I18N[this.lang.currentLang()] || CARD_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzCardComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-card>
    <p>Simple card with a paragraph of content.</p>
</cz-card>

<cz-card header="Title" subheader="Subtitle">
    <p>Card with header and subtitle.</p>
</cz-card>`,
    };

    headerCode: Code = {
        html: `<cz-card header="Project" subheader="Design system">
    <p>Card body content.</p>
    <div class="cz-flex cz-gap-sm cz-mt-md" czCardFooter>
        <cz-button label="Cancel" variant="text" />
        <cz-button label="Save" />
    </div>
</cz-card>`,
    };
}
