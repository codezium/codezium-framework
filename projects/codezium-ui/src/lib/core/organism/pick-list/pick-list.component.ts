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
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronUp,
    LucideChevronsDown,
    LucideChevronsLeft,
    LucideChevronsRight,
    LucideChevronsUp,
    LucideDynamicIcon,
} from '@lucide/angular';

type PickListSide = 'source' | 'target';

@Component({
    selector: 'cz-pick-list',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './pick-list.component.html',
    styleUrl: './pick-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-pick-list',
        '[class.cz-pick-list--disabled]': 'actualDisabled()',
        '[class.cz-pick-list--striped]': 'stripedRows()',
    },
})
export class CzPickListComponent implements ControlValueAccessor {
    /** Available items (external source) */
    source = input<any[]>([]);

    /** Property used to display each item */
    optionLabel = input<string>('');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Accessible label */
    ariaLabel = input<string>('Pick list');

    /** Source list caption */
    sourceHeader = input<string>('');

    /** Target list caption */
    targetHeader = input<string>('');

    /** Comma separated fields used by the filter inputs */
    filterBy = input<string | null>(null);

    /** Placeholder of the source filter input */
    sourceFilterPlaceholder = input<string>('Search…');

    /** Placeholder of the target filter input */
    targetFilterPlaceholder = input<string>('Search…');

    /** Height of each list viewport (scrolls beyond it). Null = theme default */
    scrollHeight = input<string | null>(null);

    /** Alternating row colors */
    stripedRows = input<boolean>(false);

    /** Enables drag & drop reordering and transfers */
    dragdrop = input<boolean>(false);

    /** Shows the reorder controls (top/up/down/bottom) on the source list */
    showSourceControls = input<boolean>(false);

    /** Shows the reorder controls (top/up/down/bottom) on the target list */
    showTargetControls = input<boolean>(false);

    /** Custom item template (`$implicit` item, `index`, `selected`) */
    itemTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom empty state for the source list */
    emptySourceTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom empty state for the target list */
    emptyTargetTemplate = input<TemplateRef<unknown> | null>(null);

    /** Emitted when items are transferred to the target */
    onMoveToTarget = output<any[]>();

    /** Emitted when items are transferred back to the source */
    onMoveToSource = output<any[]>();

    /** Emitted after reordering inside the source list */
    onSourceReorder = output<any[]>();

    /** Emitted after reordering inside the target list */
    onTargetReorder = output<any[]>();

    /** Target items (the form value) */
    target = signal<any[]>([]);

    /** Source override after transfers */
    private sourceOverride = signal<any[] | null>(null);

    /** Selected indexes (relative to the filtered lists) */
    selectedSource = signal<number>(-1);
    selectedTarget = signal<number>(-1);

    /** Filter queries */
    sourceFilter = signal<string>('');
    targetFilter = signal<string>('');

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Drag state */
    dragFrom = signal<{ side: PickListSide; index: number } | null>(null);
    dragOver = signal<{ side: PickListSide; index: number } | null>(null);

    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    /** Items available in the source list */
    availableItems = computed(() => this.sourceOverride() ?? this.source());

    /** Filtered views */
    filteredSource = computed(() => this.filterItems(this.availableItems(), this.sourceFilter()));
    filteredTarget = computed(() => this.filterItems(this.target(), this.targetFilter()));

    canMoveRight = computed(() => this.selectedSource() >= 0 && !this.actualDisabled());
    canMoveLeft = computed(() => this.selectedTarget() >= 0 && !this.actualDisabled());
    canMoveAllRight = computed(() => this.filteredSource().length > 0 && !this.actualDisabled());
    canMoveAllLeft = computed(() => this.filteredTarget().length > 0 && !this.actualDisabled());

    canSourceMoveTop = computed(() => this.selectedSource() > 0 && !this.actualDisabled());
    canSourceMoveUp = computed(() => this.selectedSource() > 0 && !this.actualDisabled());
    canSourceMoveDown = computed(
        () => this.selectedSource() >= 0 && this.selectedSource() < this.filteredSource().length - 1 && !this.actualDisabled(),
    );
    canSourceMoveBottom = computed(
        () => this.selectedSource() >= 0 && this.selectedSource() < this.filteredSource().length - 1 && !this.actualDisabled(),
    );

    canTargetMoveTop = computed(() => this.selectedTarget() > 0 && !this.actualDisabled());
    canTargetMoveUp = computed(() => this.selectedTarget() > 0 && !this.actualDisabled());
    canTargetMoveDown = computed(
        () => this.selectedTarget() >= 0 && this.selectedTarget() < this.filteredTarget().length - 1 && !this.actualDisabled(),
    );
    canTargetMoveBottom = computed(
        () => this.selectedTarget() >= 0 && this.selectedTarget() < this.filteredTarget().length - 1 && !this.actualDisabled(),
    );

    readonly LeftIcon = LucideChevronLeft;
    readonly RightIcon = LucideChevronRight;
    readonly AllLeftIcon = LucideChevronsLeft;
    readonly AllRightIcon = LucideChevronsRight;
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

    /* ── Selection ── */

    selectSource(index: number): void {
        if (this.actualDisabled()) return;
        this.selectedSource.set(index);
        this.selectedTarget.set(-1);
        this.onTouched();
    }

    selectTarget(index: number): void {
        if (this.actualDisabled()) return;
        this.selectedTarget.set(index);
        this.selectedSource.set(-1);
        this.onTouched();
    }

    /* ── Transfer ── */

    moveRight(): void {
        const index = this.selectedSource();
        if (!this.canMoveRight() || index < 0) return;

        const item = this.filteredSource()[index];
        this.removeFromSource([item]);
        this.target.update(target => [...target, item]);
        this.selectedSource.set(-1);
        this.emitChange();
        this.onMoveToTarget.emit([item]);
    }

    moveLeft(): void {
        const index = this.selectedTarget();
        if (!this.canMoveLeft() || index < 0) return;

        const item = this.filteredTarget()[index];
        this.target.update(target => target.filter(t => t !== item));
        this.addToSource([item]);
        this.selectedTarget.set(-1);
        this.emitChange();
        this.onMoveToSource.emit([item]);
    }

    moveAllRight(): void {
        if (!this.canMoveAllRight()) return;

        const items = [...this.filteredSource()];
        this.removeFromSource(items);
        this.target.update(target => [...target, ...items]);
        this.selectedSource.set(-1);
        this.emitChange();
        this.onMoveToTarget.emit(items);
    }

    moveAllLeft(): void {
        if (!this.canMoveAllLeft()) return;

        const items = [...this.filteredTarget()];
        this.target.update(target => target.filter(t => !items.includes(t)));
        this.addToSource(items);
        this.selectedTarget.set(-1);
        this.emitChange();
        this.onMoveToSource.emit(items);
    }

    /* ── Reorder within lists ── */

    sourceMoveTop(): void { this.swapSource(this.selectedSource(), 0); }
    sourceMoveUp(): void { this.swapSource(this.selectedSource(), this.selectedSource() - 1); }
    sourceMoveDown(): void { this.swapSource(this.selectedSource(), this.selectedSource() + 1); }
    sourceMoveBottom(): void { this.swapSource(this.selectedSource(), this.filteredSource().length - 1); }

    targetMoveTop(): void { this.swapTarget(this.selectedTarget(), 0); }
    targetMoveUp(): void { this.swapTarget(this.selectedTarget(), this.selectedTarget() - 1); }
    targetMoveDown(): void { this.swapTarget(this.selectedTarget(), this.selectedTarget() + 1); }
    targetMoveBottom(): void { this.swapTarget(this.selectedTarget(), this.filteredTarget().length - 1); }

    /* ── Filters ── */

    onSourceFilterInput(event: Event): void {
        this.sourceFilter.set((event.target as HTMLInputElement).value);
        this.selectedSource.set(-1);
    }

    onTargetFilterInput(event: Event): void {
        this.targetFilter.set((event.target as HTMLInputElement).value);
        this.selectedTarget.set(-1);
    }

    /* ── Drag & drop ── */

    onItemDragStart(side: PickListSide, index: number, event: DragEvent): void {
        if (!this.dragdrop() || this.actualDisabled()) return;

        this.dragFrom.set({ side, index });
        event.dataTransfer?.setData('text/plain', `${side}:${index}`);
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
        }
    }

    onItemDragOver(side: PickListSide, index: number, event: DragEvent): void {
        if (!this.dragdrop() || !this.dragFrom() || this.actualDisabled()) return;

        event.preventDefault();
        this.dragOver.set({ side, index });
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }
    }

    onItemDrop(side: PickListSide, index: number, event: DragEvent): void {
        event.preventDefault();

        const from = this.dragFrom();
        if (!from) return;

        if (from.side === side) {
            if (side === 'source') {
                this.swapSource(from.index, index);
            } else {
                this.swapTarget(from.index, index);
            }
        } else if (side === 'target') {
            const item = this.filteredSource()[from.index];
            if (item !== undefined) {
                this.removeFromSource([item]);
                const target = [...this.target()];
                target.splice(Math.min(index, target.length), 0, item);
                this.target.set(target);
                this.emitChange();
                this.onMoveToTarget.emit([item]);
            }
        } else {
            const item = this.filteredTarget()[from.index];
            if (item !== undefined) {
                this.target.update(target => target.filter(t => t !== item));
                this.addToSource([item]);
                this.emitChange();
                this.onMoveToSource.emit([item]);
            }
        }

        this.resetDrag();
    }

    resetDrag(): void {
        this.dragFrom.set(null);
        this.dragOver.set(null);
    }

    isDragging(side: PickListSide, index: number): boolean {
        const from = this.dragFrom();
        return !!from && from.side === side && from.index === index;
    }

    isDragOver(side: PickListSide, index: number): boolean {
        const over = this.dragOver();
        const from = this.dragFrom();
        return !!over && !!from && over.side === side && over.index === index && !(from.side === side && from.index === index);
    }

    /* ── Internals ── */

    private filterItems(items: any[], query: string): any[] {
        const filterBy = this.filterBy();
        const value = query.trim().toLowerCase();
        if (!filterBy || !value) return items;

        const fields = filterBy.split(',').map(field => field.trim());
        return items.filter(item =>
            fields.some(field => String(item[field] ?? '').toLowerCase().includes(value)),
        );
    }

    private removeFromSource(items: any[]): void {
        this.sourceOverride.set(this.availableItems().filter(item => !items.includes(item)));
    }

    private addToSource(items: any[]): void {
        this.sourceOverride.update(available => [...(available ?? this.source()), ...items]);
    }

    private swapSource(from: number, to: number): void {
        if (this.actualDisabled()) return;

        const filtered = this.filteredSource();
        if (from < 0 || to < 0 || from >= filtered.length || to >= filtered.length || from === to) return;

        const items = [...this.availableItems()];
        const fromIndex = items.indexOf(filtered[from]);
        const toIndex = items.indexOf(filtered[to]);
        [items[fromIndex], items[toIndex]] = [items[toIndex], items[fromIndex]];

        this.sourceOverride.set(items);
        this.selectedSource.set(to);
        this.onSourceReorder.emit([...items]);
    }

    private swapTarget(from: number, to: number): void {
        if (this.actualDisabled()) return;

        const filtered = this.filteredTarget();
        if (from < 0 || to < 0 || from >= filtered.length || to >= filtered.length || from === to) return;

        const items = [...this.target()];
        const fromIndex = items.indexOf(filtered[from]);
        const toIndex = items.indexOf(filtered[to]);
        [items[fromIndex], items[toIndex]] = [items[toIndex], items[fromIndex]];

        this.target.set(items);
        this.selectedTarget.set(to);
        this.emitChange();
        this.onTargetReorder.emit([...items]);
    }

    private emitChange(): void {
        this.onChange([...this.target()]);
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        this.target.set(Array.isArray(value) ? [...value] : []);
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
