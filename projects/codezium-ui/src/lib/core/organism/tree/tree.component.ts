import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    TemplateRef,
    computed,
    inject,
    input,
    model,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    LucideChevronDown,
    LucideChevronRight,
    LucideDynamicIcon,
    type LucideIconInput,
} from '@lucide/angular';
import { CzMenuItem, CzOverlayZIndex, czOverlayZIndex } from '../../types';
import { CzCheckboxComponent } from '../../atoms/checkbox';
import { CzProgressSpinnerComponent } from '../../atoms/progress-spinner';

export interface CzTreeNode {
    label: string;
    value?: any;
    icon?: LucideIconInput;
    children?: CzTreeNode[];
    /** Stable key (used by expandedKeys/selection when `dataKey` is not provided) */
    key?: string;
    /** Initially expanded */
    expanded?: boolean;
    /** Whether the node can be selected (default true) */
    selectable?: boolean;
    /** Leaf node (no children and no lazy loading) */
    leaf?: boolean;
    /** Lazy loading in progress */
    loading?: boolean;
}

export type CzTreeSelectionMode = 'none' | 'single' | 'multiple' | 'checkbox';
export type CzTreeFilterMode = 'lenient' | 'strict';
export type CzTreeLoadingMode = 'mask' | 'icon';

interface TreeRow {
    node: CzTreeNode;
    depth: number;
    expandable: boolean;
    index: number;
    parentIndex: number;
    posinset: number;
    setsize: number;
}

@Component({
    selector: 'cz-tree',
    imports: [CommonModule, FormsModule, LucideDynamicIcon, CzCheckboxComponent, CzProgressSpinnerComponent],
    templateUrl: './tree.component.html',
    styleUrl: './tree.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-tree',
        '(document:click)': 'closeContextMenu()',
        '(document:keydown.escape)': 'closeContextMenu()',
    },
})
export class CzTreeComponent {
    private readonly host = inject(ElementRef<HTMLElement>);

    /** Hierarchical nodes (legacy alias of `value`) */
    options = input<CzTreeNode[]>([]);

    /** Hierarchical nodes */
    value = input<CzTreeNode[] | null>(null);

    /** Selection mode */
    selectionMode = input<CzTreeSelectionMode>('single');

    /** Selected nodes (multiple / checkbox mode, two-way bindable) */
    selection = model<CzTreeNode[]>([]);

    /** Property of a node that uniquely identifies it (used by expandedKeys and selection) */
    dataKey = input<string | null>(null);

    /** Expanded node keys (two-way bindable) */
    expandedKeys = model<Record<string, boolean>>({});

    /** Checks/unchecks descendants when toggling a checkbox node */
    propagateSelectionDown = input<boolean>(true);

    /** Checks/unchecks ancestors when toggling a checkbox node */
    propagateSelectionUp = input<boolean>(true);

    /** Defines how multiple items can be selected: when true, metaKey/ctrl must be pressed to toggle; when false each click toggles */
    metaKeySelection = input<boolean>(true);

    /** Highlights the node on select */
    highlightOnSelect = input<boolean>(true);

    /** Displays a built-in filter input */
    filter = input<boolean>(false);

    /** Filter input placeholder */
    filterPlaceholder = input<string>('');

    /** Fields searched by the built-in filter (comma separated) */
    filterBy = input<string>('label');

    /** Filter mode: `lenient` (contains) or `strict` (starts with) */
    filterMode = input<CzTreeFilterMode>('lenient');

    /** Focuses the filter input on render */
    filterInputAutoFocus = input<boolean>(false);

    /** Custom filter template */
    filterTemplate = input<TemplateRef<unknown> | null>(null);

    /** Global filter value (contains, case insensitive). Ancestors of matches are kept and auto-expanded */
    globalFilter = input<string>('');

    /** Node properties used by the global filter (defaults to `label` and `value`) */
    filterFields = input<string[] | null>(null);

    /** Displays a loading overlay over the tree */
    loading = input<boolean>(false);

    /** Loading mode display */
    loadingMode = input<CzTreeLoadingMode>('mask');

    /** Custom loading icon template */
    loadingIconTemplate = input<TemplateRef<unknown> | null>(null);

    /** Node template: `$implicit` node, `depth`, `expanded` (replaces the default icon + label) */
    nodeTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom toggler icon template: `$implicit` expanded, `loading` */
    togglerIconTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom header template (rendered above the tree) */
    headerTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom footer template (rendered below the tree) */
    footerTemplate = input<TemplateRef<unknown> | null>(null);

    /** Message when there are no nodes */
    emptyMessage = input<string>('No records found');

    /** Custom empty state */
    emptyTemplate = input<TemplateRef<unknown> | null>(null);

    /** Height of the scrollable viewport */
    scrollHeight = input<string | null>(null);

    /** Renders only the visible window of rows for large data sets */
    virtualScroll = input<boolean>(false);

    /** Height of a row in pixels for virtual scrolling */
    virtualScrollItemSize = input<number>(0);

    /** Indentation factor (rem) for nested levels */
    indentation = input<number>(1.25);

    /** Custom tracking function for the node list */
    trackBy = input<((index: number, node: CzTreeNode) => unknown) | null>(null);

    /** String that labels the tree for accessibility */
    ariaLabel = input<string | null>(null);

    /** IDs of elements that label the tree for accessibility */
    ariaLabelledBy = input<string | null>(null);

    /** Label for the toggler icons */
    togglerAriaLabel = input<string>('Toggle node');

    /** Items for the built-in node context menu (right click) */
    contextMenuItems = input<CzMenuItem[]>([]);

    /** Overlay z-index of the built-in context menu */
    zIndex = input<CzOverlayZIndex>(null);

    /** Emitted when a node is selected */
    onNodeSelect = output<CzTreeNode>();

    /** Emitted when a node is unselected */
    onNodeUnselect = output<CzTreeNode>();

    /** Emitted when the multiple / checkbox selection changes */
    onSelectionChange = output<CzTreeNode[]>();

    /** Emitted when a node is expanded */
    onNodeExpand = output<CzTreeNode>();

    /** Emitted when a node is collapsed */
    onNodeCollapse = output<CzTreeNode>();

    /** Emitted when a node is double clicked */
    onNodeDoubleClick = output<CzTreeNode>();

    /** Emitted when a node is right-clicked */
    onNodeContextMenu = output<{ node: CzTreeNode; event: MouseEvent }>();

    /** Emitted when a built-in context menu item is activated */
    onContextMenuSelect = output<{ item: CzMenuItem; node: CzTreeNode }>();

    /** Emitted when the built-in filter changes */
    onFilter = output<{ filter: string }>();

    /** Emitted on virtual scroll viewport scroll */
    onScroll = output<Event>();

    /** Emitted when the rendered range changes while scrolling */
    onScrollIndexChange = output<{ first: number; last: number }>();

    /** Selected node (single mode) */
    selectedNode = signal<CzTreeNode | null>(null);

    /** Expanded nodes (identity fallback when no key is available) */
    expandedNodes = signal<Set<CzTreeNode>>(new Set());

    /** Nodes toggled at least once (identity fallback) */
    private touchedNodes = signal<Set<CzTreeNode>>(new Set());

    /** Maps cloned nodes (filter) back to their original value node */
    private readonly cloneSources = new Map<CzTreeNode, CzTreeNode>();

    /** Built-in filter value */
    readonly filterValue = signal<string>('');

    /** Keyboard focus (index of the focused row) */
    readonly focusedIndex = signal<number>(-1);

    /** Virtual scroll offset */
    readonly scrollTop = signal<number>(0);

    /** Built-in context menu state */
    contextMenuVisible = signal<boolean>(false);
    contextMenuPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });
    contextMenuNode = signal<CzTreeNode | null>(null);

    readonly contextMenuZIndex = computed(() => czOverlayZIndex(this.zIndex()));

    readonly ChevronDownIcon = LucideChevronDown;
    readonly ChevronRightIcon = LucideChevronRight;

    /** Nodes from `value` or the legacy `options` alias */
    readonly nodes = computed<CzTreeNode[]>(() => this.value() ?? this.options());

    /** True when the built-in or the global filter is active */
    readonly hasActiveFilter = computed(() => !!(this.filterValue().trim() || this.globalFilter().trim()));

    /** Tree filtered by the built-in filter or the global filter (keeps ancestors of matches) */
    readonly filteredNodes = computed<CzTreeNode[]>(() => {
        this.cloneSources.clear();

        if (!this.hasActiveFilter()) return this.nodes();

        const filterNodes = (nodes: CzTreeNode[]): CzTreeNode[] => {
            const result: CzTreeNode[] = [];
            for (const node of nodes) {
                if (this.matchesFilter(node)) {
                    result.push(node);
                    continue;
                }
                const children = node.children?.length ? filterNodes(node.children) : [];
                if (children.length) {
                    const clone = { ...node, children };
                    this.cloneSources.set(clone, this.identityOf(node));
                    result.push(clone);
                }
            }
            return result;
        };

        return filterNodes(this.nodes());
    });

    readonly visibleRows = computed<TreeRow[]>(() => {
        const rows: TreeRow[] = [];

        const walk = (nodes: CzTreeNode[], depth: number, parentIndex: number) => {
            const setsize = nodes.length;
            nodes.forEach((node, position) => {
                const expandable = this.isExpandable(node);
                const index = rows.length;
                rows.push({ node, depth, expandable, index, parentIndex, posinset: position + 1, setsize });

                if (expandable && node.children?.length && this.isExpanded(node)) {
                    walk(node.children, depth + 1, index);
                }
            });
        };

        walk(this.filteredNodes(), 0, -1);
        return rows;
    });

    readonly isEmpty = computed(() => this.visibleRows().length === 0);

    /* ── Virtual scroll ── */

    readonly virtualItemSize = computed(() => this.virtualScrollItemSize() || 28);

    private readonly viewportHeight = computed(() => {
        const height = this.scrollHeight();
        const parsed = height ? parseInt(height, 10) : NaN;
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 250;
    });

    readonly virtualStart = computed(() => {
        if (!this.virtualScroll()) return 0;
        return Math.max(0, Math.floor(this.scrollTop() / this.virtualItemSize()) - 2);
    });

    readonly virtualEnd = computed(() => {
        const total = this.visibleRows().length;
        if (!this.virtualScroll()) return total;
        const count = Math.ceil(this.viewportHeight() / this.virtualItemSize()) + 4;
        return Math.min(total, this.virtualStart() + count);
    });

    /** Rows rendered in the current window */
    readonly displayRows = computed(() => {
        if (!this.virtualScroll()) return this.visibleRows();
        return this.visibleRows().slice(this.virtualStart(), this.virtualEnd());
    });

    handleScroll(event: Event): void {
        this.onScroll.emit(event);

        if (!this.virtualScroll()) return;

        const first = this.virtualStart();
        this.scrollTop.set((event.target as HTMLElement).scrollTop);

        if (this.virtualStart() !== first) {
            this.onScrollIndexChange.emit({ first: this.virtualStart(), last: this.virtualEnd() });
        }
    }

    /* ── Filter ── */

    onFilterInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.filterValue.set(value);
        this.onFilter.emit({ filter: value });
    }

    /** Resets the built-in filter */
    resetFilter(): void {
        this.filterValue.set('');
        this.onFilter.emit({ filter: '' });
    }

    private matchesFilter(node: CzTreeNode): boolean {
        const builtIn = this.filterValue().trim();
        const value = (builtIn || this.globalFilter().trim()).toLowerCase();
        if (!value) return true;

        const fields = builtIn
            ? this.filterBy().split(',').map(field => field.trim()).filter(Boolean)
            : this.filterFields() ?? ['label', 'value'];
        const strict = builtIn ? this.filterMode() === 'strict' : false;

        return fields.some(field => {
            const text = String((node as Record<string, any>)[field] ?? '').toLowerCase();
            return strict ? text.startsWith(value) : text.includes(value);
        });
    }

    /* ── Expansion ── */

    isExpandable(node: CzTreeNode): boolean {
        return node.leaf === false || !!node.children?.length;
    }

    isExpanded(node: CzTreeNode): boolean {
        if (this.hasActiveFilter() && node.children?.length) return true;

        const key = this.expandedKey(node);
        if (key != null) {
            const value = this.expandedKeys()[key];
            if (value !== undefined) return value;
            return node.expanded === true;
        }

        const identity = this.identityOf(node);
        if (this.touchedNodes().has(identity)) return this.expandedNodes().has(identity);
        return node.expanded === true;
    }

    toggle(node: CzTreeNode, event?: Event): void {
        event?.stopPropagation();

        const expanded = this.isExpanded(node);
        const key = this.expandedKey(node);

        if (key != null) {
            const next = { ...this.expandedKeys() };
            next[key] = !expanded;
            this.expandedKeys.set(next);
        } else {
            const identity = this.identityOf(node);

            const nextTouched = new Set(this.touchedNodes());
            nextTouched.add(identity);

            const next = new Set(this.expandedNodes());
            if (expanded) {
                next.delete(identity);
            } else {
                next.add(identity);
            }

            this.touchedNodes.set(nextTouched);
            this.expandedNodes.set(next);
        }

        if (expanded) {
            this.onNodeCollapse.emit(this.identityOf(node));
        } else {
            this.onNodeExpand.emit(this.identityOf(node));
        }
    }

    private expandedKey(node: CzTreeNode): string | null {
        const dataKey = this.dataKey();
        if (dataKey && (node as Record<string, any>)[dataKey] != null) return String((node as Record<string, any>)[dataKey]);
        if (node.key != null) return node.key;
        return null;
    }

    /* ── Selection ── */

    selectNode(node: CzTreeNode, event?: MouseEvent): void {
        if (this.selectionMode() === 'none' || node.selectable === false) return;

        if (this.selectionMode() === 'single') {
            const identity = this.identityOf(node);
            this.selectedNode.set(identity);
            this.onNodeSelect.emit(identity);
            return;
        }

        if (this.selectionMode() === 'multiple') {
            if (!this.metaKeySelection() || event?.metaKey || event?.ctrlKey) {
                this.toggleNodeSelection(node, !this.isSelected(node));
            } else {
                const identity = this.identityOf(node);
                this.selection.set([identity]);
                this.onSelectionChange.emit([identity]);
                this.onNodeSelect.emit(identity);
            }
        }
    }

    toggleNodeSelection(node: CzTreeNode, checked: boolean): void {
        const identity = this.identityOf(node);
        const current = this.selection();
        const next = checked
            ? [...current.filter(item => !this.isSameNode(item, identity)), identity]
            : current.filter(item => !this.isSameNode(item, identity));

        this.selection.set(next);
        this.onSelectionChange.emit(next);

        if (checked) {
            this.onNodeSelect.emit(identity);
        } else {
            this.onNodeUnselect.emit(identity);
        }
    }

    isSelected(node: CzTreeNode): boolean {
        return this.selection().some(item => this.isSameNode(item, node));
    }

    isSingleSelected(node: CzTreeNode): boolean {
        const selected = this.selectedNode();
        return !!selected && this.isSameNode(selected, node);
    }

    isHighlighted(node: CzTreeNode): boolean {
        if (!this.highlightOnSelect()) return false;
        if (this.selectionMode() === 'single') return this.isSingleSelected(node);
        return this.isSelected(node);
    }

    /* ── Checkbox mode ── */

    toggleCheckbox(node: CzTreeNode, checked: boolean): void {
        if (node.selectable === false) return;

        const identity = this.identityOf(node);
        let next = [...this.selection()];

        if (checked) {
            const toAdd = [identity];
            if (this.propagateSelectionDown()) {
                for (const descendant of this.descendants(node)) {
                    if (descendant.selectable === false) continue;
                    const id = this.identityOf(descendant);
                    if (!this.isSameNode(id, identity)) toAdd.push(id);
                }
            }
            for (const id of toAdd) {
                if (!next.some(item => this.isSameNode(item, id))) next.push(id);
            }
        } else {
            const toRemove = [identity];
            if (this.propagateSelectionDown()) {
                for (const descendant of this.descendants(node)) {
                    if (descendant.selectable === false) continue;
                    const id = this.identityOf(descendant);
                    if (!this.isSameNode(id, identity)) toRemove.push(id);
                }
            }
            next = next.filter(item => !toRemove.some(id => this.isSameNode(item, id)));
        }

        if (this.propagateSelectionUp()) {
            next = this.propagateUp(next);
        }

        this.selection.set(next);
        this.onSelectionChange.emit(next);

        if (checked) {
            this.onNodeSelect.emit(identity);
        } else {
            this.onNodeUnselect.emit(identity);
        }
    }

    /** True when the node and every selectable descendant is selected */
    isChecked(node: CzTreeNode): boolean {
        const selectables = this.descendants(node).filter(descendant => descendant.selectable !== false);
        return selectables.length > 0 && selectables.every(descendant => this.isSelected(descendant));
    }

    /** True when some (but not all) selectable descendants are selected */
    isIndeterminate(node: CzTreeNode): boolean {
        const selectables = this.descendants(node).filter(descendant => descendant.selectable !== false);
        if (selectables.length < 2) return false;
        const selected = selectables.filter(descendant => this.isSelected(descendant)).length;
        return selected > 0 && selected < selectables.length;
    }

    /** Adds/removes ancestors according to their descendants' selection */
    private propagateUp(selection: CzTreeNode[]): CzTreeNode[] {
        let next = [...selection];

        const walk = (nodes: CzTreeNode[]): void => {
            for (const node of nodes) {
                if (!node.children?.length) continue;
                walk(node.children);

                const selectables = this.descendants(node).filter(
                    descendant => descendant.selectable !== false && !this.isSameNode(descendant, node),
                );
                const allSelected =
                    selectables.length > 0 &&
                    selectables.every(descendant => next.some(item => this.isSameNode(item, this.identityOf(descendant))));

                const id = this.identityOf(node);
                const isIn = next.some(item => this.isSameNode(item, id));

                if (node.selectable === false) continue;

                if (allSelected && !isIn) {
                    next.push(id);
                } else if (!allSelected && isIn) {
                    next = next.filter(item => !this.isSameNode(item, id));
                }
            }
        };

        walk(this.filteredNodes());
        return next;
    }

    private descendants(node: CzTreeNode): CzTreeNode[] {
        const result: CzTreeNode[] = [];
        const walk = (nodes: CzTreeNode[]) => {
            for (const item of nodes) {
                result.push(item);
                if (item.children?.length) walk(item.children);
            }
        };
        walk([node]);
        return result;
    }

    private isSameNode(a: CzTreeNode | null, b: CzTreeNode | null): boolean {
        if (!a || !b) return false;
        const dataKey = this.dataKey();
        if (dataKey) {
            const av = (a as Record<string, any>)[dataKey];
            const bv = (b as Record<string, any>)[dataKey];
            if (av != null && bv != null) return av === bv;
        }
        const ia = this.identityOf(a);
        const ib = this.identityOf(b);
        if (ia.key != null && ib.key != null) return ia.key === ib.key;
        return ia === ib;
    }

    /** Resolves cloned nodes (filter) back to their original value node */
    private identityOf(node: CzTreeNode): CzTreeNode {
        return this.cloneSources.get(node) ?? node;
    }

    trackNode(index: number, row: TreeRow): unknown {
        const trackBy = this.trackBy();
        if (trackBy) return trackBy(row.index, row.node);

        const dataKey = this.dataKey();
        if (dataKey && (row.node as Record<string, any>)[dataKey] != null) {
            return (row.node as Record<string, any>)[dataKey];
        }
        return row.node.key ?? index;
    }

    /* ── Keyboard ── */

    tabIndexFor(row: TreeRow): number {
        const focused = this.focusedIndex();
        if (focused === row.index) return 0;
        if (focused < 0 && row.index === 0) return 0;
        return -1;
    }

    onTreeKeydown(event: KeyboardEvent, row: TreeRow): void {
        if ((event.target as HTMLElement).tagName === 'INPUT') return;

        switch (event.key) {
            case 'ArrowDown':
                this.focusRow(Math.min(row.index + 1, this.visibleRows().length - 1));
                break;
            case 'ArrowUp':
                this.focusRow(Math.max(row.index - 1, 0));
                break;
            case 'ArrowRight':
                if (row.expandable && !this.isExpanded(row.node)) {
                    this.toggle(row.node);
                } else if (row.expandable) {
                    this.focusRow(row.index + 1);
                }
                break;
            case 'ArrowLeft':
                if (row.expandable && this.isExpanded(row.node)) {
                    this.toggle(row.node);
                } else if (row.parentIndex >= 0) {
                    this.focusRow(row.parentIndex);
                }
                break;
            case 'Enter':
            case ' ':
                if (this.selectionMode() === 'checkbox') {
                    this.toggleCheckbox(row.node, !this.isChecked(row.node));
                } else {
                    this.selectNode(row.node);
                }
                break;
            default:
                return;
        }

        event.preventDefault();
        event.stopPropagation();
    }

    private focusRow(index: number): void {
        const rows = this.visibleRows();
        if (index < 0 || index >= rows.length) return;

        if (this.virtualScroll()) {
            const itemSize = this.virtualItemSize();
            const top = index * itemSize;
            const bottom = top + itemSize;
            const viewport = this.viewportHeight();

            if (top < this.scrollTop()) {
                this.scrollTop.set(top);
            } else if (bottom > this.scrollTop() + viewport) {
                this.scrollTop.set(bottom - viewport);
            }
        }

        this.focusedIndex.set(index);

        setTimeout(() => {
            const element = this.host.nativeElement.querySelector(`[data-row-index="${index}"]`) as HTMLElement | null;
            element?.focus();
        });
    }

    handleNodeDoubleClick(node: CzTreeNode): void {
        this.onNodeDoubleClick.emit(this.identityOf(node));
    }

    /* ── Context menu ── */

    handleNodeContextMenu(node: CzTreeNode, event: MouseEvent): void {
        const identity = this.identityOf(node);
        this.onNodeContextMenu.emit({ node: identity, event });

        if (!this.contextMenuItems().length) return;

        event.preventDefault();
        event.stopPropagation();
        this.contextMenuNode.set(identity);
        this.contextMenuPosition.set({ x: event.clientX, y: event.clientY });
        this.contextMenuVisible.set(true);
    }

    activateContextMenuItem(item: CzMenuItem, event: Event): void {
        if (item.disabled || item.separator) return;

        event.stopPropagation();
        const node = this.contextMenuNode();
        item.command?.(event);

        if (node) {
            this.onContextMenuSelect.emit({ item, node });
        }

        this.closeContextMenu();
    }

    closeContextMenu(): void {
        if (!this.contextMenuVisible()) return;
        this.contextMenuVisible.set(false);
        this.contextMenuNode.set(null);
    }
}
