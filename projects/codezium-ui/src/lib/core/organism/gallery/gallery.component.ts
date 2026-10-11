import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    model,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LucideChevronLeft,
    LucideChevronRight,
    LucideDynamicIcon,
    LucideX,
} from '@lucide/angular';

export interface CzGalleryImage {
    src: string;
    alt?: string;
    thumbnail?: string;
}

@Component({
    selector: 'cz-gallery',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-gallery',
        '(document:keydown)': 'onKeydown($event)',
    },
})
export class CzGalleryComponent {
    /** Images to display */
    images = input<CzGalleryImage[]>([]);

    /** Active image index */
    activeIndex = model<number>(0);

    /** Fullscreen preview visibility */
    fullscreen = model<boolean>(false);

    readonly CloseIcon = LucideX;
    readonly PrevIcon = LucideChevronLeft;
    readonly NextIcon = LucideChevronRight;

    current = computed(() => this.images()[this.activeIndex()] ?? null);

    thumbnailOf(image: CzGalleryImage): string {
        return image.thumbnail ?? image.src;
    }

    open(index: number): void {
        this.activeIndex.set(index);
        this.fullscreen.set(true);
    }

    close(): void {
        this.fullscreen.set(false);
    }

    next(): void {
        const last = this.images().length - 1;
        if (last < 0) return;
        this.activeIndex.update((i) => (i >= last ? 0 : i + 1));
    }

    prev(): void {
        const last = this.images().length - 1;
        if (last < 0) return;
        this.activeIndex.update((i) => (i <= 0 ? last : i - 1));
    }

    onKeydown(event: KeyboardEvent): void {
        if (!this.fullscreen()) return;

        switch (event.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowRight':
                this.next();
                break;
            case 'ArrowLeft':
                this.prev();
                break;
        }
    }
}
