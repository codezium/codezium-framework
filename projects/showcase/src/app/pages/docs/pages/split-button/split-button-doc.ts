import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzMenuItem, CzSplitButtonComponent } from 'codezium-ui';
import { LucideSave, LucideTrash, LucideUpload } from '@lucide/angular';
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
                    <cz-split-button label="Save" [icon]="SaveIcon" [items]="items" (onClick)="clicks.set(clicks() + 1)" (onItemSelect)="last.set($event)" />
                    <span class="cz-text-sm">Default clicks: {{ clicks() }} · Last item: {{ last()?.label || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-split-button label="Primary" [items]="items" severity="primary" />
                    <cz-split-button label="Success" [items]="items" severity="success" size="lg" />
                    <cz-split-button label="Danger" [items]="items" severity="danger" size="sm" />
                    <cz-split-button label="Disabled" [items]="items" [disabled]="true" />
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
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Default action label.</td></tr>
                            <tr><td><code>icon</code></td><td><code>LucideIconInput</code></td><td><code>null</code></td><td>Default action icon.</td></tr>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'primary'</code></td><td>Color of both buttons.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Button size.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Blocks both actions.</td></tr>
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Dropdown commands.</td></tr>
                            <tr><td><code>onClick</code></td><td><code>output&lt;MouseEvent&gt;</code></td><td>-</td><td>Default action click.</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td>-</td><td>Dropdown item selected.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class SplitButtonDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => SPLIT_BUTTON_DOC_I18N[this.lang.currentLang()] || SPLIT_BUTTON_DOC_I18N.es);

    readonly SaveIcon = LucideSave;
    readonly clicks = signal(0);
    readonly last = signal<CzMenuItem | null>(null);

    readonly items: CzMenuItem[] = [
        { label: 'Save as draft', icon: LucideSave },
        { label: 'Publish', icon: LucideUpload },
        { separator: true },
        { label: 'Delete', icon: LucideTrash, disabled: true },
    ];

    importCode: Code = {
        typescript: `import { CzSplitButtonComponent, CzMenuItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-split-button label="Save" [icon]="SaveIcon" [items]="items" (onClick)="save()" (onItemSelect)="onSelect($event)" />`,
        typescript: `items: CzMenuItem[] = [
    { label: 'Save as draft', icon: LucideSave, command: () => this.saveDraft() },
    { label: 'Publish', icon: LucideUpload, command: () => this.publish() },
];`,
    };

    optionsCode: Code = {
        html: `<cz-split-button label="Success" [items]="items" severity="success" size="lg" />
<cz-split-button label="Disabled" [items]="items" [disabled]="true" />`,
    };
}
