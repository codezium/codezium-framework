import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzMenubarComponent, CzMenuItem } from 'codezium-ui';
import { LucideFilePlus, LucideHelpCircle, LucideSave } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { MENUBAR_DOC_I18N } from './menubar-doc.i18n';

@Component({
    selector: 'cz-menubar-doc-page',
    imports: [CzMenubarComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="menubar">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-menubar [items]="items" (onItemSelect)="last.set($event)" />
                    <span class="cz-text-sm">Last command: {{ last()?.label || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Root items with optional dropdown children.</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td>-</td><td>Emitted when a leaf item is activated.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class MenubarDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => MENUBAR_DOC_I18N[this.lang.currentLang()] || MENUBAR_DOC_I18N.es);

    readonly last = signal<CzMenuItem | null>(null);

    readonly items: CzMenuItem[] = [
        {
            label: 'File',
            items: [
                { label: 'New', icon: LucideFilePlus },
                { label: 'Save', icon: LucideSave, badge: '⌘S' },
                { separator: true },
                { label: 'Exit' },
            ],
        },
        { label: 'Help', icon: LucideHelpCircle },
    ];

    importCode: Code = {
        typescript: `import { CzMenubarComponent, CzMenuItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-menubar [items]="items" (onItemSelect)="onSelect($event)" />`,
        typescript: `items: CzMenuItem[] = [
    {
        label: 'File',
        items: [
            { label: 'New', icon: LucideFilePlus, command: () => this.newFile() },
            { label: 'Save', icon: LucideSave, badge: '⌘S' },
        ],
    },
    { label: 'Help', icon: LucideHelpCircle, command: () => this.openHelp() },
];`,
    };
}
