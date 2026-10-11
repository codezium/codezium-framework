import {
    ChangeDetectionStrategy,
    Component,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type CzFloatLabelVariant = 'over' | 'in' | 'on';

@Component({
    selector: 'cz-float-label',
    imports: [CommonModule],
    template: `<ng-content />`,
    styleUrl: './float-label.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-float-label',
        '[attr.data-variant]': 'variant()',
    },
})
export class CzFloatLabelComponent {
    /**
     * Float style:
     * - `over`: label floats above the input border
     * - `in` / `on`: label floats onto the top border with background
     */
    variant = input<CzFloatLabelVariant>('over');
}
