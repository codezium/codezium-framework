import { Injectable, computed, signal } from '@angular/core';

/**
 * CzBlockUIService
 *
 * Global blocking state rendered by `<cz-block-ui [fromService]="true">`.
 * Uses a counter so concurrent operations (e.g. parallel HTTP requests)
 * can block/unblock independently.
 */
@Injectable({ providedIn: 'root' })
export class CzBlockUIService {
    private readonly counter = signal(0);

    /** True while at least one operation is blocking the UI */
    readonly blocked = computed(() => this.counter() > 0);

    /** Increments the block counter */
    block(): void {
        this.counter.update(count => count + 1);
    }

    /** Decrements the block counter (never below zero) */
    unblock(): void {
        this.counter.update(count => Math.max(0, count - 1));
    }

    /** Releases every active block */
    reset(): void {
        this.counter.set(0);
    }
}
