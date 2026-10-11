import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzDialogComponent } from '../dialog';
import { CzButtonComponent } from '../../atoms/button';
import { CzConfirmationService } from '../confirmation';

@Component({
    selector: 'cz-confirm-dialog',
    imports: [CommonModule, CzDialogComponent, CzButtonComponent],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-confirm-dialog-host',
    },
})
export class CzConfirmDialogComponent {
    private readonly service = inject(CzConfirmationService);

    readonly config = this.service.active;

    readonly visible = computed(() => !!this.config() && this.service.mode() === 'dialog');

    accept(): void {
        this.service.accept();
    }

    reject(): void {
        this.service.reject();
    }

    onHide(): void {
        if (this.config()) {
            this.service.reject();
        }
    }
}
