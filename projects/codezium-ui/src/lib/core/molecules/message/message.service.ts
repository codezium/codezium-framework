import { Injectable, signal } from '@angular/core';
import { CzSeverity } from '../../types';

export interface CzMessage {
    id: number;
    severity: CzSeverity;
    summary?: string;
    detail?: string;
}

export interface CzMessageInput {
    severity?: CzSeverity;
    summary?: string;
    detail?: string;
    /** Auto-clear time in ms (0 = sticky). Defaults to 4000. */
    life?: number;
}

/**
 * CzMessageService
 *
 * Pushes inline messages rendered by `<cz-message [fromService]="true" />`.
 * Every message disappears automatically after its `life` (a few seconds by default).
 */
@Injectable({ providedIn: 'root' })
export class CzMessageService {
    private counter = 0;

    /** Active messages */
    readonly messages = signal<CzMessage[]>([]);

    /** Pushes a message and returns its id */
    add(message: CzMessageInput): number {
        const id = ++this.counter;
        const { life = 4000, ...rest } = message;

        this.messages.update(list => [...list, { id, severity: rest.severity ?? 'info', ...rest }]);

        if (life > 0) {
            setTimeout(() => this.remove(id), life);
        }

        return id;
    }

    success(summary: string, detail?: string, life = 4000): number {
        return this.add({ severity: 'success', summary, detail, life });
    }

    info(summary: string, detail?: string, life = 4000): number {
        return this.add({ severity: 'info', summary, detail, life });
    }

    warning(summary: string, detail?: string, life = 4000): number {
        return this.add({ severity: 'warning', summary, detail, life });
    }

    error(summary: string, detail?: string, life = 4000): number {
        return this.add({ severity: 'danger', summary, detail, life });
    }

    /** Removes a message by id */
    remove(id: number): void {
        this.messages.update(list => list.filter(message => message.id !== id));
    }

    /** Removes every active message */
    clear(): void {
        this.messages.set([]);
    }
}
