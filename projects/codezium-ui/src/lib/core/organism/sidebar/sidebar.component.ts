import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
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
    selector: 'cz-sidebar',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-sidebar',
        '[class.cz-sidebar--collapsed]': 'collapsed()',
    },
})
export class CzSidebarComponent {
    /** Navigation items */
    items = input<CzMenuItem[]>([]);

    /** Sidebar title */
    header = input<string>('');

    /** Collapsed (icons only) mode */
    collapsed = model<boolean>(false);

    /** Emitted when a leaf item is activated */
    onItemSelect = output<CzMenuItem>();

    /** Expanded group items */
    expanded = signal<Set<CzMenuItem>>(new Set());

    readonly ChevronDownIcon = LucideChevronDown;
    readonly ChevronRightIcon = LucideChevronRight;

    isExpanded(item: CzMenuItem): boolean {
        return this.expanded().has(item);
    }

    toggleCollapse(): void {
        this.collapsed.update((v) => !v);
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
