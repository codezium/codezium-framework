import {
    ChangeDetectionStrategy,
    Component,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { type LucideIconInput } from '@lucide/angular';
import { CzIconComponent } from '../../../icons';
import { CzSeverity } from '../../types';

export type CzTagSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'cz-tag',
    imports: [CommonModule, CzIconComponent],
    templateUrl: './tag.component.html',
    styleUrl: './tag.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-tag',
        '[class.cz-tag--rounded]': 'rounded()',
        '[attr.data-severity]': 'severity()',
        '[attr.data-size]': 'size()',
    },
})
export class CzTagComponent {
    /** Text of the tag */
    value = input<string>('');

    /** Severity color */
    severity = input<CzSeverity>('primary');

    /** Optional Lucide icon */
    icon = input<LucideIconInput | null>(null);

    /** Tag size */
    size = input<CzTagSize>('md');

    /** Fully rounded (pill) shape */
    rounded = input<boolean>(false);

    iconSize = input<number>(14);
}
