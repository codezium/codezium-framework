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
    ViewChild,
    Injector,
    OnInit,
    DestroyRef,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface CzCheckboxChangeEvent {
    /** The state of the checkbox after the interaction */
    checked: boolean;
    /** The actual value that the model was updated to (boolean, string, array, etc) */
    value: any;
    /** Original browser event */
    originalEvent: Event;
}

export type CzCheckboxColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
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
        '[class.cz-checkbox--disabled]': 'isDisabled()',
        '[class.cz-checkbox--readonly]': 'readonly()',
    },
    encapsulation: ViewEncapsulation.None
})
export class CzCheckboxComponent implements ControlValueAccessor, OnInit {
    private cdr = inject(ChangeDetectorRef);
    private injector = inject(Injector);
    private destroyRef = inject(DestroyRef);

    /** Lazy getter to bypass cyclical injection dependencies of NG_VALUE_ACCESSOR */
    private get ngControl(): NgControl | null {
        return this.injector.get(NgControl, null, { optional: true, self: true });
    }

    /** The value of the checkbox when interacting in a group (Array mode) */
    value = input<any>();
    label = input<string>('');
    /** If true, the bound value is a boolean or matching trueValue/falseValue. If false, binds to an array. */
    binary = input<boolean>(false);
    disabled = input<boolean>(false);
    readonly = input<boolean>(false);

    /* Form Control internal disabled state */
    _formDisabled = signal<boolean>(false);

    /** Derived disabled state: true if either the input [disabled] is true or the FormControl is disabled */
    isDisabled = computed(() => this.disabled() || this._formDisabled());

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

    ngOnInit() {
        if (this.ngControl && this.ngControl.control) {
            // Subscribe to live form changes to bypass Angular's identical CVA overwrite bug
            // ensuring all matching checkboxes always reflect identical global state.
            this.ngControl.control.valueChanges.pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe((val: any) => {
                this.model.set(val);
                this.cdr.markForCheck();
            });
        }
    }

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

        if (this.isDisabled() || this.readonly()) {
            return;
        }

        this.updateModel(event);

        if (focus && this.inputViewChild) {
            this.inputViewChild.nativeElement.focus();
        }
    }

    onSpaceKey(event: KeyboardEvent) {
        if (this.isDisabled() || this.readonly()) {
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
            // Array-style logic (Always read from the live Forms Control if active to bypass identical-name access bugs)
            let rawFormArray = this.ngControl?.control?.value ?? this.model();
            let currentModel = Array.isArray(rawFormArray) ? rawFormArray : [];

            if (this.checked()) {
                // Remove value
                newModelValue = currentModel.filter((val: any) => val !== this.value());
            } else {
                // Add value
                newModelValue = [...currentModel, this.value()];
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
        this._formDisabled.set(val);
        this.cdr.markForCheck();
    }
}
