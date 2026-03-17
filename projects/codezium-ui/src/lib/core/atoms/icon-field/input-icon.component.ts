import {
    ChangeDetectionStrategy,
    Component, 
    computed,
    input, 
    ViewEncapsulation,
    OnChanges,
    SimpleChanges,
    signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'cz-input-icon',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
        <div class="cz-input-icon-container" [class.cz-icon-animating]="isAnimating()">
            @if (isStringIcon()) {
                <lucide-icon 
                    [name]="$any(icon())" 
                    [size]="size()" 
                    [color]="actualColor()"
                    class="cz-input-icon-element">
                </lucide-icon>
            } @else {
                <lucide-icon 
                    [img]="$any(icon())" 
                    [size]="size()" 
                    [color]="actualColor()"
                    class="cz-input-icon-element">
                </lucide-icon>
            }
        </div>
    `,
    styleUrl: './input-icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-input-icon',
        '[attr.data-color]': 'isSemanticColor() ? color() : null'
    }
})
export class CzInputIconComponent implements OnChanges {
    /** Name (string) or Icon Data (LucideIconData) of the Lucide icon */
    icon = input.required<string | any>();

    /** Size of the icon in pixels */
    size = input<number>(18);

    /** 
     * Color of the icon. 
     * Can be a semantic name (primary, secondary, success, warning, danger, info, dark)
     * or a valid CSS color (hex, rgb, etc.).
     */
    color = input<string>();

    isAnimating = signal<boolean>(false);

    isStringIcon = computed(() => typeof this.icon() === 'string');

    private semanticColors = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'dark'];

    isSemanticColor = computed(() => {
        const c = this.color();
        return c ? this.semanticColors.includes(c) : false;
    });

    actualColor = computed(() => {
        const c = this.color();
        if (!c) return 'currentColor';
        if (this.isSemanticColor()) {
            if (c === 'dark') return 'var(--cz-color-gray-900)';
            return `var(--cz-color-${c})`;
        }
        return c;
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['icon'] && !changes['icon'].firstChange) {
            this.triggerAnimation();
        }
    }

    private triggerAnimation(): void {
        this.isAnimating.set(true);
        // Reset animation state after it finishes
        setTimeout(() => this.isAnimating.set(false), 300);
    }
}
