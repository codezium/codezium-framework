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
    LucideCheck,
    LucideChevronDown,
    LucideChevronRight,
    LucideDynamicIcon,
    LucideX,
} from '@lucide/angular';
import { CzInputSize, CzOverlayZIndex, czOverlayZIndex } from '../../types';

export interface CzCascadeSelectOption {
    label: string;
    value?: any;
    items?: CzCascadeSelectOption[];
}

@Component({
    selector: 'cz-cascade-select',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './cascade-select.component.html',
    styleUrl: './cascade-select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-cascade-select',
        '[class.cz-cascade-select--disabled]': 'actualDisabled()',
        '[attr.data-size]': 'size()',
        '(document:click)': 'onDocumentClick($event)',
    },
})
export class CzCascadeSelectComponent implements ControlValueAccessor {
    /** Hierarchical options */
    options = input<CzCascadeSelectOption[]>([]);

    /** Property used as the visible label */
    optionLabel = input<string>('label');

    /** Property used as the value */
    optionValue = input<string>('value');

    /** Input placeholder */
    placeholder = input<string>('Select...');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Readonly state */
    readonly = input<boolean>(false);

    /** Shows the clear button */
    clearable = input<boolean>(false);

    /** Component size */
    size = input<CzInputSize>('md');
    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex()));


    /** Accessible label */
    ariaLabel = input<string>('Cascade select');

    /** Emitted on value change */
    onChangeEvent = output<{ value: any; originalEvent: Event }>({ alias: 'onChange' });

    /** Current value */
    value = signal<any>(null);

    /** Overlay visibility */
    isOpen = signal<boolean>(false);

    /** Hovered path used to build the visible columns */
    hoveredPath = signal<CzCascadeSelectOption[]>([]);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    readonly ChevronDownIcon = LucideChevronDown;
    readonly ChevronRightIcon = LucideChevronRight;
    readonly CheckIcon = LucideCheck;
    readonly XIcon = LucideX;

    columns = computed(() => {
        const columns: CzCascadeSelectOption[][] = [this.options()];
        for (const node of this.hoveredPath()) {
            if (node.items?.length) {
                columns.push(node.items);
            }
        }
        return columns;
    });

    selectedLabel = computed(() => {
        const path = this.findPath(this.value());
        return path.map((node) => this.getOptionLabel(node)).join(' / ');
    });

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    getOptionLabel(option: CzCascadeSelectOption): string {
        return (option as any)[this.optionLabel()] ?? '';
    }

    getOptionValue(option: CzCascadeSelectOption): any {
        return (option as any)[this.optionValue()];
    }

    private findPath(value: any, nodes: CzCascadeSelectOption[] = this.options()): CzCascadeSelectOption[] {
        for (const node of nodes) {
            if (this.getOptionValue(node) === value && !node.items?.length) {
                return [node];
            }
            if (node.items?.length) {
                const childPath = this.findPath(value, node.items);
                if (childPath.length) {
                    return [node, ...childPath];
                }
            }
        }
        return [];
    }

    isHovered(option: CzCascadeSelectOption, columnIndex: number): boolean {
        return this.hoveredPath()[columnIndex] === option;
    }

    isSelected(option: CzCascadeSelectOption): boolean {
        return this.getOptionValue(option) === this.value() && !option.items?.length;
    }

    hoverOption(option: CzCascadeSelectOption, columnIndex: number): void {
        const path = this.hoveredPath().slice(0, columnIndex);
        path.push(option);
        this.hoveredPath.set(path);
    }

    selectOption(option: CzCascadeSelectOption, event: Event, columnIndex: number): void {
        if (this.actualDisabled() || this.readonly()) return;

        this.hoverOption(option, columnIndex);

        if (option.items?.length) {
            return; // keep drilling down
        }

        const value = this.getOptionValue(option);
        this.value.set(value);
        this.onChange(value);
        this.onChangeEvent.emit({ value, originalEvent: event });
        this.onTouched();
        this.close();
    }

    toggle(): void {
        if (this.actualDisabled() || this.readonly()) return;
        if (this.isOpen()) {
            this.close();
            return;
        }
        this.hoveredPath.set(this.findPath(this.value()).slice(0, -1));
        this.isOpen.set(true);
    }

    close(): void {
        this.isOpen.set(false);
    }

    clear(event: Event): void {
        event.stopPropagation();
        this.value.set(null);
        this.onChange(null);
        this.onChangeEvent.emit({ value: null, originalEvent: event });
    }

    onDocumentClick(event: Event): void {
        if (!this.isOpen()) return;
        const host = event.currentTarget as HTMLElement | null;
        const target = event.target as Node | null;
        if (target && host && !host.contains(target)) {
            this.close();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        this.value.set(value ?? null);
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
