import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzDialogComponent, CzDialogService, CzInputTextComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { DIALOG_SERVICE_DOC_I18N } from './dialog-service-doc.i18n';

@Component({
    selector: 'cz-dialog-service-doc-page',
    imports: [CzButtonComponent, CzDialogComponent, CzInputTextComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="dialog-service">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="usage">{{ t().usageTitle }}</h2>
                <p [innerHTML]="t().usageDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Open profile dialog" (onClick)="dialogs.open('profile-demo')" />
                    <cz-button label="Toggle settings" severity="info" (onClick)="dialogs.toggle('settings-demo')" />
                    <cz-button label="Close all" severity="danger" (onClick)="dialogs.closeAll()" />
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
                            <tr><td><code>open(id)</code></td><td><code>string → void</code></td><td>Opens the dialog with the given id.</td></tr>
                            <tr><td><code>close(id)</code></td><td><code>string → void</code></td><td>Closes the dialog with the given id.</td></tr>
                            <tr><td><code>toggle(id)</code></td><td><code>string → void</code></td><td>Toggles the dialog with the given id.</td></tr>
                            <tr><td><code>isOpen(id)</code></td><td><code>string → boolean</code></td><td>Non-reactive check of the dialog state.</td></tr>
                            <tr><td><code>closeAll()</code></td><td><code>() → void</code></td><td>Closes every registered dialog.</td></tr>
                            <tr><td><code>register(id)</code></td><td><code>string → WritableSignal&lt;boolean&gt;</code></td><td>Returns the visibility signal (used internally by the dialog).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 id="how">{{ t().noteTitle }}</h2>
                <p [innerHTML]="t().noteDesc"></p>
                <app-code [code]="howCode" />
            </section>
        </div>

        <cz-dialog dialogId="profile-demo" header="Edit profile">
            <div class="cz-flex cz-flex-col cz-gap-md">
                <cz-input-text label="Name" labelPosition="float" />
                <cz-input-text label="Email" labelPosition="float" />
            </div>
            <div czDialogFooter>
                <cz-button label="Cancel" severity="secondary" variant="text" (onClick)="dialogs.close('profile-demo')" />
                <cz-button label="Save" (onClick)="dialogs.close('profile-demo')" />
            </div>
        </cz-dialog>

        <cz-dialog dialogId="settings-demo" header="Settings" [maximizable]="true">
            <p>This dialog is toggled with <code>dialogs.toggle('settings-demo')</code>.</p>
        </cz-dialog>
    `,
})
export class DialogServiceDocPage {
    private readonly lang = inject(LanguageService);
    readonly dialogs = inject(CzDialogService);
    readonly t = computed(() => DIALOG_SERVICE_DOC_I18N[this.lang.currentLang()] || DIALOG_SERVICE_DOC_I18N.en);

    importCode: Code = {
        typescript: `import { CzDialogService } from 'codezium-ui';`,
    };

    usageCode: Code = {
        html: `<cz-dialog dialogId="profile" header="Edit profile">…</cz-dialog>`,
        typescript: `private readonly dialogs = inject(CzDialogService);

// From anywhere in the app
this.dialogs.open('profile');
this.dialogs.close('profile');
this.dialogs.toggle('profile');
this.dialogs.closeAll();`,
    };

    howCode: Code = {
        typescript: `// The dialog owns no visible state when dialogId is present:
// opening, closing (button/mask/Escape) and maximize all sync
// with the service automatically.`,
    };
}
