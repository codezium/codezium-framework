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
import { CzBadgeComponent } from '../badge';
import { CzSeverity } from '../../types';

export type CzButtonSize = 'sm' | 'md' | 'lg';
export type CzButtonVariant = 'solid' | 'outlined' | 'text' | 'link' | 'plain';
export type CzButtonIconPos = 'left' | 'right' | 'top' | 'bottom';
export type CzButtonType = 'button' | 'submit' | 'reset';

@Component({
    selector: 'cz-button',
    imports: [CommonModule, CzIconComponent, CzBadgeComponent],
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
        '[class.cz-button--icon-only]': 'actualIconOnly()',
        '[attr.data-size]': 'size()',
        '[attr.data-severity]': 'severity()',
        '[attr.data-variant]': 'variant()',
        '[attr.data-icon-pos]': 'iconPos()',
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

    /** Custom icon shown while loading (defaults to a CSS spinner) */
    loadingIcon = input<LucideIconInput | null>(null);

    /** Badge value displayed inside the button */
    badge = input<string | number | null>(null);

    /** Severity of the badge */
    badgeSeverity = input<CzSeverity>('secondary');

    /** Forces the square icon-only styling */
    iconOnly = input<boolean>(false);

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Full width */
    fluid = input<boolean>(false);

    /** Native button type */
    type = input<CzButtonType>('button');

    /** Custom style class for the native button */
    styleClass = input<string>('');

    /** Native tabindex */
    tabindex = input<number | null>(null);

    /** Focuses the button on load */
    autofocus = input<boolean>(false);

    /** Accessible label (required when there is no visible label) */
    ariaLabel = input<string>('');

    /** Emitted on click (blocked while disabled/loading) */
    onClick = output<MouseEvent>();

    /** Emitted on focus */
    onFocus = output<FocusEvent>();

    /** Emitted on blur */
    onBlur = output<FocusEvent>();

    actualDisabled = computed(() => this.disabled() || this.loading());

    /** Icon-only is inferred when there is an icon and no label/badge */
    actualIconOnly = computed(
        () =>
            this.iconOnly() ||
            (!this.label() && !!this.icon() && (this.badge() === null || this.badge() === undefined)),
    );

    iconSize = computed(() => {
        switch (this.size()) {
            case 'sm': return 14;
            case 'lg': return 18;
            default: return 16;
        }
    });

    hasBadge = computed(() => this.badge() !== null && this.badge() !== undefined);

    handleClick(event: MouseEvent): void {
        if (this.actualDisabled()) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.onClick.emit(event);
    }
}
