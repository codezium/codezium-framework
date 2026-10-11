import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzButtonComponent, CzDialogComponent, CzDialogService, CzInputTextComponent } from 'codezium-ui';
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
                <h2 id="features">{{ t().featuresTitle }}</h2>
                <p [innerHTML]="t().featuresDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Draggable · Resizable · Maximizable" (onClick)="features.set(true)" />
                </div>
                <app-code [code]="featuresCode" />
            </section>

            <section>
                <h2 id="service">{{ t().serviceTitle }}</h2>
                <p [innerHTML]="t().serviceDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Open by id" severity="success" (onClick)="dialogs.open('service-demo')" />
                    <cz-button label="Close all" severity="danger" (onClick)="dialogs.closeAll()" />
                </div>
                <app-code [code]="serviceCode" />
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
                            <tr><td><code>dialogId</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Controls the dialog through <code>CzDialogService</code> by id.</td></tr>
                            <tr><td><code>header</code></td><td><code>string</code></td><td><code>''</code></td><td>Dialog title.</td></tr>
                            <tr><td><code>modal</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows the mask.</td></tr>
                            <tr><td><code>closable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows the close button.</td></tr>
                            <tr><td><code>dismissableMask</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Closes on mask click.</td></tr>
                            <tr><td><code>closeOnEscape</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Closes when Escape is pressed.</td></tr>
                            <tr><td><code>position</code></td><td><code>CzDialogPosition</code></td><td><code>'center'</code></td><td>Dialog position.</td></tr>
                            <tr><td><code>width</code></td><td><code>string</code></td><td><code>'30rem'</code></td><td>Dialog width.</td></tr>
                            <tr><td><code>showHeader</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Renders the header (title + actions).</td></tr>
                            <tr><td><code>draggable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Reposition by dragging the header.</td></tr>
                            <tr><td><code>resizable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Resize from the bottom-right corner.</td></tr>
                            <tr><td><code>maximizable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Full screen toggle.</td></tr>
                            <tr><td><code>maximized</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Maximized state (two-way).</td></tr>
                            <tr><td><code>breakpoints</code></td><td><code>Record&lt;string, string&gt; | null</code></td><td><code>null</code></td><td>Widths per breakpoint, e.g. <code>&#123;'1199px': '75vw'&#125;</code>.</td></tr>
                            <tr><td><code>styleClass</code></td><td><code>string</code></td><td><code>''</code></td><td>Custom style class for the dialog panel.</td></tr>
                            <tr><td><code>closeAriaLabel</code></td><td><code>string</code></td><td><code>'Close'</code></td><td>Accessible label of the close button.</td></tr>
                            <tr><td><code>focusOnShow</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Moves focus into the dialog on show.</td></tr>
                            <tr><td><code>blockScroll</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Blocks background scroll while visible.</td></tr>
                            <tr><td><code>onShow / onHide</code></td><td><code>output</code></td><td><code>—</code></td><td>Emitted when the dialog shows / hides.</td></tr>
                            <tr><td><code>onMaximize</code></td><td><code>output&lt;boolean&gt;</code></td><td><code>—</code></td><td>Emitted when the maximized state changes.</td></tr>
                            <tr><td><code>[czDialogHeader]</code></td><td><code>slot</code></td><td><code>—</code></td><td>Custom header content.</td></tr>
                            <tr><td><code>[czDialogFooter]</code></td><td><code>slot</code></td><td><code>—</code></td><td>Footer content (rendered only when provided).</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Overlay z-index: a number overrides it, <code>'none'</code> keeps it in normal flow, <code>null</code> = theme default (above everything).</td></tr>
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

        <cz-dialog [visible]="features()" header="Draggable & resizable" [draggable]="true" [resizable]="true"
            [maximizable]="true" [breakpoints]="featuresBreakpoints" width="34rem" (onHide)="features.set(false)">
            <p class="cz-mb-md">
                Drag me by the header, resize me from the bottom-right corner or use the maximize action.
            </p>
            <cz-input-text label="Quick note" labelPosition="float" />
            <div czDialogFooter class="cz-flex cz-gap-sm cz-justify-end">
                <cz-button label="Cancel" severity="secondary" variant="text" (onClick)="features.set(false)" />
                <cz-button label="Save" (onClick)="features.set(false)" />
            </div>
        </cz-dialog>

        <cz-dialog dialogId="service-demo" header="Opened through CzDialogService" [maximizable]="true">
            <p class="cz-mb-md">
                This dialog has no <code>visible</code> binding: it is controlled by id from anywhere in the app.
            </p>
            <div czDialogFooter>
                <cz-button label="Close" (onClick)="dialogs.close('service-demo')" />
            </div>
        </cz-dialog>
    `,
})
export class DialogDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => DIALOG_DOC_I18N[this.lang.currentLang()] || DIALOG_DOC_I18N.es);

    readonly dialogs = inject(CzDialogService);

    readonly visible = signal(false);
    readonly positioned = signal(false);
    readonly position = signal<'topright' | 'bottomleft'>('topright');
    readonly dismissable = signal(false);
    readonly noClose = signal(false);
    readonly features = signal(false);

    readonly featuresBreakpoints = { '1199px': '80vw', '640px': '95vw' };

    openPositioned(position: 'topright' | 'bottomleft'): void {
        this.position.set(position);
        this.positioned.set(true);
    }

    importCode: Code = {
        typescript: `import { CzDialogComponent, CzDialogService } from 'codezium-ui';`,
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

    featuresCode: Code = {
        html: `<cz-dialog
    [visible]="visible()"
    header="Draggable & resizable"
    [draggable]="true"
    [resizable]="true"
    [maximizable]="true"
    [breakpoints]="{ '1199px': '80vw', '640px': '95vw' }"
>
    <p>Drag me by the header or resize me from the corner.</p>

    <div czDialogFooter>
        <cz-button label="Cancel" severity="secondary" (onClick)="visible.set(false)" />
        <cz-button label="Save" (onClick)="visible.set(false)" />
    </div>
</cz-dialog>`,
    };

    serviceCode: Code = {
        html: `<cz-dialog dialogId="profile" header="Edit profile">…</cz-dialog>`,
        typescript: `private readonly dialogs = inject(CzDialogService);

this.dialogs.open('profile');
this.dialogs.close('profile');
this.dialogs.toggle('profile');
this.dialogs.closeAll();`,
    };
}
