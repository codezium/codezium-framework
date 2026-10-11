import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cz-virtual-scroller',
    imports: [CommonModule],
    templateUrl: './virtual-scroller.component.html',
    styleUrl: './virtual-scroller.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-virtual-scroller',
    },
})
export class CzVirtualScrollerComponent {
    /** Items to render virtually */
    items = input<any[]>([]);

    /** Height of each item in pixels */
    itemSize = input<number>(40);

    /** Height of the viewport in pixels */
    height = input<number>(288);

    /** Property used to display each item */
    field = input<string>('');

    /** Extra items rendered outside the viewport */
    overscan = input<number>(2);

    /** Current scroll offset */
    scrollTop = signal<number>(0);

    totalHeight = computed(() => this.items().length * this.itemSize());

    startIndex = computed(() => {
        const start = Math.floor(this.scrollTop() / this.itemSize()) - this.overscan();
        return Math.max(0, start);
    });

    endIndex = computed(() => {
        const visible = Math.ceil(this.height() / this.itemSize());
        const end = this.startIndex() + visible + this.overscan() * 2;
        return Math.min(this.items().length, end);
    });

    visibleItems = computed(() => {
        const start = this.startIndex();
        return this.items()
            .slice(start, this.endIndex())
            .map((value, offset) => ({ index: start + offset, value }));
    });

    offsetY = computed(() => this.startIndex() * this.itemSize());

    display(item: any): string {
        return this.field() ? String(item[this.field()]) : String(item);
    }

    onScroll(event: Event): void {
        this.scrollTop.set((event.target as HTMLElement).scrollTop);
    }
}
