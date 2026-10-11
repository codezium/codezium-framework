import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
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
    LucideDynamicIcon,
} from '@lucide/angular';
import { CzPaginatorComponent } from '../../molecules/paginator';

export interface CzTableColumn {
    field: string;
    header: string;
    sortable?: boolean;
    width?: string;
}

export type CzTableSortOrder = 'asc' | 'desc';

export interface CzTableSortEvent {
    field: string;
    order: CzTableSortOrder;
}

@Component({
    selector: 'cz-table',
    imports: [CommonModule, FormsModule, LucideDynamicIcon, CzPaginatorComponent],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-table',
        '[class.cz-table--striped]': 'striped()',
        '[class.cz-table--gridlines]': 'gridlines()',
    },
})
export class CzTableComponent {
    /** Column definitions */
    columns = input<CzTableColumn[]>([]);

    /** Row data */
    value = input<Record<string, any>[]>([]);

    /** Enables sorting on all columns with `sortable` not explicitly false */
    sortable = input<boolean>(false);

    /** Alternating row background */
    striped = input<boolean>(false);

    /** Shows cell borders */
    gridlines = input<boolean>(false);

    /** Message when there are no rows */
    emptyMessage = input<string>('No records found');

    /** Enables single row selection */
    selectionMode = input<'none' | 'single'>('none');

    /** Rows per page (0 disables pagination) */
    rows = input<number>(0);

    /** Emitted on sort */
    onSort = output<CzTableSortEvent>();

    /** Emitted when a row is selected */
    onRowSelect = output<Record<string, any>>();

    /** Current sort state */
    sortField = signal<string | null>(null);
    sortOrder = signal<CzTableSortOrder | null>(null);

    /** Selected row */
    selectedRow = signal<Record<string, any> | null>(null);

    /** Current page (0 based) */
    page = signal<number>(0);

    readonly SortIcon = LucideArrowUpDown;
    readonly AscIcon = LucideArrowUp;
    readonly DescIcon = LucideArrowDown;

    pageCount = computed(() => {
        const rows = this.rows();
        if (rows <= 0) return 1;
        return Math.max(1, Math.ceil(this.value().length / rows));
    });

    sortedValue = computed(() => {
        const field = this.sortField();
        const order = this.sortOrder();
        const rows = [...this.value()];

        if (!field || !order) return rows;

        return rows.sort((a, b) => {
            const av = a[field];
            const bv = b[field];
            const result = av === bv ? 0 : av > bv ? 1 : -1;
            return order === 'asc' ? result : -result;
        });
    });

    paginatedValue = computed(() => {
        const rows = this.rows();
        if (rows <= 0) return this.sortedValue();

        const start = this.page() * rows;
        return this.sortedValue().slice(start, start + rows);
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

    selectRow(row: Record<string, any>): void {
        if (this.selectionMode() !== 'single') return;
        this.selectedRow.set(row);
        this.onRowSelect.emit(row);
    }
}
