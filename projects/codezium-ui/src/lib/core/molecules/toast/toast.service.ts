import { Injectable, signal } from '@angular/core';
import { CzSeverity } from '../../types';

export interface CzToastMessage {
    id: number;
    severity: CzSeverity;
    summary?: string;
    detail?: string;
    /** Auto dismiss time in ms (0 = sticky) */
    life?: number;
}

export type CzToastInput = Omit<CzToastMessage, 'id'>;

/**
 * CzToastService
 *
 * Global service used to push toast messages rendered by `<cz-toast />`.
 */
@Injectable({ providedIn: 'root' })
export class CzToastService {
    private counter = 0;

    /** Active messages */
    readonly messages = signal<CzToastMessage[]>([]);

    add(message: CzToastInput): number {
        const id = ++this.counter;
        const toast: CzToastMessage = { life: 3000, ...message, id };
        this.messages.update((list) => [...list, toast]);

        if (toast.life && toast.life > 0) {
            setTimeout(() => this.remove(id), toast.life);
        }

        return id;
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
        this.messages.update((list) => list.filter((m) => m.id !== id));
    }

    clear(): void {
        this.messages.set([]);
    }
}
