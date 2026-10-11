import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cz-toolbar',
    imports: [CommonModule],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-toolbar',
    },
})
export class CzToolbarComponent {}
