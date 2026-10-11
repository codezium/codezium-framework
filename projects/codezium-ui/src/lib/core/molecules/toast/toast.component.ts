import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LucideCircleAlert,
    LucideCircleCheck,
    LucideCircleX,
    LucideDynamicIcon,
    LucideInfo,
    type LucideIconInput,
} from '@lucide/angular';
import { CzToastMessage, CzToastService } from './toast.service';

export type CzToastPosition =
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center';

@Component({
    selector: 'cz-toast',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-toast',
        '[attr.data-position]': 'position()',
    },
})
export class CzToastComponent {
    /** Screen position of the stack */
    position = input<CzToastPosition>('top-right');

    private readonly service = inject(CzToastService);

    readonly messages = this.service.messages;

    iconFor(message: CzToastMessage): LucideIconInput {
        switch (message.severity) {
            case 'success': return LucideCircleCheck;
            case 'warning': return LucideCircleAlert;
            case 'danger': return LucideCircleX;
            default: return LucideInfo;
        }
    }

    close(id: number): void {
        this.service.remove(id);
    }
}
