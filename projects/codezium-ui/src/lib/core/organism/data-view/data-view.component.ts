import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideArrowUpDown, LucideDynamicIcon } from '@lucide/angular';
import { CzPaginatorComponent } from '../../molecules/paginator';

export type CzDataViewLayout = 'list' | 'grid';

@Component({
    selector: 'cz-data-view',
    imports: [CommonModule, FormsModule, LucideDynamicIcon, CzPaginatorComponent],
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

    /** Property used to display each item */
    field = input<string>('');

    /** Rows per page (0 disables pagination) */
    rows = input<number>(0);

    /** Enables sorting by the `field` property */
    sortable = input<boolean>(false);

    /** Message when there are no items */
    emptyMessage = input<string>('No records found');

    /** Current page (0 based) */
    page = signal(0);

    /** Sort order */
    sortOrder = signal<'asc' | 'desc' | null>(null);

    readonly SortIcon = LucideArrowUpDown;

    pageCount = computed(() => {
        const rows = this.rows();
        if (rows <= 0) return 1;
        return Math.max(1, Math.ceil(this.value().length / rows));
    });

    processedValue = computed(() => {
        const field = this.field();
        const order = this.sortOrder();
        let items = [...this.value()];

        if (field && order) {
            items.sort((a, b) => {
                const av = a[field];
                const bv = b[field];
                const result = av === bv ? 0 : av > bv ? 1 : -1;
                return order === 'asc' ? result : -result;
            });
        }

        const rows = this.rows();
        if (rows > 0) {
            const start = this.page() * rows;
            items = items.slice(start, start + rows);
        }

        return items;
    });

    display(item: Record<string, any>): string {
        return this.field() ? String(item[this.field()]) : String(item);
    }

    toggleSort(): void {
        if (!this.sortable()) return;
        this.sortOrder.update((order) => (order === 'asc' ? 'desc' : 'asc'));
        this.page.set(0);
    }
}
