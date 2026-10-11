import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideDynamicIcon } from '@lucide/angular';
import { CzMenuItem } from '../../types';
import { CzTooltipDirective } from '../tooltip';

@Component({
    selector: 'cz-dock',
    imports: [CommonModule, LucideDynamicIcon, CzTooltipDirective],
    templateUrl: './dock.component.html',
    styleUrl: './dock.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-dock',
    },
})
export class CzDockComponent {
    /** Dock items (flat list with icon, label and command) */
    items = input<CzMenuItem[]>([]);

    /** Emitted when an item is activated */
    onItemSelect = output<CzMenuItem>();

    activate(item: CzMenuItem, event?: Event): void {
        if (item.disabled) return;

        item.command?.(event);
        this.onItemSelect.emit(item);
    }
}
