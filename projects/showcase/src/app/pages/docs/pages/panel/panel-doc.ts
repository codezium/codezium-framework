import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzPanelComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { PANEL_DOC_I18N } from './panel-doc.i18n';

@Component({
    selector: 'cz-panel-doc-page',
    imports: [CzPanelComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="panel">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md">
                    <cz-panel header="Panel header">
                        <p>Panel content with any projection.</p>
                    </cz-panel>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="toggleable">{{ t().toggleable }}</h2>
                <p [innerHTML]="t().toggleableDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-panel header="Toggleable" [toggleable]="true" [(collapsed)]="collapsed">
                        <p>This content can be collapsed.</p>
                    </cz-panel>
                    <span class="cz-text-sm">Collapsed: {{ collapsed() }}</span>
                    <cz-panel header="Initially collapsed" [toggleable]="true" [collapsed]="true">
                        <p>Hidden by default.</p>
                    </cz-panel>
                </div>
                <app-code [code]="toggleableCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>header</code></td><td><code>string</code></td><td><code>''</code></td><td>Panel header text.</td></tr>
                            <tr><td><code>toggleable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Allows collapsing.</td></tr>
                            <tr><td><code>collapsed</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Collapsed state (two-way).</td></tr>
                            <tr><td><code>onToggle</code></td><td><code>output&lt;boolean&gt;</code></td><td>-</td><td>Emitted on toggle.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class PanelDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => PANEL_DOC_I18N[this.lang.currentLang()] || PANEL_DOC_I18N.es);

    readonly collapsed = signal(false);

    importCode: Code = {
        typescript: `import { CzPanelComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-panel header="Panel header">
    <p>Panel content with any projection.</p>
</cz-panel>`,
    };

    toggleableCode: Code = {
        html: `<cz-panel header="Toggleable" [toggleable]="true" [(collapsed)]="collapsed">
    <p>This content can be collapsed.</p>
</cz-panel>`,
        typescript: `collapsed = signal(false);`,
    };
}
