import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzContextMenuComponent, CzMenuItem } from 'codezium-ui';
import { LucideClipboard, LucidePencil, LucideTrash } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { CONTEXT_MENU_DOC_I18N } from './context-menu-doc.i18n';

@Component({
    selector: 'cz-context-menu-doc-page',
    imports: [CzContextMenuComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="context-menu">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-context-menu [items]="items" (onItemSelect)="last.set($event)">
                        <div class="cz-p-xl cz-border cz-rounded-lg cz-text-center">
                            Right click this area
                        </div>
                    </cz-context-menu>
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
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Menu items (label, icon, command, separator, disabled).</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td>-</td><td>Emitted when a leaf item is activated.</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Overlay z-index: a number overrides it, <code>'none'</code> keeps it in normal flow, <code>null</code> = theme default (above everything).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ContextMenuDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => CONTEXT_MENU_DOC_I18N[this.lang.currentLang()] || CONTEXT_MENU_DOC_I18N.es);

    readonly last = signal<CzMenuItem | null>(null);

    readonly items: CzMenuItem[] = [
        { label: 'Copy', icon: LucideClipboard },
        { label: 'Rename', icon: LucidePencil },
        { separator: true },
        { label: 'Delete', icon: LucideTrash, disabled: true },
    ];

    importCode: Code = {
        typescript: `import { CzContextMenuComponent, CzMenuItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-context-menu [items]="items" (onItemSelect)="onSelect($event)">
    <div class="target">Right click this area</div>
</cz-context-menu>`,
        typescript: `items: CzMenuItem[] = [
    { label: 'Copy', icon: LucideClipboard, command: () => this.copy() },
    { label: 'Rename', icon: LucidePencil, command: () => this.rename() },
    { separator: true },
    { label: 'Delete', icon: LucideTrash, disabled: true },
];`,
    };
}
