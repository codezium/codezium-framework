import { Injectable, signal } from '@angular/core';
import { type LucideIconInput } from '@lucide/angular';
import { CzSeverity } from '../../types';

export interface CzToastMessage {
    id: number;
    /** Severity of the message (default `info`) */
    severity?: CzSeverity;
    summary?: string;
    detail?: string;
    /** Auto dismiss time in ms (0 = sticky) */
    life?: number;
    /** Sticky toast: stays until dismissed manually */
    sticky?: boolean;
    /** Key of the target toast component */
    key?: string;
    /** Custom icon overriding the severity icon */
    icon?: LucideIconInput;
    /** Spins the message icon (e.g. while loading) */
    iconSpin?: boolean;
    /** Extra class applied to the toast item */
    styleClass?: string;
    /** Arbitrary data for custom message templates */
    data?: Record<string, any>;
}

export type CzToastInput = Omit<CzToastMessage, 'id'>;

/**
 * CzToastService
 *
 * Global service used to push toast messages rendered by `<cz-toast />`.
 * The service only holds state; auto-dismiss timers are managed by the
 * toast component (per its `life` input), following the PrimeNG model.
 */
@Injectable({ providedIn: 'root' })
export class CzToastService {
    private counter = 0;

    /** Active messages */
    readonly messages = signal<CzToastMessage[]>([]);

    add(message: CzToastInput): number {
        const id = ++this.counter;
        this.messages.update((list) => [...list, { severity: 'info' as CzSeverity, ...message, id }]);
        return id;
    }

    addAll(messages: CzToastInput[]): void {
        this.messages.update((list) => [
            ...list,
            ...messages.map((message) => ({ severity: 'info' as CzSeverity, ...message, id: ++this.counter })),
        ]);
    }

    success(detail: string, summary = 'Success'): number {
        return this.add({ severity: 'success', summary, detail });
    }

    info(detail: string, summary = 'Info'): number {
        return this.add({ severity: 'info', summary, detail });
    }

    warning(detail: string, summary = 'Warning'): number {
        return this.add({ severity: 'warning', summary, detail });
    }

    error(detail: string, summary = 'Error'): number {
        return this.add({ severity: 'danger', summary, detail });
    }

    remove(id: number): void {
        this.messages.update((list) => list.filter((message) => message.id !== id));
    }

    /** Clears all messages, or only the messages targeting a toast with the given key */
    clear(key?: string): void {
        if (key === undefined) {
            this.messages.set([]);
            return;
        }
        this.messages.update((list) => list.filter((message) => message.key !== key));
    }
}
