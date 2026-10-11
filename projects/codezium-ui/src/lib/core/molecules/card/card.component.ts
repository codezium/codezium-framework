import {
    ChangeDetectionStrategy,
    Component,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cz-card',
    imports: [CommonModule],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-card',
    },
})
export class CzCardComponent {
    /** Card title */
    header = input<string>('');

    /** Card subtitle */
    subheader = input<string>('');
}
