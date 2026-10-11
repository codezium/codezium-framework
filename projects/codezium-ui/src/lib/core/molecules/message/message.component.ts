import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
    signal,
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
import { CzSeverity } from '../../types';
import { CzMessageService } from './message.service';

@Component({
    selector: 'cz-message',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './message.component.html',
    styleUrl: './message.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-message',
        '[class.cz-message--closed]': 'closed() && !fromService()',
        '[class.cz-message--service]': 'fromService()',
        '[attr.data-severity]': 'severity()',
    },
})
export class CzMessageComponent {
    /** Severity color */
    severity = input<CzSeverity>('info');

    /** Message text */
    text = input<string>('');

    /** Custom icon (defaults to the severity icon) */
    icon = input<LucideIconInput | null>(null);

    /** Shows the close button */
    closable = input<boolean>(false);

    /** Renders the messages pushed through CzMessageService instead */
    fromService = input<boolean>(false);

    /** Emitted when the message is closed */
    onClose = output<void>();

    /** Internal closed state */
    closed = signal<boolean>(false);

    private readonly service = inject(CzMessageService);

    /** Service-driven messages (only used when fromService is enabled) */
    readonly messages = this.service.messages;

    readonly defaultIcon = computed<LucideIconInput>(() => {
        switch (this.severity()) {
            case 'success': return LucideCircleCheck;
            case 'warning': return LucideCircleAlert;
            case 'danger': return LucideCircleX;
            default: return LucideInfo;
        }
    });

    actualIcon = computed(() => this.icon() ?? this.defaultIcon());

    iconFor(severity: CzSeverity): LucideIconInput {
        switch (severity) {
            case 'success': return LucideCircleCheck;
            case 'warning': return LucideCircleAlert;
            case 'danger': return LucideCircleX;
            default: return LucideInfo;
        }
    }

    close(): void {
        this.closed.set(true);
        this.onClose.emit();
    }

    removeFromService(id: number): void {
        this.service.remove(id);
    }
}
