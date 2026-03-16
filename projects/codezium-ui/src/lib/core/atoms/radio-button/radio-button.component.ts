import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    ElementRef,
    forwardRef,
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
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface CzRadioButtonChangeEvent {
    /** The actual value that the model was updated to */
    value: any;
    /** Original browser event */
    originalEvent: Event;
}

export type CzRadioButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
export type CzRadioButtonSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'cz-radio-button',
    imports: [],
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CzRadioButtonComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.cz-radio-wrapper]': 'true',
        '[class.cz-radio--disabled]': 'isDisabled()',
        '[class.cz-radio--readonly]': 'readonly()',
        '[class.cz-radio--label-left]': 'isLabelLeft()',
        '[class.cz-radio--focused]': 'focused()'
    },
    encapsulation: ViewEncapsulation.None
})
export class CzRadioButtonComponent implements ControlValueAccessor, OnInit {
    private cdr = inject(ChangeDetectorRef);
    private injector = inject(Injector);
    private destroyRef = inject(DestroyRef);

    /** Lazy getter to bypass cyclical injection dependencies of NG_VALUE_ACCESSOR */
    public get ngControl(): NgControl | null {
        return this.injector.get(NgControl, null, { optional: true, self: true });
    }

    /** The value associated with this radio button */
    value = input.required<any>();
    /** Unique name for the radio group */
    name = input<string>('');
    /** Label to display next to the radio button */
    label = input<string>('');
    /** Label placement */
    labelPosition = input<'left' | 'right'>('right');
    /** Custom color variant */
    color = input<CzRadioButtonColor>('primary');
    /** Size variant */
    size = input<CzRadioButtonSize>('md');
    /** Disabled state */
    disabled = input<boolean>(false);
    /** Readonly state */
    readonly = input<boolean>(false);
    /** Helper text displayed below the component */
    helperText = input<string>('');

    /** Emit on interaction */
    onChangeEvent = output<CzRadioButtonChangeEvent>({ alias: 'onChange' });

    @ViewChild('rb') inputViewChild!: ElementRef<HTMLInputElement>;

    /* Form Control internal disabled state */
    private _formDisabled = signal<boolean>(false);
    
    /** Derived disabled state: true if either the input [disabled] is true or the FormControl is disabled */
    isDisabled = computed(() => this.disabled() || this._formDisabled());
    
    /** Determines if the label should be on the left */
    isLabelLeft = computed(() => this.labelPosition() === 'left');

    /* ControlValueAccessor internal model */
    model = signal<any>(null);
    focused = signal<boolean>(false);

    // NgModel / Reactive forms standard callbacks
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    ngOnInit() {
        if (this.ngControl && this.ngControl.control) {
            // Subscribe to live form changes to reflect identical global state.
            this.ngControl.control.valueChanges.pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe((val: any) => {
                this.model.set(val);
                this.cdr.markForCheck();
            });
        }
    }

    /** Returns true if this specific radio is checked against the model */
    readonly checked = computed(() => this.model() === this.value());

    onClick(event: Event) {
        if (this.isDisabled() || this.readonly() || this.checked()) {
            return;
        }

        this.select(event);
        
        if (this.inputViewChild) {
            this.inputViewChild.nativeElement.focus();
        }
    }

    onInputChange(event: Event) {
        this.select(event);
    }

    private select(event: Event) {
        const newValue = this.value();
        this.model.set(newValue);
        this.onModelChange(newValue);
        this.onChangeEvent.emit({
            value: newValue,
            originalEvent: event
        });
        this.cdr.markForCheck();
    }

    /* ── Events ── */
    onFocus() {
        this.focused.set(true);
    }

    onBlur() {
        this.focused.set(false);
        this.onModelTouched();
    }

    /* ── ControlValueAccessor Implementation ── */
    writeValue(value: any): void {
        this.model.set(value);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
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

    /** Helper for validation states in template */
    get isInvalid(): boolean {
        return !!(this.ngControl && this.ngControl.invalid && (this.ngControl.dirty || this.ngControl.touched));
    }
}
