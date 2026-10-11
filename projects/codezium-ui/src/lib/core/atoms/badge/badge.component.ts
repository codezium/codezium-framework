import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzSeverity } from '../../types';

export type CzBadgeSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'cz-badge',
    imports: [CommonModule],
    templateUrl: './badge.component.html',
    styleUrl: './badge.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-badge',
        '[class.cz-badge--dot]': 'dot()',
        '[attr.data-severity]': 'severity()',
        '[attr.data-size]': 'size()',
        '[attr.aria-label]': 'ariaLabel() || null',
    },
})
export class CzBadgeComponent {
    /** Value displayed inside the badge */
    value = input<string | number | null>(null);

    /** Severity color */
    severity = input<CzSeverity>('primary');

    /** Badge size */
    size = input<CzBadgeSize>('md');

    /** Renders a small dot instead of the value */
    dot = input<boolean>(false);

    /** Accessible label */
    ariaLabel = input<string>('');

    hasValue = computed(() => {
        const v = this.value();
        return v !== null && v !== undefined && v !== '';
    });
}
