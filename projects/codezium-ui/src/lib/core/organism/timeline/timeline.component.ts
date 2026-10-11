import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';
import { CzSeverity } from '../../types';

export interface CzTimelineEvent {
    title: string;
    date?: string;
    content?: string;
    icon?: LucideIconInput;
    severity?: CzSeverity;
}

export type CzTimelineAlign = 'left' | 'right' | 'alternate';

@Component({
    selector: 'cz-timeline',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-timeline',
        '[attr.data-align]': 'align()',
    },
})
export class CzTimelineComponent {
    /** Timeline events */
    value = input<CzTimelineEvent[]>([]);

    /** Alignment of the content relative to the line */
    align = input<CzTimelineAlign>('left');

    /** Emitted when an event is clicked */
    onEventSelect = output<CzTimelineEvent>();
}
