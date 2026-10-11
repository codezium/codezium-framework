import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    computed,
    input,
    Optional,
    output,
    Self,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
    LucideChevronDown,
    LucideChevronUp,
    LucideChevronsDown,
    LucideChevronsUp,
    LucideDynamicIcon,
} from '@lucide/angular';

export type CzOrderListControlsPosition = 'left' | 'right';

@Component({
    selector: 'cz-order-list',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './order-list.component.html',
    styleUrl: './order-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-order-list',
        '[class.cz-order-list--disabled]': 'actualDisabled()',
        '[class.cz-order-list--striped]': 'stripedRows()',
    },
})
export class CzOrderListComponent implements ControlValueAccessor {
    /** Property used to display each item */
    optionLabel = input<string>('');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Accessible label */
    ariaLabel = input<string>('Order list');

    /** Enables the filter input and decides which field to search against */
    filterBy = input<string | null>(null);

    /** Placeholder of the filter input */
    filterPlaceholder = input<string>('Filter');

    /** Location of the move controls relative to the list */
    controlsPosition = input<CzOrderListControlsPosition>('right');

    /** Height of the list viewport (scrolls beyond it). Null = theme default */
    scrollHeight = input<string | null>(null);

    /** Alternating row colors */
    stripedRows = input<boolean>(false);

    /** Enables drag & drop reordering */
    dragdrop = input<boolean>(false);

    /** Custom item template (receives `$implicit` item, `index` and `selected`) */
    itemTemplate = input<TemplateRef<unknown> | null>(null);

    /** Emitted after every reorder */
    onReorder = output<any[]>();

    /** Emitted when the selected item changes */
    onSelectionChange = output<number>();

    /** Current items */
    items = signal<any[]>([]);

    /** Selected index (relative to the filtered list) */
    selectedIndex = signal<number>(-1);

    /** Filter query */
    filterValue = signal<string>('');

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Index being dragged */
    dragIndex = signal<number | null>(null);

    /** Index hovered while dragging */
    overIndex = signal<number | null>(null);

    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    /** Items visible after filtering */
    filteredItems = computed(() => {
        const field = this.filterBy();
        const query = this.filterValue().trim().toLowerCase();
        const items = this.items();

        if (!field || !query) return items;

        return items.filter(item => String(item[field] ?? '').toLowerCase().includes(query));
    });

    canMoveTop = computed(() => this.selectedIndex() > 0 && !this.actualDisabled());
    canMoveUp = computed(() => this.selectedIndex() > 0 && !this.actualDisabled());
    canMoveDown = computed(
        () =>
            this.selectedIndex() >= 0 &&
            this.selectedIndex() < this.filteredItems().length - 1 &&
            !this.actualDisabled(),
    );
    canMoveBottom = computed(
        () =>
            this.selectedIndex() >= 0 &&
            this.selectedIndex() < this.filteredItems().length - 1 &&
            !this.actualDisabled(),
    );

    readonly TopIcon = LucideChevronsUp;
    readonly UpIcon = LucideChevronUp;
    readonly DownIcon = LucideChevronDown;
    readonly BottomIcon = LucideChevronsDown;

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    display(item: any): string {
        return this.optionLabel() ? String(item[this.optionLabel()]) : String(item);
    }

    select(index: number): void {
        if (this.actualDisabled()) return;
        this.selectedIndex.set(index);
        this.onTouched();
        this.onSelectionChange.emit(index);
    }

    /* ── Reordering ── */

    moveTop(): void {
        this.swapFiltered(this.selectedIndex(), 0);
    }

    moveUp(): void {
        this.swapFiltered(this.selectedIndex(), this.selectedIndex() - 1);
    }

    moveDown(): void {
        this.swapFiltered(this.selectedIndex(), this.selectedIndex() + 1);
    }

    moveBottom(): void {
        this.swapFiltered(this.selectedIndex(), this.filteredItems().length - 1);
    }

    onFilterInput(event: Event): void {
        this.filterValue.set((event.target as HTMLInputElement).value);
        this.selectedIndex.set(-1);
    }

    /* ── Drag & drop ── */

    onDragStart(index: number, event: DragEvent): void {
        if (!this.dragdrop() || this.actualDisabled()) return;

        this.dragIndex.set(index);
        event.dataTransfer?.setData('text/plain', String(index));
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
        }
    }

    onDragOver(index: number, event: DragEvent): void {
        if (!this.dragdrop() || this.dragIndex() === null || this.actualDisabled()) return;

        event.preventDefault();
        this.overIndex.set(index);
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }
    }

    onDrop(index: number, event: DragEvent): void {
        event.preventDefault();

        const from = this.dragIndex();
        if (from !== null && from !== index) {
            this.swapFiltered(from, index);
            this.selectedIndex.set(index);
        }

        this.onDragEnd();
    }

    onDragEnd(): void {
        this.dragIndex.set(null);
        this.overIndex.set(null);
    }

    /** Swaps two items in the source array using their filtered positions */
    private swapFiltered(from: number, to: number): void {
        if (this.actualDisabled()) return;

        const filtered = this.filteredItems();
        if (from < 0 || to < 0 || from >= filtered.length || to >= filtered.length || from === to) {
            return;
        }

        const items = [...this.items()];
        const fromIndex = items.indexOf(filtered[from]);
        const toIndex = items.indexOf(filtered[to]);
        if (fromIndex < 0 || toIndex < 0) return;

        [items[fromIndex], items[toIndex]] = [items[toIndex], items[fromIndex]];
        this.items.set(items);
        this.selectedIndex.set(to);
        this.onChange([...items]);
        this.onReorder.emit([...items]);
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        this.items.set(Array.isArray(value) ? [...value] : []);
        this.selectedIndex.set(-1);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.formsDisabled.set(isDisabled);
    }
}
