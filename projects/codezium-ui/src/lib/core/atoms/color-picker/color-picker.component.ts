import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    Optional,
    Self,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CzInputSize } from '../../types';

@Component({
    selector: 'cz-color-picker',
    imports: [CommonModule],
    templateUrl: './color-picker.component.html',
    styleUrl: './color-picker.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-color-picker',
        '[class.cz-color-picker--disabled]': 'actualDisabled()',
        '[attr.data-size]': 'size()',
    },
})
export class CzColorPickerComponent implements ControlValueAccessor {
    /** Current color value (hex string) */
    value = signal<string>('#000000');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Component size */
    size = input<CzInputSize>('md');

    /** Shows the hex value next to the swatch */
    showValue = input<boolean>(true);

    /** Accessible label */
    ariaLabel = input<string>('Color');

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    onInputChange(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
        this.value.set(val);
        this.onChange(val);
    }

    onBlur(): void {
        this.onTouched();
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        if (typeof value === 'string' && value.length > 0) {
            this.value.set(value);
        }
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
