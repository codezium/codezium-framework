import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideChevronUp, LucideDynamicIcon } from '@lucide/angular';

@Component({
    selector: 'cz-scroll-top',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './scroll-top.component.html',
    styleUrl: './scroll-top.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-scroll-top',
        '(window:scroll)': 'onWindowScroll()',
    },
})
export class CzScrollTopComponent {
    /** Scroll offset required to show the button */
    threshold = input<number>(400);

    /** Target element or selector (defaults to the window) */
    target = input<string | HTMLElement | null>(null);

    /** Accessible label */
    ariaLabel = input<string>('Scroll to top');

    /** Visibility state */
    visible = signal<boolean>(false);

    readonly ArrowIcon = LucideChevronUp;

    onWindowScroll(): void {
        if (this.target()) {
            const element = this.resolveTarget();
            this.visible.set((element?.scrollTop ?? 0) > this.threshold());
            return;
        }

        const offset = window.scrollY ?? document.documentElement.scrollTop ?? 0;
        this.visible.set(offset > this.threshold());
    }

    scrollToTop(): void {
        const element = this.resolveTarget();
        if (element) {
            element.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    private resolveTarget(): HTMLElement | null {
        const target = this.target();
        if (!target) return null;
        if (typeof target === 'string') {
            return document.querySelector<HTMLElement>(target);
        }
        return target;
    }
}
