import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    DestroyRef,
    forwardRef,
    inject,
    Injector,
    input,
    OnInit,
    output,
    signal,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, Star, StarOff, XCircle } from 'lucide-angular';

export interface CzRatingChangeEvent {
    /** The actual value that the model was updated to */
    value: number | null;
    /** Original browser event */
    originalEvent: Event;
}

export type CzRatingColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
export type CzRatingSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'cz-rating',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CzRatingComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.cz-rating]': 'true',
        '[class.cz-rating--disabled]': 'isDisabled()',
        '[class.cz-rating--readonly]': 'readonly()',
        '[class.cz-rating--invalid]': 'isInvalid',
        '[class.cz-rating--label-left]': 'labelPosition() === "left"',
        '[attr.data-size]': 'size()'
    },
    encapsulation: ViewEncapsulation.None
})
export class CzRatingComponent implements ControlValueAccessor, OnInit {
    private cdr = inject(ChangeDetectorRef);
    private injector = inject(Injector);
    private destroyRef = inject(DestroyRef);

    /** Number of stars to display */
    stars = input<number>(5);
    /** Readonly state */
    readonly = input<boolean>(false);
    /** Disabled state */
    disabled = input<boolean>(false);
    /** Whether to show the cancel button */
    cancel = input<boolean>(true);
    /** Icon for unchecked state */
    iconOff = input<any>(StarOff);
    /** Icon for checked state */
    iconOn = input<any>(Star);
    /** Icon for cancel button */
    iconCancel = input<any>(XCircle);
    /** Color variant */
    color = input<CzRatingColor>('primary');
    /** Component size */
    size = input<CzRatingSize>('md');
    /** Label text */
    label = input<string>('');
    /** Label position */
    labelPosition = input<'left' | 'right'>('right');

    /** Emit on value change */
    onChangeEvent = output<CzRatingChangeEvent>({ alias: 'onChange' });
    /** Emit when the cancel button is clicked */
    onCancelEvent = output<Event>({ alias: 'onCancel' });

    /* Form Control internal disabled state */
    private _formDisabled = signal<boolean>(false);
    
    /** Derived disabled state */
    isDisabled = computed(() => this.disabled() || this._formDisabled());

    /* ControlValueAccessor internal model */
    value = signal<number | null>(null);

    /* Interaction state */
    hoveredValue = signal<number | null>(null);
    focusedStar = signal<number | null>(null);

    /** Internal array for star iteration */
    starsArray = computed(() => Array.from({ length: this.stars() }, (_, i) => i + 1));

    /** Derived icon size based on component size */
    iconSize = computed(() => {
        switch (this.size()) {
            case 'sm': return 16;
            case 'lg': return 32;
            default: return 24;
        }
    });

    // NgModel / Reactive forms standard callbacks
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    public get ngControl(): NgControl | null {
        return this.injector.get(NgControl, null, { optional: true, self: true });
    }

    ngOnInit() {
        if (this.ngControl && this.ngControl.control) {
            this.ngControl.control.valueChanges.pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe((val: any) => {
                this.value.set(val);
                this.cdr.markForCheck();
            });
        }
    }

    onStarClick(event: Event, value: number) {
        if (this.isDisabled() || this.readonly()) {
            return;
        }

        this.updateValue(event, value);
    }

    onCancelClick(event: Event) {
        if (this.isDisabled() || this.readonly()) {
            return;
        }

        this.updateValue(event, null);
        this.onCancelEvent.emit(event);
    }

    onStarMouseEnter(value: number) {
        if (this.isDisabled() || this.readonly()) {
            return;
        }
        this.hoveredValue.set(value);
    }

    onMouseLeave() {
        this.hoveredValue.set(null);
    }

    onStarFocus(value: number) {
        this.focusedStar.set(value);
    }

    onStarBlur() {
        this.focusedStar.set(null);
        this.onModelTouched();
    }

    onKeyDown(event: KeyboardEvent, value: number) {
        if (this.isDisabled() || this.readonly()) {
            return;
        }

        switch (event.key) {
            case 'Enter':
            case ' ':
                this.updateValue(event, value);
                event.preventDefault();
                break;
            case 'ArrowLeft':
            case 'ArrowDown':
                if (value > 1) {
                    this.updateValue(event, value - 1);
                } else if (value === 1 && this.cancel()) {
                    this.updateValue(event, null);
                }
                event.preventDefault();
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                if (value < this.stars()) {
                    this.updateValue(event, value + 1);
                }
                event.preventDefault();
                break;
        }
    }

    private updateValue(event: Event, newValue: number | null) {
        if (this.value() !== newValue) {
            this.value.set(newValue);
            this.onModelChange(newValue);
            this.onChangeEvent.emit({
                value: newValue,
                originalEvent: event
            });
            this.cdr.markForCheck();
        }
    }

    /* ── ControlValueAccessor Implementation ── */
    writeValue(value: any): void {
        this.value.set(value);
        this.cdr.markForCheck();
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
