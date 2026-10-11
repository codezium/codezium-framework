import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    computed,
    input,
    model,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    LucideArrowDown,
    LucideArrowUp,
    LucideArrowUpDown,
    LucideChevronDown,
    LucideChevronRight,
    LucideDynamicIcon,
} from '@lucide/angular';
import { CzMenuItem, CzOverlayZIndex, czOverlayZIndex } from '../../types';
import { CzCheckboxComponent } from '../../atoms/checkbox';
import { CzPaginatorComponent } from '../../molecules/paginator';
import { CzProgressSpinnerComponent } from '../../atoms/progress-spinner';

export interface CzTableColumn {
    field: string;
    header: string;
    sortable?: boolean;
    width?: string;
    /** Custom cell template: `$implicit` row, `value`, `index` */
    template?: TemplateRef<unknown>;
}

export type CzTableSortOrder = 'asc' | 'desc';
export type CzTableSelectionMode = 'none' | 'single' | 'multiple';
export type CzTableSize = 'sm' | 'md' | 'lg';

export interface CzTableSortEvent {
    field: string;
    order: CzTableSortOrder;
}

@Component({
    selector: 'cz-table',
    imports: [
        CommonModule,
        FormsModule,
        LucideDynamicIcon,
        CzCheckboxComponent,
        CzPaginatorComponent,
        CzProgressSpinnerComponent,
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-table',
        '[class.cz-table--striped]': 'striped()',
        '[class.cz-table--gridlines]': 'gridlines()',
        '[attr.data-size]': 'size()',
        '(document:click)': 'closeContextMenu()',
        '(document:keydown.escape)': 'closeContextMenu()',
    },
})
export class CzTableComponent {
    /** Column definitions */
    columns = input<CzTableColumn[]>([]);

    /** Row data */
    value = input<Record<string, any>[]>([]);

    /** Field that uniquely identifies a row (used by selection and tracking) */
    dataKey = input<string | null>(null);

    /** Enables sorting on all columns with `sortable` not explicitly false */
    sortable = input<boolean>(false);

    /** Alternating row background */
    striped = input<boolean>(false);

    /** Shows cell borders */
    gridlines = input<boolean>(false);

    /** Row size */
    size = input<CzTableSize>('md');

    /** Message when there are no rows */
    emptyMessage = input<string>('No records found');

    /** Selection mode */
    selectionMode = input<CzTableSelectionMode>('none');

    /** Selected rows (multiple mode, two-way bindable) */
    selection = model<Record<string, any>[]>([]);

    /** Rows per page (0 disables pagination) */
    rows = input<number>(0);

    /** Options for the rows per page select */
    rowsPerPageOptions = input<number[]>([]);

    /** Height of the table viewport (sticky header + scroll). Null = no scroll */
    scrollHeight = input<string | null>(null);

    /** Shows a loading overlay */
    loading = input<boolean>(false);

    /** Global filter value (contains, case insensitive) */
    globalFilter = input<string>('');

    /** Fields used by the global filter (defaults to every column field) */
    filterFields = input<string[] | null>(null);

    /** Whole row template: `$implicit` row, `index` (replaces the default cells) */
    rowTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom header (write your own `<tr>`, supports colspan/rowspan) */
    headerTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom empty state */
    emptyTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom footer (`<tfoot>` content) */
    footerTemplate = input<TemplateRef<unknown> | null>(null);

    /** Row expansion template: `$implicit` row, `index` */
    expansionTemplate = input<TemplateRef<unknown> | null>(null);

    /** Items for the built-in row context menu (right click) */
    contextMenuItems = input<CzMenuItem[]>([]);

    /** Overlay z-index of the built-in context menu */
    zIndex = input<CzOverlayZIndex>(null);

    /** Emitted on sort */
    onSort = output<CzTableSortEvent>();

    /** Emitted when a row is selected (single mode) */
    onRowSelect = output<Record<string, any>>();

    /** Emitted when the multiple selection changes */
    onSelectionChange = output<Record<string, any>[]>();

    /** Emitted when a row is expanded */
    onRowExpand = output<Record<string, any>>();

    /** Emitted when a row is collapsed */
    onRowCollapse = output<Record<string, any>>();

    /** Emitted when a row is right-clicked */
    onRowContextMenu = output<{ row: Record<string, any>; event: MouseEvent }>();

    /** Emitted when a built-in context menu item is activated */
    onContextMenuSelect = output<{ item: CzMenuItem; row: Record<string, any> }>();

    /** Current sort state */
    sortField = signal<string | null>(null);
    sortOrder = signal<CzTableSortOrder | null>(null);

    /** Selected row (single mode) */
    selectedRow = signal<Record<string, any> | null>(null);

    /** Expanded rows */
    expandedRows = signal<Set<Record<string, any>>>(new Set());

    /** Built-in context menu state */
    contextMenuVisible = signal<boolean>(false);
    contextMenuPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });
    contextMenuRow = signal<Record<string, any> | null>(null);

    readonly contextMenuZIndex = computed(() => czOverlayZIndex(this.zIndex()));

    /** Current page (0 based) */
    page = signal<number>(0);

    readonly SortIcon = LucideArrowUpDown;
    readonly AscIcon = LucideArrowUp;
    readonly DescIcon = LucideArrowDown;
    readonly ExpandIcon = LucideChevronRight;
    readonly CollapseIcon = LucideChevronDown;

    /** Filtered rows (global filter) */
    readonly filteredValue = computed(() => {
        const filter = this.globalFilter().trim().toLowerCase();
        if (!filter) return this.value();

        const fields = this.filterFields() ?? this.columns().map(column => column.field);
        return this.value().filter(row =>
            fields.some(field => String(row[field] ?? '').toLowerCase().includes(filter)),
        );
    });

    /** Filtered + sorted rows */
    readonly sortedValue = computed(() => {
        const field = this.sortField();
        const order = this.sortOrder();
        const rows = [...this.filteredValue()];

        if (!field || !order) return rows;

        return rows.sort((a, b) => {
            const av = a[field];
            const bv = b[field];
            const result = av === bv ? 0 : av > bv ? 1 : -1;
            return order === 'asc' ? result : -result;
        });
    });

    readonly pageCount = computed(() => {
        const rows = this.rows();
        if (rows <= 0) return 1;
        return Math.max(1, Math.ceil(this.sortedValue().length / rows));
    });

    /** Rows of the current page */
    readonly paginatedValue = computed(() => {
        const rows = this.rows();
        if (rows <= 0) return this.sortedValue();

        const start = this.page() * rows;
        return this.sortedValue().slice(start, start + rows);
    });

    /** Total rendered columns (data + selection + expander) */
    readonly totalColumns = computed(
        () =>
            this.columns().length +
            (this.selectionMode() === 'multiple' ? 1 : 0) +
            (this.expansionTemplate() ? 1 : 0),
    );

    readonly allSelected = computed(() => {
        const rows = this.sortedValue();
        return rows.length > 0 && rows.every(row => this.isSelected(row));
    });

    isColumnSortable(column: CzTableColumn): boolean {
        return column.sortable ?? this.sortable();
    }

    toggleSort(column: CzTableColumn): void {
        if (!this.isColumnSortable(column)) return;

        this.page.set(0);

        if (this.sortField() !== column.field) {
            this.sortField.set(column.field);
            this.sortOrder.set('asc');
        } else if (this.sortOrder() === 'asc') {
            this.sortOrder.set('desc');
        } else {
            this.sortField.set(null);
            this.sortOrder.set(null);
            return;
        }

        this.onSort.emit({ field: this.sortField()!, order: this.sortOrder()! });
    }

    isSorted(column: CzTableColumn): boolean {
        return this.sortField() === column.field && !!this.sortOrder();
    }

    /* ── Selection ── */

    selectRow(row: Record<string, any>): void {
        if (this.selectionMode() === 'none') return;

        if (this.selectionMode() === 'single') {
            this.selectedRow.set(row);
            this.onRowSelect.emit(row);
            return;
        }

        this.toggleRow(row, !this.isSelected(row));
    }

    toggleRow(row: Record<string, any>, checked: boolean): void {
        const current = this.selection();
        const next = checked
            ? [...current.filter(item => !this.isSame(item, row)), row]
            : current.filter(item => !this.isSame(item, row));

        this.selection.set(next);
        this.onSelectionChange.emit(next);
    }

    toggleAll(checked: boolean): void {
        const next = checked ? [...this.sortedValue()] : [];
        this.selection.set(next);
        this.onSelectionChange.emit(next);
    }

    isSelected(row: Record<string, any>): boolean {
        return this.selection().some(item => this.isSame(item, row));
    }

    isRowHighlighted(row: Record<string, any>): boolean {
        if (this.selectionMode() === 'single') {
            const selected = this.selectedRow();
            return !!selected && this.isSame(selected, row);
        }
        return this.isSelected(row);
    }

    /* ── Context menu ── */

    handleRowContextMenu(row: Record<string, any>, event: MouseEvent): void {
        this.onRowContextMenu.emit({ row, event });

        if (!this.contextMenuItems().length) return;

        event.preventDefault();
        event.stopPropagation();
        this.contextMenuRow.set(row);
        this.contextMenuPosition.set({ x: event.clientX, y: event.clientY });
        this.contextMenuVisible.set(true);
    }

    activateContextMenuItem(item: CzMenuItem, event: Event): void {
        if (item.disabled || item.separator) return;

        event.stopPropagation();
        const row = this.contextMenuRow();
        item.command?.(event);

        if (row) {
            this.onContextMenuSelect.emit({ item, row });
        }

        this.closeContextMenu();
    }

    closeContextMenu(): void {
        if (!this.contextMenuVisible()) return;
        this.contextMenuVisible.set(false);
        this.contextMenuRow.set(null);
    }

    private isSame(a: Record<string, any> | null, b: Record<string, any> | null): boolean {
        if (!a || !b) return false;
        const key = this.dataKey();
        return key ? a[key] === b[key] : a === b;
    }

    trackRow(index: number, row: Record<string, any>): unknown {
        const key = this.dataKey();
        return key ? row[key] : index;
    }

    /* ── Row expansion ── */

    isExpanded(row: Record<string, any>): boolean {
        return this.expandedRows().has(row);
    }

    toggleExpand(row: Record<string, any>, event: Event): void {
        event.stopPropagation();

        const next = new Set(this.expandedRows());
        const expanded = next.has(row);

        if (expanded) {
            next.delete(row);
        } else {
            next.add(row);
        }

        this.expandedRows.set(next);

        if (expanded) {
            this.onRowCollapse.emit(row);
        } else {
            this.onRowExpand.emit(row);
        }
    }
}
