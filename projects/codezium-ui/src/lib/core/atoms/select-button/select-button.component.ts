import { 
    ChangeDetectionStrategy, 
    Component, 
    computed, 
    inject,
    input, 
    model, 
    Optional,
    output, 
    Self,
    ViewEncapsulation,
    signal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';

export type CzSelectButtonSize = 'sm' | 'md' | 'lg';
export type CzSelectButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
export type CzSelectButtonLabelPosition = 'left' | 'right' | 'top';

@Component({
    selector: 'cz-select-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './select-button.component.html',
    styleUrl: './select-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-select-button',
        '[class.cz-select-button--disabled]': 'disabled()',
        '[class.cz-select-button--label-left]': 'labelPosition() === "left"',
        '[class.cz-select-button--label-right]': 'labelPosition() === "right"',
        '[class.cz-select-button--has-error]': 'isInvalid',
        '[attr.data-size]': 'size()',
        '[attr.data-color]': 'color()'
    }
})
export class CzSelectButtonComponent implements ControlValueAccessor {
    /** Array of options to display */
    options = input.required<any[]>();

    /** Property name or getter function to use as the label of an option */
    optionLabel = input<string>();

    /** Property name or getter function to use as the value of an option */
    optionValue = input<string>();

    /** Whether to allow multiple selection */
    multiple = input<boolean>(false);

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

    /** Helper text to display below the component */
    helperText = input<string>('');

    /** Whether to show validation errors automatically */
    showErrors = input<boolean>(true);

    /** Current validation locale */
    locale = input<CzValidationLocale>('es');

    /** Custom error message overrides */
    customErrors = input<Partial<CzValidationErrorKeys>>();

    /** Callback for selection change */
    onChange = output<any>();

    /** Internal value state */
    value = signal<any>(null);

    /** Track focused option for keyboard navigation */
    focusedIndex = signal<number>(-1);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Computed disabled state combining both inputs */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    // ControlValueAccessor implementations
    onModelChange: Function = (_: any) => { };
    onModelTouched: Function = () => { };

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    /** Validation helpers */
    get isInvalid(): boolean {
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
        if (this.optionLabel()) {
            return option[this.optionLabel()!];
        }
        return option;
    }

    getValue(option: any): any {
        if (this.optionValue()) {
            return option[this.optionValue()!];
        }
        return option;
    }

    isSelected(option: any): boolean {
        const optionValue = this.getValue(option);
        const currentValue = this.value();

        if (this.multiple()) {
            return Array.isArray(currentValue) && currentValue.includes(optionValue);
        }

        return currentValue === optionValue;
    }

    onOptionClick(event: Event, option: any, index: number): void {
        if (this.actualDisabled()) return;

        const optionValue = this.getValue(option);
        let newValue: any;

        if (this.multiple()) {
            const currentValues = Array.isArray(this.value()) ? [...this.value()] : [];
            const valueIndex = currentValues.indexOf(optionValue);

            if (valueIndex > -1) {
                currentValues.splice(valueIndex, 1);
            } else {
                currentValues.push(optionValue);
            }
            newValue = currentValues;
        } else {
            newValue = this.value() === optionValue ? null : optionValue;
        }

        this.updateValue(newValue);
        this.focusedIndex.set(index);
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
        }
    }

    private navigate(direction: number): void {
        const length = this.options()?.length || 0;
        if (length === 0) return;

        const nextIndex = (this.focusedIndex() + direction + length) % length;
        this.focusedIndex.set(nextIndex);
        
        // Focus the button in the DOM
        const buttons = document.querySelectorAll('.cz-select-button-option');
        if (buttons[nextIndex]) {
            (buttons[nextIndex] as HTMLElement).focus();
        }
    }

    private updateValue(val: any): void {
        this.value.set(val);
        this.onModelChange(val);
        this.onModelTouched();
        this.onChange.emit(val);
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
