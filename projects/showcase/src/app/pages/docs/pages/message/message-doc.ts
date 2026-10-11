import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzMessageComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { MESSAGE_DOC_I18N } from './message-doc.i18n';

@Component({
    selector: 'cz-message-doc-page',
    imports: [CzMessageComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="message">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-message text="This is an informational message." severity="info" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="severities">{{ t().severities }}</h2>
                <p [innerHTML]="t().severitiesDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-message text="Success message" severity="success" />
                    <cz-message text="Warning message" severity="warning" />
                    <cz-message text="Danger message" severity="danger" />
                    <cz-message text="Closable message" severity="secondary" [closable]="true" />
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
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'info'</code></td><td>Message color.</td></tr>
                            <tr><td><code>text</code></td><td><code>string</code></td><td><code>''</code></td><td>Message text.</td></tr>
                            <tr><td><code>icon</code></td><td><code>LucideIconInput</code></td><td><code>null</code></td><td>Custom icon.</td></tr>
                            <tr><td><code>closable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the close button.</td></tr>
                            <tr><td><code>fromService</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Renders the messages pushed through <code>CzMessageService</code> (see Services).</td></tr>
                            <tr><td><code>onClose</code></td><td><code>output&lt;void&gt;</code></td><td>-</td><td>Emitted when closed.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class MessageDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => MESSAGE_DOC_I18N[this.lang.currentLang()] || MESSAGE_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzMessageComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-message text="This is an informational message." severity="info" />`,
    };

    severitiesCode: Code = {
        html: `<cz-message text="Success message" severity="success" />
<cz-message text="Warning message" severity="warning" />
<cz-message text="Danger message" severity="danger" />
<cz-message text="Closable message" severity="secondary" [closable]="true" />`,
    };
}
