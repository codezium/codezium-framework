import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideChevronDown, LucideDynamicIcon } from '@lucide/angular';

@Component({
    selector: 'cz-panel',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './panel.component.html',
    styleUrl: './panel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-panel',
        '[class.cz-panel--collapsed]': 'collapsed()',
    },
})
export class CzPanelComponent {
    /** Panel header text */
    header = input<string>('');

    /** Allows collapsing the content */
    toggleable = input<boolean>(false);

    /** Collapsed state (two-way bindable) */
    collapsed = model<boolean>(false);

    /** Emitted when the collapsed state changes */
    onToggle = output<boolean>();

    readonly ChevronIcon = LucideChevronDown;

    toggle(): void {
        if (!this.toggleable()) return;
        const next = !this.collapsed();
        this.collapsed.set(next);
        this.onToggle.emit(next);
    }
}
