import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type CzIconFieldPosition = 'left' | 'right';
export type CzIconFieldSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'cz-icon-field',
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    styleUrl: './icon-field.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-icon-field',
        '[class.cz-icon-field--left]': 'iconPosition() === "left"',
        '[class.cz-icon-field--right]': 'iconPosition() === "right"',
        '[class.cz-icon-field-fluid]': 'fluid()',
        '[attr.data-size]': 'size()'
    }
})
export class CzIconFieldComponent implements AfterViewInit {
    /** Position of the icon relative to the input */
    iconPosition = input<CzIconFieldPosition>('left');

    /** Size of the field */
    size = input<CzIconFieldSize>('md');

    /** Whether the field should take up the full width of its container */
    fluid = input<boolean>(false);

    private readonly host = inject(ElementRef<HTMLElement>);
    private readonly destroyRef = inject(DestroyRef);
    private resizeObserver?: ResizeObserver;

    ngAfterViewInit(): void {
        this.updateIconCenter();

        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => this.updateIconCenter());
            this.resizeObserver.observe(this.host.nativeElement);

            const target = this.findInputContainer();
            if (target) {
                this.resizeObserver.observe(target);
            }
        }

        this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());
    }

    /** Finds the visual input box of the projected control */
    private findInputContainer(): HTMLElement | null {
        return this.host.nativeElement.querySelector(
            '.cz-input-container, .cz-select-button-container, .cz-autocomplete-container, .cz-input-native, textarea, input',
        ) as HTMLElement | null;
    }

    /** Centers the projected icon exactly on the input box */
    private updateIconCenter(): void {
        const host = this.host.nativeElement;
        const target = this.findInputContainer();
        if (!target) return;

        const hostRect = host.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        if (!targetRect.height) return;

        const centerY = targetRect.top - hostRect.top + targetRect.height / 2;
        const offsetLeft = targetRect.left - hostRect.left;
        const offsetRight = hostRect.right - targetRect.right;

        host.style.setProperty('--cz-icon-center-y', `${centerY}px`);
        host.style.setProperty('--cz-icon-offset-left', `${offsetLeft}px`);
        host.style.setProperty('--cz-icon-offset-right', `${offsetRight}px`);
    }
}
