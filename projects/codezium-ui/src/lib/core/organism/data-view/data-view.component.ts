import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    computed,
    contentChild,
    inject,
    input,
    output,
    signal,
    Directive,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown, LucideDynamicIcon } from '@lucide/angular';
import { CzPaginatorComponent } from '../../molecules/paginator';
import { CzProgressSpinnerComponent } from '../../atoms/progress-spinner';

export type CzDataViewLayout = 'list' | 'grid';
export type CzDataViewPaginatorPosition = 'top' | 'bottom' | 'both';

export interface CzDataViewPageEvent {
    page: number;
    first: number;
    rows: number;
    pageCount: number;
}

export interface CzDataViewSortEvent {
    sortField: string | null;
    sortOrder: 1 | -1;
}

/* ── Template slots ───────────────────────────────────────────── */

@Directive({ selector: '[czDataViewHeader]' })
export class CzDataViewHeaderDirective {
    readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({ selector: '[czDataViewList]' })
export class CzDataViewListDirective {
    readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({ selector: '[czDataViewGrid]' })
export class CzDataViewGridDirective {
    readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({ selector: '[czDataViewFooter]' })
export class CzDataViewFooterDirective {
    readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({ selector: '[czDataViewEmpty]' })
export class CzDataViewEmptyDirective {
    readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
    selector: 'cz-data-view',
    imports: [
        CommonModule,
        FormsModule,
        LucideDynamicIcon,
        CzPaginatorComponent,
        CzProgressSpinnerComponent,
    ],
    templateUrl: './data-view.component.html',
    styleUrl: './data-view.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-data-view',
    },
})
export class CzDataViewComponent {
    /** Data to display */
    value = input<Record<string, any>[]>([]);

    /** List or grid layout */
    layout = input<CzDataViewLayout>('list');

    /** Fallback property used to display each item and to sort by */
    field = input<string>('');

    /** Enables pagination */
    paginator = input<boolean>(false);

    /** Rows per page (0 uses 10 when paginator is enabled, all rows otherwise) */
    rows = input<number>(0);

    /** Total records, defaults to the length of `value` */
    totalRecords = input<number | null>(null);

    /** Options for the rows per page select */
    rowsPerPageOptions = input<number[]>([]);

    /** Position of the paginator */
    paginatorPosition = input<CzDataViewPaginatorPosition>('bottom');

    /** Shows the paginator even when there is only one page */
    alwaysShowPaginator = input<boolean>(true);

    /** Enables the built-in sort toggle button */
    sortable = input<boolean>(false);

    /** External sort field (takes precedence over the built-in sorting) */
    sortField = input<string | null>(null);

    /** External sort order: 1 = asc, -1 = desc */
    sortOrder = input<1 | -1>(1);

    /** Shows a loading overlay on top of the content */
    loading = input<boolean>(false);

    /** Message when there are no items */
    emptyMessage = input<string>('No records found');

    /** Custom trackBy for the fallback rendering */
    trackBy = input<((index: number, item: Record<string, any>) => unknown) | null>(null);

    /** Emitted when the page changes */
    onPage = output<CzDataViewPageEvent>();

    /** Emitted when the built-in sorting changes */
    onSort = output<CzDataViewSortEvent>();

    /* ── Template slots (single-component import) ── */

    /** Header template */
    headerTemplate = input<TemplateRef<unknown> | null>(null);

    /** List layout template (receives the page items as $implicit) */
    listTemplate = input<TemplateRef<unknown> | null>(null);

    /** Grid layout template (receives the page items as $implicit) */
    gridTemplate = input<TemplateRef<unknown> | null>(null);

    /** Footer template */
    footerTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom empty state template */
    emptyTemplate = input<TemplateRef<unknown> | null>(null);

    /* ── Optional attribute directives (alternative to the template inputs) ── */
    private readonly headerDirective = contentChild(CzDataViewHeaderDirective);
    private readonly listDirective = contentChild(CzDataViewListDirective);
    private readonly gridDirective = contentChild(CzDataViewGridDirective);
    private readonly footerDirective = contentChild(CzDataViewFooterDirective);
    private readonly emptyDirective = contentChild(CzDataViewEmptyDirective);

    readonly resolvedHeader = computed(() => this.headerTemplate() ?? this.headerDirective()?.templateRef ?? null);
    readonly resolvedList = computed(() => this.listTemplate() ?? this.listDirective()?.templateRef ?? null);
    readonly resolvedGrid = computed(() => this.gridTemplate() ?? this.gridDirective()?.templateRef ?? null);
    readonly resolvedFooter = computed(() => this.footerTemplate() ?? this.footerDirective()?.templateRef ?? null);
    readonly resolvedEmpty = computed(() => this.emptyTemplate() ?? this.emptyDirective()?.templateRef ?? null);

    /** Current page (0 based) */
    readonly page = signal(0);

    /** Internal sort order used by the built-in `sortable` button */
    private readonly internalOrder = signal<1 | -1 | null>(null);

    readonly SortIcon = LucideArrowUpDown;
    readonly SortAscIcon = LucideArrowUp;
    readonly SortDescIcon = LucideArrowDown;

    /** Effective rows per page */
    readonly effectiveRows = computed(() => {
        const rows = this.rows();
        if (rows > 0) return rows;
        return this.paginator() ? 10 : 0;
    });

    /** Effective total records */
    readonly effectiveTotal = computed(() => this.totalRecords() ?? this.value().length);

    readonly pageCount = computed(() => {
        const rows = this.effectiveRows();
        if (rows <= 0) return 1;
        return Math.max(1, Math.ceil(this.effectiveTotal() / rows));
    });

    readonly showPaginator = computed(
        () =>
            (this.paginator() || this.rows() > 0) &&
            (this.alwaysShowPaginator() || this.pageCount() > 1),
    );

    /** Effective sort field and order (external inputs win over the built-in state) */
    readonly activeSortField = computed(() => this.sortField() || this.field());
    readonly activeSortOrder = computed<1 | -1 | null>(() =>
        this.sortField() ? this.sortOrder() : this.internalOrder(),
    );

    readonly sortIcon = computed(() => {
        const order = this.activeSortOrder();
        if (order === 1) return this.SortAscIcon;
        if (order === -1) return this.SortDescIcon;
        return this.SortIcon;
    });

    /** Sorted and paginated data */
    readonly processedValue = computed(() => {
        const field = this.activeSortField();
        const order = this.activeSortOrder();
        let items = [...this.value()];

        if (field && order) {
            items.sort((a, b) => {
                const av = a[field];
                const bv = b[field];
                const result = av === bv ? 0 : av > bv ? 1 : -1;
                return order === 1 ? result : -result;
            });
        }

        const rows = this.effectiveRows();
        if (rows > 0) {
            const start = this.page() * rows;
            items = items.slice(start, start + rows);
        }

        return items;
    });

    display(item: Record<string, any>): string {
        return this.field() ? String(item[this.field()]) : String(item);
    }

    trackItem(index: number, item: Record<string, any>): unknown {
        return this.trackBy()?.(index, item) ?? index;
    }

    toggleSort(): void {
        if (!this.sortable() || this.sortField()) return;

        const next: 1 | -1 = this.internalOrder() === 1 ? -1 : 1;
        this.internalOrder.set(next);
        this.page.set(0);
        this.onSort.emit({ sortField: this.activeSortField() || null, sortOrder: next });
    }

    changePage(page: number): void {
        this.page.set(page);
        const rows = this.effectiveRows();
        this.onPage.emit({
            page,
            first: page * rows,
            rows,
            pageCount: this.pageCount(),
        });
    }
}
