import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzTreeTableColumn, CzTreeTableComponent, CzTreeTableNode } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TREE_TABLE_DOC_I18N } from './tree-table-doc.i18n';

@Component({
    selector: 'cz-tree-table-doc-page',
    imports: [CzTreeTableComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="tree-table">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="columns" [value]="nodes" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="columns" [value]="nodes" />
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
                            <tr><td><code>columns</code></td><td><code>CzTreeTableColumn[]</code></td><td><code>[]</code></td><td>Column definitions.</td></tr>
                            <tr><td><code>value</code></td><td><code>CzTreeTableNode[]</code></td><td><code>[]</code></td><td>Hierarchical nodes (data + children).</td></tr>
                            <tr><td><code>emptyMessage</code></td><td><code>string</code></td><td><code>'No records found'</code></td><td>Message when there are no nodes.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TreeTableDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TREE_TABLE_DOC_I18N[this.lang.currentLang()] || TREE_TABLE_DOC_I18N.es);

    readonly columns: CzTreeTableColumn[] = [
        { field: 'name', header: 'Name' },
        { field: 'size', header: 'Size' },
        { field: 'type', header: 'Type' },
    ];

    readonly nodes: CzTreeTableNode[] = [
        {
            data: { name: 'Documents', size: '75kb', type: 'Folder' },
            children: [
                { data: { name: 'Work', size: '55kb', type: 'Folder' } },
                { data: { name: 'Expenses.doc', size: '30kb', type: 'Document' } },
            ],
        },
        {
            data: { name: 'Photos', size: '150kb', type: 'Folder' },
            children: [{ data: { name: 'Mountain.jpg', size: '90kb', type: 'Image' } }],
        },
    ];

    importCode: Code = {
        typescript: `import { CzTreeTableComponent, CzTreeTableColumn, CzTreeTableNode } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-tree-table [columns]="columns" [value]="nodes" />`,
        typescript: `columns: CzTreeTableColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'size', header: 'Size' },
];

nodes: CzTreeTableNode[] = [
    {
        data: { name: 'Documents', size: '75kb' },
        children: [{ data: { name: 'Work', size: '55kb' } }],
    },
];`,
    };

    optionsCode: Code = {
        html: `<!-- Click the chevron to expand nested rows -->
<cz-tree-table [columns]="columns" [value]="nodes" />`,
    };
}
