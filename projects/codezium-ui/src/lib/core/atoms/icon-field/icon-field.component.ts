import { 
    ChangeDetectionStrategy, 
    Component, 
    input, 
    ViewEncapsulation 
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type CzIconFieldPosition = 'left' | 'right';
export type CzIconFieldSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'cz-icon-field',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    styleUrl: './icon-field.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-icon-field',
        '[class.cz-icon-field--left]': 'iconPosition() === "left"',
        '[class.cz-icon-field--right]': 'iconPosition() === "right"',
        '[class.cz-icon-field-fluid]': 'fluid()',
        '[attr.data-size]': 'size()'
    }
})
export class CzIconFieldComponent {
    /** Position of the icon relative to the input */
    iconPosition = input<CzIconFieldPosition>('left');

    /** Size of the field */
    size = input<CzIconFieldSize>('md');

    /** Whether the field should take up the full width of its container */
    fluid = input<boolean>(false);
}
