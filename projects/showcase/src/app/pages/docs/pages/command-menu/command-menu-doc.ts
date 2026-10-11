import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzButtonComponent, CzCommandMenuComponent, CzMenuItem } from 'codezium-ui';
import { LucideFilePlus, LucideFolderOpen, LucideMoon, LucideSettings } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { COMMAND_MENU_DOC_I18N } from './command-menu-doc.i18n';

@Component({
    selector: 'cz-command-menu-doc-page',
    imports: [CzCommandMenuComponent, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="command-menu">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-button label="Open command menu" (onClick)="menu.open()" />
                    <span class="cz-text-sm">Last command: {{ last()?.label || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Try the palette" severity="secondary" (onClick)="menu.open()" />
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
                            <tr><td><code>visible</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Palette visibility (two-way).</td></tr>
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Commands (label, icon, command, badge).</td></tr>
                            <tr><td><code>open()</code> / <code>close()</code></td><td><code>methods</code></td><td>-</td><td>Control the palette programmatically.</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td>-</td><td>Emitted when a command is selected.</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Overlay z-index: a number overrides it, <code>'none'</code> keeps it in normal flow, <code>null</code> = theme default (above everything).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>

        <cz-command-menu #menu [items]="items" (onItemSelect)="last.set($event)" />
    `,
})
export class CommandMenuDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => COMMAND_MENU_DOC_I18N[this.lang.currentLang()] || COMMAND_MENU_DOC_I18N.es);

    readonly last = signal<CzMenuItem | null>(null);

    readonly items: CzMenuItem[] = [
        { label: 'New file', icon: LucideFilePlus, badge: '⌘N' },
        { label: 'Open folder', icon: LucideFolderOpen, badge: '⌘O' },
        { label: 'Toggle dark mode', icon: LucideMoon },
        { label: 'Preferences', icon: LucideSettings, badge: '⌘,' },
    ];

    importCode: Code = {
        typescript: `import { CzCommandMenuComponent, CzMenuItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-command-menu #menu [items]="items" (onItemSelect)="onSelect($event)" />`,
        typescript: `items: CzMenuItem[] = [
    { label: 'New file', icon: LucideFilePlus, badge: '⌘N', command: () => this.newFile() },
    { label: 'Preferences', icon: LucideSettings, badge: '⌘,' },
];

// Open it from anywhere:
this.menu.open();`,
    };

    optionsCode: Code = {
        html: `<cz-button label="Try the palette" (onClick)="menu.open()" />`,
        typescript: `// Inside the palette: type to filter, ↑/↓ to navigate, Enter to run, Escape to close`,
    };
}
