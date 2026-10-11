import {
    Directive,
    effect,
    ElementRef,
    inject,
    input,
    OnDestroy,
    Renderer2,
} from '@angular/core';

/**
 * CzStyleClassDirective
 *
 * Manages a CSS class on the host element with optional enter/leave animation
 * classes triggered when the active state changes.
 *
 * Usage:
 *   <div [czStyleClass]="'panel-open'"
 *        [styleClassActive]="open()"
 *        styleClassEnter="cz-style-class-enter"
 *        styleClassLeave="cz-style-class-leave">
 */
@Directive({
    selector: '[czStyleClass]',
})
export class CzStyleClassDirective implements OnDestroy {
    /** Class toggled while active */
    czStyleClass = input<string>('');

    /** Active state */
    styleClassActive = input<boolean>(false);

    /** Animation class added on enter */
    styleClassEnter = input<string>('');

    /** Animation class added on leave */
    styleClassLeave = input<string>('');

    /** Duration of the animation classes in ms */
    styleClassDuration = input<number>(400);

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly renderer = inject(Renderer2);
    private lastActive: boolean | null = null;
    private timeouts: ReturnType<typeof setTimeout>[] = [];

    constructor() {
        effect(() => {
            const className = this.czStyleClass();
            const active = this.styleClassActive();

            if (!className || active === this.lastActive) return;
            this.lastActive = active;

            if (active) {
                this.renderer.addClass(this.el.nativeElement, className);
                this.playAnimation(this.styleClassEnter());
            } else {
                const leave = this.styleClassLeave();
                if (leave) {
                    this.playAnimation(leave, () => {
                        this.renderer.removeClass(this.el.nativeElement, leave);
                        this.renderer.removeClass(this.el.nativeElement, className);
                    });
                } else {
                    this.renderer.removeClass(this.el.nativeElement, className);
                }
            }
        });
    }

    private playAnimation(animationClass: string, onEnd?: () => void): void {
        if (!animationClass) {
            onEnd?.();
            return;
        }

        this.renderer.addClass(this.el.nativeElement, animationClass);

        const timeout = setTimeout(() => {
            if (!onEnd) {
                this.renderer.removeClass(this.el.nativeElement, animationClass);
            }
            onEnd?.();
        }, this.styleClassDuration());

        this.timeouts.push(timeout);
    }

    ngOnDestroy(): void {
        for (const timeout of this.timeouts) {
            clearTimeout(timeout);
        }
        this.timeouts = [];
    }
}
