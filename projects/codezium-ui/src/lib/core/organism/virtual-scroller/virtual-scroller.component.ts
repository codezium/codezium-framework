import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    TemplateRef,
    afterNextRender,
    computed,
    input,
    output,
    signal,
    viewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzProgressSpinnerComponent } from '../../atoms/progress-spinner';

export type CzVirtualScrollerOrientation = 'vertical' | 'horizontal' | 'both';
export type CzVirtualScrollerItemSize = number | number[];

export interface CzVirtualScrollerItemContext {
    $implicit: any;
    index: number;
    count: number;
    first: number;
    last: number;
    even: boolean;
    odd: boolean;
    loading: boolean;
}

export interface CzVirtualScrollerLazyLoadEvent {
    first: number;
    last: number;
}

export interface CzVirtualScrollerScrollEvent {
    originalEvent: Event;
    scrollTop: number;
    scrollLeft: number;
}

@Component({
    selector: 'cz-virtual-scroller',
    imports: [CommonModule, CzProgressSpinnerComponent],
    templateUrl: './virtual-scroller.component.html',
    styleUrl: './virtual-scroller.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-virtual-scroller',
        '[class.cz-virtual-scroller--inline]': 'inline()',
        '[class]': 'styleClass()',
        '(window:resize)': 'measureViewport()',
    },
})
export class CzVirtualScrollerComponent {
    private readonly viewportRef = viewChild<ElementRef<HTMLElement>>('viewport');

    /** An array of objects to display */
    items = input<any[]>([]);

    /** The height/width of an item according to the orientation (array `[height, width]` for grid) */
    itemSize = input<CzVirtualScrollerItemSize>(40);

    /** Height of the scroll viewport */
    scrollHeight = input<string | null>(null);

    /** Width of the scroll viewport */
    scrollWidth = input<string | null>(null);

    /** The orientation of the scrollbar */
    orientation = input<CzVirtualScrollerOrientation>('vertical');

    /** Used to specify how many items to load in each load method in lazy mode */
    step = input<number>(0);

    /** Delay in ms before new data is rendered while scrolling */
    delay = input<number>(0);

    /** Defines if data is loaded and interacted with in lazy manner */
    lazy = input<boolean>(false);

    /** Defines whether the data is loaded (shows the mask in lazy mode) */
    loading = input<boolean>(false);

    /** Defines whether to show the loader overlay */
    showLoader = input<boolean>(false);

    /** If disabled, the scroller feature is eliminated and the content is displayed directly */
    disabled = input<boolean>(false);

    /** Specifies whether the scroller should be displayed inline */
    inline = input<boolean>(false);

    /** Fixed number of columns for the grid orientation */
    columns = input<number | null>(null);

    /** How many additional items to render outside of the viewport */
    numToleratedItems = input<number | null>(null);

    /** Function to optimize the item list rendering */
    trackBy = input<((index: number, item: any) => unknown) | null>(null);

    /** Style class of the host element */
    styleClass = input<string>('');

    /** Index of the element in tabbing order */
    tabindex = input<number | null>(null);

    /** Item template: `$implicit` item, `index`, `count`, `first`, `last`, `even`, `odd`, `loading` */
    itemTemplate = input<TemplateRef<unknown> | null>(null);

    /** Content template replacing the default list: `$implicit` visible items, `first`, `last`, `count` */
    contentTemplate = input<TemplateRef<unknown> | null>(null);

    /** Loader template (overlay content): `$implicit` placeholders, `count` */
    loaderTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom loading icon */
    loaderIconTemplate = input<TemplateRef<unknown> | null>(null);

    /** Emitted in lazy mode when scrolling requires a new chunk of data */
    onLazyLoad = output<CzVirtualScrollerLazyLoadEvent>();

    /** Emitted when the scroll position changes */
    onScroll = output<CzVirtualScrollerScrollEvent>();

    /** Emitted when the rendered range changes */
    onScrollIndexChange = output<CzVirtualScrollerLazyLoadEvent>();

    /** Legacy alias: fixed viewport height in pixels */
    height = input<number>(0);

    /** Legacy alias: property used to display each item in the default rendering */
    field = input<string>('');

    /** Legacy alias of `numToleratedItems` */
    overscan = input<number>(2);

    /* ── State ── */

    readonly scrollTop = signal<number>(0);
    readonly scrollLeft = signal<number>(0);
    readonly viewportHeight = signal<number>(0);
    readonly viewportWidth = signal<number>(0);

    private scrollTimer: ReturnType<typeof setTimeout> | null = null;

    /* ── Geometry ── */

    readonly itemHeight = computed(() => {
        const size = this.itemSize();
        if (Array.isArray(size)) return size[0] || 0;
        return this.orientation() === 'horizontal' ? 0 : size || 0;
    });

    readonly itemWidth = computed(() => {
        const size = this.itemSize();
        if (Array.isArray(size)) return size[1] || 0;
        return this.orientation() === 'horizontal' ? size || 0 : 0;
    });

    readonly scrollHeightValue = computed(() => this.scrollHeight() ?? (this.height() ? `${this.height()}px` : null));

    private readonly effectiveViewportHeight = computed(
        () => this.viewportHeight() || this.parseSize(this.scrollHeightValue()) || 0,
    );

    private readonly effectiveViewportWidth = computed(
        () => this.viewportWidth() || this.parseSize(this.scrollWidth()) || 0,
    );

    readonly tolerated = computed(() => this.numToleratedItems() ?? this.overscan());

    readonly gridColumns = computed(() => {
        if (this.orientation() !== 'both') return 1;
        const width = this.itemWidth() || 1;
        return this.columns() ?? Math.max(1, Math.floor((this.effectiveViewportWidth() || width * 3) / width));
    });

    readonly totalHeight = computed(() => {
        const total = this.items().length;
        if (this.orientation() === 'horizontal') return 0;
        if (this.orientation() === 'both') {
            return Math.ceil(total / this.gridColumns()) * this.itemHeight();
        }
        return total * this.itemHeight();
    });

    readonly visibleCount = computed(() => {
        if (this.orientation() === 'horizontal') {
            return Math.max(1, Math.ceil((this.effectiveViewportWidth() || 0) / (this.itemWidth() || 1)));
        }
        const rows = Math.max(1, Math.ceil((this.effectiveViewportHeight() || 0) / (this.itemHeight() || 1)));
        return rows * (this.orientation() === 'both' ? this.gridColumns() : 1);
    });

    /* ── Window ── */

    readonly first = computed(() => {
        if (this.disabled()) return 0;
        const tolerated = this.tolerated();

        if (this.orientation() === 'horizontal') {
            return Math.max(0, Math.floor(this.scrollLeft() / (this.itemWidth() || 1)) - tolerated);
        }

        const startRow = Math.max(0, Math.floor(this.scrollTop() / (this.itemHeight() || 1)) - tolerated);
        return this.orientation() === 'both' ? startRow * this.gridColumns() : startRow;
    });

    readonly last = computed(() => {
        if (this.disabled()) return this.items().length;
        const total = this.items().length;
        const count = this.visibleCount() + this.tolerated() * 2;
        return Math.min(total, this.first() + count);
    });

    readonly displayItems = computed(() => {
        if (this.disabled()) {
            return this.items().map((value, index) => ({ index, value, loading: false }));
        }

        const first = this.first();
        return this.items()
            .slice(first, this.last())
            .map((value, offset) => ({ index: first + offset, value, loading: this.lazy() && value == null }));
    });

    readonly spacerBefore = computed(() => {
        if (this.disabled()) return 0;
        if (this.orientation() === 'both') {
            return Math.floor(this.first() / this.gridColumns()) * this.itemHeight();
        }
        return this.first() * (this.orientation() === 'horizontal' ? this.itemWidth() : this.itemHeight());
    });

    readonly spacerAfter = computed(() => {
        if (this.disabled()) return 0;
        const total = this.items().length;

        if (this.orientation() === 'both') {
            const totalRows = Math.ceil(total / this.gridColumns());
            const lastRow = Math.ceil(this.last() / this.gridColumns());
            return Math.max(0, (totalRows - lastRow) * this.itemHeight());
        }

        const size = this.orientation() === 'horizontal' ? this.itemWidth() : this.itemHeight();
        return Math.max(0, (total - this.last()) * size);
    });

    readonly overlayVisible = computed(() => this.showLoader() || (this.lazy() && this.loading()));

    readonly loaderPlaceholders = computed(() => Array.from({ length: Math.max(1, this.visibleCount()) }));

    constructor() {
        afterNextRender(() => {
            this.measureViewport();
            if (this.lazy()) {
                this.onLazyLoad.emit({ first: this.first(), last: this.last() });
            }
        });
    }

    /* ── Scrolling ── */

    handleScroll(event: Event): void {
        const target = event.target as HTMLElement;
        this.onScroll.emit({ originalEvent: event, scrollTop: target.scrollTop, scrollLeft: target.scrollLeft });
        this.measureViewport();

        const apply = () => this.applyScroll(target.scrollTop, target.scrollLeft);

        if (this.delay() > 0) {
            if (this.scrollTimer) clearTimeout(this.scrollTimer);
            this.scrollTimer = setTimeout(apply, this.delay());
        } else {
            apply();
        }
    }

    private applyScroll(top: number, left: number): void {
        const first = this.first();
        const last = this.last();

        this.scrollTop.set(top);
        this.scrollLeft.set(left);

        if (this.first() !== first || this.last() !== last) {
            this.onScrollIndexChange.emit({ first: this.first(), last: this.last() });

            if (this.lazy()) {
                this.onLazyLoad.emit({ first: this.first(), last: this.last() });
            }
        }
    }

    /** Scrolls to a specific item index */
    scrollToIndex(index: number): void {
        const viewport = this.viewportRef()?.nativeElement;
        if (!viewport) return;

        if (this.orientation() === 'horizontal') {
            const left = index * this.itemWidth();
            viewport.scrollLeft = left;
            this.applyScroll(viewport.scrollTop, left);
            return;
        }

        const row = this.orientation() === 'both' ? Math.floor(index / this.gridColumns()) : index;
        const top = row * this.itemHeight();
        viewport.scrollTop = top;
        this.applyScroll(top, viewport.scrollLeft);
    }

    /** Scrolls to an absolute position */
    scrollTo(options: { top?: number; left?: number; behavior?: ScrollBehavior }): void {
        const viewport = this.viewportRef()?.nativeElement;
        if (!viewport) return;

        viewport.scrollTo(options as ScrollToOptions);
    }

    measureViewport(): void {
        const viewport = this.viewportRef()?.nativeElement;
        if (!viewport) return;

        this.viewportHeight.set(viewport.clientHeight);
        this.viewportWidth.set(viewport.clientWidth);
    }

    /* ── Helpers ── */

    trackItem(index: number, entry: { index: number; value: any }): unknown {
        const trackBy = this.trackBy();
        if (trackBy) return trackBy(entry.index, entry.value);
        return entry.index;
    }

    display(item: any): string {
        return this.field() ? String(item?.[this.field()]) : String(item);
    }

    private parseSize(value: string | null): number {
        if (!value) return 0;
        const parsed = parseInt(value, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }
}
