import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    ElementRef,
    forwardRef,
    HostBinding,
    inject,
    input,
    output,
    signal,
    ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface CzCheckboxChangeEvent {
    /** The state of the checkbox after the interaction */
    checked: boolean;
    /** The actual value that the model was updated to (boolean, string, array, etc) */
    value: any;
    /** Original browser event */
    originalEvent: Event;
}

export type CzCheckboxColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
export type CzCheckboxSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'cz-checkbox',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CzCheckboxComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.cz-checkbox-wrapper]': 'true',
        '[class.cz-checkbox--disabled]': 'disabled()',
        '[class.cz-checkbox--readonly]': 'readonly()',
    }
})
export class CzCheckboxComponent implements ControlValueAccessor {
    private cdr = inject(ChangeDetectorRef);

    /** The value of the checkbox when interacting in a group (Array mode) */
    value = input<any>();
    label = input<string>('');
    /** If true, the bound value is a boolean or matching trueValue/falseValue. If false, binds to an array. */
    binary = input<boolean>(false);
    disabled = input<boolean>(false);
    readonly = input<boolean>(false);

    /** Value to return if binary=true and the checkbox is checked */
    trueValue = input<any>(true);
    /** Value to return if binary=true and the checkbox is unchecked */
    falseValue = input<any>(false);

    color = input<CzCheckboxColor>('primary');
    size = input<CzCheckboxSize>('md');

    /** Emit on interaction */
    onChangeEvent = output<CzCheckboxChangeEvent>({ alias: 'onChange' });

    @ViewChild('cb') inputViewChild!: ElementRef<HTMLInputElement>;

    /* ControlValueAccessor internal model */
    model = signal<any>(null);
    focused = false;

    // NgModel / Reactive forms standard callbacks
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    /* ── Computed State ── */

    /** Returns true if this specific box is structurally verified as checked against the model */
    readonly checked = computed(() => {
        if (this.binary()) {
            return this.model() === this.trueValue();
        } else {
            if (this.model() && Array.isArray(this.model())) {
                return this.model().includes(this.value());
            }
        }
        return false;
    });

    /** View classes mapping */
    readonly boxClasses = computed(() => {
        return {
            'cz-checkbox-box': true,
            'cz-checkbox-box--checked': this.checked(),
            'cz-checkbox-box--focused': this.focused,
            [`cz-checkbox-box--${this.color()}`]: true,
            [`cz-checkbox-box--${this.size()}`]: true
        };
    });

    onClick(event: Event, focus: boolean = true) {
        event.preventDefault(); // Prevent standard click behavior, we handle the model

        if (this.disabled() || this.readonly()) {
            return;
        }

        this.updateModel(event);

        if (focus && this.inputViewChild) {
            this.inputViewChild.nativeElement.focus();
        }
    }

    onSpaceKey(event: KeyboardEvent) {
        if (this.disabled() || this.readonly()) {
            return;
        }
        this.updateModel(event);
        event.preventDefault();
    }

    private updateModel(event: Event) {
        let newModelValue: any;

        if (this.binary()) {
            // Binary Boolean-style flip
            newModelValue = this.checked() ? this.falseValue() : this.trueValue();
        } else {
            // Array-style logic
            if (this.checked()) {
                // Remove value
                if (Array.isArray(this.model())) {
                    newModelValue = this.model().filter((val: any) => val !== this.value());
                } else {
                    newModelValue = [];
                }
            } else {
                // Add value
                newModelValue = this.model() ? [...this.model(), this.value()] : [this.value()];
            }
        }

        // Apply new model internal
        this.model.set(newModelValue);

        // Emit forms & Component boundaries
        this.onModelChange(this.model());
        this.onChangeEvent.emit({
            checked: this.checked(),
            value: this.model(),
            originalEvent: event
        });

        // Ensure UI updates in OnPush
        this.cdr.markForCheck();
    }

    /* ── Events ── */
    onFocus() {
        this.focused = true;
    }

    onBlur() {
        this.focused = false;
        this.onModelTouched();
    }

    /* ── ControlValueAccessor Implementation ── */
    writeValue(value: any): void {
        this.model.set(value);
        this.cdr.markForCheck(); // Trigger reactive detection internally inside onPush
        this.cdr.detectChanges(); // Force synchronous detection for initial forms setup (crucial for Tests & SSR)
    }

    registerOnChange(fn: any): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean): void {
        // Ignored here because we rely on the strictly decoupled 'disabled = input()' 
        // Signal for physical boundaries. However, form-level disable events 
        // can be passed up optionally.
        this.cdr.markForCheck();
    }
}
