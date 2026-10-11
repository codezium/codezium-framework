import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    input,
    model,
    output,
    signal,
    viewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';
import { CzMenuItem, CzOverlayZIndex, czOverlayZIndex } from '../../types';

@Component({
    selector: 'cz-command-menu',
    imports: [CommonModule, FormsModule, LucideDynamicIcon],
    templateUrl: './command-menu.component.html',
    styleUrl: './command-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-command-menu',
        '(document:keydown.escape)': 'onEscape()',
    },
})
export class CzCommandMenuComponent {
    /** Visibility (two-way bindable) */
    visible = model<boolean>(false);

    /** Commands to search through */
    items = input<CzMenuItem[]>([]);

    /** Search input placeholder */
    placeholder = input<string>('Type a command...');
    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex()));


    /** Message when there are no matches */
    emptyMessage = input<string>('No commands found');

    /** Emitted when a command is selected */
    onItemSelect = output<CzMenuItem>();

    /** Search query */
    query = signal<string>('');

    /** Focused result index */
    focusedIndex = signal<number>(0);

    readonly SearchIcon = LucideSearch;

    private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

    filtered = computed(() => {
        const query = this.query().trim().toLowerCase();
        return this.items().filter(
            (item) => !item.separator && !item.disabled && (!query || (item.label ?? '').toLowerCase().includes(query)),
        );
    });

    open(): void {
        this.query.set('');
        this.focusedIndex.set(0);
        this.visible.set(true);
        queueMicrotask(() => this.searchInput()?.nativeElement.focus());
    }

    close(): void {
        this.visible.set(false);
    }

    select(item: CzMenuItem, event?: Event): void {
        if (item.disabled || item.separator) return;

        item.command?.(event);
        this.onItemSelect.emit(item);
        this.close();
    }

    onKeyDown(event: KeyboardEvent): void {
        const results = this.filtered();

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.focusedIndex.update((i) => (i < results.length - 1 ? i + 1 : i));
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.focusedIndex.update((i) => (i > 0 ? i - 1 : 0));
                break;
            case 'Enter': {
                event.preventDefault();
                const item = results[this.focusedIndex()];
                if (item) this.select(item, event);
                break;
            }
        }
    }

    onQueryChange(value: string): void {
        this.query.set(value);
        this.focusedIndex.set(0);
    }

    onEscape(): void {
        if (this.visible()) {
            this.close();
        }
    }
}
