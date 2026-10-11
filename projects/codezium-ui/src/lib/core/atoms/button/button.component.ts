import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { type LucideIconInput } from '@lucide/angular';
import { CzIconComponent } from '../../../icons';
import { CzSeverity } from '../../types';

export type CzButtonSize = 'sm' | 'md' | 'lg';
export type CzButtonVariant = 'solid' | 'outlined' | 'text';
export type CzButtonIconPos = 'left' | 'right';
export type CzButtonType = 'button' | 'submit' | 'reset';

@Component({
    selector: 'cz-button',
    imports: [CommonModule, CzIconComponent],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-button',
        '[class.cz-button--disabled]': 'actualDisabled()',
        '[class.cz-button--loading]': 'loading()',
        '[class.cz-button--fluid]': 'fluid()',
        '[class.cz-button--raised]': 'raised()',
        '[class.cz-button--rounded]': 'rounded()',
        '[class.cz-button--icon-only]': '!label()',
        '[attr.data-size]': 'size()',
        '[attr.data-severity]': 'severity()',
        '[attr.data-variant]': 'variant()',
    },
})
export class CzButtonComponent {
    /** Text of the button */
    label = input<string>('');

    /** Optional Lucide icon (component, data or registered name) */
    icon = input<LucideIconInput | null>(null);

    /** Icon position */
    iconPos = input<CzButtonIconPos>('left');

    /** Severity color */
    severity = input<CzSeverity>('primary');

    /** Visual variant */
    variant = input<CzButtonVariant>('solid');

    /** Button size */
    size = input<CzButtonSize>('md');

    /** Adds a raised elevation */
    raised = input<boolean>(false);

    /** Fully rounded (pill) shape */
    rounded = input<boolean>(false);

    /** Loading state: shows a spinner and blocks clicks */
    loading = input<boolean>(false);

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Full width */
    fluid = input<boolean>(false);

    /** Native button type */
    type = input<CzButtonType>('button');

    /** Accessible label (required when there is no visible label) */
    ariaLabel = input<string>('');

    /** Emitted on click (blocked while disabled/loading) */
    onClick = output<MouseEvent>();

    actualDisabled = computed(() => this.disabled() || this.loading());

    iconSize = computed(() => {
        switch (this.size()) {
            case 'sm': return 14;
            case 'lg': return 18;
            default: return 16;
        }
    });

    handleClick(event: MouseEvent): void {
        if (this.actualDisabled()) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.onClick.emit(event);
    }
}
