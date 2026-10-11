import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CzMeterItem {
    label: string;
    value: number;
    color?: string;
}

const FALLBACK_COLORS = [
    'var(--cz-color-primary)',
    'var(--cz-color-success)',
    'var(--cz-color-warning)',
    'var(--cz-color-danger)',
    'var(--cz-color-info)',
    'var(--cz-color-secondary)',
];

@Component({
    selector: 'cz-meter-group',
    imports: [CommonModule],
    templateUrl: './meter-group.component.html',
    styleUrl: './meter-group.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-meter-group',
        '[attr.data-orientation]': 'orientation()',
    },
})
export class CzMeterGroupComponent {
    /** Meter items */
    value = input<CzMeterItem[]>([]);

    /** Maximum value of the scale */
    max = input<number>(100);

    /** Bar orientation */
    orientation = input<'horizontal' | 'vertical'>('horizontal');

    total = computed(() =>
        Math.min(
            this.max(),
            this.value().reduce((sum, item) => sum + item.value, 0),
        ),
    );

    percentOf(item: CzMeterItem): number {
        const max = this.max();
        if (max <= 0) return 0;
        return Math.min(100, Math.max(0, (item.value / max) * 100));
    }

    colorOf(item: CzMeterItem, index: number): string {
        return item.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
    }
}
