import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    Optional,
    output,
    Self,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
    LucideChevronDown,
    LucideChevronUp,
    LucideDynamicIcon,
} from '@lucide/angular';

@Component({
    selector: 'cz-order-list',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './order-list.component.html',
    styleUrl: './order-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-order-list',
        '[class.cz-order-list--disabled]': 'actualDisabled()',
    },
})
export class CzOrderListComponent implements ControlValueAccessor {
    /** Property used to display each item */
    optionLabel = input<string>('');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Accessible label */
    ariaLabel = input<string>('Order list');

    /** Emitted after every reorder */
    onReorder = output<any[]>();

    /** Current items */
    items = signal<any[]>([]);

    /** Selected index */
    selectedIndex = signal<number>(-1);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    canMoveUp = computed(() => this.selectedIndex() > 0 && !this.actualDisabled());
    canMoveDown = computed(
        () => this.selectedIndex() >= 0 && this.selectedIndex() < this.items().length - 1 && !this.actualDisabled(),
    );

    readonly UpIcon = LucideChevronUp;
    readonly DownIcon = LucideChevronDown;

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    display(item: any): string {
        return this.optionLabel() ? String(item[this.optionLabel()]) : String(item);
    }

    select(index: number): void {
        if (this.actualDisabled()) return;
        this.selectedIndex.set(index);
        this.onTouched();
    }

    moveUp(): void {
        if (!this.canMoveUp()) return;
        const index = this.selectedIndex();
        const next = [...this.items()];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        this.items.set(next);
        this.selectedIndex.set(index - 1);
        this.onChange([...next]);
        this.onReorder.emit([...next]);
    }

    moveDown(): void {
        if (!this.canMoveDown()) return;
        const index = this.selectedIndex();
        const next = [...this.items()];
        [next[index + 1], next[index]] = [next[index], next[index + 1]];
        this.items.set(next);
        this.selectedIndex.set(index + 1);
        this.onChange([...next]);
        this.onReorder.emit([...next]);
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        this.items.set(Array.isArray(value) ? [...value] : []);
        this.selectedIndex.set(-1);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.formsDisabled.set(isDisabled);
    }
}
