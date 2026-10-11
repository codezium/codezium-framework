import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideDynamicIcon } from '@lucide/angular';
import { CzMenuItem } from '../../types';

@Component({
    selector: 'cz-context-menu',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './context-menu.component.html',
    styleUrl: './context-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-context-menu',
        '(contextmenu)': 'onContextMenu($event)',
        '(document:click)': 'close()',
        '(document:keydown.escape)': 'close()',
    },
})
export class CzContextMenuComponent {
    /** Menu items (supports `separator` and `disabled`) */
    items = input<CzMenuItem[]>([]);

    /** Emitted when a leaf item is activated */
    onItemSelect = output<CzMenuItem>();

    /** Panel visibility */
    visible = signal<boolean>(false);

    /** Panel position */
    position = signal<{ x: number; y: number }>({ x: 0, y: 0 });

    onContextMenu(event: MouseEvent): void {
        event.preventDefault();
        this.position.set({ x: event.clientX, y: event.clientY });
        this.visible.set(true);
    }

    activate(item: CzMenuItem, event?: Event): void {
        if (item.disabled || item.separator) return;

        item.command?.(event);
        this.onItemSelect.emit(item);
        this.close();
    }

    close(): void {
        this.visible.set(false);
    }
}
