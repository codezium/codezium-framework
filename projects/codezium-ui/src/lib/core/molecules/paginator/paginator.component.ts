import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    Optional,
    output,
    Self,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronsLeft,
    LucideChevronsRight,
    LucideDynamicIcon,
} from '@lucide/angular';

export interface CzPaginatorState {
    page: number;
    first: number;
    rows: number;
    pageCount: number;
}

@Component({
    selector: 'cz-paginator',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-paginator',
        '[class.cz-paginator--disabled]': 'actualDisabled()',
    },
})
export class CzPaginatorComponent implements ControlValueAccessor {
    /** Total amount of records */
    totalRecords = input<number>(0);

    /** Rows per page */
    rows = input<number>(10);

    /** Options for the rows per page select */
    rowsPerPageOptions = input<number[]>([]);

    /** Number of page links to display (0 = all) */
    pageLinkSize = input<number>(5);

    /** Shows the first/last page buttons */
    showFirstLastIcon = input<boolean>(true);

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Accessible label */
    ariaLabel = input<string>('Pagination');

    /** Emitted on page change */
    onPageChange = output<CzPaginatorState>();

    /** Current page (0 based) */
    page = signal<number>(0);

    /** Rows override coming from the rows per page select */
    rowsOverride = signal<number | null>(null);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    effectiveRows = computed(() => this.rowsOverride() ?? this.rows());

    pageCount = computed(() => Math.max(1, Math.ceil(this.totalRecords() / this.effectiveRows())));

    pages = computed(() => {
        const count = this.pageCount();
        const size = this.pageLinkSize();

        if (size <= 0 || size >= count) {
            return Array.from({ length: count }, (_, i) => i);
        }

        let start = this.page() - Math.floor(size / 2);
        start = Math.max(0, Math.min(start, count - size));
        return Array.from({ length: size }, (_, i) => start + i);
    });

    first = computed(() => this.page() * this.effectiveRows());

    rangeEnd = computed(() =>
        Math.min(this.first() + this.effectiveRows(), this.totalRecords()),
    );

    canPrev = computed(() => this.page() > 0);
    canNext = computed(() => this.page() < this.pageCount() - 1);

    readonly FirstIcon = LucideChevronsLeft;
    readonly PrevIcon = LucideChevronLeft;
    readonly NextIcon = LucideChevronRight;
    readonly LastIcon = LucideChevronsRight;

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    private emitState(): void {
        this.onPageChange.emit({
            page: this.page(),
            first: this.first(),
            rows: this.effectiveRows(),
            pageCount: this.pageCount(),
        });
    }

    goTo(page: number, event?: Event): void {
        if (this.actualDisabled()) return;

        const clamped = Math.max(0, Math.min(page, this.pageCount() - 1));
        if (clamped === this.page()) return;

        this.page.set(clamped);
        this.onChange(clamped);
        this.emitState();
        this.onTouched();
    }

    firstPage(): void {
        this.goTo(0);
    }

    lastPage(): void {
        this.goTo(this.pageCount() - 1);
    }

    nextPage(): void {
        this.goTo(this.page() + 1);
    }

    prevPage(): void {
        this.goTo(this.page() - 1);
    }

    onRowsChange(event: Event): void {
        const rows = Number((event.target as HTMLSelectElement).value);
        if (!rows || Number.isNaN(rows)) return;

        this.rowsOverride.set(rows);
        this.page.set(0);
        this.onChange(0);
        this.emitState();
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        const page = Number(value);
        this.page.set(Number.isNaN(page) ? 0 : Math.max(0, page));
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.formsDisabled.set(isDisabled);
    }
}
