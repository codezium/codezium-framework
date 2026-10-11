import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzToastService } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TOAST_DOC_I18N } from './toast-doc.i18n';

@Component({
    selector: 'cz-toast-doc-page',
    imports: [CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="toast">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Show toast" (onClick)="show()" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="severities">{{ t().severities }}</h2>
                <p [innerHTML]="t().severitiesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Success" severity="success" (onClick)="toast.success('Everything went fine', 'Success')" />
                    <cz-button label="Info" severity="info" (onClick)="toast.info('Just a heads up', 'Info')" />
                    <cz-button label="Warning" severity="warning" (onClick)="toast.warning('Check the data', 'Warning')" />
                    <cz-button label="Error" severity="danger" (onClick)="toast.error('Something failed', 'Error')" />
                </div>
                <app-code [code]="severitiesCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>API</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>cz-toast</code></td><td><code>component</code></td><td>Renders the active messages.</td></tr>
                            <tr><td><code>position</code></td><td><code>CzToastPosition</code></td><td>Stack position on screen.</td></tr>
                            <tr><td><code>add(message)</code></td><td><code>service</code></td><td>Pushes a message, returns its id.</td></tr>
                            <tr><td><code>success/info/warning/error</code></td><td><code>service</code></td><td>Severity helpers.</td></tr>
                            <tr><td><code>remove(id)</code> / <code>clear()</code></td><td><code>service</code></td><td>Removes one or all messages.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ToastDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TOAST_DOC_I18N[this.lang.currentLang()] || TOAST_DOC_I18N.es);
    readonly toast = inject(CzToastService);

    show(): void {
        this.toast.success('Message pushed from CzToastService', 'Codezium');
    }

    importCode: Code = {
        typescript: `import { CzToastComponent, CzToastService } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<!-- Once in the app root -->
<cz-toast position="top-right" />`,
        typescript: `import { CzToastService } from 'codezium-ui';

export class AppComponent {
    private toast = inject(CzToastService);

    show() {
        this.toast.success('Everything went fine', 'Success');
    }
}`,
    };

    severitiesCode: Code = {
        html: `<cz-button label="Success" severity="success" (onClick)="toast.success('Everything went fine')" />
<cz-button label="Error" severity="danger" (onClick)="toast.error('Something failed')" />`,
    };
}
