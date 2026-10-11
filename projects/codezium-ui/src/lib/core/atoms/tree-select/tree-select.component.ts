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

export interface CzTreeSelectOption {
    label: string;
    value?: any;
    children?: CzTreeSelectOption[];
}

interface TreeRow {
    node: CzTreeSelectOption;
    depth: number;
    expandable: boolean;
}

@Component({
    selector: 'cz-tree-select',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './tree-select.component.html',
    styleUrl: './tree-select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-tree-select',
        '[class.cz-tree-select--disabled]': 'actualDisabled()',
        '[attr.data-size]': 'size()',
        '(document:click)': 'onDocumentClick($event)',
    },
})
export class CzTreeSelectComponent implements ControlValueAccessor {
    /** Hierarchical options */
    options = input<CzTreeSelectOption[]>([]);

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
    ariaLabel = input<string>('Tree select');

    /** Emitted on value change */
    onChangeEvent = output<{ value: any; originalEvent: Event }>({ alias: 'onChange' });

    /** Current value */
    value = signal<any>(null);

    /** Overlay visibility */
    isOpen = signal<boolean>(false);

    /** Expanded nodes */
    expanded = signal<Set<CzTreeSelectOption>>(new Set());

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    readonly ChevronDownIcon = LucideChevronDown;
    readonly ChevronRightIcon = LucideChevronRight;
    readonly CheckIcon = LucideCheck;
    readonly XIcon = LucideX;

    visibleRows = computed(() => {
        const rows: TreeRow[] = [];
        const walk = (nodes: CzTreeSelectOption[], depth: number) => {
            for (const node of nodes) {
                const expandable = !!node.children?.length;
                rows.push({ node, depth, expandable });
                if (expandable && this.expanded().has(node)) {
                    walk(node.children!, depth + 1);
                }
            }
        };
        walk(this.options(), 0);
        return rows;
    });

    selectedLabel = computed(() => {
        const node = this.findNode(this.value());
        return node ? this.getOptionLabel(node) : '';
    });

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    getOptionLabel(option: CzTreeSelectOption): string {
        return (option as any)[this.optionLabel()] ?? '';
    }

    getOptionValue(option: CzTreeSelectOption): any {
        return (option as any)[this.optionValue()] ?? option;
    }

    private findNode(value: any, nodes: CzTreeSelectOption[] = this.options()): CzTreeSelectOption | null {
        for (const node of nodes) {
            if (this.getOptionValue(node) === value) return node;
            if (node.children?.length) {
                const found = this.findNode(value, node.children);
                if (found) return found;
            }
        }
        return null;
    }

    isExpanded(node: CzTreeSelectOption): boolean {
        return this.expanded().has(node);
    }

    isSelected(node: CzTreeSelectOption): boolean {
        return this.getOptionValue(node) === this.value();
    }

    toggleExpand(node: CzTreeSelectOption, event: Event): void {
        event.stopPropagation();
        const next = new Set(this.expanded());
        if (next.has(node)) {
            next.delete(node);
        } else {
            next.add(node);
        }
        this.expanded.set(next);
    }

    toggle(): void {
        if (this.actualDisabled() || this.readonly()) return;
        this.isOpen.update((open) => !open);
    }

    close(): void {
        this.isOpen.set(false);
    }

    selectNode(node: CzTreeSelectOption, event: Event): void {
        if (this.actualDisabled() || this.readonly()) return;

        const value = this.getOptionValue(node);
        this.value.set(value);
        this.onChange(value);
        this.onChangeEvent.emit({ value, originalEvent: event });
        this.onTouched();
        this.close();
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
