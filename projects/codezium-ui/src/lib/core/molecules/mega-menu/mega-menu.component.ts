import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideChevronDown, LucideDynamicIcon } from '@lucide/angular';
import { CzMenuItem } from '../../types';

interface MegaMenuGroup {
    label: string;
    items: CzMenuItem[];
}

@Component({
    selector: 'cz-mega-menu',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './mega-menu.component.html',
    styleUrl: './mega-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-mega-menu',
        '(document:click)': 'onDocumentClick($event)',
        '(document:keydown.escape)': 'close()',
    },
})
export class CzMegaMenuComponent {
    /** Root items; children are grouped by their `group` property into columns */
    items = input<CzMenuItem[]>([]);

    /** Emitted when a leaf item is activated */
    onItemSelect = output<CzMenuItem>();

    /** Index of the open panel */
    openIndex = signal<number>(-1);

    readonly ChevronDownIcon = LucideChevronDown;

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

    groups = computed<MegaMenuGroup[]>(() => {
        const open = this.openIndex();
        if (open < 0) return [];

        const children = this.items()[open]?.items ?? [];
        const map = new Map<string, CzMenuItem[]>();

        for (const child of children) {
            const key = child.group ?? '';
            const list = map.get(key) ?? [];
            list.push(child);
            map.set(key, list);
        }

        return [...map.entries()].map(([label, groupItems]) => ({ label, items: groupItems }));
    });

    toggleItem(index: number, item: CzMenuItem, event?: Event): void {
        if (item.disabled) return;

        if (!item.items?.length) {
            this.activate(item, event);
            return;
        }

        this.openIndex.update((open) => (open === index ? -1 : index));
    }

    activate(item: CzMenuItem, event?: Event): void {
        if (item.disabled || item.separator) return;

        item.command?.(event);
        this.onItemSelect.emit(item);
        this.close();
    }

    close(): void {
        this.openIndex.set(-1);
    }

    onDocumentClick(event: Event): void {
        if (this.openIndex() < 0) return;
        const target = event.target as Node | null;
        if (target && !this.el.nativeElement.contains(target)) {
            this.close();
        }
    }
}
