import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    computed,
    inject,
    input,
    model,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideDynamicIcon, LucidePlus, type LucideIconInput } from '@lucide/angular';
import { CzTooltipDirective } from '../tooltip';
import { CzSeverity, CzMenuItem, CzOverlayZIndex, czOverlayZIndex } from '../../types';

export type CzSpeedDialType = 'linear' | 'circle' | 'semi-circle' | 'quarter-circle';

export type CzSpeedDialDirection =
    | 'up'
    | 'down'
    | 'left'
    | 'right'
    | 'up-left'
    | 'up-right'
    | 'down-left'
    | 'down-right';

@Component({
    selector: 'cz-speed-dial',
    imports: [CommonModule, LucideDynamicIcon, CzTooltipDirective],
    templateUrl: './speed-dial.component.html',
    styleUrl: './speed-dial.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-speed-dial',
        '[attr.data-direction]': 'direction()',
        '[attr.data-type]': 'type()',
        '(document:click)': 'onDocumentClick($event)',
    },
})
export class CzSpeedDialComponent {
    /** Actions displayed around the trigger */
    items = input<CzMenuItem[]>([]);

    /** Opening layout: linear list or radial arc */
    type = input<CzSpeedDialType>('linear');

    /** Direction of the actions (linear: up/down/left/right; quarter-circle: corners) */
    direction = input<CzSpeedDialDirection>('up');

    /** Radius of the radial layouts (circle, semi-circle, quarter-circle) */
    radius = input<number>(80);

    /** Visibility (two-way bindable) */
    visible = model<boolean>(false);

    /** Delay step in ms between each action's entrance animation */
    transitionDelay = input<number>(30);

    /** Shows a mask behind the actions */
    mask = input<boolean>(false);

    /** Disabled state of the trigger */
    disabled = input<boolean>(false);

    /** Closes the actions when clicking outside */
    hideOnClickOutside = input<boolean>(true);

    /** Trigger icon (defaults to plus) */
    icon = input<LucideIconInput | null>(null);

    /** Trigger icon shown while open (defaults to the show icon) */
    hideIcon = input<LucideIconInput | null>(null);

    /** Rotates the trigger icon 45° when open (when no hideIcon is set) */
    rotateAnimation = input<boolean>(true);

    /** Severity color of the trigger */
    severity = input<CzSeverity>('primary');

    /** Shows tooltips built from each item label */
    showTooltips = input<boolean>(false);

    /** Accessible label of the trigger */
    ariaLabel = input<string>('Actions');

    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    /** Emitted when the visibility changes */
    onVisibleChange = output<boolean>();

    /** Emitted when the actions are shown */
    onShow = output<void>();

    /** Emitted when the actions are hidden */
    onHide = output<void>();

    /** Emitted when the trigger is clicked */
    onClick = output<MouseEvent>();

    /** Emitted when an action is activated */
    onItemSelect = output<CzMenuItem>();

    readonly PlusIcon = LucidePlus;

    readonly actionsZIndex = computed(() => czOverlayZIndex(this.zIndex()));

    readonly maskZIndex = computed(() => czOverlayZIndex(this.zIndex(), -1));

    private readonly router = inject(Router);
    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

    /** Trigger icon for the current state */
    readonly triggerIcon = computed<LucideIconInput>(() => {
        const base = this.icon() ?? this.PlusIcon;
        if (!this.visible()) return base;
        return this.hideIcon() ?? base;
    });

    /** Whether the trigger icon should rotate while open */
    readonly isRotated = computed(
        () => this.visible() && !this.hideIcon() && this.rotateAnimation(),
    );

    /** Radial offsets per item; null for the linear layout */
    readonly itemOffsets = computed<{ x: number; y: number }[] | null>(() => {
        const type = this.type();
        if (type === 'linear') return null;

        const count = this.items().length;
        if (!count) return [];

        const radius = this.radius();
        const direction = this.direction();

        return this.items().map((_, index) => {
            let angle: number;

            if (type === 'circle') {
                // Full circle, starting at the top
                angle = -90 + (360 / count) * index;
            } else if (type === 'semi-circle') {
                const start =
                    { up: 180, down: 0, left: 90, right: 270 }[direction as 'up' | 'down' | 'left' | 'right'] ?? 180;
                angle = count === 1 ? start + 90 : start + (180 / (count - 1)) * index;
            } else {
                // quarter-circle
                const start =
                    { 'up-left': 180, 'up-right': 270, 'down-right': 0, 'down-left': 90 }[
                        direction as 'up-left' | 'up-right' | 'down-right' | 'down-left'
                    ] ?? 180;
                angle = count === 1 ? start + 45 : start + (90 / (count - 1)) * index;
            }

            const radians = (angle * Math.PI) / 180;
            return { x: Math.cos(radians) * radius, y: Math.sin(radians) * radius };
        });
    });

    /** Inline transform for a radial item (null for linear layouts) */
    itemTransform(index: number): string | null {
        const offsets = this.itemOffsets();
        if (!offsets) return null;

        const offset = offsets[index];
        if (!offset) return null;

        const x = this.visible() ? offset.x : 0;
        const y = this.visible() ? offset.y : 0;
        const scale = this.visible() ? 1 : 0.4;
        return `translate(${x}px, ${y}px) scale(${scale})`;
    }

    toggle(event?: Event): void {
        event?.stopPropagation();
        if (this.disabled()) return;

        this.setVisible(!this.visible());
        if (event) this.onClick.emit(event as MouseEvent);
    }

    hide(): void {
        this.setVisible(false);
    }

    activate(item: CzMenuItem, event: Event): void {
        if (item.disabled) return;

        event.stopPropagation();
        item.command?.(event);

        if (item.url) {
            window.open(item.url, item.target || '_blank');
        } else if (item.routerLink) {
            this.router.navigateByUrl(item.routerLink);
        }

        this.onItemSelect.emit(item);
        this.hide();
    }

    onDocumentClick(event: Event): void {
        if (!this.visible() || !this.hideOnClickOutside()) return;

        const target = event.target as Node | null;
        if (target && !this.el.nativeElement.contains(target)) {
            this.hide();
        }
    }

    private setVisible(value: boolean): void {
        if (value === this.visible()) return;

        this.visible.set(value);
        this.onVisibleChange.emit(value);

        if (value) {
            this.onShow.emit();
        } else {
            this.onHide.emit();
        }
    }
}
