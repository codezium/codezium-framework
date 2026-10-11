import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzMenuItem, CzSplitButtonComponent, CzToastService } from 'codezium-ui';
import {
    LucideCopy,
    LucideDownload,
    LucidePencil,
    LucideSave,
    LucideShare2,
    LucideTrash,
    LucideUpload,
} from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SPLIT_BUTTON_DOC_I18N } from './split-button-doc.i18n';

@Component({
    selector: 'cz-split-button-doc-page',
    imports: [CzSplitButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="split-button">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-split-button label="Save" [icon]="SaveIcon" [items]="items" (onClick)="onDefault()"
                        (onItemSelect)="onSelect($event)" />
                    <span class="cz-text-sm">Default clicks: {{ clicks() }} · Last item: {{ last()?.label || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="severities">{{ t().severities }}</h2>
                <p [innerHTML]="t().severitiesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-split-button label="Primary" [items]="items" severity="primary" />
                    <cz-split-button label="Secondary" [items]="items" severity="secondary" />
                    <cz-split-button label="Success" [items]="items" severity="success" />
                    <cz-split-button label="Info" [items]="items" severity="info" />
                    <cz-split-button label="Warning" [items]="items" severity="warning" />
                    <cz-split-button label="Danger" [items]="items" severity="danger" />
                    <cz-split-button label="Dark" [items]="items" severity="dark" />
                </div>
                <app-code [code]="severitiesCode" />
            </section>

            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p [innerHTML]="t().sizesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-split-button label="Small" [items]="items" size="sm" />
                    <cz-split-button label="Medium" [items]="items" size="md" />
                    <cz-split-button label="Large" [items]="items" size="lg" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <section>
                <h2 id="icons">{{ t().icons }}</h2>
                <p [innerHTML]="t().iconsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-split-button label="Download" [icon]="DownloadIcon" [items]="items" severity="info" />
                    <cz-split-button label="Share" [icon]="ShareIcon" [items]="items" severity="secondary" />
                </div>
                <app-code [code]="iconsCode" />
            </section>

            <section>
                <h2 id="disabled">{{ t().disabledTitle }}</h2>
                <p [innerHTML]="t().disabledDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-split-button label="Disabled" [icon]="SaveIcon" [items]="items" [disabled]="true" />
                </div>
                <app-code [code]="disabledCode" />
            </section>

            <section>
                <h2 id="menu">{{ t().menu }}</h2>
                <p [innerHTML]="t().menuDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-split-button label="Document" [items]="richItems" severity="primary" (onItemSelect)="onSelect($event)" />
                </div>
                <app-code [code]="menuCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Default action label.</td></tr>
                            <tr><td><code>icon</code></td><td><code>LucideIconInput</code></td><td><code>null</code></td><td>Default action icon.</td></tr>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'primary'</code></td><td>Color of both buttons.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Button size.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Blocks the default action and the dropdown.</td></tr>
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Dropdown commands (label, icon, command, disabled, separator).</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Overlay z-index: a number overrides it, <code>'none'</code> keeps it in normal flow, <code>null</code> = theme default (above everything).</td></tr>
                            <tr><td><code>onClick</code></td><td><code>output&lt;MouseEvent&gt;</code></td><td><code>—</code></td><td>Emitted when the default action is clicked.</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td><code>—</code></td><td>Emitted when a dropdown item is selected.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class SplitButtonDocPage {
    private readonly lang = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => SPLIT_BUTTON_DOC_I18N[this.lang.currentLang()] || SPLIT_BUTTON_DOC_I18N.es);

    readonly SaveIcon = LucideSave;
    readonly DownloadIcon = LucideDownload;
    readonly ShareIcon = LucideShare2;

    readonly clicks = signal(0);
    readonly last = signal<CzMenuItem | null>(null);

    readonly items: CzMenuItem[] = [
        { label: 'Save as draft', icon: LucideSave },
        { label: 'Publish', icon: LucideUpload },
        { separator: true },
        { label: 'Delete', icon: LucideTrash, disabled: true },
    ];

    readonly richItems: CzMenuItem[] = [
        { label: 'Rename', icon: LucidePencil, command: () => this.toast.info('Renamed', 'Document') },
        { label: 'Duplicate', icon: LucideCopy, command: () => this.toast.info('Duplicated', 'Document') },
        { label: 'Download', icon: LucideDownload, command: () => this.toast.success('Downloading…', 'Document') },
        { separator: true },
        { label: 'Delete', icon: LucideTrash, disabled: true },
    ];

    onDefault(): void {
        this.clicks.update(value => value + 1);
        this.toast.success('Saved', 'SplitButton');
    }

    onSelect(item: CzMenuItem): void {
        this.last.set(item);
    }

    importCode: Code = {
        typescript: `import { CzSplitButtonComponent, CzMenuItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-split-button
    label="Save"
    [icon]="SaveIcon"
    [items]="items"
    (onClick)="save()"
    (onItemSelect)="onSelect($event)"
/>`,
        typescript: `items: CzMenuItem[] = [
    { label: 'Save as draft', icon: LucideSave, command: () => this.saveDraft() },
    { label: 'Publish', icon: LucideUpload, command: () => this.publish() },
    { separator: true },
    { label: 'Delete', icon: LucideTrash, disabled: true },
];`,
    };

    severitiesCode: Code = {
        html: `<cz-split-button label="Primary" [items]="items" severity="primary" />
<cz-split-button label="Secondary" [items]="items" severity="secondary" />
<cz-split-button label="Success" [items]="items" severity="success" />
<cz-split-button label="Info" [items]="items" severity="info" />
<cz-split-button label="Warning" [items]="items" severity="warning" />
<cz-split-button label="Danger" [items]="items" severity="danger" />
<cz-split-button label="Dark" [items]="items" severity="dark" />`,
    };

    sizesCode: Code = {
        html: `<cz-split-button label="Small" [items]="items" size="sm" />
<cz-split-button label="Medium" [items]="items" size="md" />
<cz-split-button label="Large" [items]="items" size="lg" />`,
    };

    iconsCode: Code = {
        html: `<cz-split-button label="Download" [icon]="DownloadIcon" [items]="items" severity="info" />
<cz-split-button label="Share" [icon]="ShareIcon" [items]="items" severity="secondary" />`,
    };

    disabledCode: Code = {
        html: `<cz-split-button label="Disabled" [icon]="SaveIcon" [items]="items" [disabled]="true" />`,
    };

    menuCode: Code = {
        html: `<cz-split-button label="Document" [items]="items" (onItemSelect)="onSelect($event)" />`,
        typescript: `items: CzMenuItem[] = [
    { label: 'Rename', icon: LucidePencil, command: () => this.rename() },
    { label: 'Duplicate', icon: LucideCopy, command: () => this.duplicate() },
    { label: 'Download', icon: LucideDownload, command: () => this.download() },
    { separator: true },
    { label: 'Delete', icon: LucideTrash, disabled: true },
];`,
    };
}
