import {
    ChangeDetectionStrategy,
    Component,
    effect,
    input,
    model,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LucideChevronLeft,
    LucideChevronRight,
    LucideDynamicIcon,
} from '@lucide/angular';

@Component({
    selector: 'cz-carousel',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-carousel',
    },
})
export class CzCarouselComponent {
    /** Slides data */
    items = input<any[]>([]);

    /** Property used to display each slide */
    field = input<string>('');

    /** Wraps around at the edges */
    circular = input<boolean>(false);

    /** Shows the dot indicators */
    showIndicators = input<boolean>(true);

    /** Shows the prev/next navigators */
    showNavigators = input<boolean>(true);

    /** Advances automatically */
    autoPlay = input<boolean>(false);

    /** Auto play interval in ms */
    autoPlayInterval = input<number>(3000);

    /** Active slide index (two-way) */
    activeIndex = model<number>(0);

    readonly PrevIcon = LucideChevronLeft;
    readonly NextIcon = LucideChevronRight;

    constructor() {
        effect((onCleanup) => {
            if (!this.autoPlay() || this.items().length <= 1) return;

            const id = setInterval(() => this.next(), this.autoPlayInterval());
            onCleanup(() => clearInterval(id));
        });
    }

    display(item: any): string {
        return this.field() ? String(item[this.field()]) : String(item);
    }

    next(): void {
        const last = this.items().length - 1;
        if (last < 0) return;

        if (this.activeIndex() >= last) {
            this.activeIndex.set(this.circular() ? 0 : last);
        } else {
            this.activeIndex.update((i) => i + 1);
        }
    }

    prev(): void {
        const last = this.items().length - 1;
        if (last < 0) return;

        if (this.activeIndex() <= 0) {
            this.activeIndex.set(this.circular() ? last : 0);
        } else {
            this.activeIndex.update((i) => i - 1);
        }
    }

    goTo(index: number): void {
        if (index < 0 || index >= this.items().length) return;
        this.activeIndex.set(index);
    }
}
