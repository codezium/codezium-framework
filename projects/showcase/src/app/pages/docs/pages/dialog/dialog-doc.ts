import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzButtonComponent, CzDialogComponent, CzInputTextComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { DIALOG_DOC_I18N } from './dialog-doc.i18n';

@Component({
    selector: 'cz-dialog-doc-page',
    imports: [CzDialogComponent, CzButtonComponent, CzInputTextComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="dialog">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Open dialog" (onClick)="visible.set(true)" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Top right" severity="secondary" (onClick)="openPositioned('topright')" />
                    <cz-button label="Bottom left" severity="secondary" (onClick)="openPositioned('bottomleft')" />
                    <cz-button label="Dismissable mask" severity="info" (onClick)="dismissable.set(true)" />
                    <cz-button label="No close button" severity="warning" (onClick)="noClose.set(true)" />
                </div>
                <app-code [code]="optionsCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>visible</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Visibility (two-way).</td></tr>
                            <tr><td><code>header</code></td><td><code>string</code></td><td><code>''</code></td><td>Dialog title.</td></tr>
                            <tr><td><code>modal</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows the mask.</td></tr>
                            <tr><td><code>closable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows the close button.</td></tr>
                            <tr><td><code>dismissableMask</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Closes on mask click.</td></tr>
                            <tr><td><code>position</code></td><td><code>CzDialogPosition</code></td><td><code>'center'</code></td><td>Dialog position.</td></tr>
                            <tr><td><code>width</code></td><td><code>string</code></td><td><code>'30rem'</code></td><td>Dialog width.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>

        <cz-dialog [visible]="visible()" header="Edit profile" (onHide)="visible.set(false)">
            <div class="cz-flex cz-flex-col cz-gap-md">
                <cz-input-text label="Name" labelPosition="float" />
                <cz-input-text label="Email" labelPosition="float" />
            </div>
        </cz-dialog>

        <cz-dialog [visible]="positioned()" [position]="position()" header="Positioned" (onHide)="positioned.set(false)">
            <p>This dialog is positioned at {{ position() }}.</p>
        </cz-dialog>

        <cz-dialog [visible]="dismissable()" header="Dismissable" [dismissableMask]="true" (onHide)="dismissable.set(false)">
            <p>Click the mask to close this dialog.</p>
        </cz-dialog>

        <cz-dialog [visible]="noClose()" header="No close button" [closable]="false" (onHide)="noClose.set(false)">
            <p>Use the button below to close.</p>
            <cz-button label="Close" (onClick)="noClose.set(false)" />
        </cz-dialog>
    `,
})
export class DialogDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => DIALOG_DOC_I18N[this.lang.currentLang()] || DIALOG_DOC_I18N.es);

    readonly visible = signal(false);
    readonly positioned = signal(false);
    readonly position = signal<'topright' | 'bottomleft'>('topright');
    readonly dismissable = signal(false);
    readonly noClose = signal(false);

    openPositioned(position: 'topright' | 'bottomleft'): void {
        this.position.set(position);
        this.positioned.set(true);
    }

    importCode: Code = {
        typescript: `import { CzDialogComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-dialog [visible]="visible()" header="Edit profile" (onHide)="visible.set(false)">
    <cz-input-text label="Name" labelPosition="float" />
</cz-dialog>`,
        typescript: `visible = signal(false);`,
    };

    optionsCode: Code = {
        html: `<cz-dialog [visible]="visible()" [position]="'topright'" [dismissableMask]="true" header="Positioned" />`,
    };
}
