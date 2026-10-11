import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    computed,
    input,
    model,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    LucideArrowDown,
    LucideArrowUp,
    LucideArrowUpDown,
    LucideChevronDown,
    LucideChevronRight,
    LucideDynamicIcon,
} from '@lucide/angular';
import { CzMenuItem, CzOverlayZIndex, czOverlayZIndex } from '../../types';
import { CzCheckboxComponent } from '../../atoms/checkbox';
import { CzPaginatorComponent } from '../../molecules/paginator';
import { CzProgressSpinnerComponent } from '../../atoms/progress-spinner';

export interface CzTreeTableColumn {
    field: string;
    header: string;
    sortable?: boolean;
    width?: string;
    /** Custom cell template: `$implicit` row data, `value`, `index`, `node` */
    template?: TemplateRef<unknown>;
}

export interface CzTreeTableNode {
    /** Row data */
    data: Record<string, any>;
    /** Child nodes */
    children?: CzTreeTableNode[];
    /** Stable key (used by expandedKeys when `dataKey` is not provided) */
    key?: string;
    /** Initially expanded */
    expanded?: boolean;
}

export type CzTreeTableSelectionMode = 'none' | 'single' | 'multiple';
export type CzTreeTableSize = 'sm' | 'md' | 'lg';

export interface CzTreeTableSortEvent {
    field: string;
    order: 'asc' | 'desc';
}

export interface CzTreeTableRow {
    node: CzTreeTableNode;
    depth: number;
    expandable: boolean;
}

@Component({
    selector: 'cz-tree-table',
    imports: [
        CommonModule,
        FormsModule,
        LucideDynamicIcon,
        CzCheckboxComponent,
        CzPaginatorComponent,
        CzProgressSpinnerComponent,
    ],
    templateUrl: './tree-table.component.html',
    styleUrl: './tree-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-tree-table',
        '[class.cz-tree-table--striped]': 'striped()',
        '[class.cz-tree-table--gridlines]': 'gridlines()',
        '[attr.data-size]': 'size()',
        '(document:click)': 'closeContextMenu()',
        '(document:keydown.escape)': 'closeContextMenu()',
    },
})
export class CzTreeTableComponent {
    /** Column definitions */
    columns = input<CzTreeTableColumn[]>([]);

    /** Hierarchical row data */
    value = input<CzTreeTableNode[]>([]);

    /** Property of `node.data` that uniquely identifies a node (used by expandedKeys and selection) */
    dataKey = input<string | null>(null);

    /** Expanded node keys (two-way bindable) */
    expandedKeys = model<Record<string, boolean>>({});

    /** Enables sorting on all columns with `sortable` not explicitly false */
    sortable = input<boolean>(false);

    /** Alternating row background */
    striped = input<boolean>(false);

    /** Shows cell borders */
    gridlines = input<boolean>(false);

    /** Row size */
    size = input<CzTreeTableSize>('md');

    /** Message when there are no rows */
    emptyMessage = input<string>('No records found');

    /** Selection mode */
    selectionMode = input<CzTreeTableSelectionMode>('none');

    /** Selected nodes (multiple mode, two-way bindable) */
    selection = model<CzTreeTableNode[]>([]);

    /** Rows per page (0 disables pagination) */
    rows = input<number>(0);

    /** Options for the rows per page select */
    rowsPerPageOptions = input<number[]>([]);

    /** Height of the tree table viewport (sticky header + scroll). Null = no scroll */
    scrollHeight = input<string | null>(null);

    /** Shows a loading overlay */
    loading = input<boolean>(false);

    /** Global filter value (contains, case insensitive). Ancestors of matches are kept and auto-expanded */
    globalFilter = input<string>('');

    /** Fields used by the global filter (defaults to every column field) */
    filterFields = input<string[] | null>(null);

    /** Whole row template: `$implicit` node, `depth`, `index` (replaces the default cells) */
    rowTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom header (write your own `<tr>`, supports colspan/rowspan) */
    headerTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom empty state */
    emptyTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom footer (`<tfoot>` content) */
    footerTemplate = input<TemplateRef<unknown> | null>(null);

    /** Items for the built-in row context menu (right click) */
    contextMenuItems = input<CzMenuItem[]>([]);

    /** Overlay z-index of the built-in context menu */
    zIndex = input<CzOverlayZIndex>(null);

    /** Emitted on sort */
    onSort = output<CzTreeTableSortEvent>();

    /** Emitted when a node is selected (single mode) */
    onRowSelect = output<CzTreeTableNode>();

    /** Emitted when the multiple selection changes */
    onSelectionChange = output<CzTreeTableNode[]>();

    /** Emitted when a node is expanded */
    onNodeExpand = output<CzTreeTableNode>();

    /** Emitted when a node is collapsed */
    onNodeCollapse = output<CzTreeTableNode>();

    /** Emitted when a node is right-clicked */
    onRowContextMenu = output<{ node: CzTreeTableNode; event: MouseEvent }>();

    /** Emitted when a built-in context menu item is activated */
    onContextMenuSelect = output<{ item: CzMenuItem; node: CzTreeTableNode }>();

    /** Current sort state */
    sortField = signal<string | null>(null);
    sortOrder = signal<'asc' | 'desc' | null>(null);

    /** Selected node (single mode) */
    selectedNode = signal<CzTreeTableNode | null>(null);

    /** Expanded nodes (identity fallback when no key is available) */
    expandedNodes = signal<Set<CzTreeTableNode>>(new Set());

    /** Nodes toggled at least once (identity fallback) */
    private touchedNodes = signal<Set<CzTreeTableNode>>(new Set());

    /** Maps cloned nodes (filter/sort) back to their original value node */
    private readonly cloneSources = new Map<CzTreeTableNode, CzTreeTableNode>();

    /** Built-in context menu state */
    contextMenuVisible = signal<boolean>(false);
    contextMenuPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });
    contextMenuNode = signal<CzTreeTableNode | null>(null);

    readonly contextMenuZIndex = computed(() => czOverlayZIndex(this.zIndex()));

    /** Current page (0 based) */
    page = signal<number>(0);

    readonly SortIcon = LucideArrowUpDown;
    readonly AscIcon = LucideArrowUp;
    readonly DescIcon = LucideArrowDown;
    readonly ExpandIcon = LucideChevronRight;
    readonly CollapseIcon = LucideChevronDown;

    /** Tree filtered by the global filter (keeps ancestors of matches) */
    readonly filteredTree = computed<CzTreeTableNode[]>(() => {
        this.cloneSources.clear();

        const filter = this.globalFilter().trim().toLowerCase();
        if (!filter) return this.value();

        const fields = this.filterFields() ?? this.columns().map(column => column.field);
        const matches = (node: CzTreeTableNode) =>
            fields.some(field => String(node.data[field] ?? '').toLowerCase().includes(filter));

        const filterNodes = (nodes: CzTreeTableNode[]): CzTreeTableNode[] => {
            const result: CzTreeTableNode[] = [];
            for (const node of nodes) {
                if (matches(node)) {
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

        return filterNodes(this.value());
    });

    /** Filtered + sorted tree (siblings sorted per level) */
    readonly sortedTree = computed<CzTreeTableNode[]>(() => {
        const field = this.sortField();
        const order = this.sortOrder();
        const tree = this.filteredTree();

        if (!field || !order) return tree;

        const sortNodes = (nodes: CzTreeTableNode[]): CzTreeTableNode[] =>
            nodes
                .map(node => {
                    if (!node.children?.length) return node;
                    const clone = { ...node, children: sortNodes(node.children) };
                    this.cloneSources.set(clone, this.identityOf(node));
                    return clone;
                })
                .sort((a, b) => {
                    const av = a.data[field];
                    const bv = b.data[field];
                    const result = av === bv ? 0 : av > bv ? 1 : -1;
                    return order === 'asc' ? result : -result;
                });

        return sortNodes(tree);
    });

    /** Flattened visible rows (respecting expansion) */
    readonly visibleRows = computed<CzTreeTableRow[]>(() => {
        const rows: CzTreeTableRow[] = [];
        const walk = (nodes: CzTreeTableNode[], depth: number) => {
            for (const node of nodes) {
                const expandable = !!node.children?.length;
                rows.push({ node, depth, expandable });
                if (expandable && this.isExpanded(node)) {
                    walk(node.children!, depth + 1);
                }
            }
        };
        walk(this.sortedTree(), 0);
        return rows;
    });

    readonly pageCount = computed(() => {
        const rows = this.rows();
        if (rows <= 0) return 1;
        return Math.max(1, Math.ceil(this.visibleRows().length / rows));
    });

    /** Rows of the current page */
    readonly paginatedRows = computed(() => {
        const rows = this.rows();
        if (rows <= 0) return this.visibleRows();

        const start = this.page() * rows;
        return this.visibleRows().slice(start, start + rows);
    });

    /** Total rendered columns (data + selection) */
    readonly totalColumns = computed(() => this.columns().length + (this.selectionMode() === 'multiple' ? 1 : 0));

    readonly allSelected = computed(() => {
        const rows = this.visibleRows();
        return rows.length > 0 && rows.every(row => this.isSelected(row.node));
    });

    isColumnSortable(column: CzTreeTableColumn): boolean {
        return column.sortable ?? this.sortable();
    }

    toggleSort(column: CzTreeTableColumn): void {
        if (!this.isColumnSortable(column)) return;

        this.page.set(0);

        if (this.sortField() !== column.field) {
            this.sortField.set(column.field);
            this.sortOrder.set('asc');
        } else if (this.sortOrder() === 'asc') {
            this.sortOrder.set('desc');
        } else {
            this.sortField.set(null);
            this.sortOrder.set(null);
            return;
        }

        this.onSort.emit({ field: this.sortField()!, order: this.sortOrder()! });
    }

    isSorted(column: CzTreeTableColumn): boolean {
        return this.sortField() === column.field && !!this.sortOrder();
    }

    /* ── Expansion ── */

    isExpanded(node: CzTreeTableNode): boolean {
        if (this.globalFilter().trim() && node.children?.length) return true;

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

    toggle(node: CzTreeTableNode, event?: Event): void {
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

    /** Resolves cloned nodes (filter/sort) back to their original value node */
    private identityOf(node: CzTreeTableNode): CzTreeTableNode {
        return this.cloneSources.get(node) ?? node;
    }

    private expandedKey(node: CzTreeTableNode): string | null {
        const dataKey = this.dataKey();
        if (dataKey && node.data[dataKey] != null) return String(node.data[dataKey]);
        if (node.key != null) return node.key;
        return null;
    }

    /* ── Selection ── */

    selectNode(node: CzTreeTableNode): void {
        if (this.selectionMode() === 'none') return;

        if (this.selectionMode() === 'single') {
            const identity = this.identityOf(node);
            this.selectedNode.set(identity);
            this.onRowSelect.emit(identity);
            return;
        }

        this.toggleNodeSelection(node, !this.isSelected(node));
    }

    toggleNodeSelection(node: CzTreeTableNode, checked: boolean): void {
        const identity = this.identityOf(node);
        const current = this.selection();
        const next = checked
            ? [...current.filter(item => !this.isSameNode(item, identity)), identity]
            : current.filter(item => !this.isSameNode(item, identity));

        this.selection.set(next);
        this.onSelectionChange.emit(next);
    }

    toggleAll(checked: boolean): void {
        const next = checked ? this.visibleRows().map(row => this.identityOf(row.node)) : [];
        this.selection.set(next);
        this.onSelectionChange.emit(next);
    }

    isSelected(node: CzTreeTableNode): boolean {
        return this.selection().some(item => this.isSameNode(item, node));
    }

    isRowHighlighted(node: CzTreeTableNode): boolean {
        if (this.selectionMode() === 'single') {
            const selected = this.selectedNode();
            return !!selected && this.isSameNode(selected, node);
        }
        return this.isSelected(node);
    }

    private isSameNode(a: CzTreeTableNode | null, b: CzTreeTableNode | null): boolean {
        if (!a || !b) return false;
        const dataKey = this.dataKey();
        if (dataKey && a.data[dataKey] != null && b.data[dataKey] != null) {
            return a.data[dataKey] === b.data[dataKey];
        }
        const ia = this.identityOf(a);
        const ib = this.identityOf(b);
        if (ia.key != null && ib.key != null) return ia.key === ib.key;
        return ia === ib;
    }

    trackRow(index: number, row: CzTreeTableRow): unknown {
        const dataKey = this.dataKey();
        if (dataKey && row.node.data[dataKey] != null) return row.node.data[dataKey];
        return row.node.key ?? index;
    }

    /* ── Context menu ── */

    handleRowContextMenu(node: CzTreeTableNode, event: MouseEvent): void {
        const identity = this.identityOf(node);
        this.onRowContextMenu.emit({ node: identity, event });

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
