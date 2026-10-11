import {
    ChangeDetectionStrategy,
    Component,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type CzScrollAreaVariant = 'default' | 'hover' | 'always';

@Component({
    selector: 'cz-scroll-area',
    imports: [CommonModule],
    template: `
        <div class="cz-scroll-area-viewport" [attr.data-variant]="variant()" [style.max-height]="maxHeight()">
            <ng-content />
        </div>
    `,
    styleUrl: './scroll-area.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-scroll-area',
    },
})
export class CzScrollAreaComponent {
    /**
     * Scrollbar visibility:
     * - `default`: thin styled scrollbars
     * - `hover`: scrollbars appear on hover
     * - `always`: scrollbars always visible (fallback styling)
     */
    variant = input<CzScrollAreaVariant>('default');

    /** Optional max height for the viewport */
    maxHeight = input<string | null>(null);
}
