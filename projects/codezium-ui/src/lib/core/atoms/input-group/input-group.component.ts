import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cz-input-group',
    imports: [CommonModule],
    template: `<ng-content />`,
    styleUrl: './input-group.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-input-group',
    },
})
export class CzInputGroupComponent {}
