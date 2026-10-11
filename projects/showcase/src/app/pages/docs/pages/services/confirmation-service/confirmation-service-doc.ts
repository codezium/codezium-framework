import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzConfirmationService } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { CONFIRMATION_SERVICE_DOC_I18N } from './confirmation-service-doc.i18n';

@Component({
    selector: 'cz-confirmation-service-doc-page',
    imports: [CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="confirmation-service">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="usage">{{ t().usageTitle }}</h2>
                <p [innerHTML]="t().usageDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Delete item" severity="danger" (onClick)="confirmDelete()" />
                    <cz-button label="Save changes" severity="success" (onClick)="confirmSave()" />
                </div>
                <app-code [code]="usageCode" />
            </section>

            <section>
                <h2 id="popup">{{ t().popupTitle }}</h2>
                <p [innerHTML]="t().popupDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Confirm here" severity="warning" (onClick)="confirmPopup($event)" />
                </div>
                <app-code [code]="popupCode" />
            </section>

            <section>
                <h2 id="methods">{{ t().methodsTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Method</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>confirm(config)</code></td><td><code>CzConfirmationConfig → void</code></td><td>Opens the modal confirmation dialog.</td></tr>
                            <tr><td><code>confirmPopup(config, event?)</code></td><td><code>(config, MouseEvent?) → void</code></td><td>Opens the anchored confirmation popup.</td></tr>
                            <tr><td><code>accept()</code></td><td><code>() → void</code></td><td>Accepts the active confirmation and runs <code>accept</code>.</td></tr>
                            <tr><td><code>reject()</code></td><td><code>() → void</code></td><td>Rejects the active confirmation and runs <code>reject</code>.</td></tr>
                            <tr><td><code>clear()</code></td><td><code>() → void</code></td><td>Clears the active confirmation without running callbacks.</td></tr>
                            <tr><td><code>active</code></td><td><code>Signal&lt;CzConfirmationConfig | null&gt;</code></td><td>Active confirmation config.</td></tr>
                            <tr><td><code>mode</code></td><td><code>Signal&lt;'dialog' | 'popup' | null&gt;</code></td><td>Which renderer displays the confirmation.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 id="options">{{ t().configTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Option</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>message</code></td><td><code>string</code></td><td>Message to display (required).</td></tr>
                            <tr><td><code>header</code></td><td><code>string</code></td><td>Title of the confirmation.</td></tr>
                            <tr><td><code>acceptLabel</code></td><td><code>string</code></td><td>Accept button label.</td></tr>
                            <tr><td><code>rejectLabel</code></td><td><code>string</code></td><td>Reject button label.</td></tr>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td>Severity of the accept button.</td></tr>
                            <tr><td><code>accept</code></td><td><code>() =&gt; void</code></td><td>Callback executed when accepted.</td></tr>
                            <tr><td><code>reject</code></td><td><code>() =&gt; void</code></td><td>Callback executed when rejected.</td></tr>
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
export class ConfirmationServiceDocPage {
    private readonly lang = inject(LanguageService);
    private readonly confirmation = inject(CzConfirmationService);
    readonly t = computed(() => CONFIRMATION_SERVICE_DOC_I18N[this.lang.currentLang()] || CONFIRMATION_SERVICE_DOC_I18N.en);

    confirmDelete(): void {
        this.confirmation.confirm({
            header: 'Delete item',
            message: 'Are you sure you want to delete this item? This action cannot be undone.',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            severity: 'danger',
            accept: () => {},
        });
    }

    confirmSave(): void {
        this.confirmation.confirm({
            header: 'Save changes',
            message: 'Do you want to save the current changes?',
            acceptLabel: 'Save',
            severity: 'success',
            accept: () => {},
        });
    }

    confirmPopup(event: MouseEvent): void {
        this.confirmation.confirmPopup(
            {
                message: 'Confirm this action?',
                acceptLabel: 'Yes',
                rejectLabel: 'No',
            },
            event,
        );
    }

    importCode: Code = {
        typescript: `import { CzConfirmationService } from 'codezium-ui';`,
    };

    usageCode: Code = {
        typescript: `private readonly confirmation = inject(CzConfirmationService);

this.confirmation.confirm({
    header: 'Delete item',
    message: 'Are you sure you want to delete this item?',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    severity: 'danger',
    accept: () => this.deleteItem(),
    reject: () => this.cancel(),
});`,
    };

    popupCode: Code = {
        html: `<button (click)="confirmation.confirmPopup({ message: 'Confirm this action?' }, $event)">
    Confirm here
</button>`,
    };

    hostCode: Code = {
        html: `<!-- Once, at the application root -->
<cz-confirm-dialog />
<cz-confirm-popup />`,
    };
}
