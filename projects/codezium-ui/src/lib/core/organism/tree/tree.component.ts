import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LucideChevronDown,
    LucideChevronRight,
    LucideDynamicIcon,
    type LucideIconInput,
} from '@lucide/angular';

export interface CzTreeNode {
    label: string;
    value?: any;
    icon?: LucideIconInput;
    children?: CzTreeNode[];
}

interface TreeRow {
    node: CzTreeNode;
    depth: number;
    expandable: boolean;
}

@Component({
    selector: 'cz-tree',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './tree.component.html',
    styleUrl: './tree.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-tree',
    },
})
export class CzTreeComponent {
    /** Hierarchical options */
    options = input<CzTreeNode[]>([]);

    /** Selection mode */
    selectionMode = input<'none' | 'single'>('single');

    /** Emitted when a node is selected */
    onNodeSelect = output<CzTreeNode>();

    /** Expanded nodes */
    expanded = signal<Set<CzTreeNode>>(new Set());

    /** Selected node */
    selectedNode = signal<CzTreeNode | null>(null);

    readonly ChevronDownIcon = LucideChevronDown;
    readonly ChevronRightIcon = LucideChevronRight;

    visibleRows = computed(() => {
        const rows: TreeRow[] = [];
        const walk = (nodes: CzTreeNode[], depth: number) => {
            for (const node of nodes) {
                const expandable = !!node.children?.length;
                rows.push({ node, depth, expandable });
                if (expandable && this.expanded().has(node)) {
                    walk(node.children!, depth + 1);
                }
            }
        };
        walk(this.options(), 0);
        return rows;
    });

    isExpanded(node: CzTreeNode): boolean {
        return this.expanded().has(node);
    }

    isSelected(node: CzTreeNode): boolean {
        return this.selectedNode() === node;
    }

    toggle(node: CzTreeNode, event: Event): void {
        event.stopPropagation();
        const next = new Set(this.expanded());
        if (next.has(node)) {
            next.delete(node);
        } else {
            next.add(node);
        }
        this.expanded.set(next);
    }

    selectNode(node: CzTreeNode): void {
        if (this.selectionMode() === 'none') return;
        this.selectedNode.set(node);
        this.onNodeSelect.emit(node);
    }
}
