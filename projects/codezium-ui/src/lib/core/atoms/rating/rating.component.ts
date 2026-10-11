import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    contentChild,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    Injector,
    input,
    OnInit,
    output,
    signal,
    TemplateRef,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideDynamicIcon, LucideStar, LucideStarOff, type LucideIconInput } from '@lucide/angular';

export interface CzRatingChangeEvent {
    /** The actual value that the model was updated to */
    value: number | null;
    /** Original browser event */
    originalEvent: Event;
}

/** PrimeNG-compatible alias for the rate event payload */
export type CzRatingRateEvent = CzRatingChangeEvent;

export interface CzRatingIconTemplateContext {
    /** 1-based star index */
    $implicit: number;
    /** Class name of the icon wrapper */
    class: string;
}

export type CzRatingColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
export type CzRatingSize = 'sm' | 'md' | 'lg';
export type CzRatingOrientation = 'horizontal' | 'vertical';

let ratingUid = 0;

@Component({
    selector: 'cz-rating',
    imports: [CommonModule, FormsModule, LucideDynamicIcon],
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
        '[class.cz-rating--invalid]': 'isInvalid()',
        '[class.cz-rating--label-left]': 'labelPosition() === "left"',
        '[attr.data-size]': 'size()',
        '[attr.data-orientation]': 'orientation()',
        '(pointerenter)': 'onPointerEnter()',
        '(pointerleave)': 'onPointerLeave()'
    },
    encapsulation: ViewEncapsulation.None
})
export class CzRatingComponent implements ControlValueAccessor, OnInit, AfterViewInit {
    private cdr = inject(ChangeDetectorRef);
    private injector = inject(Injector);
    private destroyRef = inject(DestroyRef);
    private el = inject(ElementRef<HTMLElement>);

    /** Number of stars to display */
    stars = input<number>(5);
    /** Readonly state */
    readonly = input<boolean>(false);
    /** Disabled state */
    disabled = input<boolean>(false);
    /** When present, it specifies that the component should have invalid state style */
    invalid = input<boolean>(false);
    /** Name of the radio group */
    name = input<string | undefined>(undefined);
    /** Whether the component should automatically get focus on load */
    autofocus = input<boolean>(false);
    /** When present, selecting half stars is allowed */
    allowHalf = input<boolean>(false);
    /** Orientation of the component */
    orientation = input<CzRatingOrientation>('horizontal');
    /** Icon for unchecked state */
    iconOff = input<LucideIconInput>(LucideStarOff);
    /** Icon for checked state */
    iconOn = input<LucideIconInput>(LucideStar);
    /** Style class of the on icon */
    iconOnClass = input<string | undefined>(undefined);
    /** Inline style of the on icon */
    iconOnStyle = input<Record<string, any> | null | undefined>(undefined);
    /** Style class of the off icon */
    iconOffClass = input<string | undefined>(undefined);
    /** Inline style of the off icon */
    iconOffStyle = input<Record<string, any> | null | undefined>(undefined);
    /** Color variant */
    color = input<CzRatingColor>('primary');
    /** Component size */
    size = input<CzRatingSize>('md');
    /** Label text */
    label = input<string>('');
    /** Label position */
    labelPosition = input<'left' | 'right'>('right');

    /** Emit on value change */
    onRateEvent = output<CzRatingRateEvent>({ alias: 'onRate' });
    /** Backwards compatible alias of onRate */
    onChangeEvent = output<CzRatingChangeEvent>({ alias: 'onChange' });
    /** Emit when the rating receives focus */
    onFocusEvent = output<FocusEvent>({ alias: 'onFocus' });
    /** Emit when the rating loses focus */
    onBlurEvent = output<FocusEvent>({ alias: 'onBlur' });

    /** Custom on icon template */
    onIconTemplate = contentChild<TemplateRef<CzRatingIconTemplateContext>>('onicon');
    /** Custom off icon template */
    offIconTemplate = contentChild<TemplateRef<CzRatingIconTemplateContext>>('officon');

    /* Form Control internal disabled state */
    private _formDisabled = signal<boolean>(false);

    /** Derived disabled state */
    isDisabled = computed(() => this.disabled() || this._formDisabled());

    /* ControlValueAccessor internal model */
    value = signal<number | null>(null);

    /* Interaction state */
    hovering = signal<boolean>(false);
    hoveringValue = signal<number>(0);
    focusedStar = signal<number | null>(null);

    /** Unique fallback name so radio groups never leak across instances */
    private generatedName = `cz-rating-${++ratingUid}`;

    /** Name applied to the hidden radio inputs */
    inputName = computed(() => this.name() ?? this.generatedName);

    /** Value currently displayed (hover takes precedence over the model) */
    activeValue = computed(() => (this.hovering() ? this.hoveringValue() : this.value() ?? 0));

    /** Internal array for star iteration (1-based) */
    starsArray = computed(() => Array.from({ length: this.stars() }, (_, i) => i + 1));

    /** Derived icon size based on component size */
    iconSize = computed(() => {
        switch (this.size()) {
            case 'sm': return 16;
            case 'lg': return 32;
            default: return 24;
        }
    });

    /** Combined invalid state (explicit input or Angular forms validation) */
    isInvalid = computed(() =>
        this.invalid() || !!(this.ngControl && this.ngControl.invalid && (this.ngControl.dirty || this.ngControl.touched))
    );

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

    ngAfterViewInit() {
        if (this.autofocus() && !this.isDisabled() && !this.readonly()) {
            const input = (this.el.nativeElement as HTMLElement).querySelector('.cz-rating-input:not([disabled])') as HTMLInputElement | null;
            input?.focus();
        }
    }

    /** Resolves the value represented by the pointer position (half stars support) */
    resolvePointerValue(event: MouseEvent, starIndex: number): number {
        if (this.allowHalf()) {
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            return (this.orientation() === 'vertical'
                ? event.clientY < rect.top + rect.height / 2
                : event.clientX < rect.left + rect.width / 2)
                ? starIndex + 0.5
                : starIndex + 1;
        }
        return starIndex + 1;
    }

    onOptionClick(event: MouseEvent, star: number) {
        if (this.isDisabled() || this.readonly()) {
            return;
        }

        const target = event.target as HTMLElement | null;
        if (target && target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'radio') {
            return;
        }

        const value = this.allowHalf() ? this.resolvePointerValue(event, star - 1) : star;
        this.selectValue(event, value);
    }

    onInputChange(event: Event, value: number) {
        this.selectValue(event, value);
    }

    private selectValue(event: Event, value: number) {
        if (this.isDisabled() || this.readonly()) {
            return;
        }

        if (value === this.value()) {
            this.focusedStar.set(null);
            this.updateValue(event, null);
        } else {
            this.focusedStar.set(value);
            this.updateValue(event, value);
        }
    }

    onPointerMove(event: MouseEvent, starIndex: number) {
        if (this.isDisabled() || this.readonly()) {
            return;
        }
        this.hovering.set(true);
        this.hoveringValue.set(this.resolvePointerValue(event, starIndex));
    }

    onPointerEnter() {
        if (!this.isDisabled() && !this.readonly()) {
            this.hovering.set(true);
        }
    }

    onPointerLeave() {
        if (!this.isDisabled() && !this.readonly()) {
            this.hovering.set(false);
            this.hoveringValue.set(0);
        }
    }

    onInputFocus(event: FocusEvent, value: number) {
        if (this.isDisabled() || this.readonly()) {
            return;
        }
        this.focusedStar.set(value);
        this.hovering.set(true);
        this.hoveringValue.set(value);
        this.onFocusEvent.emit(event);
    }

    onInputBlur(event: FocusEvent) {
        this.focusedStar.set(null);
        const next = event.relatedTarget as Node | null;
        if (!next || !this.el.nativeElement.contains(next)) {
            this.hovering.set(false);
            this.hoveringValue.set(0);
        }
        this.onModelTouched();
        this.onBlurEvent.emit(event);
    }

    isHighlighted(starIndex: number): boolean {
        return starIndex < this.activeValue();
    }

    isHalf(starIndex: number): boolean {
        return this.allowHalf() && this.activeValue() === starIndex + 0.5;
    }

    starAriaLabel(value: number): string {
        return value === 1 ? '1 star' : `${value} stars`;
    }

    onIconContext(star: number): CzRatingIconTemplateContext {
        return { $implicit: star, class: 'cz-rating-on-icon' };
    }

    offIconContext(star: number): CzRatingIconTemplateContext {
        return { $implicit: star, class: 'cz-rating-off-icon' };
    }

    private updateValue(event: Event, newValue: number | null) {
        if (this.value() !== newValue) {
            this.value.set(newValue);
            this.onModelChange(newValue);
            const payload: CzRatingChangeEvent = { value: newValue, originalEvent: event };
            this.onChangeEvent.emit(payload);
            this.onRateEvent.emit(payload);
            this.cdr.markForCheck();
        }
        this.onModelTouched();
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
}
