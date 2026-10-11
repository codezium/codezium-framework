import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    model,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzProgressSpinnerComponent } from '../../atoms/progress-spinner';
import { CzBlockUIService } from './block-ui.service';

@Component({
    selector: 'cz-block-ui',
    imports: [CommonModule, CzProgressSpinnerComponent],
    templateUrl: './block-ui.component.html',
    styleUrl: './block-ui.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-block-ui',
        '[class.cz-block-ui--blocked]': 'isBlocked()',
    },
})
export class CzBlockUiComponent {
    /** Blocked state (two-way bindable) */
    blocked = model<boolean>(false);

    /** Also reacts to CzBlockUIService.block()/unblock() */
    fromService = input<boolean>(false);

    /** Optional message below the spinner */
    message = input<string>('');

    /** Shows the spinner */
    showSpinner = input<boolean>(true);

    private readonly service = inject(CzBlockUIService);

    /** Combined state: local model or service counter */
    readonly isBlocked = computed(() => this.blocked() || (this.fromService() && this.service.blocked()));
}
