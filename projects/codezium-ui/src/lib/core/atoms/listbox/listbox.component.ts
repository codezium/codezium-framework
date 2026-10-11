import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    TemplateRef,
    computed,
    contentChild,
    effect,
    inject,
    input,
    Optional,
    output,
    Self,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { LucideCheck, LucideDynamicIcon, LucideSearch } from '@lucide/angular';
import { CzInputSize } from '../../types';
import { CzCheckboxComponent } from '../checkbox';

export type CzListboxFilterMatchMode =
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'equals'
    | 'notContains'
    | 'notEquals'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte';

export interface CzListboxChangeEvent {
    value: any;
    originalEvent: Event;
}

export interface CzListboxClickEvent {
    originalEvent: Event;
    option: any;
    value: any;
    index: number;
}

export interface CzListboxFilterEvent {
    originalEvent: Event;
    filter: string;
}

export interface CzListboxSelectAllChangeEvent {
    originalEvent: Event;
    checked: boolean;
}

export interface CzListboxDropEvent {
    originalEvent: DragEvent;
    previousIndex: number;
    currentIndex: number;
    value: any[];
}

interface ListboxEntry {
    option: any;
    index: number;
}

@Component({
    selector: 'cz-listbox',
    imports: [CommonModule, FormsModule, LucideDynamicIcon, CzCheckboxComponent],
    templateUrl: './listbox.component.html',
    styleUrl: './listbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-listbox',
        '[class.cz-listbox--disabled]': 'actualDisabled()',
        '[class.cz-listbox--invalid]': 'invalid()',
        '[class.cz-listbox--fluid]': 'fluid()',
        '[class.cz-listbox--striped]': 'striped()',
        '[class.cz-listbox--checkbox]': 'checkbox() && multiple()',
        '[attr.data-size]': 'size()',
    },
})
export class CzListboxComponent implements ControlValueAccessor {
    private readonly host = inject(ElementRef<HTMLElement>);
    private static nextId = 0;
    private readonly autoId = `cz-listbox-${++CzListboxComponent.nextId}`;

    /** Items to display */
    options = input<any[]>([]);

    /** Property used as the visible label */
    optionLabel = input<string>('');

    /** Property used as the value */
    optionValue = input<string>('');

    /** Allows multiple selection */
    multiple = input<boolean>(false);

    /** Renders checkboxes for each option (multiple mode) */
    checkbox = input<boolean>(false);

    /** Displays a checkmark next to the selected option */
    checkmark = input<boolean>(false);

    /** Whether the selected option is highlighted */
    highlightOnSelect = input<boolean>(true);

    /** Requires metaKey/ctrl to add to the selection in multiple mode */
    metaKeySelection = input<boolean>(false);

    /** Displays alternating row colors */
    striped = input<boolean>(false);

    /** Shows the filter input */
    filter = input<boolean>(false);

    /** Initial filter value */
    filterValue = input<string>('');

    /** Fields used by the filter (comma separated, defaults to optionLabel) */
    filterBy = input<string>('');

    /** How the filter matches values */
    filterMatchMode = input<CzListboxFilterMatchMode>('contains');

    /** Placeholder of the filter input */
    filterPlaceholder = input<string>('Search...');

    /** Accessible label of the filter input */
    ariaFilterLabel = input<string>('Filter');

    /** Shows the header select-all checkbox (multiple + checkbox) */
    showToggleAll = input<boolean>(true);

    /** Whether all data is selected (bind with onSelectAllChange) */
    selectAll = input<boolean>(false);

    /** Grouped options configuration */
    group = input<boolean>(false);
    optionGroupLabel = input<string>('label');
    optionGroupChildren = input<string>('items');

    /** Property (or function) that marks an option as disabled */
    optionDisabled = input<string | ((item: any) => boolean) | null>(null);

    /** Property that uniquely identifies an option */
    dataKey = input<string | null>(null);

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Readonly state */
    readonly = input<boolean>(false);

    /** Invalid state */
    invalid = input<boolean>(false);

    /** Spans the full width of the container */
    fluid = input<boolean>(false);

    /** Height of the scrollable viewport (scrollbar when the list exceeds it) */
    scrollHeight = input<string>('');

    /** Enables drag and drop reordering */
    dragdrop = input<boolean>(false);

    /** Renders only the visible window of options for large data sets */
    virtualScroll = input<boolean>(false);

    /** Height of an item in pixels for virtual scrolling */
    virtualScrollItemSize = input<number>(36);

    /** Focuses the first visible or selected option when the list gets focus */
    autoOptionFocus = input<boolean>(true);

    /** Selects the focused option while navigating with the keyboard */
    selectOnFocus = input<boolean>(false);

    /** Moves the focus with the mouse hover */
    focusOnHover = input<boolean>(true);

    /** Component size */
    size = input<CzInputSize>('md');

    /** Message shown when there are no options */
    emptyMessage = input<string>('No results found');

    /** Message shown when the filter returns no results */
    emptyFilterMessage = input<string>('No results found');

    /** Accessible label of the list */
    ariaLabel = input<string>('Listbox');

    /** Unique identifier of the component */
    id = input<string>('');

    /** Index of the element in tabbing order */
    tabindex = input<number>(0);

    /** Style class of the list element */
    listStyleClass = input<string>('');

    /** Custom item template: `$implicit` option, `index`, `selected` */
    itemTemplate = contentChild<TemplateRef<any>>('itemTemplate');

    /** Custom group header template: `$implicit` group */
    groupTemplate = contentChild<TemplateRef<any>>('groupTemplate');

    /** Custom header template */
    headerTemplate = contentChild<TemplateRef<any>>('headerTemplate');

    /** Custom filter template */
    filterTemplate = contentChild<TemplateRef<any>>('filterTemplate');

    /** Custom footer template */
    footerTemplate = contentChild<TemplateRef<any>>('footerTemplate');

    /** Custom empty message template */
    emptyTemplate = contentChild<TemplateRef<any>>('emptyTemplate');

    /** Custom empty filter message template */
    emptyFilterTemplate = contentChild<TemplateRef<any>>('emptyFilterTemplate');

    /** Custom checkmark template */
    checkmarkTemplate = contentChild<TemplateRef<any>>('checkmarkTemplate');

    /** Bound filter callback for custom filter templates */
    readonly filterCallback = (event: Event): void => this.onFilterInput(event);

    /** Emitted on selection change */
    onChangeEvent = output<CzListboxChangeEvent>({ alias: 'onChange' });

    /** Emitted when an option is clicked */
    onClick = output<CzListboxClickEvent>();

    /** Emitted when an option is double clicked */
    onDblClick = output<CzListboxClickEvent>();

    /** Emitted when the filter changes */
    onFilter = output<CzListboxFilterEvent>();

    /** Emitted when the list gets focus */
    onFocusEvent = output<FocusEvent>({ alias: 'onFocus' });

    /** Emitted when the list loses focus */
    onBlurEvent = output<FocusEvent>({ alias: 'onBlur' });

    /** Emitted when the select-all checkbox is toggled */
    onSelectAllChange = output<CzListboxSelectAllChangeEvent>();

    /** Emitted when an item is dropped in dragdrop mode */
    onDrop = output<CzListboxDropEvent>();

    /** Current value (single or array) */
    value = signal<any>(null);

    /** Internal filter query */
    filterQuery = signal<string>('');

    /** Keyboard focus index (over the filtered flat options) */
    focusedIndex = signal<number>(-1);

    /** Local option order (dragdrop) */
    private readonly orderedOptions = signal<any[] | null>(null);

    /** Last filterValue seeded into the query */
    private lastFilterValue: string | null = null;

    /** Virtual scroll offset */
    readonly scrollTop = signal<number>(0);

    /** Drag state */
    readonly draggedIndex = signal<number>(-1);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    readonly effectiveId = computed(() => this.id() || this.autoId);
    readonly CheckIcon = LucideCheck;
    readonly SearchIcon = LucideSearch;

    /** Options honoring dragdrop reordering */
    readonly sourceOptions = computed<any[]>(() => this.orderedOptions() ?? this.options());

    /** True when the filter is active with a query */
    readonly isFiltering = computed(() => !!this.filterQuery().trim());

    /** Filtered options (groups keep non-empty children) */
    readonly filteredOptions = computed<any[]>(() => {
        const query = this.filterQuery().trim();
        const source = this.sourceOptions();
        if (!query || !this.filter()) return source;

        if (this.group()) {
            return source
                .map((groupItem) => {
                    const children = groupItem?.[this.optionGroupChildren()];
                    if (!Array.isArray(children)) return null;
                    const matches = children.filter((option) => this.matchesFilter(option));
                    return matches.length ? { ...groupItem, [this.optionGroupChildren()]: matches } : null;
                })
                .filter(Boolean);
        }

        return source.filter((option) => this.matchesFilter(option));
    });

    /** Flat list of visible options (for keyboard navigation, select all, virtual scroll) */
    readonly flatOptions = computed<any[]>(() => {
        const filtered = this.filteredOptions();
        if (!this.group()) return filtered;
        return filtered.flatMap((groupItem) =>
            Array.isArray(groupItem?.[this.optionGroupChildren()]) ? groupItem[this.optionGroupChildren()] : [],
        );
    });

    /* ── Virtual scroll ── */

    private readonly viewportHeight = computed(() => {
        const parsed = parseInt(this.scrollHeight() || '', 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 224;
    });

    readonly virtualItemSize = computed(() => this.virtualScrollItemSize() || 36);

    readonly virtualStart = computed(() => {
        if (!this.virtualScroll()) return 0;
        return Math.max(0, Math.floor(this.scrollTop() / this.virtualItemSize()) - 2);
    });

    readonly virtualEnd = computed(() => {
        const total = this.flatOptions().length;
        if (!this.virtualScroll()) return total;
        const count = Math.ceil(this.viewportHeight() / this.virtualItemSize()) + 4;
        return Math.min(total, this.virtualStart() + count);
    });

    /** Entries rendered in the current window */
    readonly displayEntries = computed<ListboxEntry[]>(() => {
        const all = this.flatOptions();
        const start = this.virtualScroll() ? this.virtualStart() : 0;
        const end = this.virtualScroll() ? this.virtualEnd() : all.length;
        return all.slice(start, end).map((option, offset) => ({ option, index: start + offset }));
    });

    readonly virtualOffsetBefore = computed(() =>
        this.virtualScroll() ? this.virtualStart() * this.virtualItemSize() : 0,
    );

    readonly virtualOffsetAfter = computed(() =>
        this.virtualScroll() ? Math.max(0, this.flatOptions().length - this.virtualEnd()) * this.virtualItemSize() : 0,
    );

    readonly allSelected = computed(() => {
        const options = this.flatOptions();
        return options.length > 0 && options.every((option) => this.isSelected(option));
    });

    readonly someSelected = computed(() => {
        const options = this.flatOptions();
        const selected = options.filter((option) => this.isSelected(option)).length;
        return selected > 0 && selected < options.length;
    });

    readonly selectedMessage = computed(() => {
        const count = Array.isArray(this.value()) ? this.value().length : this.value() !== null && this.value() !== undefined ? 1 : 0;
        return count ? `${count} items selected` : '';
    });

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }

        effect(() => {
            const initial = this.filterValue();
            if (initial !== this.lastFilterValue) {
                this.lastFilterValue = initial;
                this.filterQuery.set(initial);
            }
        });
    }

    /* ── Labels & values ── */

    getLabel(option: any): string {
        if (option === null || option === undefined) return '';
        if (this.optionLabel()) return option[this.optionLabel()] ?? '';
        return typeof option === 'object' ? (option.label ?? String(option)) : String(option);
    }

    getValue(option: any): any {
        if (option === null || option === undefined) return option;
        if (this.optionValue()) return option[this.optionValue()];
        return typeof option === 'object' ? (option.value ?? option) : option;
    }

    isSelected(option: any): boolean {
        const val = this.value();
        if (this.multiple()) {
            return Array.isArray(val) && val.some((item) => this.isSameValue(item, this.getValue(option)));
        }
        return this.isSameValue(val, this.getValue(option));
    }

    private isSameValue(a: any, b: any): boolean {
        const key = this.dataKey();
        if (key && a && b && typeof a === 'object' && typeof b === 'object') {
            return a[key] === b[key];
        }
        return a === b;
    }

    isOptionDisabled(option: any): boolean {
        const disabled = this.optionDisabled();
        if (!disabled) return false;
        return typeof disabled === 'function' ? disabled(option) : !!option?.[disabled];
    }

    /** Entry (option + flat index) for grouped rendering */
    entryFor(option: any): ListboxEntry {
        return { option, index: this.flatOptions().indexOf(option) };
    }

    /** Visible options of a group (grouped rendering) */
    groupOptions(groupItem: any): any[] {
        const children = groupItem?.[this.optionGroupChildren()];
        return Array.isArray(children) ? children : [];
    }

    trackEntry(index: number, entry: ListboxEntry): unknown {
        const key = this.dataKey();
        if (key && entry.option?.[key] != null) return entry.option[key];
        return entry.index;
    }

    /* ── Filtering ── */

    onFilterInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.filterQuery.set(value);
        this.focusedIndex.set(this.autoOptionFocus() ? 0 : -1);
        this.scrollTop.set(0);
        this.onFilter.emit({ originalEvent: event, filter: value });
    }

    private matchesFilter(option: any): boolean {
        const query = this.filterQuery().trim().toLowerCase();
        if (!query) return true;

        const fields = (this.filterBy() || this.optionLabel()).split(',').map((field) => field.trim()).filter(Boolean);
        const raw = fields.map((field) => option?.[field]).find((value) => value !== null && value !== undefined);
        const value = String(raw ?? '').toLowerCase();

        switch (this.filterMatchMode()) {
            case 'startsWith': return value.startsWith(query);
            case 'endsWith': return value.endsWith(query);
            case 'equals': return value === query;
            case 'notContains': return !value.includes(query);
            case 'notEquals': return value !== query;
            case 'gt': return parseFloat(value) > parseFloat(query);
            case 'gte': return parseFloat(value) >= parseFloat(query);
            case 'lt': return parseFloat(value) < parseFloat(query);
            case 'lte': return parseFloat(value) <= parseFloat(query);
            default: return value.includes(query);
        }
    }

    /* ── Selection ── */

    toggleOption(option: any, event: Event | boolean): void {
        if (this.actualDisabled() || this.readonly() || this.isOptionDisabled(option)) return;

        const originalEvent = event instanceof Event ? event : new Event('change');
        const optionValue = this.getValue(option);
        const index = this.flatOptions().indexOf(option);

        this.onClick.emit({ originalEvent, option, value: optionValue, index });

        if (this.multiple()) {
            const current: any[] = Array.isArray(this.value()) ? [...this.value()] : [];
            const exists = current.findIndex((item) => this.isSameValue(item, optionValue));
            const meta = originalEvent instanceof MouseEvent && (originalEvent.metaKey || originalEvent.ctrlKey);

            if (this.metaKeySelection() && !meta) {
                this.updateModel([optionValue], originalEvent);
                return;
            }

            if (exists >= 0) {
                current.splice(exists, 1);
            } else {
                current.push(optionValue);
            }
            this.updateModel(current, originalEvent);
            return;
        }

        this.updateModel(optionValue, originalEvent);
    }

    /** Updates the model value and emits the change events */
    updateModel(value: any, event: Event): void {
        this.value.set(value);
        this.onChange(value);
        this.onChangeEvent.emit({ value, originalEvent: event });
        this.onTouched();
    }

    onOptionDblClick(option: any, event: Event): void {
        if (this.actualDisabled() || this.readonly()) return;
        const index = this.flatOptions().indexOf(option);
        this.onDblClick.emit({ originalEvent: event, option, value: this.getValue(option), index });
    }

    toggleAll(checked: boolean, event: Event): void {
        if (this.actualDisabled() || this.readonly()) return;

        const value = checked ? this.flatOptions().map((option) => this.getValue(option)) : [];
        this.updateModel(value, event);
        this.onSelectAllChange.emit({ originalEvent: event, checked });
    }

    /* ── Keyboard ── */

    onKeyDown(event: KeyboardEvent): void {
        if (this.actualDisabled() || this.readonly()) return;

        const options = this.flatOptions();

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.moveFocus(1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.moveFocus(-1);
                break;
            case 'Home':
                event.preventDefault();
                this.setFocus(0);
                break;
            case 'End':
                event.preventDefault();
                this.setFocus(options.length - 1);
                break;
            case 'Enter':
            case ' ': {
                event.preventDefault();
                const index = this.focusedIndex();
                if (index >= 0 && options[index] !== undefined) {
                    this.toggleOption(options[index], event);
                }
                break;
            }
        }
    }

    private moveFocus(step: number): void {
        const options = this.flatOptions();
        if (!options.length) return;
        this.setFocus(this.focusedIndex() + step);
    }

    private setFocus(index: number): void {
        const options = this.flatOptions();
        if (!options.length) return;

        const clamped = Math.max(0, Math.min(index, options.length - 1));
        this.focusedIndex.set(clamped);

        if (this.selectOnFocus()) {
            const option = options[clamped];
            if (!this.isOptionDisabled(option) && !this.isSelected(option)) {
                this.updateModel(this.multiple() ? [...(Array.isArray(this.value()) ? this.value() : []), this.getValue(option)] : this.getValue(option), new Event('focus'));
            }
        }
    }

    onListFocus(event: FocusEvent): void {
        this.onFocusEvent.emit(event);
        if (this.autoOptionFocus() && this.focusedIndex() < 0) {
            this.setFocus(0);
        }
    }

    onListBlur(event: FocusEvent): void {
        this.onTouched();
        this.onBlurEvent.emit(event);
    }

    onOptionHover(entry: ListboxEntry): void {
        if (this.focusOnHover()) {
            this.focusedIndex.set(entry.index);
        }
    }

    /* ── Virtual scroll ── */

    onListScroll(event: Event): void {
        if (!this.virtualScroll()) return;
        this.scrollTop.set((event.target as HTMLElement).scrollTop);
    }

    /* ── Drag & drop ── */

    onDragStart(entry: ListboxEntry, event: DragEvent): void {
        if (!this.dragdrop() || this.actualDisabled() || this.readonly()) return;
        this.draggedIndex.set(entry.index);
        event.dataTransfer?.setData('text/plain', String(entry.index));
        if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    }

    onDragOver(event: DragEvent): void {
        if (!this.dragdrop() || this.draggedIndex() < 0) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    }

    handleDrop(event: DragEvent, entry: ListboxEntry): void {
        if (!this.dragdrop()) return;
        event.preventDefault();

        const previousIndex = this.draggedIndex();
        const currentIndex = entry.index;
        this.draggedIndex.set(-1);

        if (previousIndex < 0 || previousIndex === currentIndex) return;

        const reordered = [...this.sourceOptions()];
        const [moved] = reordered.splice(previousIndex, 1);
        reordered.splice(currentIndex, 0, moved);

        this.orderedOptions.set(reordered);
        this.onDrop.emit({ originalEvent: event, previousIndex, currentIndex, value: reordered });
    }

    onDragEnd(): void {
        this.draggedIndex.set(-1);
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        if (this.multiple()) {
            this.value.set(Array.isArray(value) ? [...value] : []);
        } else {
            this.value.set(value ?? null);
        }
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
