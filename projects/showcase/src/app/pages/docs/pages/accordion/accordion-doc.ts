import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzAccordionComponent, CzAccordionPanelComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { ACCORDION_DOC_I18N } from './accordion-doc.i18n';

@Component({
    selector: 'cz-accordion-doc-page',
    imports: [CzAccordionComponent, CzAccordionPanelComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="accordion">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-accordion>
                        <cz-accordion-panel header="General">General settings content.</cz-accordion-panel>
                        <cz-accordion-panel header="Security">Security settings content.</cz-accordion-panel>
                        <cz-accordion-panel header="Billing">Billing settings content.</cz-accordion-panel>
                    </cz-accordion>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-accordion [multiple]="true" [activeIndexes]="[0, 2]">
                        <cz-accordion-panel header="Open by default">First content.</cz-accordion-panel>
                        <cz-accordion-panel header="Closed">Second content.</cz-accordion-panel>
                        <cz-accordion-panel header="Open and disabled" [disabled]="true">Third content.</cz-accordion-panel>
                    </cz-accordion>
                </div>
                <app-code [code]="optionsCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Component</th><th>Name</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>cz-accordion</code></td><td><code>multiple</code></td><td><code>boolean</code></td><td>Allows multiple open panels.</td></tr>
                            <tr><td><code>cz-accordion</code></td><td><code>activeIndexes</code></td><td><code>number[]</code></td><td>Initially expanded indexes.</td></tr>
                            <tr><td><code>cz-accordion-panel</code></td><td><code>header</code></td><td><code>string</code></td><td>Panel header.</td></tr>
                            <tr><td><code>cz-accordion-panel</code></td><td><code>disabled</code></td><td><code>boolean</code></td><td>Disabled panel.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class AccordionDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => ACCORDION_DOC_I18N[this.lang.currentLang()] || ACCORDION_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzAccordionComponent, CzAccordionPanelComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-accordion>
    <cz-accordion-panel header="General">General settings content.</cz-accordion-panel>
    <cz-accordion-panel header="Security">Security settings content.</cz-accordion-panel>
</cz-accordion>`,
    };

    optionsCode: Code = {
        html: `<cz-accordion [multiple]="true" [activeIndexes]="[0, 2]">
    <cz-accordion-panel header="Open by default">First content.</cz-accordion-panel>
    <cz-accordion-panel header="Closed">Second content.</cz-accordion-panel>
    <cz-accordion-panel header="Open and disabled" [disabled]="true">Third content.</cz-accordion-panel>
</cz-accordion>`,
    };
}
