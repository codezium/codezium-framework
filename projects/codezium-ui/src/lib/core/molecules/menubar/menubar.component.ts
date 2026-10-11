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
import { LucideChevronDown, LucideDynamicIcon } from '@lucide/angular';
import { CzMenuItem } from '../../types';

@Component({
    selector: 'cz-menubar',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './menubar.component.html',
    styleUrl: './menubar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-menubar',
        '(document:click)': 'onDocumentClick($event)',
        '(document:keydown.escape)': 'close()',
    },
})
export class CzMenubarComponent {
    /** Root menu items (children open as dropdowns) */
    items = input<CzMenuItem[]>([]);

    /** Emitted when a leaf item is activated */
    onItemSelect = output<CzMenuItem>();

    /** Index of the open dropdown */
    openIndex = signal<number>(-1);

    readonly ChevronDownIcon = LucideChevronDown;

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

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
