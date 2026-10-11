import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    TemplateRef,
    computed,
    contentChild,
    inject,
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
import { CzProgressSpinnerComponent } from '../progress-spinner';

/** Legacy nested option shape ({ label, value, items }) */
export interface CzCascadeSelectOption {
    label: string;
    value?: any;
    items?: CzCascadeSelectOption[];
}

@Component({
    selector: 'cz-cascade-select',
    imports: [CommonModule, LucideDynamicIcon, CzProgressSpinnerComponent],
    templateUrl: './cascade-select.component.html',
    styleUrl: './cascade-select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-cascade-select',
        '[class.cz-cascade-select--disabled]': 'actualDisabled()',
        '[class.cz-cascade-select--fluid]': 'fluid()',
        '[class.cz-cascade-select--filled]': 'isFilled()',
        '[class.cz-cascade-select--invalid]': 'isInvalid',
        '[class]': 'styleClass()',
        '[attr.data-size]': 'size()',
        '(document:click)': 'onDocumentClick($event)',
    },
})
export class CzCascadeSelectComponent implements ControlValueAccessor {
    private readonly host = inject(ElementRef<HTMLElement>);

    private static nextId = 0;
    private readonly autoId = `cz-cascade-select-${++CzCascadeSelectComponent.nextId}`;

    /** Hierarchical options */
    options = input<any[]>([]);

    /** Property used as the visible label of a leaf option */
    optionLabel = input<string>('label');

    /** Property used as the value */
    optionValue = input<string>('value');

    /** Property used as the label of a category */
    optionGroupLabel = input<string>('name');

    /** Nested keys of the hierarchy, in order (e.g. ['states', 'cities']). Empty = legacy `items` structure */
    optionGroupChildren = input<string | string[]>([]);

    /** Input placeholder */
    placeholder = input<string>('Select...');

    /** Visible label */
    label = input<string>('');

    /** Label position: none (static above), over (infield top), in (inline) or float */
    labelPosition = input<'none' | 'over' | 'in' | 'float'>('none');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Readonly state */
    readonly = input<boolean>(false);

    /** Shows the clear button */
    showClear = input<boolean>(false);

    /** Legacy alias of `showClear` */
    clearable = input<boolean>(false);

    /** Component size */
    size = input<CzInputSize>('md');

    /** Input variant */
    variant = input<'outlined' | 'filled'>('outlined');

    /** Spans 100% width of the container */
    fluid = input<boolean>(false);

    /** Invalid state */
    invalid = input<boolean>(false);

    /** Loading state */
    loading = input<boolean>(false);

    /** Empty state message */
    emptyMessage = input<string>('No results found');

    /** Identifier of the combobox to match a label */
    inputId = input<string>('');

    /** Style class of the host element */
    styleClass = input<string>('');

    /** Accessible label */
    ariaLabel = input<string>('Cascade select');

    /** IDs of elements that label the component */
    ariaLabelledBy = input<string | null>(null);

    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex()));

    /** Emitted on value change */
    onChangeEvent = output<{ value: any; originalEvent: Event }>({ alias: 'onChange' });

    /** Emitted when the value is cleared */
    onClear = output<Event>();

    /** Emitted when the panel opens */
    onShow = output<void>();

    /** Emitted when the panel closes */
    onHide = output<void>();

    /** Custom option template: `$implicit` option */
    optionTemplate = contentChild<TemplateRef<any>>('optionTemplate');

    /** Custom selected value template: `$implicit` value */
    valueTemplate = contentChild<TemplateRef<any>>('valueTemplate');

    /** Custom trigger icon template */
    triggerIconTemplate = contentChild<TemplateRef<any>>('triggerIconTemplate');

    /** Custom loading icon template */
    loadingIconTemplate = contentChild<TemplateRef<any>>('loadingIconTemplate');

    /** Custom panel header template */
    headerTemplate = contentChild<TemplateRef<any>>('headerTemplate');

    /** Custom panel footer template */
    footerTemplate = contentChild<TemplateRef<any>>('footerTemplate');

    /** Current value */
    value = signal<any>(null);

    /** Overlay visibility */
    isOpen = signal<boolean>(false);

    /** Hovered/active path used to build the visible columns */
    hoveredPath = signal<any[]>([]);

    /** Active column level (keyboard navigation) */
    activeLevel = signal<number>(0);

    /** Active index inside the active column */
    activeIndex = signal<number>(0);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    readonly isFilled = computed(() => this.variant() === 'filled');
    readonly effectiveInputId = computed(() => this.inputId() || this.autoId);
    readonly panelId = computed(() => `${this.effectiveInputId()}-panel`);
    readonly showClearButton = computed(() => (this.showClear() || this.clearable()) && !this.actualDisabled());

    get isInvalid(): boolean {
        return this.invalid();
    }

    readonly ChevronDownIcon = LucideChevronDown;
    readonly ChevronRightIcon = LucideChevronRight;
    readonly CheckIcon = LucideCheck;
    readonly XIcon = LucideX;

    /** Ordered nested keys */
    private readonly childrenKeys = computed<string[]>(() => {
        const value = this.optionGroupChildren();
        if (Array.isArray(value)) return value.filter(Boolean);
        if (typeof value === 'string' && value) return [value];
        return [];
    });

    /** Visible columns of the drilldown */
    readonly columns = computed<any[][]>(() => {
        const columns: any[][] = [this.options()];
        this.hoveredPath().forEach((node, level) => {
            const children = this.childrenOf(node, level);
            if (children.length) columns.push(children);
        });
        return columns;
    });

    readonly selectedLabel = computed(() => {
        const path = this.findPath(this.value());
        return path.map((node, level) => this.getLabel(node, level)).join(' / ');
    });

    readonly hasValue = computed(() => this.value() !== null && this.value() !== undefined);

    /** Active descendant id for the combobox */
    readonly activeDescendant = computed(() => {
        if (!this.isOpen()) return null;
        const column = this.columnAt(this.activeLevel());
        if (!column.length) return null;
        return this.optionId(this.activeLevel(), this.activeIndex());
    });

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    /* ── Data helpers ── */

    /** Children of an option at the given level */
    childrenOf(option: any, level: number): any[] {
        const keys = this.childrenKeys();
        if (!keys.length) return option?.items ?? [];
        const key = keys[level];
        const children = key ? option?.[key] : undefined;
        return Array.isArray(children) ? children : [];
    }

    /** Label of an option at the given level (groups use `optionGroupLabel`) */
    getLabel(option: any, level: number): string {
        const keys = this.childrenKeys();
        if (!keys.length) return option?.[this.optionLabel()] ?? '';
        const isGroup = level < keys.length;
        return (isGroup ? option?.[this.optionGroupLabel()] : option?.[this.optionLabel()]) ?? '';
    }

    getOptionValue(option: any): any {
        return option?.[this.optionValue()];
    }

    private findPath(value: any, nodes: any[] = this.options(), level = 0): any[] {
        for (const node of nodes) {
            const children = this.childrenOf(node, level);
            if (!children.length) {
                if (this.getOptionValue(node) === value) return [node];
                continue;
            }
            const childPath = this.findPath(value, children, level + 1);
            if (childPath.length) return [node, ...childPath];
        }
        return [];
    }

    /** Options of the column at the given level */
    columnAt(level: number): any[] {
        if (level === 0) return this.options();
        const parent = this.hoveredPath()[level - 1];
        return parent ? this.childrenOf(parent, level - 1) : [];
    }

    isHovered(option: any, columnIndex: number): boolean {
        return this.activeLevel() === columnIndex && this.columnAt(columnIndex)[this.activeIndex()] === option;
    }

    isSelected(option: any, level: number): boolean {
        return this.childrenOf(option, level).length === 0 && this.getOptionValue(option) === this.value();
    }

    optionId(level: number, index: number): string {
        return `${this.effectiveInputId()}-${level}-${index}`;
    }

    /* ── Interaction ── */

    hoverOption(option: any, columnIndex: number): void {
        this.setActive(columnIndex, this.columnAt(columnIndex).indexOf(option));
    }

    private setActive(level: number, index: number): void {
        const column = this.columnAt(level);
        if (!column.length) return;

        const clamped = Math.max(0, Math.min(index, column.length - 1));
        const path = this.hoveredPath().slice(0, level);
        path.push(column[clamped]);

        this.hoveredPath.set(path);
        this.activeLevel.set(level);
        this.activeIndex.set(clamped);
    }

    selectOption(option: any, event: Event, columnIndex: number): void {
        if (this.actualDisabled() || this.readonly()) return;

        this.setActive(columnIndex, this.columnAt(columnIndex).indexOf(option));

        if (this.childrenOf(option, columnIndex).length) {
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

        const path = this.findPath(this.value());
        this.hoveredPath.set(path.slice(0, Math.max(0, path.length - 1)));
        this.activeLevel.set(Math.max(0, path.length - 1));
        this.activeIndex.set(0);
        this.isOpen.set(true);
        this.onShow.emit();
    }

    close(): void {
        if (!this.isOpen()) return;
        this.isOpen.set(false);
        this.onHide.emit();
    }

    clear(event: Event): void {
        event.stopPropagation();
        if (this.actualDisabled() || this.readonly()) return;

        this.value.set(null);
        this.onChange(null);
        this.onChangeEvent.emit({ value: null, originalEvent: event });
        this.onClear.emit(event);
    }

    onDocumentClick(event: Event): void {
        if (!this.isOpen()) return;
        const target = event.target as Node | null;
        if (target && !this.host.nativeElement.contains(target)) {
            this.close();
        }
    }

    /* ── Keyboard ── */

    onKeyDown(event: KeyboardEvent): void {
        if (this.actualDisabled() || this.readonly()) return;

        if (!this.isOpen()) {
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
                event.preventDefault();
                this.toggle();
            }
            return;
        }

        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                this.close();
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.setActive(this.activeLevel(), this.activeIndex() + 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.setActive(this.activeLevel(), this.activeIndex() - 1);
                break;
            case 'ArrowRight': {
                event.preventDefault();
                const option = this.columnAt(this.activeLevel())[this.activeIndex()];
                if (option && this.childrenOf(option, this.activeLevel()).length) {
                    this.setActive(this.activeLevel() + 1, 0);
                }
                break;
            }
            case 'ArrowLeft':
                event.preventDefault();
                if (this.activeLevel() > 0) {
                    this.setActive(this.activeLevel() - 1, this.activeIndex());
                }
                break;
            case 'Enter':
            case ' ': {
                event.preventDefault();
                const option = this.columnAt(this.activeLevel())[this.activeIndex()];
                if (option) {
                    this.selectOption(option, event, this.activeLevel());
                }
                break;
            }
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
