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
    signal, 
    ViewEncapsulation 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';

export type CzToggleButtonSize = 'sm' | 'md' | 'lg';
export type CzToggleButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
export type CzToggleButtonTheme = 'base' | 'glass' | 'neo';

@Component({
    selector: 'cz-toggle-button',
    imports: [CommonModule],
    templateUrl: './toggle-button.component.html',
    styleUrl: './toggle-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-toggle-button',
        '[class.cz-toggle-button--checked]': 'checked()',
        '[class.cz-toggle-button--disabled]': 'actualDisabled()',
        '[class.cz-toggle-button--readonly]': 'readonly()',
        '[class.cz-toggle-button--has-error]': 'isInvalid',
        '[attr.data-size]': 'size()',
        '[attr.data-color]': 'color()',
        '[attr.data-theme]': 'theme()'
    }
})
export class CzToggleButtonComponent implements ControlValueAccessor {
    /** Label for the On state */
    onLabel = input<string>('On');

    /** Label for the Off state */
    offLabel = input<string>('Off');

    /** Icon for the On state */
    onIcon = input<string>('');

    /** Icon for the Off state */
    offIcon = input<string>('');

    /** Size of the component */
    size = input<CzToggleButtonSize>('md');

    /** Color variant */
    color = input<CzToggleButtonColor>('primary');

    /** Design theme */
    theme = input<CzToggleButtonTheme>('base');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Readonly state */
    readonly = input<boolean>(false);

    /** Label for the component group */
    label = input<string>('');

    /** Position of the label relative to the button */
    labelPosition = input<'top' | 'left' | 'right'>('top');

    /** Supporting text below the component */
    helperText = input<string>('');

    /** Current validation locale */
    locale = input<CzValidationLocale>('es');

    /** Custom error message overrides */
    customErrors = input<Partial<CzValidationErrorKeys>>();

    /** ARIA labels for accessibility */
    ariaLabel = input<string>('');
    ariaLabelledBy = input<string>('');

    /** Output for selection change */
    onChange = output<boolean>();

    /** Internal state of the button */
    checked = signal<boolean>(false);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    // CVA callbacks
    onModelChange: Function = (_: any) => { };
    onModelTouched: Function = () => { };

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    /* ── UI Logic ── */

    toggle(event: Event): void {
        if (this.actualDisabled() || this.readonly()) {
            return;
        }

        const newValue = !this.checked();
        this.checked.set(newValue);
        this.onModelChange(newValue);
        this.onModelTouched();
        this.onChange.emit(newValue);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggle(event);
        }
    }

    /* ── Validation Layer ── */

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

    /* ── ControlValueAccessor Implementation ── */

    writeValue(value: boolean): void {
        this.checked.set(!!value);
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
