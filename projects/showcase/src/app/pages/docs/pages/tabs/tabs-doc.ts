import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzTabComponent, CzTabsComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TABS_DOC_I18N } from './tabs-doc.i18n';

@Component({
    selector: 'cz-tabs-doc-page',
    imports: [CzTabsComponent, CzTabComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="tabs">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-tabs>
                        <cz-tab header="Overview">Overview content</cz-tab>
                        <cz-tab header="Features">Features content</cz-tab>
                        <cz-tab header="API">API content</cz-tab>
                    </cz-tabs>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-tabs [activeTab]="1">
                        <cz-tab header="First">First content</cz-tab>
                        <cz-tab header="Second (initial)">Second content</cz-tab>
                        <cz-tab header="Disabled" [disabled]="true">Disabled content</cz-tab>
                    </cz-tabs>
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
                            <tr><td><code>cz-tabs</code></td><td><code>activeTab</code></td><td><code>number</code></td><td>Initial active index.</td></tr>
                            <tr><td><code>cz-tab</code></td><td><code>header</code></td><td><code>string</code></td><td>Tab label.</td></tr>
                            <tr><td><code>cz-tab</code></td><td><code>disabled</code></td><td><code>boolean</code></td><td>Disabled tab.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TabsDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TABS_DOC_I18N[this.lang.currentLang()] || TABS_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzTabComponent, CzTabsComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-tabs>
    <cz-tab header="Overview">Overview content</cz-tab>
    <cz-tab header="Features">Features content</cz-tab>
    <cz-tab header="API">API content</cz-tab>
</cz-tabs>`,
    };

    optionsCode: Code = {
        html: `<cz-tabs [activeTab]="1">
    <cz-tab header="First">First content</cz-tab>
    <cz-tab header="Second (initial)">Second content</cz-tab>
    <cz-tab header="Disabled" [disabled]="true">Disabled content</cz-tab>
</cz-tabs>`,
    };
}
