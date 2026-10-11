import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    ElementRef,
    input,
    Optional,
    output,
    Self,
    signal,
    TemplateRef,
    viewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl, FormsModule } from '@angular/forms';
import {
    LucideCheck,
    LucideChevronDown,
    LucideChevronRight,
    LucideDynamicIcon,
    LucideMinus,
    LucideSearch,
    LucideX,
} from '@lucide/angular';
import { CzInputSize, CzLabelPosition, CzOverlayZIndex, czOverlayZIndex } from '../../types';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';

export interface CzTreeSelectNode {
    label?: string;
    value?: any;
    children?: CzTreeSelectNode[];
    selectable?: boolean;
    disabled?: boolean;
    expanded?: boolean;
    loading?: boolean;
    leaf?: boolean;
    [key: string]: any;
}

/** @deprecated Use `CzTreeSelectNode` */
export type CzTreeSelectOption = CzTreeSelectNode;

export type CzTreeSelectSelectionMode = 'single' | 'multiple' | 'checkbox';
export type CzTreeSelectDisplay = 'combo' | 'chip';

export interface CzTreeSelectChangeEvent {
    originalEvent: Event;
    value: any;
}

export interface CzTreeSelectNodeEvent {
    originalEvent: Event;
    node: CzTreeSelectNode;
}

interface TreeRow {
    node: CzTreeSelectNode;
    depth: number;
    expandable: boolean;
    leaf: boolean;
}

let treeSelectUid = 0;

@Component({
    selector: 'cz-tree-select',
    imports: [CommonModule, FormsModule, LucideDynamicIcon],
    templateUrl: './tree-select.component.html',
    styleUrl: './tree-select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-tree-select',
        '[class.cz-tree-select--disabled]': 'actualDisabled()',
        '[class.cz-tree-select--multiple]': 'isMultiple()',
        '[class.cz-input-has-error]': 'isInvalid',
        '[attr.data-size]': 'size()',
        '(document:click)': 'onDocumentClick($event)',
    },
})
export class CzTreeSelectComponent implements ControlValueAccessor, AfterViewInit {
    // ── Data ──
    /** Hierarchical options */
    options = input<CzTreeSelectNode[]>([]);

    /** Property used as the visible label */
    optionLabel = input<string>('label');

    /** Property used as the value */
    optionValue = input<string>('value');

    /** A property to uniquely identify a value in options */
    dataKey = input<string>('');

    /** Selection mode */
    selectionMode = input<CzTreeSelectSelectionMode>('single');

    /** Defines how the selected items are displayed in multiple/checkbox mode */
    display = input<CzTreeSelectDisplay>('combo');

    /** Whether multiple selection without checkbox requires meta key to toggle */
    metaKeySelection = input<boolean>(true);

    // ── Common inputs ──
    label = input<string>('');
    labelPosition = input<CzLabelPosition>('none');
    placeholder = input<string>('Select...');
    disabled = input<boolean>(false);
    readonly = input<boolean>(false);
    invalid = input<boolean>(false);
    clearable = input<boolean>(false);
    /** @deprecated Use `clearable` */
    showClear = input<boolean>(false);
    fluid = input<boolean>(false);
    variant = input<'outlined' | 'filled'>('outlined');
    size = input<CzInputSize>('md');
    zIndex = input<CzOverlayZIndex>(null);
    name = input<string>('');
    inputId = input<string>('');
    tabindex = input<number | null>(null);
    autofocus = input<boolean>(false);
    ariaLabel = input<string | null>(null);
    ariaLabelledBy = input<string | null>(null);
    helpText = input<string>('');
    showErrors = input<boolean>(true);
    locale = input<CzValidationLocale>('es');
    customErrors = input<Partial<CzValidationErrorKeys>>();

    // ── Filter ──
    filter = input<boolean>(false);
    filterBy = input<string>('');
    filterPlaceholder = input<string>('Search...');
    filterMode = input<'lenient' | 'strict'>('lenient');

    // ── Messages ──
    emptyMessage = input<string>('No results found');
    emptyFilterMessage = input<string>('No results found');
    scrollHeight = input<string>('');

    // ── Templates ──
    valueTemplate = contentChild<TemplateRef<any>>('valueTemplate');
    itemTemplate = contentChild<TemplateRef<any>>('itemTemplate');
    headerTemplate = contentChild<TemplateRef<any>>('headerTemplate');
    footerTemplate = contentChild<TemplateRef<any>>('footerTemplate');
    emptyTemplate = contentChild<TemplateRef<any>>('emptyTemplate');
    emptyFilterTemplate = contentChild<TemplateRef<any>>('emptyFilterTemplate');
    dropdownIconTemplate = contentChild<TemplateRef<any>>('dropdownIconTemplate');
    clearIconTemplate = contentChild<TemplateRef<any>>('clearIconTemplate');
    filterIconTemplate = contentChild<TemplateRef<any>>('filterIconTemplate');

    // ── Outputs ──
    onChangeEvent = output<CzTreeSelectChangeEvent>({ alias: 'onChange' });
    onNodeSelectEvent = output<CzTreeSelectNodeEvent>({ alias: 'onNodeSelect' });
    onNodeUnselectEvent = output<CzTreeSelectNodeEvent>({ alias: 'onNodeUnselect' });
    onNodeExpandEvent = output<CzTreeSelectNodeEvent>({ alias: 'onNodeExpand' });
    onNodeCollapseEvent = output<CzTreeSelectNodeEvent>({ alias: 'onNodeCollapse' });
    onFilterEvent = output<{ originalEvent: Event; filter: string }>({ alias: 'onFilter' });
    onClearEvent = output<Event>({ alias: 'onClear' });
    onFocusEvent = output<Event>({ alias: 'onFocus' });
    onBlurEvent = output<Event>({ alias: 'onBlur' });
    onShowEvent = output<Event>({ alias: 'onShow' });
    onHideEvent = output<Event>({ alias: 'onHide' });

    // ── State ──
    value = signal<any>(null);
    isOpen = signal<boolean>(false);
    isFocused = signal<boolean>(false);
    filterValue = signal<string>('');
    highlightedIndex = signal<number>(-1);
    expanded = signal<Set<CzTreeSelectNode>>(new Set());
    formsDisabled = signal<boolean>(false);

    private static nextId = 0;
    private readonly autoId = `cz-tree-select-${++CzTreeSelectComponent.nextId}`;
    readonly effectiveInputId = computed(() => this.inputId() || this.autoId);
    readonly panelId = computed(() => `${this.effectiveInputId()}-panel`);

    readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex()));
    readonly actualDisabled = computed(() => this.disabled() || this.formsDisabled());
    readonly isMultiple = computed(() => this.selectionMode() !== 'single');
    readonly showClearButton = computed(() => (this.clearable() || this.showClear()) && !this.actualDisabled() && !this.readonly() && this.hasValue());
    readonly isFilled = computed(() => this.variant() === 'filled');

    private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('triggerEl');
    private readonly panelScrollRef = viewChild<ElementRef<HTMLElement>>('panelEl');

    readonly ChevronDownIcon = LucideChevronDown;
    readonly ChevronRightIcon = LucideChevronRight;
    readonly CheckIcon = LucideCheck;
    readonly MinusIcon = LucideMinus;
    readonly XIcon = LucideX;
    readonly SearchIcon = LucideSearch;

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngAfterViewInit(): void {
        if (this.autofocus() && !this.actualDisabled()) {
            this.triggerRef()?.nativeElement.focus();
        }
    }

    // ── Helpers ──
    getOptionLabel(node: CzTreeSelectNode): string {
        if (!node) return '';
        const key = this.optionLabel();
        return node[key] ?? '';
    }

    getOptionValue(node: CzTreeSelectNode): any {
        if (!node) return null;
        const key = this.optionValue();
        return key && node[key] !== undefined ? node[key] : node;
    }

    isNodeSelectable(node: CzTreeSelectNode): boolean {
        return node.selectable !== false && !node.disabled;
    }

    private isEqual(a: any, b: any): boolean {
        const key = this.dataKey();
        if (key && a && b && typeof a === 'object' && typeof b === 'object') {
            return a[key] === b[key];
        }
        return a === b;
    }

    private findNode(value: any, nodes: CzTreeSelectNode[] = this.options()): CzTreeSelectNode | null {
        for (const node of nodes) {
            if (this.isEqual(this.getOptionValue(node), value)) return node;
            if (node.children?.length) {
                const found = this.findNode(value, node.children);
                if (found) return found;
            }
        }
        return null;
    }

    private leavesOf(node: CzTreeSelectNode): CzTreeSelectNode[] {
        if (!node.children?.length) return [node];
        return node.children.flatMap((child) => this.leavesOf(child));
    }

    // ── Value helpers ──
    readonly hasValue = computed(() => {
        const val = this.value();
        if (this.isMultiple()) return Array.isArray(val) && val.length > 0;
        return val !== null && val !== undefined && val !== '';
    });

    readonly selectedNodes = computed<CzTreeSelectNode[]>(() => {
        const val = this.value();
        if (!this.hasValue()) return [];
        if (this.isMultiple()) {
            return (val as any[]).map((v) => this.findNode(v)).filter(Boolean) as CzTreeSelectNode[];
        }
        const node = this.findNode(val);
        return node ? [node] : [];
    });

    readonly selectedLabel = computed(() => {
        const nodes = this.selectedNodes();
        if (this.isMultiple()) return nodes.map((n) => this.getOptionLabel(n)).join(', ');
        return nodes.length ? this.getOptionLabel(nodes[0]) : '';
    });

    isSelected(node: CzTreeSelectNode): boolean {
        const val = this.getOptionValue(node);
        if (this.isMultiple()) {
            return Array.isArray(this.value()) && (this.value() as any[]).some((v) => this.isEqual(v, val));
        }
        return this.hasValue() && this.isEqual(this.value(), val);
    }

    /** Whether a node is fully selected in checkbox mode (all descendants selected) */
    isChecked(node: CzTreeSelectNode): boolean {
        const leaves = this.leavesOf(node);
        return leaves.length > 0 && leaves.every((leaf) => this.isSelected(leaf));
    }

    /** Whether a node is partially selected in checkbox mode */
    isPartial(node: CzTreeSelectNode): boolean {
        if (!node.children?.length) return false;
        const leaves = this.leavesOf(node);
        const selectedCount = leaves.filter((leaf) => this.isSelected(leaf)).length;
        return selectedCount > 0 && selectedCount < leaves.length;
    }

    // ── Rows / Filter ──
    private matchesFilter(node: CzTreeSelectNode, query: string): boolean {
        const field = this.filterBy() || this.optionLabel();
        const value = String(node?.[field] ?? '').toLowerCase();
        return value.includes(query);
    }

    /** Nodes that match the filter (with ancestors kept in lenient mode) */
    private filterTree(nodes: CzTreeSelectNode[], query: string): CzTreeSelectNode[] {
        if (!query) return nodes;
        const result: CzTreeSelectNode[] = [];
        for (const node of nodes) {
            const children = node.children?.length ? this.filterTree(node.children, query) : [];
            const selfMatch = this.matchesFilter(node, query);
            if (selfMatch) {
                result.push(node);
            } else if (children.length && this.filterMode() === 'lenient') {
                result.push({ ...node, children });
            } else if (children.length) {
                result.push({ ...node, children });
            }
        }
        return result;
    }

    readonly filteredOptions = computed<CzTreeSelectNode[]>(() => {
        const query = this.filterValue().trim().toLowerCase();
        return this.filterTree(this.options(), query);
    });

    /** Whether a node should be expanded (explicit or due to active filtering) */
    isExpanded(node: CzTreeSelectNode): boolean {
        if (this.filterValue().trim()) return true;
        if (node.expanded) return true;
        return this.expanded().has(node);
    }

    readonly visibleRows = computed<TreeRow[]>(() => {
        const rows: TreeRow[] = [];
        const walk = (nodes: CzTreeSelectNode[], depth: number) => {
            for (const node of nodes) {
                const children = node.children ?? [];
                const leaf = children.length === 0;
                rows.push({ node, depth, expandable: !leaf, leaf });
                if (!leaf && this.isExpanded(node)) {
                    walk(children, depth + 1);
                }
            }
        };
        walk(this.filteredOptions(), 0);
        return rows;
    });

    rowIndex(node: CzTreeSelectNode): number {
        return this.visibleRows().findIndex((r) => r.node === node);
    }

    optionId(index: number): string {
        return `${this.effectiveInputId()}-option-${index}`;
    }

    readonly activeDescendant = computed(() => {
        const index = this.highlightedIndex();
        return index > -1 && this.isOpen() ? this.optionId(index) : null;
    });

    // ── CVA ──
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    writeValue(value: any): void {
        if (this.isMultiple()) {
            this.value.set(Array.isArray(value) ? value : value !== null && value !== undefined ? [value] : []);
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

    setDisabledState(isDisabled: boolean): void {
        this.formsDisabled.set(isDisabled);
    }

    // ── Validation ──
    get isInvalid(): boolean {
        if (this.invalid()) return true;
        if (!this.ngControl) return false;
        return !!(this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty));
    }

    get errorMessage(): string | null {
        if (!this.isInvalid || !this.ngControl?.errors) return null;
        const dictionary = {
            ...CZ_VALIDATION_MESSAGES[this.locale()],
            ...this.customErrors(),
        };
        for (const key of Object.keys(this.ngControl.errors)) {
            const mappedError: any = dictionary[key as keyof typeof dictionary];
            if (mappedError) {
                if (typeof mappedError === 'function') {
                    return mappedError(this.ngControl.errors[key].requiredLength || this.ngControl.errors[key]);
                }
                return mappedError;
            }
        }
        return dictionary.default;
    }

    // ── Panel ──
    toggle(): void {
        if (this.actualDisabled()) return;
        if (this.isOpen()) {
            this.hide();
        } else {
            this.show();
        }
    }

    show(): void {
        if (this.actualDisabled() || this.isOpen()) return;
        this.isOpen.set(true);
        this.isFocused.set(true);
        this.highlightedIndex.set(-1);
        this.onShowEvent.emit(new Event('show'));
    }

    hide(): void {
        if (!this.isOpen()) return;
        this.isOpen.set(false);
        this.filterValue.set('');
        this.highlightedIndex.set(-1);
        this.onTouched();
        this.onHideEvent.emit(new Event('hide'));
    }

    focus(): void {
        this.triggerRef()?.nativeElement.focus();
    }

    // ── Selection ──
    selectNode(node: CzTreeSelectNode, event: Event): void {
        if (this.actualDisabled() || this.readonly() || !this.isNodeSelectable(node)) return;

        const mode = this.selectionMode();
        if (mode === 'single') {
            this.updateValue(this.getOptionValue(node), event);
            this.onNodeSelectEvent.emit({ originalEvent: event, node });
            this.hide();
            return;
        }

        if (mode === 'checkbox') {
            this.toggleCheckbox(node, event);
            return;
        }

        // multiple (no checkboxes)
        const arr = Array.isArray(this.value()) ? [...(this.value() as any[])] : [];
        const val = this.getOptionValue(node);
        const index = arr.findIndex((v) => this.isEqual(v, val));
        const metaKey = (event as MouseEvent).metaKey || (event as MouseEvent).ctrlKey;

        if (!this.metaKeySelection()) {
            // Without meta-key selection, clicking replaces the whole selection
            if (index > -1 && arr.length === 1) {
                this.updateValue([], event);
                this.onNodeUnselectEvent.emit({ originalEvent: event, node });
            } else {
                this.updateValue([val], event);
                this.onNodeSelectEvent.emit({ originalEvent: event, node });
            }
            return;
        }

        if (index > -1) {
            arr.splice(index, 1);
            this.updateValue(arr, event);
            this.onNodeUnselectEvent.emit({ originalEvent: event, node });
        } else {
            arr.push(val);
            this.updateValue(arr, event);
            this.onNodeSelectEvent.emit({ originalEvent: event, node });
        }
    }

    /** Checkbox mode: toggling a node selects/deselects its entire subtree (leaves) */
    toggleCheckbox(node: CzTreeSelectNode, event: Event): void {
        if (this.actualDisabled() || this.readonly() || !this.isNodeSelectable(node)) return;

        const leaves = this.leavesOf(node).filter((leaf) => this.isNodeSelectable(leaf));
        const arr = Array.isArray(this.value()) ? [...(this.value() as any[])] : [];
        const allSelected = leaves.every((leaf) => arr.some((v) => this.isEqual(v, this.getOptionValue(leaf))));

        if (allSelected) {
            const valuesToRemove = leaves.map((leaf) => this.getOptionValue(leaf));
            const next = arr.filter((v) => !valuesToRemove.some((removed) => this.isEqual(v, removed)));
            this.updateValue(next, event);
            this.onNodeUnselectEvent.emit({ originalEvent: event, node });
        } else {
            const next = [...arr];
            for (const leaf of leaves) {
                const leafValue = this.getOptionValue(leaf);
                if (!next.some((v) => this.isEqual(v, leafValue))) next.push(leafValue);
            }
            this.updateValue(next, event);
            this.onNodeSelectEvent.emit({ originalEvent: event, node });
        }
    }

    removeValue(value: any, event: Event): void {
        event.stopPropagation();
        if (this.actualDisabled() || this.readonly()) return;
        const node = this.findNode(value);
        const next = (Array.isArray(this.value()) ? (this.value() as any[]) : []).filter((v) => !this.isEqual(v, value));
        this.updateValue(next, event);
        if (node) this.onNodeUnselectEvent.emit({ originalEvent: event, node });
    }

    private updateValue(val: any, event: Event): void {
        this.value.set(val);
        this.onChange(val);
        this.onTouched();
        this.onChangeEvent.emit({ originalEvent: event, value: val });
    }

    clear(event: Event): void {
        event.stopPropagation();
        if (this.actualDisabled() || this.readonly()) return;
        const next = this.isMultiple() ? [] : null;
        this.updateValue(next, event);
        this.onClearEvent.emit(event);
    }

    // ── Expand ──
    toggleExpand(node: CzTreeSelectNode, event: Event): void {
        event.stopPropagation();
        const next = new Set(this.expanded());
        if (next.has(node)) {
            next.delete(node);
            this.onNodeCollapseEvent.emit({ originalEvent: event, node });
        } else {
            next.add(node);
            this.onNodeExpandEvent.emit({ originalEvent: event, node });
        }
        this.expanded.set(next);
    }

    // ── Filter ──
    onFilterInput(event: Event): void {
        const query = (event.target as HTMLInputElement).value;
        this.filterValue.set(query);
        this.highlightedIndex.set(0);
        this.onFilterEvent.emit({ originalEvent: event, filter: query });
    }

    // ── Document / keyboard ──
    onDocumentClick(event: Event): void {
        if (!this.isOpen()) return;
        const host = event.currentTarget as HTMLElement | null;
        const target = event.target as Node | null;
        if (target && host && !host.contains(target)) {
            this.hide();
        }
    }

    onFocus(event: Event): void {
        this.isFocused.set(true);
        this.onFocusEvent.emit(event);
    }

    onBlur(event: Event): void {
        this.isFocused.set(false);
        this.onBlurEvent.emit(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.actualDisabled()) return;

        if (!this.isOpen()) {
            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.show();
            }
            return;
        }

        const rows = this.visibleRows();
        const index = this.highlightedIndex();

        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                if (!rows.length) return;
                const next = index < rows.length - 1 ? index + 1 : 0;
                this.highlightedIndex.set(next);
                this.scrollToRow(next);
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                if (!rows.length) return;
                const previous = index > 0 ? index - 1 : rows.length - 1;
                this.highlightedIndex.set(previous);
                this.scrollToRow(previous);
                break;
            }
            case 'ArrowRight': {
                event.preventDefault();
                const row = rows[index];
                if (row?.expandable && !this.isExpanded(row.node)) {
                    this.toggleExpand(row.node, event);
                }
                break;
            }
            case 'ArrowLeft': {
                event.preventDefault();
                const row = rows[index];
                if (row?.expandable && this.isExpanded(row.node)) {
                    this.toggleExpand(row.node, event);
                }
                break;
            }
            case 'Enter':
            case ' ': {
                event.preventDefault();
                const row = rows[index];
                if (row) this.selectNode(row.node, event);
                break;
            }
            case 'Home': {
                event.preventDefault();
                this.highlightedIndex.set(0);
                this.scrollToRow(0);
                break;
            }
            case 'End': {
                event.preventDefault();
                this.highlightedIndex.set(rows.length - 1);
                this.scrollToRow(rows.length - 1);
                break;
            }
            case 'Escape': {
                event.preventDefault();
                this.hide();
                break;
            }
            case 'Tab': {
                this.hide();
                break;
            }
        }
    }

    private scrollToRow(index: number): void {
        const panel = this.panelScrollRef()?.nativeElement;
        if (!panel) return;
        const row = panel.querySelectorAll('.cz-tree-select-row')[index] as HTMLElement | null;
        row?.scrollIntoView({ block: 'nearest' });
    }
}
