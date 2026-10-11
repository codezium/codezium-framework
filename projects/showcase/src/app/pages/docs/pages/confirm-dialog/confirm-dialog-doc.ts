import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzButtonComponent, CzConfirmationService } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { CONFIRM_DIALOG_DOC_I18N } from './confirm-dialog-doc.i18n';

@Component({
    selector: 'cz-confirm-dialog-doc-page',
    imports: [CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="confirm-dialog">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Delete item" severity="danger" (onClick)="confirmDelete()" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="callbacks">{{ t().callbacks }}</h2>
                <p [innerHTML]="t().callbacksDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-button label="Save changes" severity="success" (onClick)="confirmSave()" />
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
                            <tr><td><code>cz-confirm-dialog</code></td><td><code>component</code></td><td>Renders the active modal confirmation.</td></tr>
                            <tr><td><code>confirm(config)</code></td><td><code>service</code></td><td>Opens the modal confirmation.</td></tr>
                            <tr><td><code>header / message</code></td><td><code>config</code></td><td>Title and message.</td></tr>
                            <tr><td><code>acceptLabel / rejectLabel</code></td><td><code>config</code></td><td>Button labels.</td></tr>
                            <tr><td><code>accept / reject</code></td><td><code>config</code></td><td>Callbacks.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ConfirmDialogDocPage {
    private readonly lang = inject(LanguageService);
    private readonly confirmation = inject(CzConfirmationService);

    readonly t = computed(() => CONFIRM_DIALOG_DOC_I18N[this.lang.currentLang()] || CONFIRM_DIALOG_DOC_I18N.es);
    readonly result = signal('');

    confirmDelete(): void {
        this.confirmation.confirm({
            header: 'Delete item',
            message: 'Are you sure you want to delete this item?',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            severity: 'danger',
            accept: () => this.result.set('accepted'),
            reject: () => this.result.set('rejected'),
        });
    }

    confirmSave(): void {
        this.confirmation.confirm({
            header: 'Save changes',
            message: 'Do you want to save the changes?',
            accept: () => this.result.set('saved'),
            reject: () => this.result.set('discarded'),
        });
    }

    importCode: Code = {
        typescript: `import { CzConfirmDialogComponent, CzConfirmationService } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<!-- Once in the app root -->
<cz-confirm-dialog />`,
        typescript: `private confirmation = inject(CzConfirmationService);

confirmDelete() {
    this.confirmation.confirm({
        header: 'Delete item',
        message: 'Are you sure?',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        severity: 'danger',
        accept: () => this.delete(),
    });
}`,
    };

    callbacksCode: Code = {
        typescript: `this.confirmation.confirm({
    message: 'Do you want to save the changes?',
    accept: () => this.save(),
    reject: () => this.discard(),
});`,
    };
}
