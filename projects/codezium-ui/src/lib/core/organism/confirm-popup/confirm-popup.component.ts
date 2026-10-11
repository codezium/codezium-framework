import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzOverlayZIndex, czOverlayZIndex } from '../../types';
import { CzButtonComponent } from '../../atoms/button';
import { CzConfirmationService } from '../confirmation';

@Component({
    selector: 'cz-confirm-popup',
    imports: [CommonModule, CzButtonComponent],
    templateUrl: './confirm-popup.component.html',
    styleUrl: './confirm-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-confirm-popup-host',
        '(document:keydown.escape)': 'onEscape()',
    },
})
export class CzConfirmPopupComponent {
    private readonly service = inject(CzConfirmationService);

    readonly config = this.service.active;
    readonly position = this.service.popupPosition;

    readonly visible = computed(() => !!this.config() && this.service.mode() === 'popup');

    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex()));

    accept(): void {
        this.service.accept();
    }

    reject(): void {
        this.service.reject();
    }

    onEscape(): void {
        if (this.visible()) {
            this.service.reject();
        }
    }
}
