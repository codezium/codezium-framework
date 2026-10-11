import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    effect,
    input,
    signal,
    ViewEncapsulation,
    viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cz-splitter',
    imports: [CommonModule],
    templateUrl: './splitter.component.html',
    styleUrl: './splitter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-splitter',
        '[attr.data-orientation]': 'orientation()',
        '(window:mousemove)': 'onMouseMove($event)',
        '(window:mouseup)': 'stopResize()',
    },
})
export class CzSplitterComponent {
    /** Layout direction */
    orientation = input<'horizontal' | 'vertical'>('horizontal');

    /** Initial panel sizes (percentages) */
    panelSizes = input<number[]>([50, 50]);

    /** Current sizes */
    sizes = signal<number[]>([]);

    private readonly container = viewChild<ElementRef<HTMLElement>>('container');
    private draggingIndex = -1;
    private initialized = false;

    constructor() {
        effect(() => {
            const sizes = this.panelSizes();
            if (!this.initialized) {
                this.initialized = true;
                this.sizes.set([...sizes]);
            }
        });
    }

    startResize(event: MouseEvent, index: number): void {
        event.preventDefault();
        this.draggingIndex = index;
    }

    stopResize(): void {
        this.draggingIndex = -1;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.draggingIndex < 0) return;

        const container = this.container()?.nativeElement;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const index = this.draggingIndex;
        const sizes = [...this.sizes()];

        let percent: number;
        if (this.orientation() === 'horizontal') {
            if (rect.width === 0) return;
            percent = ((event.clientX - rect.left) / rect.width) * 100;
        } else {
            if (rect.height === 0) return;
            percent = ((event.clientY - rect.top) / rect.height) * 100;
        }

        const before = sizes.slice(0, index).reduce((sum, s) => sum + s, 0);
        const pairTotal = sizes[index] + sizes[index + 1];
        const first = Math.min(Math.max(percent - before, 10), pairTotal - 10);

        sizes[index] = first;
        sizes[index + 1] = pairTotal - first;
        this.sizes.set(sizes);
    }

    onGutterKeyDown(event: KeyboardEvent, index: number): void {
        const step = 5;
        let direction = 0;

        if (this.orientation() === 'horizontal') {
            if (event.key === 'ArrowLeft') direction = -1;
            if (event.key === 'ArrowRight') direction = 1;
        } else {
            if (event.key === 'ArrowUp') direction = -1;
            if (event.key === 'ArrowDown') direction = 1;
        }

        if (direction === 0) return;

        event.preventDefault();
        const sizes = [...this.sizes()];
        const pairTotal = sizes[index] + sizes[index + 1];
        const first = Math.min(Math.max(sizes[index] + direction * step, 10), pairTotal - 10);

        sizes[index] = first;
        sizes[index + 1] = pairTotal - first;
        this.sizes.set(sizes);
    }
}
