import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzTreeComponent, CzTreeNode } from 'codezium-ui';
import { LucideFolder, LucideImage } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TREE_DOC_I18N } from './tree-doc.i18n';

@Component({
    selector: 'cz-tree-doc-page',
    imports: [CzTreeComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="tree">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-tree [options]="nodes" (onNodeSelect)="selected.set($event)" />
                    <span class="cz-text-sm">Selected: {{ selected()?.label || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <cz-tree [options]="nodes" selectionMode="none" />
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
                            <tr><td><code>options</code></td><td><code>CzTreeNode[]</code></td><td><code>[]</code></td><td>Hierarchical nodes (label, value, icon, children).</td></tr>
                            <tr><td><code>selectionMode</code></td><td><code>'none' | 'single'</code></td><td><code>'single'</code></td><td>Selection mode.</td></tr>
                            <tr><td><code>onNodeSelect</code></td><td><code>output&lt;CzTreeNode&gt;</code></td><td>-</td><td>Emitted when a node is selected.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TreeDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TREE_DOC_I18N[this.lang.currentLang()] || TREE_DOC_I18N.es);

    readonly nodes: CzTreeNode[] = [
        {
            label: 'Documents',
            icon: LucideFolder,
            children: [
                { label: 'Work' },
                {
                    label: 'Projects',
                    children: [{ label: 'Design System' }, { label: 'Marketing' }],
                },
            ],
        },
        {
            label: 'Photos',
            icon: LucideImage,
            children: [{ label: 'Vacation' }, { label: 'Family' }],
        },
    ];

    readonly selected = signal<CzTreeNode | null>(null);

    importCode: Code = {
        typescript: `import { CzTreeComponent, CzTreeNode } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-tree [options]="nodes" (onNodeSelect)="onSelect($event)" />`,
        typescript: `nodes: CzTreeNode[] = [
    {
        label: 'Documents',
        children: [
            { label: 'Work' },
            { label: 'Projects', children: [{ label: 'Design System' }] },
        ],
    },
];`,
    };

    optionsCode: Code = {
        html: `<cz-tree [options]="nodes" selectionMode="none" />`,
    };
}
