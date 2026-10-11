import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    ElementRef,
    input,
    model,
    Optional,
    output,
    Self,
    TemplateRef,
    ViewEncapsulation,
    viewChildren,
    signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';

export type CzSelectButtonSize = 'sm' | 'md' | 'lg';
export type CzSelectButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
export type CzSelectButtonLabelPosition = 'left' | 'right' | 'top';

export interface CzSelectButtonChangeEvent {
    originalEvent: Event;
    value: any;
}

export interface CzSelectButtonOptionClickEvent {
    originalEvent: Event;
    option: any;
    index: number;
}

export interface CzSelectButtonItemTemplateContext {
    $implicit: any;
    index: number;
}

let selectButtonUid = 0;

@Component({
    selector: 'cz-select-button',
    imports: [CommonModule],
    templateUrl: './select-button.component.html',
    styleUrl: './select-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-select-button',
        '[class.cz-select-button--disabled]': 'actualDisabled()',
        '[class.cz-select-button--label-left]': 'labelPosition() === "left"',
        '[class.cz-select-button--label-right]': 'labelPosition() === "right"',
        '[class.cz-select-button--has-error]': 'isInvalid',
        '[attr.data-size]': 'size()',
        '[attr.data-color]': 'color()'
    }
})
export class CzSelectButtonComponent implements ControlValueAccessor, AfterViewInit {
    /** Array of options to display */
    options = input.required<any[]>();

    /** Property name or getter function to use as the label of an option */
    optionLabel = input<string>();

    /** Property name or getter function to use as the value of an option */
    optionValue = input<string>();

    /** Name of the disabled field of an option or function to determine disabled state */
    optionDisabled = input<string | ((item: any) => boolean) | null>(null);

    /** Whether to allow multiple selection */
    multiple = input<boolean>(false);

    /** Whether selection can be cleared when clicking the selected option */
    unselectable = input<boolean>(false);

    /** Whether selection can be cleared (single mode and last value in multiple mode) */
    allowEmpty = input<boolean>(true);

    /** Size of the component */
    size = input<CzSelectButtonSize>('md');

    /** Color variant */
    color = input<CzSelectButtonColor>('primary');

    /** Whether the component should take up 100% of its container width */
    fluid = input<boolean>(false);

    /** Label for the group */
    label = input<string>('');

    /** Label position relative to the buttons */
    labelPosition = input<CzSelectButtonLabelPosition>('right');

    /** Disabled state */
    disabled = model<boolean>(false);

    /** When present, it specifies that the component should have invalid state style */
    invalid = input<boolean>(false);

    /** Index of the element in tabbing order */
    tabindex = input<number>(0);

    /** When present, it specifies that the component should automatically get focus on load */
    autofocus = input<boolean>(false);

    /** Establishes relationships between the component and label(s) where its value should be one or more element IDs */
    ariaLabelledBy = input<string | null>(null);

    /** A property to uniquely identify a value in options */
    dataKey = input<string>('');

    /** Style class of the component */
    styleClass = input<string>('');

    /** Helper text to display below the component */
    helperText = input<string>('');

    /** Whether to show validation errors automatically */
    showErrors = input<boolean>(true);

    /** Current validation locale */
    locale = input<CzValidationLocale>('es');

    /** Custom error message overrides */
    customErrors = input<Partial<CzValidationErrorKeys>>();

    /** Custom item template */
    itemTemplate = contentChild<TemplateRef<CzSelectButtonItemTemplateContext>>('itemTemplate');

    /** Callback to invoke on selection change */
    onChangeEvent = output<CzSelectButtonChangeEvent>({ alias: 'onChange' });

    /** Callback to invoke on input click */
    onOptionClickEvent = output<CzSelectButtonOptionClickEvent>({ alias: 'onOptionClick' });

    /** Internal value state */
    value = signal<any>(null);

    /** Track focused option for keyboard navigation */
    focusedIndex = signal<number>(-1);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Computed disabled state combining both inputs */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('optionButton');

    /** Unique id for the group label */
    private readonly labelId = `cz-select-button-label-${++selectButtonUid}`;

    // ControlValueAccessor implementations
    onModelChange: Function = (_: any) => { };
    onModelTouched: Function = () => { };

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngAfterViewInit(): void {
        if (this.autofocus() && !this.actualDisabled()) {
            this.buttons()[0]?.nativeElement.focus();
        }
    }

    /** Validation helpers */
    get isInvalid(): boolean {
        if (this.invalid()) return true;
        if (!this.ngControl) return false;
        return !!(this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty));
    }

    get errorMessage(): string | null {
        if (!this.isInvalid || !this.ngControl?.errors) return null;
        const errors = this.ngControl.errors;
        const dictionary = {
            ...CZ_VALIDATION_MESSAGES[this.locale()],
            ...this.customErrors()
        };

        for (const key of Object.keys(errors)) {
            const mappedError = dictionary[key];
            if (mappedError) {
                if (typeof mappedError === 'function') {
                    return mappedError(errors[key].requiredLength || errors[key]);
                }
                return mappedError;
            }
        }
        return dictionary.default;
    }

    getLabel(option: any): string {
        if (option === null || option === undefined) return '';
        if (typeof option === 'string' || typeof option === 'number') return String(option);
        const labelKey = this.optionLabel();
        if (labelKey) return option[labelKey] ?? '';
        return option.label !== undefined ? String(option.label) : String(option);
    }

    getValue(option: any): any {
        const valueKey = this.optionValue();
        if (valueKey) return option?.[valueKey];
        if (this.optionLabel() || option?.value === undefined) return option;
        return option.value;
    }

    isOptionDisabled(option: any): boolean {
        const optionDisabled = this.optionDisabled();
        if (typeof optionDisabled === 'function') return !!optionDisabled(option);
        if (typeof optionDisabled === 'string' && optionDisabled) return !!option?.[optionDisabled];
        return option?.disabled !== undefined ? !!option.disabled : false;
    }

    isButtonDisabled(option: any): boolean {
        return this.actualDisabled() || this.isOptionDisabled(option);
    }

    private isEqual(a: any, b: any): boolean {
        const key = this.dataKey();
        if (key && a && b && typeof a === 'object' && typeof b === 'object') {
            return a[key] === b[key];
        }
        return a === b;
    }

    isSelected(option: any): boolean {
        const optionValue = this.getValue(option);
        const currentValue = this.value();

        if (this.multiple()) {
            return Array.isArray(currentValue) && currentValue.some((val) => this.isEqual(val, optionValue));
        }

        return this.isEqual(currentValue, optionValue);
    }

    /** Whether the current selection can be cleared (PrimeNG parity) */
    getAllowEmpty(): boolean {
        if (this.multiple()) {
            return this.allowEmpty() || (this.value()?.length ?? 0) !== 1;
        }
        return this.allowEmpty();
    }

    /** Combined label association for the group */
    readonly effectiveAriaLabelledBy = computed(() => this.ariaLabelledBy() || (this.label() ? this.labelId : null));

    /** Unique id exposed for the rendered label */
    readonly groupLabelId = this.labelId;

    onOptionClick(event: Event, option: any, index: number): void {
        if (this.actualDisabled() || this.isOptionDisabled(option)) return;

        const selected = this.isSelected(option);
        if (selected && this.unselectable()) return;

        const optionValue = this.getValue(option);
        let newValue: any;

        if (this.multiple()) {
            if (selected && !this.getAllowEmpty()) return;
            const currentValues = Array.isArray(this.value()) ? [...this.value()] : [];
            newValue = selected
                ? currentValues.filter((val) => !this.isEqual(val, optionValue))
                : [...currentValues, optionValue];
        } else {
            if (selected && !this.getAllowEmpty()) return;
            newValue = selected ? null : optionValue;
        }

        this.focusedIndex.set(index);
        this.updateValue(newValue, event);
        this.onOptionClickEvent.emit({ originalEvent: event, option, index });
    }

    onKeyDown(event: KeyboardEvent, option: any, index: number): void {
        if (this.actualDisabled()) return;

        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.onOptionClick(event, option, index);
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                this.navigate(1);
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                this.navigate(-1);
                break;
            case 'Home':
                event.preventDefault();
                this.focusButton(0);
                break;
            case 'End':
                event.preventDefault();
                this.focusButton((this.options()?.length || 0) - 1);
                break;
        }
    }

    private navigate(direction: number): void {
        const length = this.options()?.length || 0;
        if (length === 0) return;
        const current = this.focusedIndex();
        const nextIndex = (current + direction + length) % length;
        this.focusButton(nextIndex);
    }

    private focusButton(index: number): void {
        this.focusedIndex.set(index);
        this.buttons()[index]?.nativeElement.focus();
    }

    private updateValue(val: any, event?: Event): void {
        this.value.set(val);
        this.onModelChange(val);
        this.onModelTouched();
        this.onChangeEvent.emit({ originalEvent: event ?? new Event('change'), value: val });
    }

    // CVA METHODS
    writeValue(value: any): void {
        this.value.set(value);
    }

    registerOnChange(fn: any): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onModelTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.formsDisabled.set(isDisabled);
    }
}
