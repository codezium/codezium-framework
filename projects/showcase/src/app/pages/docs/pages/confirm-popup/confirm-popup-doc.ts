import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzButtonComponent, CzConfirmationService } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { CONFIRM_POPUP_DOC_I18N } from './confirm-popup-doc.i18n';

@Component({
    selector: 'cz-confirm-popup-doc-page',
    imports: [CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="confirm-popup">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Delete" severity="danger" (onClick)="confirmDelete($event)" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="callbacks">{{ t().callbacks }}</h2>
                <p [innerHTML]="t().callbacksDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-button label="Archive" severity="warning" (onClick)="confirmArchive($event)" />
                    <span class="cz-text-sm">Result: {{ result() || '-' }}</span>
                </div>
                <app-code [code]="callbacksCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>API</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>cz-confirm-popup</code></td><td><code>component</code></td><td>Renders the active popup confirmation.</td></tr>
                            <tr><td><code>confirmPopup(config, event?)</code></td><td><code>service</code></td><td>Opens the popup at the event coordinates.</td></tr>
                            <tr><td><code>accept / reject</code></td><td><code>config</code></td><td>Callbacks.</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Overlay z-index: a number overrides it, <code>'none'</code> keeps it in normal flow, <code>null</code> = theme default (above everything).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ConfirmPopupDocPage {
    private readonly lang = inject(LanguageService);
    private readonly confirmation = inject(CzConfirmationService);

    readonly t = computed(() => CONFIRM_POPUP_DOC_I18N[this.lang.currentLang()] || CONFIRM_POPUP_DOC_I18N.es);
    readonly result = signal('');

    confirmDelete(event: MouseEvent): void {
        this.confirmation.confirmPopup(
            {
                message: 'Delete this item?',
                acceptLabel: 'Delete',
                severity: 'danger',
                accept: () => this.result.set('deleted'),
                reject: () => this.result.set('kept'),
            },
            event,
        );
    }

    confirmArchive(event: MouseEvent): void {
        this.confirmation.confirmPopup(
            {
                message: 'Archive this project?',
                accept: () => this.result.set('archived'),
                reject: () => this.result.set('cancelled'),
            },
            event,
        );
    }

    importCode: Code = {
        typescript: `import { CzConfirmPopupComponent, CzConfirmationService } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<!-- Once in the app root -->
<cz-confirm-popup />`,
        typescript: `private confirmation = inject(CzConfirmationService);

confirmDelete(event: MouseEvent) {
    this.confirmation.confirmPopup(
        {
            message: 'Delete this item?',
            acceptLabel: 'Delete',
            accept: () => this.delete(),
        },
        event,
    );
}`,
    };

    callbacksCode: Code = {
        typescript: `this.confirmation.confirmPopup(
    {
        message: 'Archive this project?',
        accept: () => this.archive(),
        reject: () => this.cancel(),
    },
    event,
);`,
    };
}
