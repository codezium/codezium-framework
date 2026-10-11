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
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronsLeft,
    LucideChevronsRight,
    LucideDynamicIcon,
} from '@lucide/angular';

@Component({
    selector: 'cz-pick-list',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './pick-list.component.html',
    styleUrl: './pick-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-pick-list',
        '[class.cz-pick-list--disabled]': 'actualDisabled()',
    },
})
export class CzPickListComponent implements ControlValueAccessor {
    /** Available items (external source) */
    source = input<any[]>([]);

    /** Property used to display each item */
    optionLabel = input<string>('');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Accessible label */
    ariaLabel = input<string>('Pick list');

    /** Emitted when items are transferred to the target */
    onMoveToTarget = output<any[]>();

    /** Emitted when items are transferred back to the source */
    onMoveToSource = output<any[]>();

    /** Target items (the form value) */
    target = signal<any[]>([]);

    /** Source override after transfers */
    private sourceOverride = signal<any[] | null>(null);

    /** Selected indexes */
    selectedSource = signal<number>(-1);
    selectedTarget = signal<number>(-1);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    availableItems = computed(() => this.sourceOverride() ?? this.source());

    canMoveRight = computed(() => this.selectedSource() >= 0 && !this.actualDisabled());
    canMoveLeft = computed(() => this.selectedTarget() >= 0 && !this.actualDisabled());
    canMoveAllRight = computed(() => this.availableItems().length > 0 && !this.actualDisabled());
    canMoveAllLeft = computed(() => this.target().length > 0 && !this.actualDisabled());

    readonly LeftIcon = LucideChevronLeft;
    readonly RightIcon = LucideChevronRight;
    readonly AllLeftIcon = LucideChevronsLeft;
    readonly AllRightIcon = LucideChevronsRight;

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

    selectSource(index: number): void {
        if (this.actualDisabled()) return;
        this.selectedSource.set(index);
        this.selectedTarget.set(-1);
        this.onTouched();
    }

    selectTarget(index: number): void {
        if (this.actualDisabled()) return;
        this.selectedTarget.set(index);
        this.selectedSource.set(-1);
        this.onTouched();
    }

    moveRight(): void {
        const index = this.selectedSource();
        if (!this.canMoveRight() || index < 0) return;

        const available = [...this.availableItems()];
        const [item] = available.splice(index, 1);
        this.sourceOverride.set(available);
        this.target.update((target) => [...target, item]);
        this.selectedSource.set(-1);
        this.emitChange();
        this.onMoveToTarget.emit([item]);
    }

    moveLeft(): void {
        const index = this.selectedTarget();
        if (!this.canMoveLeft() || index < 0) return;

        const target = [...this.target()];
        const [item] = target.splice(index, 1);
        this.target.set(target);
        this.sourceOverride.update((available) => [...(available ?? this.source()), item]);
        this.selectedTarget.set(-1);
        this.emitChange();
        this.onMoveToSource.emit([item]);
    }

    moveAllRight(): void {
        if (!this.canMoveAllRight()) return;

        const items = [...this.availableItems()];
        this.target.update((target) => [...target, ...items]);
        this.sourceOverride.set([]);
        this.selectedSource.set(-1);
        this.emitChange();
        this.onMoveToTarget.emit(items);
    }

    moveAllLeft(): void {
        if (!this.canMoveAllLeft()) return;

        const items = [...this.target()];
        this.target.set([]);
        this.sourceOverride.update((available) => [...(available ?? this.source()), ...items]);
        this.selectedTarget.set(-1);
        this.emitChange();
        this.onMoveToSource.emit(items);
    }

    private emitChange(): void {
        this.onChange([...this.target()]);
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        this.target.set(Array.isArray(value) ? [...value] : []);
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
