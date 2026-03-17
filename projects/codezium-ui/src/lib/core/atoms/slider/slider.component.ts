import { 
    ChangeDetectionStrategy, 
    Component, 
    computed, 
    ElementRef, 
    forwardRef, 
    inject, 
    input, 
    model, 
    OnDestroy, 
    OnInit, 
    Optional, 
    output, 
    Renderer2, 
    Self, 
    signal, 
    ViewChild, 
    ViewEncapsulation 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';

export type CzSliderOrientation = 'horizontal' | 'vertical';
export type CzSliderTheme = 'base' | 'glass' | 'neo';

@Component({
    selector: 'cz-slider',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './slider.component.html',
    styleUrl: './slider.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-slider',
        '[class.cz-slider--disabled]': 'disabled()',
        '[class.cz-slider--vertical]': 'orientation() === "vertical"',
        '[class.cz-slider--range]': 'range()',
        '[class.cz-slider--has-error]': 'isInvalid',
        '[attr.data-theme]': 'theme()',
        '[attr.data-color]': 'color()'
    }
})
export class CzSliderComponent implements OnInit, OnDestroy, ControlValueAccessor {
    private readonly el = inject(ElementRef);
    private readonly renderer = inject(Renderer2);

    /** Min value */
    min = input<number>(0);

    /** Max value */
    max = input<number>(100);

    /** Step increment */
    step = input<number>(1);

    /** Whether the slider is in range mode */
    range = input<boolean>(false);

    /** Orientation of the slider */
    orientation = input<CzSliderOrientation>('horizontal');

    /** Design theme */
    theme = input<CzSliderTheme>('base');

    /** Color variant */
    color = input<string>('primary');

    /** Label for the component */
    label = input<string>('');

    /** Supporting text below the slider */
    helperText = input<string>('');

    /** Disabled state */
    disabled = model<boolean>(false);

    /** Validation show control */
    showErrors = input<boolean>(true);

    /** Current validation locale */
    locale = input<CzValidationLocale>('es');

    /** Custom error message overrides */
    customErrors = input<Partial<CzValidationErrorKeys>>();

    /** Callback for value change */
    onChange = output<number | number[]>();

    @ViewChild('container') containerViewChild!: ElementRef;

    /** Internal value state (number for single, [number, number] for range) */
    value = signal<any>(0);

    /** Percentages for CSS positioning */
    handle1Pos = computed(() => this.calculatePercentage(this.getHandleValue(0)));
    handle2Pos = computed(() => this.calculatePercentage(this.getHandleValue(1)));

    rangeStart = computed(() => Math.min(this.handle1Pos(), this.handle2Pos()));
    rangeEnd = computed(() => Math.max(this.handle1Pos(), this.handle2Pos()));

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Actual disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    private draggingHandle: number | null = null;
    private dragListeners: Function[] = [];

    onModelChange: Function = (_: any) => { };
    onModelTouched: Function = () => { };

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnInit(): void {
        if (this.range() && !Array.isArray(this.value())) {
            this.value.set([this.min(), this.max()]);
        }
    }

    ngOnDestroy(): void {
        this.unbindDragEvents();
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

    onMouseDown(event: MouseEvent, index: number): void {
        if (this.actualDisabled()) return;
        event.preventDefault();
        event.stopPropagation();
        this.draggingHandle = index;
        this.bindDragEvents();
    }

    onHandleTouchStart(event: TouchEvent, index: number): void {
        if (this.actualDisabled()) return;
        event.preventDefault();
        event.stopPropagation();
        this.draggingHandle = index;
        this.bindDragEvents();
    }

    onContainerClick(event: MouseEvent): void {
        if (this.actualDisabled()) return;
        event.stopPropagation();
        
        const rect = this.containerViewChild.nativeElement.getBoundingClientRect();
        const newValue = this.getValueFromCoordinate(event.clientX, event.clientY, rect);
        
        if (this.range()) {
            const val = this.value();
            const currentArr = Array.isArray(val) ? val : [this.min(), this.max()];
            const dist0 = Math.abs(newValue - currentArr[0]);
            const dist1 = Math.abs(newValue - currentArr[1]);
            const index = dist0 < dist1 ? 0 : 1;
            this.updateHandleValue(index, newValue);
        } else {
            this.updateValue(newValue);
        }
        
        this.onModelTouched();
    }

    private bindDragEvents(): void {
        if (this.dragListeners.length === 0) {
            this.dragListeners = [
                this.renderer.listen('document', 'mousemove', (e) => this.onDrag(e)),
                this.renderer.listen('document', 'mouseup', () => this.onDragEnd()),
                this.renderer.listen('document', 'touchmove', (e) => this.onDrag(e.touches[0])),
                this.renderer.listen('document', 'touchend', () => this.onDragEnd()),
                this.renderer.listen('document', 'touchcancel', () => this.onDragEnd())
            ];
        }
    }

    private unbindDragEvents(): void {
        this.dragListeners.forEach(fn => fn());
        this.dragListeners = [];
    }

    private onDrag(event: any): void {
        if (this.draggingHandle === null) return;

        const rect = this.containerViewChild.nativeElement.getBoundingClientRect();
        const newValue = this.getValueFromCoordinate(event.clientX, event.clientY, rect);

        if (this.range()) {
            this.updateHandleValue(this.draggingHandle, newValue);
        } else {
            this.updateValue(newValue);
        }
    }

    private onDragEnd(): void {
        this.draggingHandle = null;
        this.unbindDragEvents();
        this.onModelTouched();
    }

    private getValueFromCoordinate(x: number, y: number, rect: DOMRect): number {
        let ratio: number;
        if (this.orientation() === 'horizontal') {
            ratio = (x - rect.left) / rect.width;
        } else {
            ratio = 1 - (y - rect.top) / rect.height;
        }

        ratio = Math.max(0, Math.min(1, ratio));
        const rawValue = this.min() + ratio * (this.max() - this.min());
        const steppedValue = Math.round(rawValue / this.step()) * this.step();
        
        // Clamp to decimals if step is decimal
        const precision = (this.step().toString().split('.')[1] || '').length;
        return parseFloat(steppedValue.toFixed(precision));
    }

    private updateHandleValue(index: number, val: number): void {
        const currentVals = [...this.value()];
        currentVals[index] = val;
        
        // Ensure range order if desired, or just allow crossover like PrimeNG? 
        // PrimeNG usually allows crossover but provides visual feedback.
        // Let's sort them for consistency unless dragging.
        // Actually, let's just emit and update.
        
        this.updateValue(currentVals);
    }

    private updateValue(val: any): void {
        this.value.set(val);
        this.onModelChange(val);
        this.onChange.emit(val);
    }

    private getHandleValue(index: number): number {
        const val = this.value();
        if (this.range()) {
            return Array.isArray(val) ? val[index] : (index === 0 ? this.min() : this.max());
        }
        return index === 0 ? val : 0;
    }

    private calculatePercentage(val: number): number {
        return ((val - this.min()) / (this.max() - this.min())) * 100;
    }

    // CVA METHODS
    writeValue(value: any): void {
        if (value === null || value === undefined) {
            this.value.set(this.range() ? [this.min(), this.max()] : this.min());
        } else {
            this.value.set(value);
        }
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
