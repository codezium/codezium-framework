import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type CzDividerLayout = 'horizontal' | 'vertical';
export type CzDividerType = 'solid' | 'dashed' | 'dotted';
export type CzDividerAlign = 'left' | 'center' | 'right';

@Component({
    selector: 'cz-divider',
    imports: [CommonModule],
    templateUrl: './divider.component.html',
    styleUrl: './divider.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-divider-host',
        '[class.cz-divider-host--vertical]': 'layout() === "vertical"',
        '[class.cz-divider-host--fluid]': 'layout() === "horizontal"',
    },
})
export class CzDividerComponent {
    /** Divider direction */
    layout = input<CzDividerLayout>('horizontal');

    /** Line style */
    type = input<CzDividerType>('solid');

    /** Alignment of the projected content (horizontal only) */
    align = input<CzDividerAlign>('center');

    ariaOrientation = computed(() => (this.layout() === 'vertical' ? 'vertical' : 'horizontal'));
}
