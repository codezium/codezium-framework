import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzMenuItem, CzTieredMenuComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TIERED_MENU_DOC_I18N } from './tiered-menu-doc.i18n';

@Component({
    selector: 'cz-tiered-menu-doc-page',
    imports: [CzTieredMenuComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="tiered-menu">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-gap-lg cz-mb-md">
                    <cz-tiered-menu [items]="items" (onItemSelect)="last.set($event)" />
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
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Nested menu items.</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td>-</td><td>Emitted when a leaf item is activated.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TieredMenuDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TIERED_MENU_DOC_I18N[this.lang.currentLang()] || TIERED_MENU_DOC_I18N.es);

    readonly last = signal<CzMenuItem | null>(null);

    readonly items: CzMenuItem[] = [
        { label: 'View' },
        {
            label: 'Share',
            items: [
                { label: 'Email' },
                {
                    label: 'Social',
                    items: [{ label: 'Twitter' }, { label: 'LinkedIn' }],
                },
            ],
        },
        { separator: true },
        { label: 'Delete', disabled: true },
    ];

    importCode: Code = {
        typescript: `import { CzTieredMenuComponent, CzMenuItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-tiered-menu [items]="items" (onItemSelect)="onSelect($event)" />`,
        typescript: `items: CzMenuItem[] = [
    { label: 'View', command: () => this.view() },
    {
        label: 'Share',
        items: [
            { label: 'Email' },
            { label: 'Social', items: [{ label: 'Twitter' }] },
        ],
    },
];`,
    };
}
