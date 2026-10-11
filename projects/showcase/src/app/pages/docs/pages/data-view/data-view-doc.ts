import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    CzButtonComponent,
    CzDataViewComponent,
    CzDataViewLayout,
    CzIconComponent,
    CzSelectButtonComponent,
    CzTagComponent,
    CzToastService,
} from 'codezium-ui';
import {
    LucideHeart,
    LucidePackageOpen,
    LucideShoppingCart,
    LucideStar,
} from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { DATA_VIEW_DOC_I18N } from './data-view-doc.i18n';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    rating: number;
    status: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
    image: string;
}

@Component({
    selector: 'cz-data-view-doc-page',
    imports: [
        FormsModule,
        CzDataViewComponent,
        CzTagComponent,
        CzButtonComponent,
        CzIconComponent,
        CzSelectButtonComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
        .dv-star {
            color: var(--cz-color-warning);
            fill: var(--cz-color-warning);
        }

        .dv-product-img {
            display: block;
            width: 100%;
            max-width: 11rem;
            border-radius: var(--cz-radius-md, 8px);
            border: 1px solid var(--cz-theme-border-color);
        }

        .dv-row {
            display: flex;
            flex-direction: column;
            gap: var(--cz-spacing-md);
            padding: var(--cz-spacing-lg) 0;
            border-top: 1px solid var(--cz-theme-divider);

            &:first-child {
                border-top: none;
            }
        }

        @media (min-width: 768px) {
            .dv-row {
                flex-direction: row;
                align-items: center;
            }

            .dv-row__main {
                flex: 1;
            }

            .dv-row__aside {
                align-items: flex-end;
            }
        }

        .dv-card {
            display: flex;
            flex-direction: column;
            gap: var(--cz-spacing-md);
            height: 100%;
            padding: var(--cz-spacing-lg);
            border: 1px solid var(--cz-theme-border-color);
            border-radius: var(--cz-radius-lg, 12px);
            background: var(--cz-theme-surface);
        }
    `,
    template: `
        <div class="doc-page">
            <h1 id="data-view">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
                <p class="cz-mt-md" [innerHTML]="t().templatesNote"></p>
            </section>

            <!-- ── BASIC (list template) ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-data-view [value]="products" [rows]="4" [listTemplate]="basicList"></cz-data-view>

                    <ng-template #basicList let-items>
                        @for (product of items; track product.id) {
                            <div class="dv-row">
                                <img class="dv-product-img" [src]="product.image" [alt]="product.name" width="300"
                                    height="225" loading="lazy" />

                                <div class="dv-row__main cz-flex cz-flex-col cz-gap-sm">
                                    <span class="cz-text-xs cz-text-muted cz-uppercase">{{ product.category }}</span>
                                    <div class="cz-flex cz-items-center cz-gap-sm">
                                        <strong>{{ product.name }}</strong>
                                        <cz-tag [value]="statusLabel(product.status)"
                                            [severity]="statusSeverity(product.status)" size="sm" />
                                    </div>
                                    <span class="cz-flex cz-items-center cz-gap-xs cz-text-sm">
                                        <cz-icon class="dv-star" [icon]="StarIcon" [size]="13" />
                                        {{ product.rating }}
                                    </span>
                                </div>

                                <div class="dv-row__aside cz-flex cz-flex-col cz-gap-sm cz-items-start">
                                    <span class="cz-text-lg cz-font-semibold">\${{ product.price }}</span>
                                    <div class="cz-flex cz-gap-sm">
                                        <cz-button [icon]="HeartIcon" variant="outlined" severity="secondary"
                                            ariaLabel="Add to wishlist" (onClick)="notify('Wishlist', product)" />
                                        <cz-button label="Buy Now" [icon]="CartIcon"
                                            [disabled]="product.status === 'OUTOFSTOCK'"
                                            (onClick)="notify('Buy', product)" />
                                    </div>
                                </div>
                            </div>
                        }
                    </ng-template>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── LAYOUT (list / grid) ── -->
            <section>
                <h2 id="layout">{{ t().layout }}</h2>
                <p [innerHTML]="t().layoutDesc"></p>
                <div class="cz-mb-md">
                    <cz-data-view [value]="products" [layout]="layoutKey()" [rows]="4" [paginator]="true"
                        [rowsPerPageOptions]="[4, 8, 12]" [headerTemplate]="layoutHeader"
                        [listTemplate]="layoutList" [gridTemplate]="layoutGrid"></cz-data-view>

                    <ng-template #layoutHeader>
                        <div class="cz-flex cz-justify-end cz-w-full">
                            <cz-select-button [options]="layoutOptions" optionLabel="label" optionValue="value"
                                [ngModel]="layoutKey()" (ngModelChange)="layoutKey.set($event)" ariaLabel="Layout" />
                        </div>
                    </ng-template>

                    <ng-template #layoutList let-items>
                        @for (product of items; track product.id) {
                            <div class="dv-row">
                                <img class="dv-product-img" [src]="product.image" [alt]="product.name" width="300"
                                    height="225" loading="lazy" />
                                <div class="dv-row__main cz-flex cz-flex-col cz-gap-sm">
                                    <span class="cz-text-xs cz-text-muted cz-uppercase">{{ product.category }}</span>
                                    <div class="cz-flex cz-items-center cz-gap-sm">
                                        <strong>{{ product.name }}</strong>
                                        <cz-tag [value]="statusLabel(product.status)"
                                            [severity]="statusSeverity(product.status)" size="sm" />
                                    </div>
                                </div>
                                <div class="dv-row__aside cz-flex cz-flex-col cz-gap-sm cz-items-start">
                                    <span class="cz-text-lg cz-font-semibold">\${{ product.price }}</span>
                                    <span class="cz-flex cz-items-center cz-gap-xs cz-text-sm">
                                        <cz-icon class="dv-star" [icon]="StarIcon" [size]="13" />
                                        {{ product.rating }}
                                    </span>
                                </div>
                            </div>
                        }
                    </ng-template>

                    <ng-template #layoutGrid let-items>
                        <div class="cz-grid cz-grid-cols-1 cz-sm:grid-cols-2 cz-lg:grid-cols-3 cz-gap-md">
                            @for (product of items; track product.id) {
                                <div class="dv-card">
                                    <img class="dv-product-img cz-mx-auto" [src]="product.image" [alt]="product.name"
                                        width="300" height="225" loading="lazy" />
                                    <div class="cz-flex cz-items-center cz-justify-between cz-gap-sm">
                                        <strong>{{ product.name }}</strong>
                                        <cz-tag [value]="statusLabel(product.status)"
                                            [severity]="statusSeverity(product.status)" size="sm" />
                                    </div>
                                    <span class="cz-text-xs cz-text-muted cz-uppercase">{{ product.category }}</span>
                                    <div class="cz-flex cz-items-center cz-justify-between">
                                        <span class="cz-font-semibold">\${{ product.price }}</span>
                                        <span class="cz-flex cz-items-center cz-gap-xs cz-text-sm">
                                            <cz-icon class="dv-star" [icon]="StarIcon" [size]="13" />
                                            {{ product.rating }}
                                        </span>
                                    </div>
                                    <cz-button label="Buy Now" [fluid]="true"
                                        [disabled]="product.status === 'OUTOFSTOCK'"
                                        (onClick)="notify('Buy', product)" />
                                </div>
                            }
                        </div>
                    </ng-template>
                </div>
                <app-code [code]="layoutCode" />
            </section>

            <!-- ── PAGINATION ── -->
            <section>
                <h2 id="pagination">{{ t().pagination }}</h2>
                <p [innerHTML]="t().paginationDesc"></p>
                <div class="cz-mb-md">
                    <cz-data-view [value]="products" [paginator]="true" [rows]="4" [rowsPerPageOptions]="[4, 8, 12]"
                        [listTemplate]="pageList"
                        (onPage)="lastPage.set('page ' + ($event.page + 1) + ' / ' + $event.pageCount)"></cz-data-view>

                    <ng-template #pageList let-items>
                        @for (product of items; track product.id) {
                            <div class="dv-row">
                                <img class="dv-product-img" [src]="product.image" [alt]="product.name" width="300"
                                    height="225" loading="lazy" />
                                <div class="dv-row__main cz-flex cz-flex-col cz-gap-sm">
                                    <strong>{{ product.name }}</strong>
                                    <span class="cz-text-xs cz-text-muted cz-uppercase">{{ product.category }}</span>
                                </div>
                                <div class="dv-row__aside cz-flex cz-flex-col cz-gap-sm cz-items-start">
                                    <span class="cz-font-semibold">\${{ product.price }}</span>
                                </div>
                            </div>
                        }
                    </ng-template>

                    <p class="cz-text-sm cz-text-muted cz-mt-sm">{{ lastPage() }}</p>
                </div>
                <app-code [code]="paginationCode" />
            </section>

            <!-- ── SORTING ── -->
            <section>
                <h2 id="sorting">{{ t().sorting }}</h2>
                <p [innerHTML]="t().sortingDesc"></p>
                <div class="cz-mb-md">
                    <cz-data-view [value]="products" [rows]="4" [sortField]="sortField()" [sortOrder]="sortOrder()"
                        [headerTemplate]="sortHeader" [listTemplate]="sortList"></cz-data-view>

                    <ng-template #sortHeader>
                        <div class="cz-flex cz-justify-end cz-w-full">
                            <cz-select-button [options]="sortOptions" optionLabel="label" optionValue="value"
                                [ngModel]="sortKey()" (ngModelChange)="onSortChange($event)" ariaLabel="Sort" />
                        </div>
                    </ng-template>

                    <ng-template #sortList let-items>
                        @for (product of items; track product.id) {
                            <div class="dv-row">
                                <img class="dv-product-img" [src]="product.image" [alt]="product.name" width="300"
                                    height="225" loading="lazy" />
                                <div class="dv-row__main cz-flex cz-flex-col cz-gap-sm">
                                    <strong>{{ product.name }}</strong>
                                    <span class="cz-text-xs cz-text-muted cz-uppercase">{{ product.category }}</span>
                                </div>
                                <div class="dv-row__aside cz-flex cz-flex-col cz-gap-sm cz-items-start">
                                    <span class="cz-font-semibold">\${{ product.price }}</span>
                                </div>
                            </div>
                        }
                    </ng-template>
                </div>
                <app-code [code]="sortingCode" />
            </section>

            <!-- ── LOADING ── -->
            <section>
                <h2 id="loading">{{ t().loading }}</h2>
                <p [innerHTML]="t().loadingDesc"></p>
                <div class="cz-flex cz-gap-md cz-mb-md">
                    <cz-button label="Reload data" [loading]="loading()" (onClick)="reload()" />
                </div>
                <div class="cz-mb-md">
                    <cz-data-view [value]="products" [rows]="3" [loading]="loading()"
                        [listTemplate]="loadingList"></cz-data-view>

                    <ng-template #loadingList let-items>
                        @for (product of items; track product.id) {
                            <div class="dv-row">
                                <img class="dv-product-img" [src]="product.image" [alt]="product.name" width="300"
                                    height="225" loading="lazy" />
                                <div class="dv-row__main cz-flex cz-flex-col cz-gap-sm">
                                    <strong>{{ product.name }}</strong>
                                    <span class="cz-text-xs cz-text-muted cz-uppercase">{{ product.category }}</span>
                                </div>
                                <div class="dv-row__aside cz-flex cz-flex-col cz-gap-sm cz-items-start">
                                    <span class="cz-font-semibold">\${{ product.price }}</span>
                                </div>
                            </div>
                        }
                    </ng-template>
                </div>
                <app-code [code]="loadingCode" />
            </section>

            <!-- ── HEADER, FOOTER & EMPTY SLOTS ── -->
            <section>
                <h2 id="slots">{{ t().slots }}</h2>
                <p [innerHTML]="t().slotsDesc"></p>
                <div class="cz-flex cz-gap-md cz-mb-md">
                    <cz-button label="Toggle empty state" severity="secondary" variant="outlined"
                        (onClick)="toggleEmpty()" />
                </div>
                <div class="cz-mb-md">
                    <cz-data-view [value]="slotData()" [rows]="4" [headerTemplate]="slotsHeader"
                        [listTemplate]="slotsList" [emptyTemplate]="slotsEmpty"
                        [footerTemplate]="slotsFooter"></cz-data-view>

                    <ng-template #slotsHeader>
                        <div class="cz-flex cz-items-center cz-justify-between cz-w-full">
                            <strong>{{ t().catalog }}</strong>
                            <span class="cz-text-sm cz-text-muted">{{ slotData().length }} items</span>
                        </div>
                    </ng-template>

                    <ng-template #slotsList let-items>
                        @for (product of items; track product.id) {
                            <div class="dv-row">
                                <img class="dv-product-img" [src]="product.image" [alt]="product.name" width="300"
                                    height="225" loading="lazy" />
                                <div class="dv-row__main cz-flex cz-flex-col cz-gap-sm">
                                    <strong>{{ product.name }}</strong>
                                    <span class="cz-text-xs cz-text-muted cz-uppercase">{{ product.category }}</span>
                                </div>
                                <div class="dv-row__aside cz-flex cz-flex-col cz-gap-sm cz-items-start">
                                    <span class="cz-font-semibold">\${{ product.price }}</span>
                                </div>
                            </div>
                        }
                    </ng-template>

                    <ng-template #slotsEmpty>
                        <div class="cz-flex cz-flex-col cz-items-center cz-gap-sm cz-py-lg">
                            <cz-icon [icon]="PackageOpenIcon" [size]="32" />
                            <strong>{{ t().emptyTitle }}</strong>
                            <span class="cz-text-sm">{{ t().emptyDesc }}</span>
                        </div>
                    </ng-template>

                    <ng-template #slotsFooter>
                        <span class="cz-text-sm cz-text-muted">{{ t().footerNote }}</span>
                    </ng-template>
                </div>
                <app-code [code]="slotsCode" />
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
                            <tr><td><code>value</code></td><td><code>Record&lt;string, any&gt;[]</code></td><td><code>[]</code></td><td>Data to display.</td></tr>
                            <tr><td><code>layout</code></td><td><code>'list' | 'grid'</code></td><td><code>'list'</code></td><td>Items layout.</td></tr>
                            <tr><td><code>field</code></td><td><code>string</code></td><td><code>''</code></td><td>Fallback property used to display and sort items.</td></tr>
                            <tr><td><code>paginator</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables pagination.</td></tr>
                            <tr><td><code>rows</code></td><td><code>number</code></td><td><code>0</code></td><td>Rows per page (0 uses 10 with paginator, all rows otherwise).</td></tr>
                            <tr><td><code>totalRecords</code></td><td><code>number | null</code></td><td><code>null</code></td><td>Total records, defaults to the length of <code>value</code>.</td></tr>
                            <tr><td><code>rowsPerPageOptions</code></td><td><code>number[]</code></td><td><code>[]</code></td><td>Options for the rows per page select.</td></tr>
                            <tr><td><code>paginatorPosition</code></td><td><code>'top' | 'bottom' | 'both'</code></td><td><code>'bottom'</code></td><td>Position of the paginator.</td></tr>
                            <tr><td><code>alwaysShowPaginator</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows the paginator even with a single page.</td></tr>
                            <tr><td><code>sortable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables the built-in sort toggle button.</td></tr>
                            <tr><td><code>sortField</code></td><td><code>string | null</code></td><td><code>null</code></td><td>External sort field (takes precedence over built-in sorting).</td></tr>
                            <tr><td><code>sortOrder</code></td><td><code>1 | -1</code></td><td><code>1</code></td><td>External sort order (1 = asc, -1 = desc).</td></tr>
                            <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a loading overlay on top of the content.</td></tr>
                            <tr><td><code>emptyMessage</code></td><td><code>string</code></td><td><code>'No records found'</code></td><td>Fallback message when there are no items.</td></tr>
                            <tr><td><code>trackBy</code></td><td><code>(index, item) =&gt; unknown | null</code></td><td><code>null</code></td><td>Custom trackBy for the fallback rendering.</td></tr>
                            <tr><td><code>headerTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Header template.</td></tr>
                            <tr><td><code>listTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>List layout template (<code>let-items</code> receives the page items).</td></tr>
                            <tr><td><code>gridTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Grid layout template (<code>let-items</code> receives the page items).</td></tr>
                            <tr><td><code>footerTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Footer template.</td></tr>
                            <tr><td><code>emptyTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom empty state template.</td></tr>
                            <tr><td><code>onPage</code></td><td><code>output&lt;CzDataViewPageEvent&gt;</code></td><td><code>—</code></td><td>Emitted when the page changes.</td></tr>
                            <tr><td><code>onSort</code></td><td><code>output&lt;CzDataViewSortEvent&gt;</code></td><td><code>—</code></td><td>Emitted when the built-in sorting changes.</td></tr>
                            <tr><td><code>[czDataViewList]</code>…</td><td><code>directive</code></td><td><code>—</code></td><td>Optional attribute directives (<code>Header</code>, <code>List</code>, <code>Grid</code>, <code>Footer</code>, <code>Empty</code>) as an alternative to the template inputs.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class DataViewDocPage {
    private readonly lang = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => DATA_VIEW_DOC_I18N[this.lang.currentLang()] || DATA_VIEW_DOC_I18N.es);

    readonly StarIcon = LucideStar;
    readonly HeartIcon = LucideHeart;
    readonly CartIcon = LucideShoppingCart;
    readonly PackageOpenIcon = LucidePackageOpen;

    readonly loading = signal(false);
    readonly lastPage = signal('');
    readonly slotData = signal<Product[]>([]);

    readonly layoutKey = signal<CzDataViewLayout>('list');
    readonly layoutOptions = [
        { label: 'List', value: 'list' },
        { label: 'Grid', value: 'grid' },
    ];

    readonly sortKey = signal('name-asc');
    readonly sortField = signal<string | null>('name');
    readonly sortOrder = signal<1 | -1>(1);
    readonly sortOptions = [
        { label: 'Name A-Z', value: 'name-asc' },
        { label: 'Name Z-A', value: 'name-desc' },
        { label: 'Price ↑', value: 'price-asc' },
        { label: 'Price ↓', value: 'price-desc' },
    ];

    readonly products: Product[] = [
        { id: 1, name: 'UltraBook Pro', category: 'Laptops', price: 1499, rating: 4.8, status: 'INSTOCK', image: '/images/dataview/product-1.svg' },
        { id: 2, name: 'Nova Phone X', category: 'Phones', price: 999, rating: 4.6, status: 'LOWSTOCK', image: '/images/dataview/product-2.svg' },
        { id: 3, name: 'Pulse Watch S2', category: 'Wearables', price: 349, rating: 4.4, status: 'INSTOCK', image: '/images/dataview/product-3.svg' },
        { id: 4, name: 'Echo Headphones', category: 'Audio', price: 249, rating: 4.7, status: 'INSTOCK', image: '/images/dataview/product-4.svg' },
        { id: 5, name: 'VisionCam 4K', category: 'Cameras', price: 549, rating: 4.3, status: 'OUTOFSTOCK', image: '/images/dataview/product-5.svg' },
        { id: 6, name: 'BoomBox Mini', category: 'Audio', price: 129, rating: 4.1, status: 'INSTOCK', image: '/images/dataview/product-6.svg' },
        { id: 7, name: 'UltraBook Air', category: 'Laptops', price: 1199, rating: 4.5, status: 'INSTOCK', image: '/images/dataview/product-1.svg' },
        { id: 8, name: 'Nova Phone SE', category: 'Phones', price: 649, rating: 4.2, status: 'INSTOCK', image: '/images/dataview/product-2.svg' },
        { id: 9, name: 'Pulse Watch Lite', category: 'Wearables', price: 199, rating: 4.0, status: 'LOWSTOCK', image: '/images/dataview/product-3.svg' },
        { id: 10, name: 'Echo Buds', category: 'Audio', price: 99, rating: 4.3, status: 'INSTOCK', image: '/images/dataview/product-4.svg' },
        { id: 11, name: 'VisionCam Mini', category: 'Cameras', price: 299, rating: 3.9, status: 'INSTOCK', image: '/images/dataview/product-5.svg' },
        { id: 12, name: 'BoomBox Max', category: 'Audio', price: 219, rating: 4.6, status: 'INSTOCK', image: '/images/dataview/product-6.svg' },
    ];

    constructor() {
        this.slotData.set(this.products);
    }

    statusLabel(status: Product['status']): string {
        switch (status) {
            case 'INSTOCK': return 'In Stock';
            case 'LOWSTOCK': return 'Low Stock';
            default: return 'Out of Stock';
        }
    }

    statusSeverity(status: Product['status']): 'success' | 'warning' | 'danger' {
        switch (status) {
            case 'INSTOCK': return 'success';
            case 'LOWSTOCK': return 'warning';
            default: return 'danger';
        }
    }

    notify(action: string, product: Product): void {
        this.toast.success(`${action}: ${product.name}`);
    }

    onSortChange(key: string): void {
        this.sortKey.set(key);
        const [field, order] = key.split('-');
        this.sortField.set(field);
        this.sortOrder.set(order === 'asc' ? 1 : -1);
    }

    reload(): void {
        this.loading.set(true);
        setTimeout(() => this.loading.set(false), 1500);
    }

    toggleEmpty(): void {
        this.slotData.set(this.slotData().length ? [] : this.products);
    }

    importCode: Code = {
        typescript: `import { CzDataViewComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-data-view [value]="products" [rows]="4" [listTemplate]="list"></cz-data-view>

<ng-template #list let-items>
    @for (product of items; track product.id) {
        <div class="product-row">
            <img [src]="product.image" [alt]="product.name" />
            <div>
                <strong>{{ product.name }}</strong>
                <cz-tag [value]="product.status" [severity]="severity(product.status)" />
            </div>
            <span>\${{ product.price }}</span>
        </div>
    }
</ng-template>`,
        typescript: `products: Product[] = [
    { id: 1, name: 'UltraBook Pro', category: 'Laptops', price: 1499, rating: 4.8, status: 'INSTOCK', image: '/images/dataview/product-1.svg' },
];`,
    };

    layoutCode: Code = {
        html: `<cz-data-view
    [value]="products"
    [layout]="layout"
    [paginator]="true"
    [rows]="4"
    [headerTemplate]="header"
    [listTemplate]="list"
    [gridTemplate]="grid"
></cz-data-view>

<ng-template #header>
    <cz-select-button [options]="layoutOptions" [(ngModel)]="layout" />
</ng-template>

<ng-template #list let-items>…</ng-template>

<ng-template #grid let-items>
    <div class="cz-grid cz-grid-cols-1 cz-sm:grid-cols-2 cz-lg:grid-cols-3 cz-gap-md">…</div>
</ng-template>`,
    };

    paginationCode: Code = {
        html: `<cz-data-view
    [value]="products"
    [paginator]="true"
    [rows]="4"
    [rowsPerPageOptions]="[4, 8, 12]"
    [listTemplate]="list"
    (onPage)="onPage($event)"
></cz-data-view>`,
        typescript: `onPage(event: CzDataViewPageEvent): void {
    console.log(event.page, event.first, event.rows, event.pageCount);
}`,
    };

    sortingCode: Code = {
        html: `<cz-data-view [value]="products" [sortField]="sortField()" [sortOrder]="sortOrder()"
    [headerTemplate]="header" [listTemplate]="list"></cz-data-view>

<ng-template #header>
    <cz-select-button [options]="sortOptions" (ngModelChange)="onSortChange($event)" />
</ng-template>`,
        typescript: `onSortChange(key: string): void {
    const [field, order] = key.split('-');
    this.sortField.set(field);
    this.sortOrder.set(order === 'asc' ? 1 : -1);
}`,
    };

    loadingCode: Code = {
        html: `<cz-data-view [value]="products" [loading]="loading()" [rows]="3" [listTemplate]="list"></cz-data-view>`,
        typescript: `readonly loading = signal(false);

reload(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 1500);
}`,
    };

    slotsCode: Code = {
        html: `<cz-data-view
    [value]="products"
    [headerTemplate]="header"
    [listTemplate]="list"
    [emptyTemplate]="empty"
    [footerTemplate]="footer"
></cz-data-view>

<ng-template #header><strong>Catalog</strong></ng-template>
<ng-template #list let-items>…</ng-template>
<ng-template #empty><div>No products found</div></ng-template>
<ng-template #footer><span>Prices include VAT</span></ng-template>`,
    };
}
