import {
    Directive,
    effect,
    ElementRef,
    inject,
    input,
    Renderer2,
} from '@angular/core';

/**
 * CzBindDirective
 *
 * Utility directive for binding a record of attributes to the host element.
 *
 * Usage:
 *   <button [czBind]="{ 'aria-label': 'Save', 'data-role': 'primary', disabled: true }">
 */
@Directive({
    selector: '[czBind]',
})
export class CzBindDirective {
    /** Record of attribute name -> value */
    czBind = input<Record<string, unknown> | null>(null);

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly renderer = inject(Renderer2);
    private appliedKeys = new Set<string>();

    constructor() {
        effect(() => {
            const record = this.czBind() ?? {};
            const nextKeys = new Set(Object.keys(record));

            for (const key of this.appliedKeys) {
                if (!nextKeys.has(key)) {
                    this.renderer.removeAttribute(this.el.nativeElement, key);
                }
            }

            for (const [key, value] of Object.entries(record)) {
                if (value === null || value === undefined || value === false) {
                    this.renderer.removeAttribute(this.el.nativeElement, key);
                } else if (value === true) {
                    this.renderer.setAttribute(this.el.nativeElement, key, '');
                } else {
                    this.renderer.setAttribute(this.el.nativeElement, key, String(value));
                }
            }

            this.appliedKeys = nextKeys;
        });
    }
}
