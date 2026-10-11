import {
    ChangeDetectionStrategy,
    Component,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzSeverity } from '../../types';

export type CzProgressSpinnerFill = 'none' | 'solid';

@Component({
    selector: 'cz-progress-spinner',
    imports: [CommonModule],
    templateUrl: './progress-spinner.component.html',
    styleUrl: './progress-spinner.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-progress-spinner',
        '[attr.data-severity]': 'severity()',
    },
})
export class CzProgressSpinnerComponent {
    /** Diameter in pixels */
    size = input<number>(50);

    /** Circle stroke width */
    strokeWidth = input<number>(4);

    /** Fill style of the inner circle */
    fill = input<CzProgressSpinnerFill>('none');

    /** Spinning duration, e.g. '2s' */
    animationDuration = input<string>('2s');

    /** Severity color */
    severity = input<CzSeverity>('primary');

    /** Accessible label */
    ariaLabel = input<string>('Loading');
}
