import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideDynamicIcon, LucidePlus, type LucideIconInput } from '@lucide/angular';
import { CzMenuItem } from '../../types';

export type CzSpeedDialDirection = 'up' | 'down' | 'left' | 'right';

@Component({
    selector: 'cz-speed-dial',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './speed-dial.component.html',
    styleUrl: './speed-dial.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-speed-dial',
        '[attr.data-direction]': 'direction()',
        '(document:click)': 'onDocumentClick($event)',
    },
})
export class CzSpeedDialComponent {
    /** Actions displayed around the trigger */
    items = input<CzMenuItem[]>([]);

    /** Direction in which the actions open */
    direction = input<CzSpeedDialDirection>('up');

    /** Trigger icon (defaults to plus) */
    icon = input<LucideIconInput | null>(null);

    /** Accessible label of the trigger */
    ariaLabel = input<string>('Actions');

    /** Emitted when an action is activated */
    onItemSelect = output<CzMenuItem>();

    /** Actions visibility */
    open = signal<boolean>(false);

    readonly PlusIcon = LucidePlus;

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

    toggle(event: Event): void {
        event.stopPropagation();
        this.open.update((v) => !v);
    }

    activate(item: CzMenuItem, event: Event): void {
        if (item.disabled) return;

        event.stopPropagation();
        item.command?.(event);
        this.onItemSelect.emit(item);
        this.open.set(false);
    }

    onDocumentClick(event: Event): void {
        if (!this.open()) return;
        const target = event.target as Node | null;
        if (target && !this.el.nativeElement.contains(target)) {
            this.open.set(false);
        }
    }
}
