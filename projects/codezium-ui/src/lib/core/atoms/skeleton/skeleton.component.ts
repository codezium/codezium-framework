import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type CzSkeletonShape = 'rectangle' | 'circle';
export type CzSkeletonAnimation = 'pulse' | 'none';

function toCssSize(value: string | number | null | undefined, fallback: string): string {
    if (value === null || value === undefined || value === '') return fallback;
    return typeof value === 'number' ? `${value}px` : value;
}

@Component({
    selector: 'cz-skeleton',
    imports: [CommonModule],
    templateUrl: './skeleton.component.html',
    styleUrl: './skeleton.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-skeleton',
        '[class.cz-skeleton--circle]': 'shape() === "circle"',
        '[class.cz-skeleton--pulse]': 'animation() === "pulse"',
        '[style.width]': 'actualWidth()',
        '[style.height]': 'actualHeight()',
        '[style.border-radius]': 'actualBorderRadius()',
        '[attr.aria-hidden]': '"true"',
    },
})
export class CzSkeletonComponent {
    /** Skeleton shape */
    shape = input<CzSkeletonShape>('rectangle');

    /** CSS width (number = px) */
    width = input<string | number | null>(null);

    /** CSS height (number = px) */
    height = input<string | number | null>(null);

    /** CSS border radius override */
    borderRadius = input<string | null>(null);

    /** Animation style */
    animation = input<CzSkeletonAnimation>('pulse');

    actualWidth = computed(() =>
        toCssSize(this.width(), this.shape() === 'circle' ? '3rem' : '100%'),
    );

    actualHeight = computed(() =>
        toCssSize(this.height(), this.shape() === 'circle' ? this.actualWidth() : '1rem'),
    );

    actualBorderRadius = computed(() =>
        this.borderRadius() ?? (this.shape() === 'circle' ? '50%' : 'var(--cz-radius-sm)'),
    );
}
