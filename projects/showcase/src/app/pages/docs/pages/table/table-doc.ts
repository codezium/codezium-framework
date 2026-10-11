import { ChangeDetectionStrategy, Component, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    CzAvatarComponent,
    CzButtonComponent,
    CzIconComponent,
    CzMenuItem,
    CzSelectButtonComponent,
    CzTableColumn,
    CzTableComponent,
    CzTagComponent,
    CzToastService,
} from 'codezium-ui';
import {
    LucideCopy,
    LucidePencil,
    LucideStar,
    LucideTrash,
} from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TABLE_DOC_I18N } from './table-doc.i18n';

interface Product {
    id: number;
    image: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    status: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
}

/** Simulated server response (unknown shape until it arrives) */
const SERVER_RESPONSE: Record<string, any>[] = [
    { id: 1, name: 'UltraBook Pro', category: 'Laptops', price: 1499, stock: 12 },
    { id: 2, name: 'Nova Phone X', category: 'Phones', price: 999, stock: 4 },
    { id: 3, name: 'Pulse Watch S2', category: 'Wearables', price: 349, stock: 23 },
    { id: 4, name: 'Echo Headphones', category: 'Audio', price: 249, stock: 0 },
    { id: 5, name: 'VisionCam 4K', category: 'Cameras', price: 549, stock: 7 },
    { id: 6, name: 'BoomBox Mini', category: 'Audio', price: 129, stock: 31 },
    { id: 7, name: 'UltraBook Air', category: 'Laptops', price: 1199, stock: 9 },
    { id: 8, name: 'Nova Phone SE', category: 'Phones', price: 649, stock: 2 },
];

@Component({
    selector: 'cz-table-doc-page',
    imports: [
        FormsModule,
        CzTableComponent,
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
            <h1 id="table">{{ t().title }}</h1>
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
                    <cz-table [columns]="customerColumns" [value]="customers" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── SORTING ── -->
            <section>
                <h2 id="sorting">{{ t().sorting }}</h2>
                <p [innerHTML]="t().sortingDesc"></p>
                <div class="cz-mb-md">
                    <cz-table [columns]="customerColumns" [value]="customers" [sortable]="true"
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
                    <cz-table [columns]="customerColumns" [value]="customers" [globalFilter]="filter()"
                        [filterFields]="['name', 'country', 'company']" />
                </div>
                <app-code [code]="filteringCode" />
            </section>

            <!-- ── PAGINATION ── -->
            <section>
                <h2 id="pagination">{{ t().pagination }}</h2>
                <p [innerHTML]="t().paginationDesc"></p>
                <div class="cz-mb-md">
                    <cz-table [columns]="productColumns()" [value]="products" [rows]="4"
                        [rowsPerPageOptions]="[4, 8, 12]" [sortable]="true" />
                </div>
                <app-code [code]="paginationCode" />
            </section>

            <!-- ── SELECTION ── -->
            <section>
                <h2 id="selection">{{ t().selection }}</h2>
                <p [innerHTML]="t().selectionDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <div>
                        <cz-table [columns]="customerColumns" [value]="customers" selectionMode="single"
                            (onRowSelect)="lastSelected.set($event['name'])" />
                        <span class="cz-text-sm">{{ t().selected }}: {{ lastSelected() || '-' }}</span>
                    </div>
                    <div>
                        <cz-table [columns]="productColumns()" [value]="products" selectionMode="multiple"
                            dataKey="id" [selection]="selectedProducts()"
                            (onSelectionChange)="selectedProducts.set($event)" />
                        <span class="cz-text-sm">{{ t().selectedCount }}: {{ selectedProducts().length }}</span>
                    </div>
                </div>
                <app-code [code]="selectionCode" />
            </section>

            <!-- ── CELL TEMPLATES (avatar / image) ── -->
            <section>
                <h2 id="templates">{{ t().templates }}</h2>
                <p [innerHTML]="t().templatesDesc"></p>
                <div class="cz-mb-md">
                    <cz-table [columns]="productColumns()" [value]="products" [sortable]="true" [striped]="true" />
                </div>
                <app-code [code]="templatesCode" />

                <ng-template #imageTpl let-row>
                    <cz-avatar [image]="row.image" shape="circle" size="sm" [ariaLabel]="row.name" />
                </ng-template>

                <ng-template #categoryTpl let-value="value">
                    <cz-tag [value]="value" severity="secondary" size="sm" />
                </ng-template>

                <ng-template #priceTpl let-value="value">
                    <span class="cz-font-semibold">\${{ value }}</span>
                </ng-template>

                <ng-template #statusTpl let-row>
                    <cz-tag [value]="statusLabel(row.status)" [severity]="statusSeverity(row.status)" size="sm" />
                </ng-template>

                <ng-template #ratingTpl let-row>
                    <span class="cz-flex cz-items-center cz-gap-xs">
                        <cz-icon [icon]="StarIcon" [size]="13" />
                        {{ row.quantity > 20 ? 'Top' : 'New' }}
                    </span>
                </ng-template>
            </section>

            <!-- ── ROW TEMPLATE ── -->
            <section>
                <h2 id="row-template">{{ t().rowTemplate }}</h2>
                <p [innerHTML]="t().rowTemplateDesc"></p>
                <div class="cz-mb-md">
                    <cz-table [columns]="customerColumns" [value]="customers" [rowTemplate]="rowTpl" />

                    <ng-template #rowTpl let-row>
                        <tr class="cz-table-row cz-table-row--selectable">
                            <td>
                                <span class="cz-flex cz-items-center cz-gap-sm">
                                    <cz-avatar [label]="row['name'].charAt(0)" shape="circle" size="sm" />
                                    <strong>{{ row['name'] }}</strong>
                                </span>
                            </td>
                            <td>{{ row['country'] }}</td>
                            <td>
                                <cz-tag [value]="row['status']" [severity]="statusSeverity(row['status'])" size="sm" />
                            </td>
                            <td>
                                <cz-button label="View" size="sm" variant="text" severity="info"
                                    (onClick)="notify('View', row['name'])" />
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
                    <cz-table [columns]="salesColumns" [value]="sales" [headerTemplate]="groupHeader"
                        [footerTemplate]="groupFooter" [gridlines]="true" />

                    <ng-template #groupHeader>
                        <tr>
                            <th rowspan="2">{{ t().product }}</th>
                            <th colspan="2">{{ t().salesGroup }}</th>
                            <th colspan="2">{{ t().profitGroup }}</th>
                        </tr>
                        <tr>
                            <th>{{ t().lastYear }}</th>
                            <th>{{ t().thisYear }}</th>
                            <th>{{ t().lastYear }}</th>
                            <th>{{ t().thisYear }}</th>
                        </tr>
                    </ng-template>

                    <ng-template #groupFooter>
                        <tr>
                            <td colspan="3" style="text-align: right;"><strong>{{ t().totals }}</strong></td>
                            <td><strong>\${{ lastYearTotal.toLocaleString() }}</strong></td>
                            <td><strong>\${{ thisYearTotal.toLocaleString() }}</strong></td>
                        </tr>
                    </ng-template>
                </div>
                <app-code [code]="groupsCode" />
            </section>

            <!-- ── ROW EXPANSION ── -->
            <section>
                <h2 id="expansion">{{ t().expansion }}</h2>
                <p [innerHTML]="t().expansionDesc"></p>
                <div class="cz-mb-md">
                    <cz-table [columns]="productColumns()" [value]="products" [expansionTemplate]="expansionTpl"
                        (onRowExpand)="notify('Expand', $event['name'])" />

                    <ng-template #expansionTpl let-row>
                        <div class="cz-flex cz-flex-wrap cz-gap-xl">
                            <span><strong>{{ t().category }}:</strong> {{ row.category }}</span>
                            <span><strong>{{ t().quantity }}:</strong> {{ row.quantity }}</span>
                            <span><strong>{{ t().status }}:</strong> {{ statusLabel(row.status) }}</span>
                        </div>
                    </ng-template>
                </div>
                <app-code [code]="expansionCode" />
            </section>

            <!-- ── CONTEXT MENU ── -->
            <section>
                <h2 id="context-menu">{{ t().contextMenu }}</h2>
                <p [innerHTML]="t().contextMenuDesc"></p>
                <div class="cz-mb-md">
                    <cz-table [columns]="productColumns()" [value]="products" [contextMenuItems]="contextItems"
                        dataKey="id" (onContextMenuSelect)="notify($event.item.label || '', $event.row['name'])" />
                    <span class="cz-text-sm">{{ t().lastAction }}: {{ lastAction() || '-' }}</span>
                </div>
                <app-code [code]="contextMenuCode" />
            </section>

            <!-- ── DYNAMIC / SERVER DATA ── -->
            <section>
                <h2 id="dynamic">{{ t().dynamic }}</h2>
                <p [innerHTML]="t().dynamicDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-button [label]="t().loadFromServer" size="sm" [loading]="dynamicLoading()"
                        (onClick)="loadFromServer()" />
                    @if (dynamicRows().length) {
                        <span class="cz-text-sm">{{ t().loadedRows }}: {{ dynamicRows().length }}</span>
                    }
                </div>
                <div class="cz-mb-md">
                    <cz-table [columns]="dynamicColumns()" [value]="dynamicRows()" [loading]="dynamicLoading()"
                        [rows]="5" [rowsPerPageOptions]="[5, 10]" [sortable]="true" [striped]="true" />
                </div>
                <app-code [code]="dynamicCode" />
            </section>

            <!-- ── OPTIONS ── -->
            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-select-button [options]="sizeOptions" optionLabel="label" optionValue="value"
                        [ngModel]="tableSize()" (ngModelChange)="tableSize.set($event)" ariaLabel="Size" />
                    <cz-button [label]="t().toggleLoading" size="sm" [loading]="loading()"
                        (onClick)="reload()" />
                </div>
                <div class="cz-mb-md">
                    <cz-table [columns]="productColumns()" [value]="products" [striped]="true" [gridlines]="true"
                        [size]="tableSize()" [loading]="loading()" scrollHeight="16rem" [sortable]="true" />
                </div>
                <div class="cz-mb-md">
                    <cz-table [columns]="customerColumns" [value]="[]" [emptyTemplate]="emptyTpl" />

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
                            <tr><td><code>columns</code></td><td><code>CzTableColumn[]</code></td><td><code>[]</code></td><td>Column definitions (<code>field</code>, <code>header</code>, <code>sortable</code>, <code>width</code>, <code>template</code>).</td></tr>
                            <tr><td><code>value</code></td><td><code>Record&lt;string, any&gt;[]</code></td><td><code>[]</code></td><td>Row data.</td></tr>
                            <tr><td><code>dataKey</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Field that uniquely identifies a row (selection &amp; tracking).</td></tr>
                            <tr><td><code>sortable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables sorting on all columns (per-column override with <code>column.sortable</code>).</td></tr>
                            <tr><td><code>globalFilter</code></td><td><code>string</code></td><td><code>''</code></td><td>Global contains filter.</td></tr>
                            <tr><td><code>filterFields</code></td><td><code>string[] | null</code></td><td><code>null</code></td><td>Fields used by the global filter (defaults to every column).</td></tr>
                            <tr><td><code>selectionMode</code></td><td><code>'none' | 'single' | 'multiple'</code></td><td><code>'none'</code></td><td>Row selection mode (multiple renders checkboxes + select all).</td></tr>
                            <tr><td><code>selection</code></td><td><code>Record&lt;string, any&gt;[] (model)</code></td><td><code>[]</code></td><td>Selected rows in multiple mode (two-way).</td></tr>
                            <tr><td><code>rows</code></td><td><code>number</code></td><td><code>0</code></td><td>Rows per page (0 disables pagination).</td></tr>
                            <tr><td><code>rowsPerPageOptions</code></td><td><code>number[]</code></td><td><code>[]</code></td><td>Options for the paginator rows select.</td></tr>
                            <tr><td><code>striped</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Alternating row background.</td></tr>
                            <tr><td><code>gridlines</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Cell borders.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Row size.</td></tr>
                            <tr><td><code>scrollHeight</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Scrollable viewport with sticky header.</td></tr>
                            <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a blurred loading overlay.</td></tr>
                            <tr><td><code>emptyMessage</code></td><td><code>string</code></td><td><code>'No records found'</code></td><td>Fallback empty message.</td></tr>
                            <tr><td><code>headerTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom header rows (supports colspan/rowspan for column groups).</td></tr>
                            <tr><td><code>rowTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Whole row template (<code>$implicit</code> row, <code>index</code>).</td></tr>
                            <tr><td><code>footerTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom <code>&lt;tfoot&gt;</code> content.</td></tr>
                            <tr><td><code>emptyTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom empty state.</td></tr>
                            <tr><td><code>expansionTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Row expansion content (<code>$implicit</code> row, <code>index</code>).</td></tr>
                            <tr><td><code>contextMenuItems</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Built-in row context menu (right click).</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Z-index of the built-in context menu.</td></tr>
                            <tr><td><code>onSort</code></td><td><code>output&lt;CzTableSortEvent&gt;</code></td><td><code>—</code></td><td>Emitted on sort.</td></tr>
                            <tr><td><code>onRowSelect</code></td><td><code>output&lt;Record&gt;</code></td><td><code>—</code></td><td>Emitted on single selection.</td></tr>
                            <tr><td><code>onSelectionChange</code></td><td><code>output&lt;Record[]&gt;</code></td><td><code>—</code></td><td>Emitted on multiple selection change.</td></tr>
                            <tr><td><code>onRowExpand / onRowCollapse</code></td><td><code>output&lt;Record&gt;</code></td><td><code>—</code></td><td>Emitted when a row expands / collapses.</td></tr>
                            <tr><td><code>onRowContextMenu</code></td><td><code>output&lt;&#123; row, event &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when a row is right-clicked.</td></tr>
                            <tr><td><code>onContextMenuSelect</code></td><td><code>output&lt;&#123; item, row &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when a built-in context menu item is activated.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TableDocPage {
    private readonly lang = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => TABLE_DOC_I18N[this.lang.currentLang()] || TABLE_DOC_I18N.es);

    readonly StarIcon = LucideStar;

    readonly lastSort = signal('');
    readonly lastSelected = signal('');
    readonly lastAction = signal('');
    readonly filter = signal('');
    readonly tableSize = signal<'sm' | 'md' | 'lg'>('md');
    readonly loading = signal(false);
    readonly selectedProducts = signal<Record<string, any>[]>([]);
    readonly dynamicColumns = signal<CzTableColumn[]>([]);
    readonly dynamicRows = signal<Record<string, any>[]>([]);
    readonly dynamicLoading = signal(false);

    readonly sizeOptions = [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
    ];

    readonly customerColumns: CzTableColumn[] = [
        { field: 'name', header: 'Name', sortable: true },
        { field: 'country', header: 'Country', sortable: true },
        { field: 'company', header: 'Company' },
        { field: 'status', header: 'Status' },
    ];

    readonly customers = [
        { name: 'James Butt', country: 'Algeria', company: 'Benton', status: 'unqualified' },
        { name: 'Josephine Darakjy', country: 'Egypt', company: 'Chanay', status: 'negotiation' },
        { name: 'Art Venere', country: 'Panama', company: 'Chemel', status: 'qualified' },
        { name: 'Lenna Paprocki', country: 'Slovenia', company: 'Feltz', status: 'new' },
        { name: 'Donette Foller', country: 'Brazil', company: 'Lewis', status: 'renewal' },
        { name: 'Simona Morasca', country: 'Mexico', company: 'Gaucher', status: 'proposal' },
    ];

    readonly products: Product[] = [
        { id: 1, image: '/images/dataview/product-1.svg', name: 'UltraBook Pro', category: 'Laptops', price: 1499, quantity: 12, status: 'INSTOCK' },
        { id: 2, image: '/images/dataview/product-2.svg', name: 'Nova Phone X', category: 'Phones', price: 999, quantity: 4, status: 'LOWSTOCK' },
        { id: 3, image: '/images/dataview/product-3.svg', name: 'Pulse Watch S2', category: 'Wearables', price: 349, quantity: 23, status: 'INSTOCK' },
        { id: 4, image: '/images/dataview/product-4.svg', name: 'Echo Headphones', category: 'Audio', price: 249, quantity: 0, status: 'OUTOFSTOCK' },
        { id: 5, image: '/images/dataview/product-5.svg', name: 'VisionCam 4K', category: 'Cameras', price: 549, quantity: 7, status: 'INSTOCK' },
        { id: 6, image: '/images/dataview/product-6.svg', name: 'BoomBox Mini', category: 'Audio', price: 129, quantity: 31, status: 'INSTOCK' },
        { id: 7, image: '/images/dataview/product-1.svg', name: 'UltraBook Air', category: 'Laptops', price: 1199, quantity: 9, status: 'INSTOCK' },
        { id: 8, image: '/images/dataview/product-2.svg', name: 'Nova Phone SE', category: 'Phones', price: 649, quantity: 2, status: 'LOWSTOCK' },
        { id: 9, image: '/images/dataview/product-3.svg', name: 'Pulse Watch Lite', category: 'Wearables', price: 199, quantity: 18, status: 'INSTOCK' },
        { id: 10, image: '/images/dataview/product-4.svg', name: 'Echo Buds', category: 'Audio', price: 99, quantity: 44, status: 'INSTOCK' },
        { id: 11, image: '/images/dataview/product-5.svg', name: 'VisionCam Mini', category: 'Cameras', price: 299, quantity: 5, status: 'INSTOCK' },
        { id: 12, image: '/images/dataview/product-6.svg', name: 'BoomBox Max', category: 'Audio', price: 219, quantity: 0, status: 'OUTOFSTOCK' },
    ];

    readonly sales = [
        { product: 'UltraBook Pro', lastYearSale: 51, thisYearSale: 40, lastYearProfit: 54406, thisYearProfit: 43342 },
        { product: 'Nova Phone X', lastYearSale: 83, thisYearSale: 9, lastYearProfit: 423132, thisYearProfit: 312122 },
        { product: 'Pulse Watch S2', lastYearSale: 38, thisYearSale: 5, lastYearProfit: 12321, thisYearProfit: 8500 },
        { product: 'Echo Headphones', lastYearSale: 49, thisYearSale: 22, lastYearProfit: 745232, thisYearProfit: 650323 },
        { product: 'VisionCam 4K', lastYearSale: 17, thisYearSale: 79, lastYearProfit: 643242, thisYearProfit: 500332 },
    ];

    readonly salesColumns: CzTableColumn[] = [
        { field: 'product', header: 'Product' },
        { field: 'lastYearSale', header: 'Last Year' },
        { field: 'thisYearSale', header: 'This Year' },
        { field: 'lastYearProfit', header: 'Last Year' },
        { field: 'thisYearProfit', header: 'This Year' },
    ];

    readonly lastYearTotal = this.sales.reduce((total, sale) => total + sale.lastYearProfit, 0);
    readonly thisYearTotal = this.sales.reduce((total, sale) => total + sale.thisYearProfit, 0);

    readonly contextItems: CzMenuItem[] = [
        { label: 'Edit', icon: LucidePencil, command: () => this.toast.info('Edit', 'Context menu') },
        { label: 'Duplicate', icon: LucideCopy, command: () => this.toast.info('Duplicate', 'Context menu') },
        { separator: true },
        { label: 'Delete', icon: LucideTrash, disabled: true },
    ];

    /* Cell templates (viewChild) */
    readonly imageTpl = viewChild<TemplateRef<unknown>>('imageTpl');
    readonly categoryTpl = viewChild<TemplateRef<unknown>>('categoryTpl');
    readonly priceTpl = viewChild<TemplateRef<unknown>>('priceTpl');
    readonly statusTpl = viewChild<TemplateRef<unknown>>('statusTpl');
    readonly ratingTpl = viewChild<TemplateRef<unknown>>('ratingTpl');

    readonly productColumns = computed<CzTableColumn[]>(() => [
        { field: 'image', header: '', width: '5rem', template: this.imageTpl() ?? undefined },
        { field: 'name', header: 'Product', sortable: true },
        { field: 'category', header: 'Category', template: this.categoryTpl() ?? undefined },
        { field: 'price', header: 'Price', sortable: true, template: this.priceTpl() ?? undefined },
        { field: 'quantity', header: 'Qty', sortable: true },
        { field: 'status', header: 'Status', template: this.statusTpl() ?? undefined },
        { field: 'quantity', header: '', template: this.ratingTpl() ?? undefined },
    ]);

    statusLabel(status: Product['status']): string {
        switch (status) {
            case 'INSTOCK': return 'In Stock';
            case 'LOWSTOCK': return 'Low Stock';
            default: return 'Out of Stock';
        }
    }

    statusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
        switch (status) {
            case 'INSTOCK':
            case 'qualified': return 'success';
            case 'LOWSTOCK':
            case 'negotiation': return 'warning';
            case 'OUTOFSTOCK':
            case 'unqualified': return 'danger';
            default: return 'info';
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

    /** Simulates a server query: response rows drive both the data and the columns */
    loadFromServer(): void {
        this.dynamicLoading.set(true);
        this.dynamicColumns.set([]);

        setTimeout(() => {
            const rows = SERVER_RESPONSE;
            this.dynamicRows.set(rows);
            this.dynamicColumns.set(
                Object.keys(rows[0]).map(key => ({
                    field: key,
                    header: key.charAt(0).toUpperCase() + key.slice(1),
                    sortable: true,
                })),
            );
            this.dynamicLoading.set(false);
        }, 1200);
    }

    importCode: Code = {
        typescript: `import { CzTableComponent, CzTableColumn } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-table [columns]="columns" [value]="customers" />`,
        typescript: `columns: CzTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'country', header: 'Country' },
    { field: 'company', header: 'Company' },
];`,
    };

    sortingCode: Code = {
        html: `<cz-table [columns]="columns" [value]="customers" [sortable]="true" (onSort)="onSort($event)" />`,
        typescript: `onSort(event: CzTableSortEvent): void {
    console.log(event.field, event.order); // 'asc' | 'desc'
}`,
    };

    filteringCode: Code = {
        html: `<input type="text" [value]="filter()" (input)="filter.set($any($event.target).value)" />

<cz-table
    [columns]="columns"
    [value]="customers"
    [globalFilter]="filter()"
    filterFields="['name', 'country', 'company']"
/>`,
    };

    paginationCode: Code = {
        html: `<cz-table
    [columns]="columns"
    [value]="products"
    [rows]="4"
    [rowsPerPageOptions]="[4, 8, 12]"
    [sortable]="true"
/>`,
    };

    selectionCode: Code = {
        html: `<!-- Single selection (row click) -->
<cz-table [columns]="columns" [value]="customers" selectionMode="single" (onRowSelect)="onSelect($event)" />

<!-- Multiple selection with checkboxes + select all -->
<cz-table
    [columns]="columns"
    [value]="products"
    selectionMode="multiple"
    dataKey="id"
    [(selection)]="selected"
/>`,
    };

    templatesCode: Code = {
        html: `<cz-table [columns]="columns" [value]="products" />

<ng-template #imageTpl let-row>
    <cz-avatar [image]="row.image" shape="circle" size="sm" />
</ng-template>

<ng-template #statusTpl let-row>
    <cz-tag [value]="row.status" [severity]="severity(row.status)" />
</ng-template>

<!-- columns -->
{ field: 'image', header: '', template: this.imageTpl() }
{ field: 'status', header: 'Status', template: this.statusTpl() }`,
    };

    rowTemplateCode: Code = {
        html: `<cz-table [columns]="columns" [value]="customers" [rowTemplate]="rowTpl" />

<ng-template #rowTpl let-row>
    <tr class="cz-table-row cz-table-row--selectable">
        <td>
            <cz-avatar [label]="row.name.charAt(0)" shape="circle" size="sm" />
            <strong>{{ row.name }}</strong>
        </td>
        <td>{{ row.country }}</td>
        <td><cz-tag [value]="row.status" /></td>
        <td><cz-button label="View" size="sm" variant="text" /></td>
    </tr>
</ng-template>`,
    };

    groupsCode: Code = {
        html: `<cz-table [columns]="columns" [value]="sales" [headerTemplate]="header" [footerTemplate]="footer" />

<ng-template #header>
    <tr>
        <th rowspan="2">Product</th>
        <th colspan="2">Sales</th>
        <th colspan="2">Profit</th>
    </tr>
    <tr>
        <th>Last year</th>
        <th>This year</th>
        <th>Last year</th>
        <th>This year</th>
    </tr>
</ng-template>

<ng-template #footer>
    <tr><td colspan="3">Totals</td><td>{{ lastYearTotal }}</td><td>{{ thisYearTotal }}</td></tr>
</ng-template>`,
    };

    expansionCode: Code = {
        html: `<cz-table [columns]="columns" [value]="products" [expansionTemplate]="expansionTpl" />

<ng-template #expansionTpl let-row>
    <div class="details">
        <span><strong>Category:</strong> {{ row.category }}</span>
        <span><strong>Quantity:</strong> {{ row.quantity }}</span>
    </div>
</ng-template>`,
    };

    dynamicCode: Code = {
        html: `<cz-table
    [columns]="columns()"
    [value]="value()"
    [loading]="loading()"
    [rows]="5"
    [rowsPerPageOptions]="[5, 10]"
    [sortable]="true"
/>`,
        typescript: `// Columns are not known until the response arrives: build them at runtime
async loadFromServer(): Promise<void> {
    this.loading.set(true);

    const response = await fetch('/api/products');
    const rows: Record<string, any>[] = await response.json();

    this.columns.set(
        Object.keys(rows[0]).map(key => ({
            field: key,
            header: key.charAt(0).toUpperCase() + key.slice(1),
            sortable: true,
        })),
    );
    this.value.set(rows);
    this.loading.set(false);
}`,
    };

    contextMenuCode: Code = {
        html: `<cz-table
    [columns]="columns"
    [value]="products"
    dataKey="id"
    [contextMenuItems]="items"
    (onContextMenuSelect)="onAction($event)"
/>

<!-- items: CzMenuItem[] -->
items = [
    { label: 'Edit', icon: LucidePencil, command: () => this.edit() },
    { label: 'Duplicate', icon: LucideCopy, command: () => this.duplicate() },
    { separator: true },
    { label: 'Delete', icon: LucideTrash, disabled: true },
];

onAction(event: { item: CzMenuItem; row: Product }): void {
    console.log(event.item.label, event.row);
}`,
    };

    optionsCode: Code = {
        html: `<!-- Sizes: sm | md | lg -->
<cz-table [columns]="columns" [value]="products" [size]="'sm'" />

<!-- Scrollable with sticky header -->
<cz-table [columns]="columns" [value]="products" scrollHeight="16rem" />

<!-- Loading overlay -->
<cz-table [columns]="columns" [value]="products" [loading]="loading()" />

<!-- Striped + gridlines -->
<cz-table [columns]="columns" [value]="products" [striped]="true" [gridlines]="true" />

<!-- Custom empty state -->
<cz-table [columns]="columns" [value]="[]" [emptyTemplate]="emptyTpl" />`,
    };
}
