import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    model,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cz-compare',
    imports: [CommonModule],
    templateUrl: './compare.component.html',
    styleUrl: './compare.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-compare',
    },
})
export class CzCompareComponent {
    /** Left (before) image */
    leftImage = input<string>('');

    /** Right (after) image */
    rightImage = input<string>('');

    /** Labels */
    leftLabel = input<string>('Before');
    rightLabel = input<string>('After');

    /** Split percentage (0-100) */
    value = model<number>(50);

    clipPath = computed(() => `inset(0 ${100 - this.value()}% 0 0)`);

    onRangeInput(event: Event): void {
        const value = Number((event.target as HTMLInputElement).value);
        this.value.set(Number.isNaN(value) ? 50 : value);
    }
}
