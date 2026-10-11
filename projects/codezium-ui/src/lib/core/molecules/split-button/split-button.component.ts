import {
    computed,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideChevronDown, LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';
import { CzMenuItem, CzSeverity, CzInputSize, CzOverlayZIndex, czOverlayZIndex } from '../../types';

@Component({
    selector: 'cz-split-button',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './split-button.component.html',
    styleUrl: './split-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-split-button',
        '[class.cz-split-button--disabled]': 'disabled()',
        '[attr.data-severity]': 'severity()',
        '[attr.data-size]': 'size()',
        '(document:click)': 'onDocumentClick($event)',
    },
})
export class CzSplitButtonComponent {
    /** Default action label */
    label = input<string>('');

    /** Optional icon of the default action */
    icon = input<LucideIconInput | null>(null);

    /** Severity color */
    severity = input<CzSeverity>('primary');

    /** Button size */
    size = input<CzInputSize>('md');
    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex()));


    /** Disabled state */
    disabled = input<boolean>(false);

    /** Menu items of the dropdown */
    items = input<CzMenuItem[]>([]);

    /** Emitted when the default action is clicked */
    onClick = output<MouseEvent>();

    /** Emitted when a menu item is selected */
    onItemSelect = output<CzMenuItem>();

    /** Dropdown visibility */
    open = signal<boolean>(false);

    readonly ChevronDownIcon = LucideChevronDown;

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

    triggerDefault(event: MouseEvent): void {
        if (this.disabled()) return;
        this.onClick.emit(event);
    }

    toggle(event: Event): void {
        event.stopPropagation();
        if (this.disabled()) return;
        this.open.update((v) => !v);
    }

    activate(item: CzMenuItem, event: Event): void {
        if (item.disabled || item.separator) return;

        item.command?.(event);
        this.onItemSelect.emit(item);
        this.open.set(false);
    }

    onDocumentClick(event: Event): void {
        if (!this.open()) return;
        const target = event.target as Node | null;
        if (target && !this.el.nativeElement.contains(target)) {
            this.open.set(false);
        }
    }
}
