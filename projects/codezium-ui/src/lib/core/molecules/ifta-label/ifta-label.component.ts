import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cz-ifta-label',
    imports: [CommonModule],
    template: `<ng-content />`,
    styleUrl: './ifta-label.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-ifta-label',
    },
})
export class CzIftaLabelComponent {}
