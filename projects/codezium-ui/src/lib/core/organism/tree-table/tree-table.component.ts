import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LucideChevronDown,
    LucideChevronRight,
    LucideDynamicIcon,
} from '@lucide/angular';

export interface CzTreeTableColumn {
    field: string;
    header: string;
    width?: string;
}

export interface CzTreeTableNode {
    data: Record<string, any>;
    children?: CzTreeTableNode[];
}

interface TreeTableRow {
    node: CzTreeTableNode;
    depth: number;
    expandable: boolean;
}

@Component({
    selector: 'cz-tree-table',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './tree-table.component.html',
    styleUrl: './tree-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-tree-table',
    },
})
export class CzTreeTableComponent {
    /** Column definitions */
    columns = input<CzTreeTableColumn[]>([]);

    /** Hierarchical row data */
    value = input<CzTreeTableNode[]>([]);

    /** Message when there are no rows */
    emptyMessage = input<string>('No records found');

    /** Expanded nodes */
    expanded = signal<Set<CzTreeTableNode>>(new Set());

    readonly ChevronDownIcon = LucideChevronDown;
    readonly ChevronRightIcon = LucideChevronRight;

    visibleRows = computed(() => {
        const rows: TreeTableRow[] = [];
        const walk = (nodes: CzTreeTableNode[], depth: number) => {
            for (const node of nodes) {
                const expandable = !!node.children?.length;
                rows.push({ node, depth, expandable });
                if (expandable && this.expanded().has(node)) {
                    walk(node.children!, depth + 1);
                }
            }
        };
        walk(this.value(), 0);
        return rows;
    });

    isExpanded(node: CzTreeTableNode): boolean {
        return this.expanded().has(node);
    }

    toggle(node: CzTreeTableNode, event: Event): void {
        event.stopPropagation();
        const next = new Set(this.expanded());
        if (next.has(node)) {
            next.delete(node);
        } else {
            next.add(node);
        }
        this.expanded.set(next);
    }
}
