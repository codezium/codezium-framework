import {
    Directive,
    ElementRef,
    Renderer2,
    inject,
    input,
} from '@angular/core';

/**
 * CzRippleDirective
 *
 * Adds a material-style ripple effect to any element.
 *
 * Usage:
 *   <button czRipple>Save</button>
 *   <div czRipple rippleColor="rgba(255,255,255,0.4)" [rippleCentered]="true">...</div>
 */
@Directive({
    selector: '[czRipple]',
    host: {
        'class': 'cz-ripple-host',
        '(mousedown)': 'onMouseDown($event)',
    },
})
export class CzRippleDirective {
    /** Disables the ripple effect */
    rippleDisabled = input<boolean>(false);

    /** Custom ripple color (defaults to currentColor) */
    rippleColor = input<string | null>(null);

    /** Starts the ripple from the center of the element */
    rippleCentered = input<boolean>(false);

    /** Duration in milliseconds */
    rippleDuration = input<number>(500);

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly renderer = inject(Renderer2);

    onMouseDown(event: MouseEvent): void {
        if (this.rippleDisabled()) return;

        const host = this.el.nativeElement;
        const rect = host.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = this.rippleCentered()
            ? rect.width / 2 - size / 2
            : event.clientX - rect.left - size / 2;
        const y = this.rippleCentered()
            ? rect.height / 2 - size / 2
            : event.clientY - rect.top - size / 2;

        const ripple = this.renderer.createElement('span') as HTMLSpanElement;
        ripple.className = 'cz-ripple';
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.backgroundColor = this.rippleColor() ?? 'currentColor';
        ripple.style.animationDuration = `${this.rippleDuration()}ms`;

        this.renderer.appendChild(host, ripple);
        setTimeout(() => ripple.remove(), this.rippleDuration() + 50);
    }
}
