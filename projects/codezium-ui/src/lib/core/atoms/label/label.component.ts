import {
    ChangeDetectionStrategy,
    Component,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cz-label',
    imports: [CommonModule],
    templateUrl: './label.component.html',
    styleUrl: './label.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-label-host',
    },
})
export class CzLabelComponent {
    /** Id of the form control this label is linked to */
    htmlFor = input<string>('');

    /** Shows a required marker */
    required = input<boolean>(false);
}
