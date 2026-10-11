import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzProgressSpinnerComponent } from '../../atoms/progress-spinner';

@Component({
    selector: 'cz-block-ui',
    imports: [CommonModule, CzProgressSpinnerComponent],
    templateUrl: './block-ui.component.html',
    styleUrl: './block-ui.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-block-ui',
        '[class.cz-block-ui--blocked]': 'blocked()',
    },
})
export class CzBlockUiComponent {
    /** Blocked state (two-way bindable) */
    blocked = model<boolean>(false);

    /** Optional message below the spinner */
    message = input<string>('');

    /** Shows the spinner */
    showSpinner = input<boolean>(true);
}
