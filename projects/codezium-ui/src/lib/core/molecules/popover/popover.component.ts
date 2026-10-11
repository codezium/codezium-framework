import {
    computed,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    model,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzOverlayZIndex, czOverlayZIndex } from '../../types';

export type CzPopoverPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
    selector: 'cz-popover',
    imports: [CommonModule],
    templateUrl: './popover.component.html',
    styleUrl: './popover.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-popover-host',
        '(document:click)': 'onDocumentClick($event)',
    },
})
export class CzPopoverComponent {
    /** Visibility (two-way bindable) */
    visible = model<boolean>(false);

    /** Position of the panel relative to the trigger */
    position = input<CzPopoverPosition>('bottom');
    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex()));


    /** Closes when clicking outside */
    dismissable = input<boolean>(true);

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

    toggle(event?: Event): void {
        event?.stopPropagation();
        this.visible.update((v) => !v);
    }

    onDocumentClick(event: Event): void {
        if (!this.visible() || !this.dismissable()) return;

        const target = event.target as Node | null;
        if (target && !this.el.nativeElement.contains(target)) {
            this.visible.set(false);
        }
    }
}
