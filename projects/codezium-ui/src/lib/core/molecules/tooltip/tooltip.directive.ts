import {
    Directive,
    ElementRef,
    inject,
    input,
    OnDestroy,
    Renderer2,
    DOCUMENT,
} from '@angular/core';
import { CzPopoverPosition } from '../popover';
import { CzOverlayZIndex, czOverlayZIndex } from '../../types';

let nextTooltipId = 0;

/**
 * CzTooltipDirective
 *
 * Shows a floating tooltip on hover/focus.
 *
 * Usage:
 *   <button czTooltip="Save changes" tooltipPosition="top">Save</button>
 */
@Directive({
    selector: '[czTooltip]',
    host: {
        '(mouseenter)': 'show()',
        '(mouseleave)': 'hide()',
        '(focus)': 'show()',
        '(blur)': 'hide()',
        '(keydown.escape)': 'hide()',
    },
})
export class CzTooltipDirective implements OnDestroy {
    /** Tooltip text */
    czTooltip = input<string>('');

    /** Tooltip position */
    tooltipPosition = input<CzPopoverPosition>('top');

    /** Disables the tooltip */
    tooltipDisabled = input<boolean>(false);

    /** Tooltip z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    tooltipZIndex = input<CzOverlayZIndex>(null);

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly renderer = inject(Renderer2);
    private readonly document = inject(DOCUMENT);

    private readonly tooltipId = `cz-tooltip-${nextTooltipId++}`;
    private tooltipEl: HTMLElement | null = null;

    show(): void {
        if (this.tooltipDisabled() || !this.czTooltip() || this.tooltipEl) return;

        const host = this.el.nativeElement;
        const rect = host.getBoundingClientRect();

        const tooltip = this.renderer.createElement('span') as HTMLElement;
        tooltip.className = 'cz-tooltip';
        tooltip.id = this.tooltipId;
        tooltip.setAttribute('role', 'tooltip');
        tooltip.setAttribute('data-position', this.tooltipPosition());
        tooltip.textContent = this.czTooltip();

        this.renderer.appendChild(this.document.body, tooltip);

        // Position after being attached so the size is measurable
        const tooltipRect = tooltip.getBoundingClientRect();
        const offset = 8;
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.top - tooltipRect.height - offset;

        switch (this.tooltipPosition()) {
            case 'bottom':
                top = rect.bottom + offset;
                break;
            case 'left':
                left = rect.left - tooltipRect.width - offset;
                top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                break;
            case 'right':
                left = rect.right + offset;
                top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                break;
            default:
                break;
        }

        this.renderer.setStyle(tooltip, 'left', `${Math.max(offset, left)}px`);
        this.renderer.setStyle(tooltip, 'top', `${Math.max(offset, top)}px`);

        const zIndex = czOverlayZIndex(this.tooltipZIndex());
        if (zIndex !== null) {
            this.renderer.setStyle(tooltip, 'z-index', String(zIndex));
        }

        host.setAttribute('aria-describedby', this.tooltipId);
        this.tooltipEl = tooltip;
    }

    hide(): void {
        if (!this.tooltipEl) return;
        this.renderer.removeChild(this.document.body, this.tooltipEl);
        this.tooltipEl = null;
        this.el.nativeElement.removeAttribute('aria-describedby');
    }

    ngOnDestroy(): void {
        this.hide();
    }
}
