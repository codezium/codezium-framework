import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzMessageComponent, CzMessageService } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { MESSAGE_SERVICE_DOC_I18N } from './message-service-doc.i18n';

@Component({
    selector: 'cz-message-service-doc-page',
    imports: [CzButtonComponent, CzMessageComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="message-service">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="usage">{{ t().usageTitle }}</h2>
                <p [innerHTML]="t().usageDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Success" severity="success"
                        (onClick)="messages.success('Profile updated', 'Your changes were saved.')" />
                    <cz-button label="Info" severity="info"
                        (onClick)="messages.info('New version available', 'Reload to get the latest features.')" />
                    <cz-button label="Warning" severity="warning"
                        (onClick)="messages.warning('Storage almost full', 'Consider removing unused files.')" />
                    <cz-button label="Error" severity="danger"
                        (onClick)="messages.error('Connection lost', 'We will retry automatically.')" />
                    <cz-button label="Sticky" severity="secondary" (onClick)="pushSticky()" />
                </div>

                <!-- Live host: messages appear here and auto-dismiss -->
                <cz-message [fromService]="true" class="cz-mb-md" />

                <app-code [code]="usageCode" />
            </section>

            <section>
                <h2 id="methods">{{ t().methodsTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Method</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>add(message)</code></td><td><code>CzMessageInput → number</code></td><td>Pushes a message with full control (severity, summary, detail, life). Returns the message id.</td></tr>
                            <tr><td><code>success(summary, detail?, life?)</code></td><td><code>string → number</code></td><td>Shorthand for a success message.</td></tr>
                            <tr><td><code>info(summary, detail?, life?)</code></td><td><code>string → number</code></td><td>Shorthand for an info message.</td></tr>
                            <tr><td><code>warning(summary, detail?, life?)</code></td><td><code>string → number</code></td><td>Shorthand for a warning message.</td></tr>
                            <tr><td><code>error(summary, detail?, life?)</code></td><td><code>string → number</code></td><td>Shorthand for a danger message.</td></tr>
                            <tr><td><code>remove(id)</code></td><td><code>number → void</code></td><td>Removes a message by id.</td></tr>
                            <tr><td><code>clear()</code></td><td><code>() → void</code></td><td>Removes every active message.</td></tr>
                            <tr><td><code>messages</code></td><td><code>Signal&lt;CzMessage[]&gt;</code></td><td>Read-only signal with the active messages.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 id="options">{{ t().configTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'info'</code></td><td>Color and icon of the message.</td></tr>
                            <tr><td><code>summary</code></td><td><code>string</code></td><td><code>—</code></td><td>Bold title line.</td></tr>
                            <tr><td><code>detail</code></td><td><code>string</code></td><td><code>—</code></td><td>Secondary description line.</td></tr>
                            <tr><td><code>life</code></td><td><code>number</code></td><td><code>4000</code></td><td>Auto-dismiss time in ms (<code>0</code> = sticky).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 id="host">{{ t().noteTitle }}</h2>
                <p [innerHTML]="t().noteDesc"></p>
                <app-code [code]="hostCode" />
            </section>
        </div>
    `,
})
export class MessageServiceDocPage {
    private readonly lang = inject(LanguageService);
    readonly messages = inject(CzMessageService);
    readonly t = computed(() => MESSAGE_SERVICE_DOC_I18N[this.lang.currentLang()] || MESSAGE_SERVICE_DOC_I18N.en);

    pushSticky(): void {
        this.messages.add({
            severity: 'info',
            summary: 'Sticky message',
            detail: 'life: 0 keeps it until it is closed.',
            life: 0,
        });
    }

    importCode: Code = {
        typescript: `import { CzMessageService } from 'codezium-ui';`,
    };

    usageCode: Code = {
        typescript: `private readonly messages = inject(CzMessageService);

this.messages.success('Profile updated', 'Your changes were saved.');
this.messages.info('New version available');
this.messages.warning('Storage almost full');
this.messages.error('Connection lost', 'We will retry automatically.');

// Full control (life: 0 = sticky)
this.messages.add({
    severity: 'success',
    summary: 'Import finished',
    detail: '1.204 records processed',
    life: 8000,
});`,
    };

    hostCode: Code = {
        html: `<!-- Where the messages should appear -->
<cz-message [fromService]="true" />`,
    };
}
