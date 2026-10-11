import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    input,
    model,
    output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzFocusTrapDirective } from '../../molecules/focus-trap';

export type CzDialogPosition =
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'topleft'
    | 'topright'
    | 'bottomleft'
    | 'bottomright';

@Component({
    selector: 'cz-dialog',
    imports: [CommonModule, CzFocusTrapDirective],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-dialog-host',
        '(document:keydown.escape)': 'onEscape()',
    },
})
export class CzDialogComponent {
    /** Visibility (two-way bindable) */
    visible = model<boolean>(false);

    /** Dialog title */
    header = input<string>('');

    /** Shows the backdrop mask */
    modal = input<boolean>(true);

    /** Shows the close button */
    closable = input<boolean>(true);

    /** Closes when the mask is clicked */
    dismissableMask = input<boolean>(false);

    /** Position of the dialog */
    position = input<CzDialogPosition>('center');

    /** Dialog width */
    width = input<string>('30rem');

    /** Emitted when the dialog is hidden */
    onHide = output<void>();

    @ViewChild('dialogEl') private dialogEl?: ElementRef<HTMLElement>;

    constructor() {
        effect(() => {
            if (this.visible()) {
                queueMicrotask(() => this.dialogEl?.nativeElement.focus());
            }
        });
    }

    close(): void {
        if (!this.closable()) return;
        this.visible.set(false);
        this.onHide.emit();
    }

    onMaskClick(): void {
        if (this.dismissableMask()) {
            this.close();
        }
    }

    onEscape(): void {
        if (this.visible()) {
            this.close();
        }
    }
}
