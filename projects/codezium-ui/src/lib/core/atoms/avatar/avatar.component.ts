import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { type LucideIconInput } from '@lucide/angular';
import { CzIconComponent } from '../../../icons';

export type CzAvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type CzAvatarShape = 'circle' | 'square';

@Component({
    selector: 'cz-avatar',
    imports: [CommonModule, CzIconComponent],
    templateUrl: './avatar.component.html',
    styleUrl: './avatar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-avatar',
        '[class.cz-avatar--square]': 'shape() === "square"',
        '[attr.data-size]': 'size()',
        'role': 'img',
        '[attr.aria-label]': 'ariaLabel() || label() || null',
    },
})
export class CzAvatarComponent {
    /** Text label (usually initials) */
    label = input<string>('');

    /** Optional Lucide icon */
    icon = input<LucideIconInput | null>(null);

    /** Optional image url (takes precedence over icon and label) */
    image = input<string>('');

    /** Avatar size */
    size = input<CzAvatarSize>('md');

    /** Avatar shape */
    shape = input<CzAvatarShape>('circle');

    /** Accessible label override */
    ariaLabel = input<string>('');

    /** Icon size override in pixels */
    iconSize = input<number | null>(null);

    resolvedIconSize = computed(() => {
        const explicit = this.iconSize();
        if (explicit !== null) return explicit;
        switch (this.size()) {
            case 'sm': return 16;
            case 'lg': return 28;
            case 'xl': return 40;
            default: return 20;
        }
    });
}
