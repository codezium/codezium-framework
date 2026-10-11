import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideChevronRight, LucideDynamicIcon } from '@lucide/angular';
import { CzMenuItem } from '../../types';

@Component({
    selector: 'cz-tiered-menu',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './tiered-menu.component.html',
    styleUrl: './tiered-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-tiered-menu',
    },
})
export class CzTieredMenuComponent {
    /** Menu items (nested `items` open as flyout submenus on hover) */
    items = input<CzMenuItem[]>([]);

    /** Emitted when a leaf item is activated */
    onItemSelect = output<CzMenuItem>();

    readonly ChevronRightIcon = LucideChevronRight;

    activate(item: CzMenuItem, event?: Event): void {
        if (item.disabled || item.separator || item.items?.length) return;

        item.command?.(event);
        this.onItemSelect.emit(item);
    }
}
