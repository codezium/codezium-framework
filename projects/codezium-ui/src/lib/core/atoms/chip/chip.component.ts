import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { type LucideIconInput } from '@lucide/angular';
import { CzIconComponent } from '../../../icons';

@Component({
    selector: 'cz-chip',
    imports: [CommonModule, CzIconComponent],
    templateUrl: './chip.component.html',
    styleUrl: './chip.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-chip',
        '[class.cz-chip--disabled]': 'disabled()',
    },
})
export class CzChipComponent {
    /** Text of the chip */
    label = input<string>('');

    /** Optional Lucide icon */
    icon = input<LucideIconInput | null>(null);

    /** Optional image url (takes precedence over icon) */
    image = input<string>('');

    /** Shows the remove button */
    removable = input<boolean>(false);

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Accessible label for the remove button */
    removeAriaLabel = input<string>('Remove');

    /** Emitted when the remove button is clicked */
    onRemove = output<MouseEvent>();

    remove(event: MouseEvent): void {
        if (this.disabled()) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.onRemove.emit(event);
    }
}
