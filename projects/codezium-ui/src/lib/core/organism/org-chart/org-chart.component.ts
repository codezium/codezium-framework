import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    computed,
    input,
    model,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideChevronDown, LucideChevronUp, LucideDynamicIcon } from '@lucide/angular';

export interface CzOrgChartNode {
    /** Optional stable key used by collapsedKeys */
    key?: string;
    label: string;
    value?: any;
    children?: CzOrgChartNode[];
}

@Component({
    selector: 'cz-org-chart',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './org-chart.component.html',
    styleUrl: './org-chart.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-org-chart',
    },
})
export class CzOrgChartComponent {
    /** Root node of the organization */
    value = input<CzOrgChartNode | null>(null);

    /** Makes nodes with children collapsible */
    collapsible = input<boolean>(false);

    /** Map of collapsed node keys (true = collapsed). Two-way bindable */
    collapsedKeys = model<Record<string, boolean>>({});

    /** Custom node content template (receives the node as $implicit) */
    nodeTemplate = input<TemplateRef<unknown> | null>(null);

    /** Gap between sibling nodes in px (null = theme default) */
    gap = input<number | null>(null);

    /** Emitted when a node is clicked */
    onNodeSelect = output<CzOrgChartNode>();

    /** Emitted when a node is expanded */
    onNodeExpand = output<CzOrgChartNode>();

    /** Emitted when a node is collapsed */
    onNodeCollapse = output<CzOrgChartNode>();

    readonly DownIcon = LucideChevronDown;
    readonly UpIcon = LucideChevronUp;

    readonly gapStyle = computed(() => (this.gap() !== null ? `${this.gap()}px` : null));

    /** Stable key of a node (falls back to the label) */
    nodeKey(node: CzOrgChartNode): string {
        return node.key ?? node.label;
    }

    isCollapsed(node: CzOrgChartNode): boolean {
        return this.collapsible() && this.collapsedKeys()[this.nodeKey(node)] === true;
    }

    toggleNode(node: CzOrgChartNode, event: Event): void {
        if (!this.collapsible()) return;

        event.stopPropagation();
        const key = this.nodeKey(node);
        const nextCollapsed = !this.isCollapsed(node);

        this.collapsedKeys.update(keys => ({ ...keys, [key]: nextCollapsed }));

        if (nextCollapsed) {
            this.onNodeCollapse.emit(node);
        } else {
            this.onNodeExpand.emit(node);
        }
    }
}
