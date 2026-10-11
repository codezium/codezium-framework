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
import { LucideChevronDown, LucideDynamicIcon } from '@lucide/angular';

let nextAccordionId = 0;

@Component({
    selector: 'cz-accordion-panel',
    imports: [CommonModule, LucideDynamicIcon],
    template: `
        <div class="cz-accordion-header">
            <button
                type="button"
                class="cz-accordion-trigger"
                [attr.aria-expanded]="isExpanded()"
                [attr.aria-controls]="panelId"
                [id]="headerId"
                [disabled]="disabled()"
                (click)="toggle()"
            >
                <span class="cz-accordion-title">{{ header() }}</span>
                <svg
                    [lucideIcon]="ChevronIcon"
                    [size]="16"
                    class="cz-accordion-icon"
                    [class.cz-accordion-icon--expanded]="isExpanded()"
                ></svg>
            </button>
        </div>

        @if (isExpanded()) {
            <div
                class="cz-accordion-content"
                role="region"
                [id]="panelId"
                [attr.aria-labelledby]="headerId"
            >
                <ng-content />
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-accordion-panel',
    },
})
export class CzAccordionPanelComponent {
    /** Panel header */
    header = input<string>('');

    /** Disabled state */
    disabled = input<boolean>(false);

    readonly ChevronIcon = LucideChevronDown;

    readonly headerId = `cz-accordion-header-${nextAccordionId++}`;
    readonly panelId = `${this.headerId}-panel`;

    private readonly accordionRef = inject(CzAccordionComponent, { optional: true });

    isExpanded = computed(() => {
        if (!this.accordionRef) return true;
        const index = this.accordionRef.panels().indexOf(this);
        return this.accordionRef.isExpanded(index);
    });

    toggle(): void {
        if (this.disabled()) return;
        const index = this.accordionRef ? this.accordionRef.panels().indexOf(this) : 0;
        this.accordionRef?.toggle(index);
    }
}

@Component({
    selector: 'cz-accordion',
    imports: [CommonModule],
    template: `<ng-content />`,
    styleUrl: './accordion.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-accordion',
    },
})
export class CzAccordionComponent implements AfterContentInit {
    /** Allows multiple panels to be open at once */
    multiple = input<boolean>(false);

    /** Initially expanded indexes */
    activeIndexes = input<number[]>([]);

    /** Projected panels */
    panels = contentChildren(CzAccordionPanelComponent);

    /** Internal expanded state */
    expanded = signal<Set<number>>(new Set());

    ngAfterContentInit(): void {
        this.expanded.set(new Set(this.activeIndexes()));
    }

    isExpanded(index: number): boolean {
        return this.expanded().has(index);
    }

    toggle(index: number): void {
        const next = new Set(this.expanded());
        if (next.has(index)) {
            next.delete(index);
        } else {
            if (!this.multiple()) {
                next.clear();
            }
            next.add(index);
        }
        this.expanded.set(next);
    }
}
