import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzToastService } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { TOAST_SERVICE_DOC_I18N } from './toast-service-doc.i18n';

@Component({
    selector: 'cz-toast-service-doc-page',
    imports: [CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="toast-service">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="usage">{{ t().usageTitle }}</h2>
                <p [innerHTML]="t().usageDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Success" severity="success" (onClick)="toast.success('Record saved successfully')" />
                    <cz-button label="Info" severity="info" (onClick)="toast.info('A new version is available')" />
                    <cz-button label="Warning" severity="warning" (onClick)="toast.warning('Storage is almost full')" />
                    <cz-button label="Error" severity="danger" (onClick)="toast.error('Could not connect to the server')" />
                </div>
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
                            <tr><td><code>add(message)</code></td><td><code>CzToastInput → number</code></td><td>Pushes a message with full control (severity, summary, detail, life). Returns the message id.</td></tr>
                            <tr><td><code>success(detail, summary?)</code></td><td><code>string → number</code></td><td>Shorthand for a success toast.</td></tr>
                            <tr><td><code>info(detail, summary?)</code></td><td><code>string → number</code></td><td>Shorthand for an info toast.</td></tr>
                            <tr><td><code>warning(detail, summary?)</code></td><td><code>string → number</code></td><td>Shorthand for a warning toast.</td></tr>
                            <tr><td><code>error(detail, summary?)</code></td><td><code>string → number</code></td><td>Shorthand for a danger toast.</td></tr>
                            <tr><td><code>remove(id)</code></td><td><code>number → void</code></td><td>Removes a toast by id.</td></tr>
                            <tr><td><code>clear()</code></td><td><code>() → void</code></td><td>Removes every active toast.</td></tr>
                            <tr><td><code>messages</code></td><td><code>Signal&lt;CzToastMessage[]&gt;</code></td><td>Read-only signal with the active messages.</td></tr>
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
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'info'</code></td><td>Color and icon of the toast.</td></tr>
                            <tr><td><code>summary</code></td><td><code>string</code></td><td><code>—</code></td><td>Bold title line.</td></tr>
                            <tr><td><code>detail</code></td><td><code>string</code></td><td><code>—</code></td><td>Message body.</td></tr>
                            <tr><td><code>life</code></td><td><code>number</code></td><td><code>3000</code></td><td>Auto-dismiss time in ms (<code>0</code> = sticky).</td></tr>
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
export class ToastServiceDocPage {
    private readonly lang = inject(LanguageService);
    readonly toast = inject(CzToastService);
    readonly t = computed(() => TOAST_SERVICE_DOC_I18N[this.lang.currentLang()] || TOAST_SERVICE_DOC_I18N.en);

    importCode: Code = {
        typescript: `import { CzToastService } from 'codezium-ui';`,
    };

    usageCode: Code = {
        typescript: `private readonly toast = inject(CzToastService);

this.toast.success('Record saved successfully');
this.toast.info('A new version is available');
this.toast.warning('Storage is almost full');
this.toast.error('Could not connect to the server');

// Full control
this.toast.add({
    severity: 'success',
    summary: 'Deploy finished',
    detail: 'Version 2.4.0 is live',
    life: 5000,
});`,
    };

    hostCode: Code = {
        html: `<!-- Once, at the application root -->
<cz-toast position="top-right" />`,
    };
}
