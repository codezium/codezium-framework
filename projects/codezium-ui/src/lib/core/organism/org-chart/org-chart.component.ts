import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CzOrgChartNode {
    label: string;
    value?: any;
    children?: CzOrgChartNode[];
}

@Component({
    selector: 'cz-org-chart',
    imports: [CommonModule],
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

    /** Emitted when a node is clicked */
    onNodeSelect = output<CzOrgChartNode>();
}
