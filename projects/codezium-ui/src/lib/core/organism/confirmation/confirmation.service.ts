import { Injectable, signal } from '@angular/core';
import { CzSeverity } from '../../types';

export interface CzConfirmationConfig {
    /** Title of the confirmation */
    header?: string;

    /** Message to display */
    message: string;

    /** Accept button label */
    acceptLabel?: string;

    /** Reject button label */
    rejectLabel?: string;

    /** Severity of the accept button */
    severity?: CzSeverity;

    /** Callback executed when accepted */
    accept?: () => void;

    /** Callback executed when rejected */
    reject?: () => void;
}

export interface CzConfirmPopupPosition {
    x: number;
    y: number;
}

/**
 * CzConfirmationService
 *
 * Drives both `<cz-confirm-dialog />` (modal) and `<cz-confirm-popup />` (anchored).
 */
@Injectable({ providedIn: 'root' })
export class CzConfirmationService {
    /** Active confirmation config */
    readonly active = signal<CzConfirmationConfig | null>(null);

    /** Which renderer should display the confirmation */
    readonly mode = signal<'dialog' | 'popup' | null>(null);

    /** Popup position (null means no coordinates were provided) */
    readonly popupPosition = signal<CzConfirmPopupPosition | null>(null);

    /** Opens a modal confirmation dialog */
    confirm(config: CzConfirmationConfig): void {
        this.popupPosition.set(null);
        this.mode.set('dialog');
        this.active.set(config);
    }

    /** Opens a confirmation popup anchored at the event coordinates */
    confirmPopup(config: CzConfirmationConfig, event?: MouseEvent): void {
        this.popupPosition.set(event ? { x: event.clientX, y: event.clientY } : null);
        this.mode.set('popup');
        this.active.set(config);
    }

    /** Accepts the active confirmation */
    accept(): void {
        const config = this.active();
        this.clear();
        config?.accept?.();
    }

    /** Rejects the active confirmation */
    reject(): void {
        const config = this.active();
        this.clear();
        config?.reject?.();
    }

    /** Clears the active confirmation without running callbacks */
    clear(): void {
        this.active.set(null);
        this.mode.set(null);
        this.popupPosition.set(null);
    }
}
