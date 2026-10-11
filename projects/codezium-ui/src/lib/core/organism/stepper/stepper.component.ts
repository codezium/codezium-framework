import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    inject,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideCheck, LucideDynamicIcon } from '@lucide/angular';
import { CzButtonComponent } from '../../atoms/button';

@Component({
    selector: 'cz-step',
    imports: [CommonModule],
    template: `
        @if (isActive()) {
            <div class="cz-step-content" role="tabpanel">
                <ng-content />
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CzStepComponent {
    /** Step label */
    label = input<string>('');

    /** Disabled step */
    disabled = input<boolean>(false);

    private readonly stepperRef = inject(CzStepperComponent, { optional: true });

    isActive = computed(() => {
        if (!this.stepperRef) return true;
        return this.stepperRef.activeIndex() === this.stepperRef.steps().indexOf(this);
    });
}

@Component({
    selector: 'cz-stepper',
    imports: [CommonModule, LucideDynamicIcon, CzButtonComponent],
    templateUrl: './stepper.component.html',
    styleUrl: './stepper.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-stepper',
    },
})
export class CzStepperComponent implements AfterContentInit {
    /** Initial active step index */
    activeStep = input<number>(0);

    /** Prevents jumping forward past the next step */
    linear = input<boolean>(false);

    /** Shows the prev/next navigation */
    showNavigation = input<boolean>(true);

    /** Navigation labels */
    prevLabel = input<string>('Back');
    nextLabel = input<string>('Next');

    /** Current active index */
    activeIndex = signal<number>(0);

    /** Projected steps */
    steps = contentChildren(CzStepComponent);

    readonly CheckIcon = LucideCheck;

    canPrev = computed(() => this.activeIndex() > 0);

    canNext = computed(() => {
        const next = this.steps()[this.activeIndex() + 1];
        return !!next && !next.disabled();
    });

    ngAfterContentInit(): void {
        this.activeIndex.set(this.activeStep());
    }

    isCompleted(index: number): boolean {
        return index < this.activeIndex();
    }

    goTo(index: number): void {
        const step = this.steps()[index];
        if (!step || step.disabled()) return;
        if (this.linear() && index > this.activeIndex() + 1) return;
        this.activeIndex.set(index);
    }

    next(): void {
        this.goTo(this.activeIndex() + 1);
    }

    prev(): void {
        this.goTo(this.activeIndex() - 1);
    }
}
