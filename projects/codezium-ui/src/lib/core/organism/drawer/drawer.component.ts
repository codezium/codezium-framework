import {
    computed,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    input,
    model,
    output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzOverlayZIndex, czOverlayZIndex } from '../../types';

export type CzDrawerPosition = 'left' | 'right' | 'top' | 'bottom';

@Component({
    selector: 'cz-drawer',
    imports: [CommonModule],
    templateUrl: './drawer.component.html',
    styleUrl: './drawer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-drawer-host',
        '(document:keydown.escape)': 'onEscape()',
    },
})
export class CzDrawerComponent {
    /** Visibility (two-way bindable) */
    visible = model<boolean>(false);

    /** Drawer title */
    header = input<string>('');

    /** Side of the screen */
    position = input<CzDrawerPosition>('right');

    /** Drawer size along its axis */
    size = input<string>('22rem');

    /** Shows the backdrop mask */
    modal = input<boolean>(true);

    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    readonly maskZIndex = computed(() => czOverlayZIndex(this.zIndex()));

    readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex(), 1));

    /** Closes when the mask is clicked */
    dismissableMask = input<boolean>(true);

    /** Emitted when the drawer is hidden */
    onHide = output<void>();

    @ViewChild('drawerEl') private drawerEl?: ElementRef<HTMLElement>;

    constructor() {
        effect(() => {
            if (this.visible()) {
                queueMicrotask(() => this.drawerEl?.nativeElement.focus());
            }
        });
    }

    close(): void {
        this.visible.set(false);
        this.onHide.emit();
    }

    onMaskClick(): void {
        if (this.dismissableMask()) {
            this.close();
        }
    }

    onEscape(): void {
        if (this.visible()) {
            this.close();
        }
    }
}
