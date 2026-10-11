import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    TemplateRef,
    computed,
    effect,
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
import { CzOverlayZIndex, czOverlayZIndex } from '../../types';
import { CzToastMessage, CzToastService } from './toast.service';

export type CzToastPosition =
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'center';

export type CzToastMode = 'stacked' | 'expanded';

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
    /** Key of the messages targeted to this toast */
    key = input<string | null>(null);

    /** Screen position of the stack */
    position = input<CzToastPosition>('top-right');

    /** Default auto dismiss time for this toast's messages in ms (message `life` wins) */
    life = input<number | null>(null);

    /** Layout mode: `stacked` collapses toasts into a stack that expands on hover */
    mode = input<CzToastMode>('stacked');

    /** Gap between stacked toast items in pixels */
    stackGap = input<number | null>(null);

    /** Maximum number of visible toasts in the stack */
    stackVisibleLimit = input<number | null>(null);

    /** Does not display a new message while an equal one is already open */
    preventOpenDuplicates = input<boolean>(false);

    /** Displays a message with the same content only once */
    preventDuplicates = input<boolean>(false);

    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    /** Custom message template: `$implicit` message, `closeFn` */
    messageTemplate = input<TemplateRef<unknown> | null>(null);

    /** Emitted when a message is closed */
    onClose = output<CzToastMessage>();

    readonly stackZIndex = computed(() => czOverlayZIndex(this.zIndex()));

    private readonly service = inject(CzToastService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
    private readonly paused = signal(false);
    private readonly seenSignatures = new Set<string>();

    /** Messages rendered by this toast (filtered by key and duplicate options) */
    readonly messages = computed<CzToastMessage[]>(() => {
        let list = this.service.messages().filter((message) => (message.key ?? null) === this.key());

        if (this.preventOpenDuplicates()) {
            const seen = new Set<string>();
            list = list.filter((message) => {
                const signature = this.signature(message);
                if (seen.has(signature)) return false;
                seen.add(signature);
                return true;
            });
        }

        if (this.preventDuplicates()) {
            list = list.filter((message) => {
                const signature = this.signature(message);
                if (this.seenSignatures.has(signature)) return false;
                this.seenSignatures.add(signature);
                return true;
            });
        }

        return list;
    });

    constructor() {
        effect(() => {
            const messages = this.messages();

            for (const [id, timer] of this.timers) {
                if (!messages.some((message) => message.id === id)) {
                    clearTimeout(timer);
                    this.timers.delete(id);
                }
            }

            if (this.paused()) return;

            for (const message of messages) {
                if (this.timers.has(message.id)) continue;

                const life = this.lifeFor(message);
                if (life > 0) {
                    this.timers.set(message.id, setTimeout(() => this.close(message.id), life));
                }
            }
        });

        this.destroyRef.onDestroy(() => {
            for (const timer of this.timers.values()) clearTimeout(timer);
            this.timers.clear();
        });
    }

    iconFor(message: CzToastMessage): LucideIconInput {
        switch (message.severity) {
            case 'success': return LucideCircleCheck;
            case 'warning': return LucideCircleAlert;
            case 'danger': return LucideCircleX;
            case 'secondary': return LucideInfo;
            case 'dark': return LucideInfo;
            default: return LucideInfo;
        }
    }

    /** Distance of a rendered message from the newest one (for the stacked mode) */
    stackedOffset(index: number): number {
        return this.messages().length - 1 - index;
    }

    isStackHidden(index: number): boolean {
        const limit = this.stackVisibleLimit();
        return this.mode() === 'stacked' && !!limit && this.stackedOffset(index) >= limit;
    }

    closeFn(id: number): (event?: Event) => void {
        return () => this.close(id);
    }

    close(id: number): void {
        const message = this.service.messages().find((item) => item.id === id);

        const timer = this.timers.get(id);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(id);
        }

        this.service.remove(id);

        if (message) {
            this.onClose.emit(message);
        }
    }

    /** Pauses the auto-dismiss timers (e.g. while hovering the stack) */
    pauseTimers(): void {
        this.paused.set(true);

        for (const timer of this.timers.values()) clearTimeout(timer);
        this.timers.clear();
    }

    /** Resumes the auto-dismiss timers */
    resumeTimers(): void {
        this.paused.set(false);
    }

    private lifeFor(message: CzToastMessage): number {
        if (message.sticky) return 0;
        if (message.life != null) return message.life;
        return this.life() ?? 3000;
    }

    private signature(message: CzToastMessage): string {
        return `${message.severity}|${message.summary ?? ''}|${message.detail ?? ''}`;
    }
}
