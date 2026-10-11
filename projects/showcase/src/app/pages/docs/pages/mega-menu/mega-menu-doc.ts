import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzMegaMenuComponent, CzMenuItem } from 'codezium-ui';
import { LucideCloud, LucideCode, LucideTerminal } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { MEGA_MENU_DOC_I18N } from './mega-menu-doc.i18n';

@Component({
    selector: 'cz-mega-menu-doc-page',
    imports: [CzMegaMenuComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="mega-menu">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-mega-menu [items]="items" (onItemSelect)="last.set($event)" />
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
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Root items; children grouped by <code>group</code>.</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td>-</td><td>Emitted when a leaf item is activated.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class MegaMenuDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => MEGA_MENU_DOC_I18N[this.lang.currentLang()] || MEGA_MENU_DOC_I18N.es);

    readonly last = signal<CzMenuItem | null>(null);

    readonly items: CzMenuItem[] = [
        {
            label: 'Products',
            items: [
                { label: 'Editor', group: 'Tools', icon: LucideCode },
                { label: 'Terminal', group: 'Tools', icon: LucideTerminal },
                { label: 'Cloud', group: 'Services', icon: LucideCloud },
                { label: 'Hosting', group: 'Services' },
            ],
        },
        { label: 'Docs' },
    ];

    importCode: Code = {
        typescript: `import { CzMegaMenuComponent, CzMenuItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-mega-menu [items]="items" (onItemSelect)="onSelect($event)" />`,
        typescript: `items: CzMenuItem[] = [
    {
        label: 'Products',
        items: [
            { label: 'Editor', group: 'Tools', icon: LucideCode },
            { label: 'Cloud', group: 'Services', icon: LucideCloud },
        ],
    },
    { label: 'Docs' },
];`,
    };
}
