import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';
import { CzSeverity } from '../../types';

/** Structured event rendered by default when no `contentTemplate` is provided */
export interface CzTimelineEvent {
    title: string;
    date?: string;
    content?: string;
    icon?: LucideIconInput;
    severity?: CzSeverity;
}

export type CzTimelineAlign = 'left' | 'right' | 'alternate' | 'top' | 'bottom';
export type CzTimelineLayout = 'vertical' | 'horizontal';

@Component({
    selector: 'cz-timeline',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-timeline',
        '[attr.data-layout]': 'layout()',
        '[attr.data-align]': 'align()',
    },
})
export class CzTimelineComponent {
    /** An array of events to display (arbitrary objects) */
    value = input<any[]>([]);

    /** Orientation of the timeline */
    layout = input<CzTimelineLayout>('vertical');

    /**
     * Position of the line relative to the content.
     * Vertical: `left` | `right` | `alternate`; horizontal: `top` | `bottom` | `alternate`.
     */
    align = input<CzTimelineAlign>('left');

    /** Content template: `$implicit` event, `index`, `last` */
    contentTemplate = input<TemplateRef<unknown> | null>(null);

    /** Opposite content template (other side of the line): `$implicit` event, `index`, `last` */
    oppositeTemplate = input<TemplateRef<unknown> | null>(null);

    /** Marker template: `$implicit` event, `index`, `last` */
    markerTemplate = input<TemplateRef<unknown> | null>(null);

    /** Emitted when the content of an event is clicked */
    onEventSelect = output<any>();

    /** True when the event is a structured `CzTimelineEvent` (default rendering) */
    isStructured(event: any): event is CzTimelineEvent {
        return event != null && typeof event === 'object' && 'title' in event;
    }

    /** Marker severity for structured events */
    markerSeverity(event: any): CzSeverity | null {
        return this.isStructured(event) ? event.severity ?? 'primary' : null;
    }
}
