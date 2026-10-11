import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzMenuComponent, CzMenuItem } from 'codezium-ui';
import { LucideFilePlus, LucideFolderOpen, LucideSave } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { MENU_DOC_I18N } from './menu-doc.i18n';

@Component({
    selector: 'cz-menu-doc-page',
    imports: [CzMenuComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="menu">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md" style="max-width: 16rem;">
                    <cz-menu [items]="items" (onItemSelect)="last.set($event)" />
                    <span class="cz-text-sm">Last command: {{ last()?.label || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md" style="max-width: 16rem;">
                    <cz-menu [items]="nestedItems" />
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
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Menu items (label, icon, command, items, separator, disabled, badge).</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td>-</td><td>Emitted when a leaf item is activated.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class MenuDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => MENU_DOC_I18N[this.lang.currentLang()] || MENU_DOC_I18N.es);

    readonly last = signal<CzMenuItem | null>(null);

    readonly items: CzMenuItem[] = [
        { label: 'New file', icon: LucideFilePlus },
        { label: 'Open', icon: LucideFolderOpen },
        { separator: true },
        { label: 'Save', icon: LucideSave, badge: '⌘S' },
        { label: 'Delete', disabled: true },
    ];

    readonly nestedItems: CzMenuItem[] = [
        { label: 'New' },
        {
            label: 'Export',
            items: [
                { label: 'PDF' },
                { label: 'CSV', disabled: true },
            ],
        },
    ];

    importCode: Code = {
        typescript: `import { CzMenuComponent, CzMenuItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-menu [items]="items" (onItemSelect)="onSelect($event)" />`,
        typescript: `items: CzMenuItem[] = [
    { label: 'New file', icon: LucideFilePlus, command: () => this.newFile() },
    { separator: true },
    { label: 'Save', icon: LucideSave, badge: '⌘S' },
];`,
    };

    optionsCode: Code = {
        html: `<cz-menu [items]="nestedItems" />`,
        typescript: `nestedItems: CzMenuItem[] = [
    { label: 'New' },
    {
        label: 'Export',
        items: [
            { label: 'PDF' },
            { label: 'CSV', disabled: true },
        ],
    },
];`,
    };
}
