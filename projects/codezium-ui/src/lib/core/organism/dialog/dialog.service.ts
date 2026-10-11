import { Injectable, WritableSignal, signal } from '@angular/core';

/**
 * CzDialogService
 *
 * Opens and closes `<cz-dialog>` instances from anywhere in the app by id.
 * Give a dialog a `dialogId` and control it imperatively:
 *
 *   <cz-dialog dialogId="profile" header="Edit profile">…</cz-dialog>
 *   dialogService.open('profile');
 */
@Injectable({ providedIn: 'root' })
export class CzDialogService {
    private readonly flags = new Map<string, WritableSignal<boolean>>();

    /** Returns (and creates on first use) the visibility flag for a dialog id */
    register(id: string): WritableSignal<boolean> {
        let flag = this.flags.get(id);
        if (!flag) {
            flag = signal(false);
            this.flags.set(id, flag);
        }
        return flag;
    }

    /** Opens the dialog with the given id */
    open(id: string): void {
        this.register(id).set(true);
    }

    /** Closes the dialog with the given id */
    close(id: string): void {
        this.flags.get(id)?.set(false);
    }

    /** Toggles the dialog with the given id */
    toggle(id: string): void {
        const flag = this.register(id);
        flag.set(!flag());
    }

    /** Non-reactive check of the dialog state */
    isOpen(id: string): boolean {
        return this.flags.get(id)?.() ?? false;
    }

    /** Closes every registered dialog */
    closeAll(): void {
        this.flags.forEach(flag => flag.set(false));
    }
}
