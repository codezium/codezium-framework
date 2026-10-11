import { Injectable, signal, Type } from '@angular/core';

export interface CzDynamicDialogConfig<T = unknown> {
    /** Dialog title */
    header?: string;

    /** Dialog width */
    width?: string;

    /** Data injected into the dynamic component `data` input */
    data?: T;

    /** Shows the close button */
    closable?: boolean;
}

export interface CzDynamicDialogRef {
    /** Dialog id */
    readonly id: number;

    /** Closes the dialog, optionally returning a result */
    close(result?: unknown): void;
}

/**
 * CzDynamicDialogService
 *
 * Opens dialogs rendering any component as content through `<cz-dynamic-dialog />`.
 */
@Injectable({ providedIn: 'root' })
export class CzDynamicDialogService {
    private counter = 0;

    /** Active dialog state */
    readonly active = signal<{
        id: number;
        component: Type<unknown>;
        config: CzDynamicDialogConfig;
    } | null>(null);

    private resultCallbacks = new Map<number, (result: unknown) => void>();

    open(component: Type<unknown>, config: CzDynamicDialogConfig = {}): CzDynamicDialogRef {
        const id = ++this.counter;
        this.active.set({ id, component, config });

        return {
            id,
            close: (result?: unknown) => this.close(id, result),
        };
    }

    close(id: number, result?: unknown): void {
        if (this.active()?.id !== id) return;
        this.active.set(null);

        const callback = this.resultCallbacks.get(id);
        this.resultCallbacks.delete(id);
        callback?.(result);
    }

    /** Registers a callback executed when the dialog closes */
    onClose(id: number, callback: (result: unknown) => void): void {
        this.resultCallbacks.set(id, callback);
    }
}
