import {
    AfterViewInit,
    Directive,
    ElementRef,
    inject,
    input,
} from '@angular/core';

/**
 * CzAutoFocusDirective
 *
 * Focuses the host element on initial render.
 *
 * Usage:
 *   <input czAutoFocus />
 *   <input [czAutoFocus]="shouldFocus()" />
 */
@Directive({
    selector: '[czAutoFocus]',
})
export class CzAutoFocusDirective implements AfterViewInit {
    /** Whether to focus the element */
    czAutoFocus = input<boolean>(true);

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

    ngAfterViewInit(): void {
        if (!this.czAutoFocus()) return;
        queueMicrotask(() => this.el.nativeElement.focus());
    }
}
