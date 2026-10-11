import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzDockComponent, CzMenuItem } from 'codezium-ui';
import { LucideFolder, LucideHouse, LucideMail, LucideSettings } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { DOCK_DOC_I18N } from './dock-doc.i18n';

@Component({
    selector: 'cz-dock-doc-page',
    imports: [CzDockComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="dock">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md cz-items-start">
                    <cz-dock [items]="items" (onItemSelect)="last.set($event)" />
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
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Flat items with icon, label and command.</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td>-</td><td>Emitted when an item is activated.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class DockDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => DOCK_DOC_I18N[this.lang.currentLang()] || DOCK_DOC_I18N.es);

    readonly last = signal<CzMenuItem | null>(null);

    readonly items: CzMenuItem[] = [
        { label: 'Home', icon: LucideHouse },
        { label: 'Files', icon: LucideFolder },
        { label: 'Mail', icon: LucideMail },
        { label: 'Settings', icon: LucideSettings, disabled: true },
    ];

    importCode: Code = {
        typescript: `import { CzDockComponent, CzMenuItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-dock [items]="items" (onItemSelect)="onSelect($event)" />`,
        typescript: `items: CzMenuItem[] = [
    { label: 'Home', icon: LucideHouse, command: () => this.goHome() },
    { label: 'Files', icon: LucideFolder, command: () => this.openFiles() },
    { label: 'Settings', icon: LucideSettings, disabled: true },
];`,
    };
}
