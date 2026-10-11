import { ChangeDetectionStrategy, Component, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    CzAvatarComponent,
    CzButtonComponent,
    CzIconComponent,
    CzMenuItem,
    CzSelectButtonComponent,
    CzTagComponent,
    CzTreeTableColumn,
    CzTreeTableComponent,
    CzTreeTableNode,
    CzToastService,
} from 'codezium-ui';
import { LucideCopy, LucidePencil, LucideStar, LucideTrash } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TREE_TABLE_DOC_I18N } from './tree-table-doc.i18n';

@Component({
    selector: 'cz-tree-table-doc-page',
    imports: [
        FormsModule,
        CzTreeTableComponent,
        CzAvatarComponent,
        CzTagComponent,
        CzButtonComponent,
        CzIconComponent,
        CzSelectButtonComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="tree-table">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="basicColumns" [value]="productTree" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── EXPANSION ── -->
            <section>
                <h2 id="expansion">{{ t().expansion }}</h2>
                <p [innerHTML]="t().expansionDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-button [label]="t().expandAll" size="sm" (onClick)="expandAll()" />
                    <cz-button [label]="t().collapseAll" size="sm" variant="outlined" (onClick)="collapseAll()" />
                    <span class="cz-text-sm">{{ t().lastEvent }}: {{ lastNodeEvent() || '-' }}</span>
                </div>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="basicColumns" [value]="productTree" dataKey="name"
                        [expandedKeys]="expandedKeys()" (expandedKeysChange)="expandedKeys.set($event)"
                        (onNodeExpand)="lastNodeEvent.set('expand: ' + $event.data['name'])"
                        (onNodeCollapse)="lastNodeEvent.set('collapse: ' + $event.data['name'])" />
                </div>
                <app-code [code]="expansionCode" />
            </section>

            <!-- ── SORTING ── -->
            <section>
                <h2 id="sorting">{{ t().sorting }}</h2>
                <p [innerHTML]="t().sortingDesc"></p>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="basicColumns" [value]="productTree" [sortable]="true" dataKey="name"
                        (onSort)="lastSort.set($event.field + ' ' + $event.order)" />
                    <span class="cz-text-sm">{{ t().lastSort }}: {{ lastSort() || '-' }}</span>
                </div>
                <app-code [code]="sortingCode" />
            </section>

            <!-- ── FILTERING ── -->
            <section>
                <h2 id="filtering">{{ t().filtering }}</h2>
                <p [innerHTML]="t().filteringDesc"></p>
                <div class="cz-mb-md">
                    <div class="cz-mb-sm" style="max-width: 20rem;">
                        <input type="text" class="cz-w-full cz-p-sm cz-border cz-rounded-md cz-bg-surface cz-text-primary"
                            [placeholder]="t().searchPlaceholder" [value]="filter()"
                            (input)="filter.set($any($event.target).value)" />
                    </div>
                    <cz-tree-table [columns]="basicColumns" [value]="productTree" dataKey="name"
                        [globalFilter]="filter()" [filterFields]="['name', 'category']" />
                </div>
                <app-code [code]="filteringCode" />
            </section>

            <!-- ── SELECTION ── -->
            <section>
                <h2 id="selection">{{ t().selection }}</h2>
                <p [innerHTML]="t().selectionDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <div>
                        <cz-tree-table [columns]="basicColumns" [value]="productTree" dataKey="name"
                            selectionMode="single" (onRowSelect)="lastSelected.set($event.data['name'])" />
                        <span class="cz-text-sm">{{ t().selected }}: {{ lastSelected() || '-' }}</span>
                    </div>
                    <div>
                        <cz-tree-table [columns]="productColumns()" [value]="productTree" dataKey="name"
                            selectionMode="multiple" [selection]="selectedNodes()"
                            (onSelectionChange)="selectedNodes.set($event)" />
                        <span class="cz-text-sm">{{ t().selectedCount }}: {{ selectedNodes().length }}</span>
                    </div>
                </div>
                <app-code [code]="selectionCode" />
            </section>

            <!-- ── CELL TEMPLATES (avatar / image) ── -->
            <section>
                <h2 id="templates">{{ t().templates }}</h2>
                <p [innerHTML]="t().templatesDesc"></p>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="productColumns()" [value]="productTree" dataKey="name" [sortable]="true"
                        [striped]="true" />
                </div>
                <app-code [code]="templatesCode" />

                <ng-template #imageTpl let-row>
                    @if (row.image) {
                        <cz-avatar [image]="row.image" shape="circle" size="sm" [ariaLabel]="row.name" />
                    } @else {
                        <cz-avatar [label]="row.name.charAt(0)" shape="circle" size="sm" />
                    }
                </ng-template>

                <ng-template #nameTpl let-row let-node="node">
                    @if (node.children?.length) {
                        <strong>{{ row.name }}</strong>
                    } @else {
                        <span>{{ row.name }}</span>
                    }
                </ng-template>

                <ng-template #priceTpl let-value="value">
                    @if (value != null) {
                        <span class="cz-font-semibold">\${{ value }}</span>
                    } @else {
                        <span class="cz-text-muted">—</span>
                    }
                </ng-template>

                <ng-template #statusTpl let-row>
                    @if (row.status) {
                        <cz-tag [value]="statusLabel(row.status)" [severity]="statusSeverity(row.status)" size="sm" />
                    }
                </ng-template>
            </section>

            <!-- ── ROW TEMPLATE ── -->
            <section>
                <h2 id="row-template">{{ t().rowTemplate }}</h2>
                <p [innerHTML]="t().rowTemplateDesc"></p>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="basicColumns" [value]="productTree" dataKey="name" [rowTemplate]="rowTpl" />

                    <ng-template #rowTpl let-node let-depth="depth">
                        <tr class="cz-tree-table-row cz-tree-table-row--selectable">
                            <td>
                                <span class="cz-flex cz-items-center cz-gap-sm" [style.paddingLeft.rem]="depth * 1.5">
                                    <cz-avatar [label]="node.data.name.charAt(0)" shape="circle" size="sm" />
                                    <strong>{{ node.data.name }}</strong>
                                </span>
                            </td>
                            <td>{{ node.data.category }}</td>
                            <td>{{ node.data.quantity }}</td>
                            <td>
                                <cz-button [label]="t().view" size="sm" variant="text" severity="info"
                                    (onClick)="notify('View', node.data.name)" />
                            </td>
                        </tr>
                    </ng-template>
                </div>
                <app-code [code]="rowTemplateCode" />
            </section>

            <!-- ── COLUMN GROUPS ── -->
            <section>
                <h2 id="groups">{{ t().groups }}</h2>
                <p [innerHTML]="t().groupsDesc"></p>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="groupColumns" [value]="productTree" dataKey="name"
                        [headerTemplate]="groupHeader" [footerTemplate]="groupFooter" [gridlines]="true" />

                    <ng-template #groupHeader>
                        <tr>
                            <th rowspan="2">{{ t().product }}</th>
                            <th colspan="2">{{ t().pricing }}</th>
                            <th rowspan="2">{{ t().statusCol }}</th>
                        </tr>
                        <tr>
                            <th>{{ t().price }}</th>
                            <th>{{ t().qty }}</th>
                        </tr>
                    </ng-template>

                    <ng-template #groupFooter>
                        <tr>
                            <td colspan="4" style="text-align: right;">
                                <strong>{{ t().totals }}: {{ totalQuantity }} {{ t().units }}</strong>
                            </td>
                        </tr>
                    </ng-template>
                </div>
                <app-code [code]="groupsCode" />
            </section>

            <!-- ── PAGINATION ── -->
            <section>
                <h2 id="pagination">{{ t().pagination }}</h2>
                <p [innerHTML]="t().paginationDesc"></p>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="productColumns()" [value]="productTree" dataKey="name" [sortable]="true"
                        [rows]="5" [rowsPerPageOptions]="[5, 10, 15]" />
                </div>
                <app-code [code]="paginationCode" />
            </section>

            <!-- ── CONTEXT MENU ── -->
            <section>
                <h2 id="context-menu">{{ t().contextMenu }}</h2>
                <p [innerHTML]="t().contextMenuDesc"></p>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="productColumns()" [value]="productTree" dataKey="name"
                        [contextMenuItems]="contextItems"
                        (onContextMenuSelect)="notify($event.item.label || '', $event.node.data['name'])" />
                    <span class="cz-text-sm">{{ t().lastAction }}: {{ lastAction() || '-' }}</span>
                </div>
                <app-code [code]="contextMenuCode" />
            </section>

            <!-- ── OPTIONS ── -->
            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-select-button [options]="sizeOptions" optionLabel="label" optionValue="value"
                        [ngModel]="tableSize()" (ngModelChange)="tableSize.set($event)" ariaLabel="Size" />
                    <cz-button [label]="t().toggleLoading" size="sm" [loading]="loading()" (onClick)="reload()" />
                </div>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="productColumns()" [value]="productTree" dataKey="name" [striped]="true"
                        [gridlines]="true" [size]="tableSize()" [loading]="loading()" scrollHeight="16rem"
                        [sortable]="true" />
                </div>
                <div class="cz-mb-md">
                    <cz-tree-table [columns]="basicColumns" [value]="[]" [emptyTemplate]="emptyTpl" />

                    <ng-template #emptyTpl>
                        <div class="cz-flex cz-flex-col cz-items-center cz-gap-sm cz-py-lg">
                            <cz-icon [icon]="StarIcon" [size]="28" />
                            <strong>{{ t().emptyTitle }}</strong>
                            <span class="cz-text-sm">{{ t().emptyDesc }}</span>
                        </div>
                    </ng-template>
                </div>
                <app-code [code]="optionsCode" />
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>columns</code></td><td><code>CzTreeTableColumn[]</code></td><td><code>[]</code></td><td>Column definitions (<code>field</code>, <code>header</code>, <code>sortable</code>, <code>width</code>, <code>template</code>).</td></tr>
                            <tr><td><code>value</code></td><td><code>CzTreeTableNode[]</code></td><td><code>[]</code></td><td>Hierarchical nodes (<code>data</code>, <code>children</code>, <code>key</code>, <code>expanded</code>).</td></tr>
                            <tr><td><code>dataKey</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Property of <code>node.data</code> that identifies a node for expansion &amp; selection.</td></tr>
                            <tr><td><code>expandedKeys</code></td><td><code>Record&lt;string, boolean&gt; (model)</code></td><td><code>&#123;&#125;</code></td><td>Expanded state by key (two-way). Nodes with <code>expanded: true</code> start open.</td></tr>
                            <tr><td><code>sortable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Sorts siblings at every level (per-column override with <code>column.sortable</code>).</td></tr>
                            <tr><td><code>globalFilter</code></td><td><code>string</code></td><td><code>''</code></td><td>Contains filter; ancestors of matches are kept and auto-expanded.</td></tr>
                            <tr><td><code>filterFields</code></td><td><code>string[] | null</code></td><td><code>null</code></td><td>Fields used by the global filter (defaults to every column).</td></tr>
                            <tr><td><code>selectionMode</code></td><td><code>'none' | 'single' | 'multiple'</code></td><td><code>'none'</code></td><td>Node selection mode (multiple renders checkboxes + select all).</td></tr>
                            <tr><td><code>selection</code></td><td><code>CzTreeTableNode[] (model)</code></td><td><code>[]</code></td><td>Selected nodes in multiple mode (two-way).</td></tr>
                            <tr><td><code>rows</code></td><td><code>number</code></td><td><code>0</code></td><td>Rows per page (0 disables pagination).</td></tr>
                            <tr><td><code>rowsPerPageOptions</code></td><td><code>number[]</code></td><td><code>[]</code></td><td>Options for the paginator rows select.</td></tr>
                            <tr><td><code>striped</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Alternating row background.</td></tr>
                            <tr><td><code>gridlines</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Cell borders.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Row size.</td></tr>
                            <tr><td><code>scrollHeight</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Scrollable viewport with sticky header.</td></tr>
                            <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a blurred loading overlay.</td></tr>
                            <tr><td><code>emptyMessage</code></td><td><code>string</code></td><td><code>'No records found'</code></td><td>Fallback empty message.</td></tr>
                            <tr><td><code>headerTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom header rows (supports colspan/rowspan for column groups).</td></tr>
                            <tr><td><code>rowTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Whole row template (<code>$implicit</code> node, <code>depth</code>, <code>index</code>).</td></tr>
                            <tr><td><code>footerTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom <code>&lt;tfoot&gt;</code> content.</td></tr>
                            <tr><td><code>emptyTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom empty state.</td></tr>
                            <tr><td><code>contextMenuItems</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Built-in row context menu (right click).</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Z-index of the built-in context menu.</td></tr>
                            <tr><td><code>onSort</code></td><td><code>output&lt;CzTreeTableSortEvent&gt;</code></td><td><code>—</code></td><td>Emitted on sort.</td></tr>
                            <tr><td><code>onRowSelect</code></td><td><code>output&lt;CzTreeTableNode&gt;</code></td><td><code>—</code></td><td>Emitted on single selection.</td></tr>
                            <tr><td><code>onSelectionChange</code></td><td><code>output&lt;CzTreeTableNode[]&gt;</code></td><td><code>—</code></td><td>Emitted on multiple selection change.</td></tr>
                            <tr><td><code>onNodeExpand / onNodeCollapse</code></td><td><code>output&lt;CzTreeTableNode&gt;</code></td><td><code>—</code></td><td>Emitted when a node expands / collapses.</td></tr>
                            <tr><td><code>onRowContextMenu</code></td><td><code>output&lt;&#123; node, event &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when a node is right-clicked.</td></tr>
                            <tr><td><code>onContextMenuSelect</code></td><td><code>output&lt;&#123; item, node &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when a built-in context menu item is activated.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TreeTableDocPage {
    private readonly lang = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => TREE_TABLE_DOC_I18N[this.lang.currentLang()] || TREE_TABLE_DOC_I18N.es);

    readonly StarIcon = LucideStar;

    readonly lastSort = signal('');
    readonly lastSelected = signal('');
    readonly lastAction = signal('');
    readonly lastNodeEvent = signal('');
    readonly filter = signal('');
    readonly tableSize = signal<'sm' | 'md' | 'lg'>('md');
    readonly loading = signal(false);
    readonly expandedKeys = signal<Record<string, boolean>>({ Laptops: true });
    readonly selectedNodes = signal<CzTreeTableNode[]>([]);

    readonly sizeOptions = [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
    ];

    readonly basicColumns: CzTreeTableColumn[] = [
        { field: 'name', header: 'Name', sortable: true },
        { field: 'category', header: 'Category' },
        { field: 'quantity', header: 'Qty', sortable: true },
    ];

    readonly groupColumns: CzTreeTableColumn[] = [
        { field: 'name', header: 'Product' },
        { field: 'price', header: 'Price' },
        { field: 'quantity', header: 'Qty' },
        { field: 'status', header: 'Status' },
    ];

    readonly productTree: CzTreeTableNode[] = [
        {
            data: { name: 'Audio', category: 'Audio', quantity: 75 },
            children: [
                { data: { name: 'Echo Headphones', category: 'Audio', price: 249, quantity: 0, status: 'OUTOFSTOCK', image: '/images/dataview/product-4.svg' } },
                { data: { name: 'Echo Buds', category: 'Audio', price: 99, quantity: 44, status: 'INSTOCK', image: '/images/dataview/product-4.svg' } },
                { data: { name: 'BoomBox Mini', category: 'Audio', price: 129, quantity: 31, status: 'INSTOCK', image: '/images/dataview/product-6.svg' } },
            ],
        },
        {
            data: { name: 'Laptops', category: 'Laptops', quantity: 21 },
            children: [
                { data: { name: 'UltraBook Pro', category: 'Laptops', price: 1499, quantity: 12, status: 'INSTOCK', image: '/images/dataview/product-1.svg' } },
                { data: { name: 'UltraBook Air', category: 'Laptops', price: 1199, quantity: 9, status: 'INSTOCK', image: '/images/dataview/product-1.svg' } },
            ],
        },
        {
            data: { name: 'Phones', category: 'Phones', quantity: 6 },
            children: [
                { data: { name: 'Nova Phone X', category: 'Phones', price: 999, quantity: 4, status: 'LOWSTOCK', image: '/images/dataview/product-2.svg' } },
                { data: { name: 'Nova Phone SE', category: 'Phones', price: 649, quantity: 2, status: 'LOWSTOCK', image: '/images/dataview/product-2.svg' } },
            ],
        },
        {
            data: { name: 'Wearables', category: 'Wearables', quantity: 41 },
            children: [
                { data: { name: 'Pulse Watch S2', category: 'Wearables', price: 349, quantity: 23, status: 'INSTOCK', image: '/images/dataview/product-3.svg' } },
                { data: { name: 'Pulse Watch Lite', category: 'Wearables', price: 199, quantity: 18, status: 'INSTOCK', image: '/images/dataview/product-3.svg' } },
            ],
        },
    ];

    readonly totalQuantity = this.productTree.reduce((total, node) => total + (node.data['quantity'] ?? 0), 0);

    readonly contextItems: CzMenuItem[] = [
        { label: 'Edit', icon: LucidePencil, command: () => this.toast.info('Edit', 'Context menu') },
        { label: 'Duplicate', icon: LucideCopy, command: () => this.toast.info('Duplicate', 'Context menu') },
        { separator: true },
        { label: 'Delete', icon: LucideTrash, disabled: true },
    ];

    /* Cell templates (viewChild) */
    readonly imageTpl = viewChild<TemplateRef<unknown>>('imageTpl');
    readonly nameTpl = viewChild<TemplateRef<unknown>>('nameTpl');
    readonly priceTpl = viewChild<TemplateRef<unknown>>('priceTpl');
    readonly statusTpl = viewChild<TemplateRef<unknown>>('statusTpl');

    readonly productColumns = computed<CzTreeTableColumn[]>(() => [
        { field: 'image', header: '', width: '4rem', template: this.imageTpl() ?? undefined },
        { field: 'name', header: 'Product', sortable: true, template: this.nameTpl() ?? undefined },
        { field: 'category', header: 'Category' },
        { field: 'price', header: 'Price', sortable: true, template: this.priceTpl() ?? undefined },
        { field: 'quantity', header: 'Qty', sortable: true },
        { field: 'status', header: 'Status', template: this.statusTpl() ?? undefined },
    ]);

    expandAll(): void {
        const keys: Record<string, boolean> = {};
        const walk = (nodes: CzTreeTableNode[]) => {
            for (const node of nodes) {
                if (node.children?.length) {
                    keys[String(node.data['name'])] = true;
                    walk(node.children);
                }
            }
        };
        walk(this.productTree);
        this.expandedKeys.set(keys);
    }

    collapseAll(): void {
        this.expandedKeys.set({});
    }

    statusLabel(status: string): string {
        switch (status) {
            case 'INSTOCK': return 'In Stock';
            case 'LOWSTOCK': return 'Low Stock';
            default: return 'Out of Stock';
        }
    }

    statusSeverity(status: string): 'success' | 'warning' | 'danger' {
        switch (status) {
            case 'INSTOCK': return 'success';
            case 'LOWSTOCK': return 'warning';
            default: return 'danger';
        }
    }

    notify(action: string, name: string): void {
        this.lastAction.set(`${action}: ${name}`);
        this.toast.success(`${action}: ${name}`);
    }

    reload(): void {
        this.loading.set(true);
        setTimeout(() => this.loading.set(false), 1500);
    }

    importCode: Code = {
        typescript: `import { CzTreeTableComponent, CzTreeTableColumn, CzTreeTableNode } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-tree-table [columns]="columns" [value]="nodes" />`,
        typescript: `columns: CzTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'category', header: 'Category' },
    { field: 'quantity', header: 'Qty' },
];

nodes: CzTreeTableNode[] = [
    {
        data: { name: 'Laptops', category: 'Laptops', quantity: 21 },
        children: [
            { data: { name: 'UltraBook Pro', category: 'Laptops', quantity: 12 } },
        ],
    },
];`,
    };

    expansionCode: Code = {
        html: `<!-- Two-way expandedKeys + node events -->
<cz-tree-table
    [columns]="columns"
    [value]="nodes"
    dataKey="name"
    [(expandedKeys)]="expandedKeys"
    (onNodeExpand)="onExpand($event)"
    (onNodeCollapse)="onCollapse($event)"
/>

<!-- Nodes can also start expanded with the expanded flag -->
{ data: { name: 'Laptops' }, expanded: true, children: [...] }`,
    };

    sortingCode: Code = {
        html: `<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name" [sortable]="true"
    (onSort)="lastSort.set($event.field + ' ' + $event.order)" />`,
        typescript: `// Siblings are sorted at every level (asc → desc → reset)`,
    };

    filteringCode: Code = {
        html: `<input type="text" [value]="filter()" (input)="filter.set($any($event.target).value)" />

<cz-tree-table
    [columns]="columns"
    [value]="nodes"
    dataKey="name"
    [globalFilter]="filter()"
    [filterFields]="['name', 'category']"
/>`,
        typescript: `// Ancestors of matches are kept and auto-expanded while filtering`,
    };

    selectionCode: Code = {
        html: `<!-- Single selection -->
<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name" selectionMode="single"
    (onRowSelect)="onSelect($event)" />

<!-- Multiple selection with checkboxes + select all -->
<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name" selectionMode="multiple"
    [(selection)]="selectedNodes" />`,
    };

    templatesCode: Code = {
        html: `<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name" />

<ng-template #imageTpl let-row>
    @if (row.image) {
        <cz-avatar [image]="row.image" shape="circle" size="sm" />
    } @else {
        <cz-avatar [label]="row.name.charAt(0)" shape="circle" size="sm" />
    }
</ng-template>

<ng-template #nameTpl let-row let-node="node">
    @if (node.children?.length) {
        <strong>{{ row.name }}</strong>
    } @else {
        <span>{{ row.name }}</span>
    }
</ng-template>

<!-- columns: context is { $implicit: node.data, value, index, node } -->
{ field: 'image', header: '', template: this.imageTpl() }
{ field: 'name', header: 'Product', template: this.nameTpl() }`,
    };

    rowTemplateCode: Code = {
        html: `<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name" [rowTemplate]="rowTpl" />

<ng-template #rowTpl let-node let-depth="depth">
    <tr class="cz-tree-table-row cz-tree-table-row--selectable">
        <td>
            <span [style.paddingLeft.rem]="depth * 1.5">
                <cz-avatar [label]="node.data.name.charAt(0)" shape="circle" size="sm" />
                <strong>{{ node.data.name }}</strong>
            </span>
        </td>
        <td>{{ node.data.category }}</td>
        <td><cz-button label="View" size="sm" variant="text" /></td>
    </tr>
</ng-template>`,
    };

    groupsCode: Code = {
        html: `<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name"
    [headerTemplate]="header" [footerTemplate]="footer" />

<ng-template #header>
    <tr>
        <th rowspan="2">Product</th>
        <th colspan="2">Pricing</th>
        <th rowspan="2">Status</th>
    </tr>
    <tr>
        <th>Price</th>
        <th>Qty</th>
    </tr>
</ng-template>

<ng-template #footer>
    <tr><td colspan="4">Totals: {{ totalQuantity }} units</td></tr>
</ng-template>`,
    };

    paginationCode: Code = {
        html: `<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name"
    [rows]="5" [rowsPerPageOptions]="[5, 10, 15]" />`,
        typescript: `// Pagination applies to the visible (flattened) rows`,
    };

    contextMenuCode: Code = {
        html: `<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name"
    [contextMenuItems]="items"
    (onContextMenuSelect)="onAction($event)" />

<!-- items: CzMenuItem[] -->
items = [
    { label: 'Edit', icon: LucidePencil, command: () => this.edit() },
    { label: 'Duplicate', icon: LucideCopy, command: () => this.duplicate() },
    { separator: true },
    { label: 'Delete', icon: LucideTrash, disabled: true },
];

onAction(event: { item: CzMenuItem; node: CzTreeTableNode }): void {
    console.log(event.item.label, event.node.data);
}`,
    };

    optionsCode: Code = {
        html: `<!-- Sizes: sm | md | lg -->
<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name" [size]="'sm'" />

<!-- Scrollable with sticky header -->
<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name" scrollHeight="16rem" />

<!-- Loading overlay -->
<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name" [loading]="loading()" />

<!-- Striped + gridlines -->
<cz-tree-table [columns]="columns" [value]="nodes" dataKey="name" [striped]="true" [gridlines]="true" />

<!-- Custom empty state -->
<cz-tree-table [columns]="columns" [value]="[]" [emptyTemplate]="emptyTpl" />`,
    };
}
