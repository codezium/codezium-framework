import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LucideChevronDown,
    LucideChevronRight,
    LucideDynamicIcon,
} from '@lucide/angular';
import { CzMenuItem } from '../../types';

@Component({
    selector: 'cz-menu',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-menu',
    },
})
export class CzMenuComponent {
    /** Menu items (supports nested `items` and `separator`) */
    items = input<CzMenuItem[]>([]);

    /** Emitted when a leaf item is activated */
    onItemSelect = output<CzMenuItem>();

    /** Expanded items with children */
    expanded = signal<Set<CzMenuItem>>(new Set());

    readonly ChevronDownIcon = LucideChevronDown;
    readonly ChevronRightIcon = LucideChevronRight;

    isExpanded(item: CzMenuItem): boolean {
        return this.expanded().has(item);
    }

    activate(item: CzMenuItem, event?: Event): void {
        if (item.disabled || item.separator) return;

        if (item.items?.length) {
            const next = new Set(this.expanded());
            if (next.has(item)) {
                next.delete(item);
            } else {
                next.add(item);
            }
            this.expanded.set(next);
            return;
        }

        item.command?.(event);
        this.onItemSelect.emit(item);
    }
}
