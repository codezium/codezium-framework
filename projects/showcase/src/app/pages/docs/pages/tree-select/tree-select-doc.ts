import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzTreeSelectComponent, CzTreeSelectOption } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TREE_SELECT_DOC_I18N } from './tree-select-doc.i18n';

@Component({
    selector: 'cz-tree-select-doc-page',
    imports: [CzTreeSelectComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="tree-select">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md" style="max-width: 22rem;">
                    <cz-tree-select [options]="files" [(ngModel)]="selected" placeholder="Select a node" ariaLabel="Select a node" />
                    <span class="cz-text-sm">Value: {{ selected() ?? '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md" style="max-width: 22rem;">
                    <cz-tree-select [options]="files" [clearable]="true" [(ngModel)]="selected" placeholder="Clearable" />
                    <cz-tree-select [options]="files" [(ngModel)]="selected" size="sm" placeholder="Small" />
                    <cz-tree-select [options]="files" [disabled]="true" [(ngModel)]="selected" placeholder="Disabled" />
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
                            <tr><td><code>options</code></td><td><code>CzTreeSelectOption[]</code></td><td><code>[]</code></td><td>Hierarchical options.</td></tr>
                            <tr><td><code>optionLabel</code></td><td><code>string</code></td><td><code>'label'</code></td><td>Property used as label.</td></tr>
                            <tr><td><code>optionValue</code></td><td><code>string</code></td><td><code>'value'</code></td><td>Property used as value.</td></tr>
                            <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the clear button.</td></tr>
                            <tr><td><code>onChange</code></td><td><code>output&lt;&#123; value, originalEvent &#125;&gt;</code></td><td>-</td><td>Emitted on value change.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TreeSelectDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TREE_SELECT_DOC_I18N[this.lang.currentLang()] || TREE_SELECT_DOC_I18N.es);

    readonly files: CzTreeSelectOption[] = [
        {
            label: 'Documents',
            value: 'docs',
            children: [
                { label: 'Work', value: 'work' },
                {
                    label: 'Projects',
                    value: 'projects',
                    children: [
                        { label: 'Design System', value: 'ds' },
                        { label: 'Marketing', value: 'mkt' },
                    ],
                },
            ],
        },
        {
            label: 'Photos',
            value: 'photos',
            children: [
                { label: 'Vacation', value: 'vacation' },
                { label: 'Family', value: 'family' },
            ],
        },
    ];

    readonly selected = signal<string | null>('work');

    importCode: Code = {
        typescript: `import { CzTreeSelectComponent, CzTreeSelectOption } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-tree-select [options]="files" [(ngModel)]="selected" placeholder="Select a node" />`,
        typescript: `files: CzTreeSelectOption[] = [
    {
        label: 'Documents',
        value: 'docs',
        children: [
            { label: 'Work', value: 'work' },
        ],
    },
];
selected = signal<string | null>(null);`,
    };

    optionsCode: Code = {
        html: `<cz-tree-select [options]="files" [clearable]="true" [(ngModel)]="selected" />
<cz-tree-select [options]="files" size="sm" [(ngModel)]="selected" />
<cz-tree-select [options]="files" [disabled]="true" [(ngModel)]="selected" />`,
    };
}
