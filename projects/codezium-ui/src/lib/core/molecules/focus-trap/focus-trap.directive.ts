import {
    AfterViewInit,
    Directive,
    ElementRef,
    inject,
    input,
    OnDestroy,
} from '@angular/core';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * CzFocusTrapDirective
 *
 * Keeps Tab focus within the host element while active and restores focus on destroy.
 *
 * Usage:
 *   <div czFocusTrap>... focusable content ...</div>
 *   <div [czFocusTrap]="isDialogOpen">...</div>
 */
@Directive({
    selector: '[czFocusTrap]',
    host: {
        '(keydown)': 'onKeyDown($event)',
    },
})
export class CzFocusTrapDirective implements AfterViewInit, OnDestroy {
    /** Whether the trap is active */
    czFocusTrap = input<boolean>(true);

    /** Moves focus to the first focusable element on init */
    focusTrapAutoFocus = input<boolean>(true);

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
    private previouslyFocused: HTMLElement | null = null;

    ngAfterViewInit(): void {
        if (this.czFocusTrap()) {
            this.activate();
        }
    }

    ngOnDestroy(): void {
        this.restore();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.czFocusTrap() || event.key !== 'Tab') return;

        const focusables = this.focusables();
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && active === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    }

    private activate(): void {
        this.previouslyFocused = document.activeElement as HTMLElement | null;
        if (this.focusTrapAutoFocus()) {
            queueMicrotask(() => this.focusables()[0]?.focus());
        }
    }

    private restore(): void {
        if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
            this.previouslyFocused.focus();
        }
        this.previouslyFocused = null;
    }

    private focusables(): HTMLElement[] {
        return Array.from(
            this.el.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
    }
}
