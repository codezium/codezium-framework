import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzButtonComponent } from '../../atoms/button';

@Component({
    selector: 'cz-inplace',
    imports: [CommonModule, CzButtonComponent],
    templateUrl: './inplace.component.html',
    styleUrl: './inplace.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-inplace',
    },
})
export class CzInplaceComponent {
    /** Text displayed in view mode */
    display = input<string>('');

    /** Edit mode state (two-way) */
    active = model<boolean>(false);

    /** Button labels */
    saveLabel = input<string>('Save');
    cancelLabel = input<string>('Cancel');

    /** Emitted when saved */
    onSave = output<void>();

    /** Emitted when cancelled */
    onCancel = output<void>();

    activate(): void {
        this.active.set(true);
    }

    save(): void {
        this.active.set(false);
        this.onSave.emit();
    }

    cancel(): void {
        this.active.set(false);
        this.onCancel.emit();
    }
}
