import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzSeverity } from '../../types';

export type CzProgressBarMode = 'determinate' | 'indeterminate';
export type CzProgressBarSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'cz-progress-bar',
    imports: [CommonModule],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-progress-bar',
        '[attr.data-severity]': 'severity()',
        '[attr.data-size]': 'size()',
    },
})
export class CzProgressBarComponent {
    /** Current value (0 - 100) */
    value = input<number>(0);

    /** Determinate or indeterminate mode */
    mode = input<CzProgressBarMode>('determinate');

    /** Show the percentage label */
    showValue = input<boolean>(false);

    /** Severity color */
    severity = input<CzSeverity>('primary');

    /** Bar thickness */
    size = input<CzProgressBarSize>('md');

    clampedValue = computed(() => {
        const v = Number(this.value());
        if (Number.isNaN(v)) return 0;
        return Math.min(100, Math.max(0, v));
    });
}
