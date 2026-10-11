import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    model,
    output,
    signal,
    ViewChild,
    ViewEncapsulation,
    type WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideDynamicIcon, LucideMaximize2, LucideMinimize2 } from '@lucide/angular';
import { CzFocusTrapDirective } from '../../molecules/focus-trap';
import { CzOverlayZIndex, czOverlayZIndex } from '../../types';
import { CzDialogService } from './dialog.service';

export type CzDialogPosition =
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'topleft'
    | 'topright'
    | 'bottomleft'
    | 'bottomright';

@Component({
    selector: 'cz-dialog',
    imports: [CommonModule, CzFocusTrapDirective, LucideDynamicIcon],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-dialog-host',
        '(document:keydown.escape)': 'onEscape()',
    },
})
export class CzDialogComponent {
    /** Visibility (two-way bindable) */
    visible = model<boolean>(false);

    /** Optional id: when set, the dialog is controlled through CzDialogService */
    dialogId = input<string | null>(null);

    /** Dialog title */
    header = input<string>('');

    /** Shows the backdrop mask */
    modal = input<boolean>(true);

    /** Shows the close button */
    closable = input<boolean>(true);

    /** Closes when the mask is clicked */
    dismissableMask = input<boolean>(false);

    /** Closes when Escape is pressed */
    closeOnEscape = input<boolean>(true);

    /** Position of the dialog */
    position = input<CzDialogPosition>('center');

    /** Dialog width */
    width = input<string>('30rem');

    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    /** Whether to render the header (title + actions) */
    showHeader = input<boolean>(true);

    /** Enables repositioning the dialog by dragging its header */
    draggable = input<boolean>(false);

    /** Enables resizing the dialog from its bottom-right corner */
    resizable = input<boolean>(false);

    /** Enables the full screen mode toggle */
    maximizable = input<boolean>(false);

    /** Maximized state (two-way bindable) */
    maximized = model<boolean>(false);

    /** Widths per breakpoint, e.g. { '1199px': '75vw', '575px': '90vw' } */
    breakpoints = input<Record<string, string> | null>(null);

    /** Custom style class for the dialog panel */
    styleClass = input<string>('');

    /** Accessible label of the close button */
    closeAriaLabel = input<string>('Close');

    /** Moves focus into the dialog when it opens */
    focusOnShow = input<boolean>(true);

    /** Blocks the background scroll while the dialog is visible */
    blockScroll = input<boolean>(true);

    /** Emitted when the dialog is shown */
    onShow = output<void>();

    /** Emitted when the dialog is hidden */
    onHide = output<void>();

    /** Emitted when the maximized state changes */
    onMaximize = output<boolean>();

    @ViewChild('dialogEl') private dialogEl?: ElementRef<HTMLElement>;

    private readonly dialogService = inject(CzDialogService);
    private readonly serviceFlag = signal<WritableSignal<boolean> | null>(null);

    private readonly dragOffset = signal({ x: 0, y: 0 });
    private readonly resizeSize = signal<{ width: string; height: string } | null>(null);
    private readonly breakpointWidth = signal<string | null>(null);

    private dragState: { x: number; y: number; ox: number; oy: number } | null = null;
    private resizeState: { x: number; y: number; w: number; h: number } | null = null;

    readonly MaximizeIcon = LucideMaximize2;
    readonly MinimizeIcon = LucideMinimize2;

    /** Effective visibility: service-controlled when dialogId is set */
    readonly isVisible = computed(() => {
        const flag = this.serviceFlag();
        return flag ? flag() : this.visible();
    });

    readonly maskZIndex = computed(() => czOverlayZIndex(this.zIndex()));

    readonly wrapperZIndex = computed(() => czOverlayZIndex(this.zIndex(), 1));

    readonly dialogWidth = computed(() => {
        if (this.maximized()) return '100vw';
        return this.resizeSize()?.width ?? this.breakpointWidth() ?? this.width();
    });

    readonly dialogHeight = computed(() => {
        if (this.maximized()) return '100vh';
        return this.resizeSize()?.height ?? null;
    });

    readonly transformStyle = computed(() => {
        if (this.maximized()) return null;
        const { x, y } = this.dragOffset();
        return x === 0 && y === 0 ? null : `translate(${x}px, ${y}px)`;
    });

    constructor() {
        // Keep the service flag in sync with the dialog id
        effect(() => {
            const id = this.dialogId();
            this.serviceFlag.set(id ? this.dialogService.register(id) : null);
        });

        // Open lifecycle: onShow, focus, breakpoints, scroll lock
        effect(onCleanup => {
            if (!this.isVisible()) return;

            queueMicrotask(() => {
                if (this.focusOnShow()) {
                    this.dialogEl?.nativeElement.focus();
                }
            });
            this.onShow.emit();
            this.applyBreakpoints();

            const onWindowResize = () => this.applyBreakpoints();
            window.addEventListener('resize', onWindowResize);

            let previousOverflow: string | null = null;
            if (this.blockScroll()) {
                previousOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
            }

            onCleanup(() => {
                window.removeEventListener('resize', onWindowResize);
                if (previousOverflow !== null) {
                    document.body.style.overflow = previousOverflow;
                }
            });
        });

        // Reset transient state when the dialog hides
        effect(() => {
            if (!this.isVisible()) {
                this.dragOffset.set({ x: 0, y: 0 });
                this.resizeSize.set(null);
                this.breakpointWidth.set(null);
                this.maximized.set(false);
            }
        });
    }

    close(): void {
        if (!this.closable()) return;
        this.hide();
    }

    onMaskClick(): void {
        if (this.dismissableMask()) {
            this.hide();
        }
    }

    onEscape(): void {
        if (this.isVisible() && this.closeOnEscape()) {
            this.hide();
        }
    }

    toggleMaximize(): void {
        const next = !this.maximized();
        this.maximized.set(next);
        this.dragOffset.set({ x: 0, y: 0 });
        this.resizeSize.set(null);
        this.onMaximize.emit(next);
    }

    /* ── Dragging ── */

    onHeaderPointerDown(event: PointerEvent): void {
        if (!this.draggable() || this.maximized()) return;
        if ((event.target as HTMLElement).closest('button')) return;

        this.dragState = {
            x: event.clientX,
            y: event.clientY,
            ox: this.dragOffset().x,
            oy: this.dragOffset().y,
        };
        (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
        event.preventDefault();
    }

    onHeaderPointerMove(event: PointerEvent): void {
        if (!this.dragState) return;

        const dx = event.clientX - this.dragState.x;
        const dy = event.clientY - this.dragState.y;
        this.dragOffset.set(this.clampOffset(this.dragState.ox + dx, this.dragState.oy + dy));
    }

    onHeaderPointerUp(): void {
        this.dragState = null;
    }

    /* ── Resizing ── */

    onResizePointerDown(event: PointerEvent): void {
        if (!this.resizable() || this.maximized()) return;
        const el = this.dialogEl?.nativeElement;
        if (!el) return;

        this.resizeState = {
            x: event.clientX,
            y: event.clientY,
            w: el.offsetWidth,
            h: el.offsetHeight,
        };
        (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
        event.preventDefault();
        event.stopPropagation();
    }

    onResizePointerMove(event: PointerEvent): void {
        if (!this.resizeState) return;

        const width = Math.max(280, this.resizeState.w + (event.clientX - this.resizeState.x));
        const height = Math.max(160, this.resizeState.h + (event.clientY - this.resizeState.y));
        this.resizeSize.set({ width: `${width}px`, height: `${height}px` });
    }

    onResizePointerUp(): void {
        this.resizeState = null;
    }

    /* ── Internals ── */

    private hide(): void {
        const flag = this.serviceFlag();
        if (flag) {
            flag.set(false);
        } else {
            this.visible.set(false);
        }
        this.onHide.emit();
    }

    private applyBreakpoints(): void {
        const breakpoints = this.breakpoints();
        if (!breakpoints || typeof window === 'undefined') {
            this.breakpointWidth.set(null);
            return;
        }

        const entries = Object.entries(breakpoints)
            .map(([key, value]) => [parseInt(key, 10), value] as const)
            .filter(([breakpoint]) => !Number.isNaN(breakpoint))
            .sort((a, b) => a[0] - b[0]);

        for (const [breakpoint, value] of entries) {
            if (window.innerWidth <= breakpoint) {
                this.breakpointWidth.set(value);
                return;
            }
        }

        this.breakpointWidth.set(null);
    }

    private clampOffset(x: number, y: number): { x: number; y: number } {
        const el = this.dialogEl?.nativeElement;
        if (!el || typeof window === 'undefined') return { x, y };

        const rect = el.getBoundingClientRect();
        const baseLeft = rect.left - this.dragOffset().x;
        const baseTop = rect.top - this.dragOffset().y;
        const margin = 8;

        const minX = -baseLeft + margin;
        const maxX = window.innerWidth - (baseLeft + rect.width) - margin;
        const minY = -baseTop + margin;
        const maxY = window.innerHeight - (baseTop + rect.height) - margin;

        return {
            x: Math.min(Math.max(x, minX), Math.max(minX, maxX)),
            y: Math.min(Math.max(y, minY), Math.max(minY, maxY)),
        };
    }
}
