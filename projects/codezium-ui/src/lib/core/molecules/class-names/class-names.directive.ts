import {
    Directive,
    effect,
    ElementRef,
    inject,
    input,
    Renderer2,
} from '@angular/core';

export type CzClassNamesValue =
    | string
    | Array<string | Record<string, boolean>>
    | Record<string, boolean>
    | null;

/**
 * CzClassNamesDirective
 *
 * Utility for conditional CSS class management.
 *
 * Usage:
 *   <div [czClassNames]="'always'" />
 *   <div [czClassNames]="['static', { active: isActive() }]" />
 */
@Directive({
    selector: '[czClassNames]',
})
export class CzClassNamesDirective {
    /** Class names as string, array or conditional record */
    czClassNames = input<CzClassNamesValue>(null);

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly renderer = inject(Renderer2);
    private applied = new Set<string>();

    constructor() {
        effect(() => {
            const next = new Set(this.resolve(this.czClassNames()));

            for (const className of this.applied) {
                if (!next.has(className)) {
                    this.renderer.removeClass(this.el.nativeElement, className);
                }
            }

            for (const className of next) {
                if (!this.applied.has(className)) {
                    this.renderer.addClass(this.el.nativeElement, className);
                }
            }

            this.applied = next;
        });
    }

    private resolve(value: CzClassNamesValue): string[] {
        if (!value) return [];
        if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);

        if (Array.isArray(value)) {
            const classes: string[] = [];
            for (const entry of value) {
                if (typeof entry === 'string') {
                    classes.push(...entry.split(/\s+/).filter(Boolean));
                } else if (entry) {
                    classes.push(
                        ...Object.entries(entry)
                            .filter(([, enabled]) => enabled)
                            .map(([className]) => className),
                    );
                }
            }
            return classes;
        }

        return Object.entries(value)
            .filter(([, enabled]) => enabled)
            .map(([className]) => className);
    }
}
