import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzMenuItem, CzSidebarComponent } from 'codezium-ui';
import { LucideHouse, LucideSettings, LucideUser } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SIDEBAR_DOC_I18N } from './sidebar-doc.i18n';

@Component({
    selector: 'cz-sidebar-doc-page',
    imports: [CzSidebarComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="sidebar">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md" style="height: 20rem;">
                    <cz-sidebar header="Codezium" [items]="items" (onItemSelect)="last.set($event)" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md" style="height: 20rem;">
                    <cz-sidebar header="Mini" [items]="items" [(collapsed)]="collapsed" />
                    <span class="cz-text-sm">Collapsed: {{ collapsed() }}</span>
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
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Navigation items with optional children.</td></tr>
                            <tr><td><code>header</code></td><td><code>string</code></td><td><code>''</code></td><td>Sidebar title.</td></tr>
                            <tr><td><code>collapsed</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Mini mode (two-way).</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td>-</td><td>Emitted when a leaf item is activated.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class SidebarDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => SIDEBAR_DOC_I18N[this.lang.currentLang()] || SIDEBAR_DOC_I18N.es);

    readonly last = signal<CzMenuItem | null>(null);
    readonly collapsed = signal(false);

    readonly items: CzMenuItem[] = [
        { label: 'Dashboard', icon: LucideHouse },
        { label: 'Users', icon: LucideUser, badge: '12' },
        {
            label: 'Settings',
            icon: LucideSettings,
            items: [{ label: 'Profile' }, { label: 'Billing' }],
        },
    ];

    importCode: Code = {
        typescript: `import { CzSidebarComponent, CzMenuItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-sidebar header="Codezium" [items]="items" (onItemSelect)="onSelect($event)" />`,
        typescript: `items: CzMenuItem[] = [
    { label: 'Dashboard', icon: LucideHouse, command: () => this.goDashboard() },
    {
        label: 'Settings',
        icon: LucideSettings,
        items: [{ label: 'Profile' }, { label: 'Billing' }],
    },
];`,
    };

    optionsCode: Code = {
        html: `<cz-sidebar header="Mini" [items]="items" [(collapsed)]="collapsed" />`,
        typescript: `collapsed = signal(false);`,
    };
}
