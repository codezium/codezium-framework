import {
    AfterViewInit,
    Directive,
    ElementRef,
    inject,
    input,
    OnDestroy,
    signal,
} from '@angular/core';

/**
 * CzAnimateOnScrollDirective
 *
 * Applies enter/leave animations when the element moves in and out of the viewport.
 *
 * Usage:
 *   <div czAnimateOnScroll="fade-up">...</div>
 *   <div [czAnimateOnScroll]="'zoom-in'" [aosDelay]="200">...</div>
 */
@Directive({
    selector: '[czAnimateOnScroll]',
    host: {
        'class': 'cz-aos',
        '[attr.data-animation]': 'czAnimateOnScroll() || "fade-up"',
        '[class.cz-aos--visible]': 'visible()',
        '[style.transition-delay.ms]': 'aosDelay() || null',
    },
})
export class CzAnimateOnScrollDirective implements AfterViewInit, OnDestroy {
    /** Animation name (fade-up, fade-down, fade-left, fade-right, zoom-in) */
    czAnimateOnScroll = input<string>('fade-up');

    /** Delay in milliseconds */
    aosDelay = input<number>(0);

    /** Keeps the element visible after the first intersection */
    aosOnce = input<boolean>(true);

    /** Visibility state */
    visible = signal<boolean>(false);

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
    private observer?: IntersectionObserver;

    ngAfterViewInit(): void {
        if (typeof IntersectionObserver === 'undefined') {
            this.visible.set(true);
            return;
        }

        this.observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        this.visible.set(true);
                        if (this.aosOnce()) {
                            this.observer?.disconnect();
                        }
                    } else if (!this.aosOnce()) {
                        this.visible.set(false);
                    }
                }
            },
            { threshold: 0.1 },
        );

        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }
}
