import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    HostListener,
    inject,
    input,
    model,
    Optional,
    output,
    Self,
    signal,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CZ_VALIDATION_MESSAGES, CzValidationLocale, CzValidationErrorKeys } from '../../i18n';

export type CzKnobTheme = 'base' | 'glass' | 'neo';
export type CzKnobColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';

@Component({
    selector: 'cz-knob',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './knob.component.html',
    styleUrl: './knob.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-knob',
        '[class.cz-knob--disabled]': 'actualDisabled()',
        '[class.cz-knob--readonly]': 'readOnly()',
        '[class.cz-knob--has-error]': 'isInvalid',
        '[attr.data-size]': 'size()',
        '[attr.data-color]': 'color()',
        '[attr.data-theme]': 'theme()',
        '[attr.tabindex]': 'actualDisabled() ? -1 : 0'
    }
})
export class CzKnobComponent implements ControlValueAccessor {
    private readonly el = inject(ElementRef);

    /** Current value of the knob */
    value = model<number>(0);

    /** Minimum value */
    min = input<number>(0);

    /** Maximum value */
    max = input<number>(100);

    /** Step factor */
    step = input<number>(1);

    /** Size in pixels */
    size = input<number>(100);

    /** Stroke width of the circle */
    strokeWidth = input<number>(14);

    /** Whether to show the value in the center */
    showValue = input<boolean>(true);

    /** Template string for the displayed value (e.g., '{value}%') */
    valueTemplate = input<string>('{value}');

    /** Read-only state */
    readOnly = input<boolean>(false);

    /** Disabled state */
    disabled = model<boolean>(false);

    /** Color variant */
    color = input<CzKnobColor>('primary');

    /** Design theme */
    theme = input<CzKnobTheme>('base');

    /** Helper text below the component */
    helperText = input<string>('');

    /** Whether to show validation errors automatically */
    showErrors = input<boolean>(true);

    /** Current validation locale */
    locale = input<CzValidationLocale>('es');

    /** Custom error message overrides */
    customErrors = input<Partial<CzValidationErrorKeys>>();

    /** Callback for value change */
    onChange = output<number>();

    @ViewChild('svgContainer') svgContainer!: ElementRef<SVGElement>;

    private isDragging = signal(false);
    private formsDisabled = signal(false);

    // ControlValueAccessor implementations
    onModelChange: Function = (_: any) => { };
    onModelTouched: Function = () => { };

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    radius = computed(() => 50 - this.strokeWidth() / 2);
    circumference = computed(() => 2 * Math.PI * this.radius());
    
    // We use a 270 degree arc (from 135 to 405)
    dashArray = computed(() => {
        const c = this.circumference();
        return `${(270 / 360) * c} ${c}`;
    });

    dashOffset = computed(() => {
        const c = this.circumference();
        const range = this.max() - this.min();
        const relativeValue = Math.min(Math.max(this.value() - this.min(), 0), range);
        const percentage = relativeValue / range;
        return (270 / 360) * c * (1 - percentage);
    });

    handleX = computed(() => {
        const range = this.max() - this.min();
        const percentage = (this.value() - this.min()) / range;
        const angle = (135 + (percentage * 270)) * Math.PI / 180;
        return 50 + this.radius() * Math.cos(angle);
    });

    handleY = computed(() => {
        const range = this.max() - this.min();
        const percentage = (this.value() - this.min()) / range;
        const angle = (135 + (percentage * 270)) * Math.PI / 180;
        return 50 + this.radius() * Math.sin(angle);
    });

    formattedValue = computed(() => {
        return this.valueTemplate().replace('{value}', this.value().toString());
    });

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

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        if (this.actualDisabled() || this.readOnly()) return;
        this.isDragging.set(true);
        this.updateValueFromEvent(event);
        this.onModelTouched();
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.isDragging()) {
            this.updateValueFromEvent(event);
        }
    }

    @HostListener('window:mouseup')
    onMouseUp() {
        this.isDragging.set(true);
        this.isDragging.set(false);
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent) {
        if (this.actualDisabled() || this.readOnly()) return;
        this.isDragging.set(true);
        this.updateValueFromEvent(event.touches[0]);
        this.onModelTouched();
    }

    @HostListener('window:touchmove', ['$event'])
    onTouchMove(event: TouchEvent) {
        if (this.isDragging()) {
            event.preventDefault();
            this.updateValueFromEvent(event.touches[0]);
        }
    }

    @HostListener('window:touchend')
    onTouchEnd() {
        this.isDragging.set(false);
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.actualDisabled() || this.readOnly()) return;
        
        let newValue = this.value();
        if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
            newValue += this.step();
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
            newValue -= this.step();
        } else if (event.key === 'Home') {
            newValue = this.min();
        } else if (event.key === 'End') {
            newValue = this.max();
        } else {
            return;
        }

        event.preventDefault();
        this.updateValue(newValue);
    }

    private updateValueFromEvent(event: any) {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = event.clientX - centerX;
        const dy = event.clientY - centerY;
        
        // Calculate angle in degrees (0 is right, 90 is bottom)
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Adjust angle to 0-360 starting from 0 (right)
        angle = (angle + 360) % 360;
        
        // Our knob goes from 135 to 405 (which is 135 to 45 mod 360)
        // Normalize angle so 135 is 0 and 405 is 270
        let normalizedAngle = (angle - 135 + 360) % 360;
        
        if (normalizedAngle > 270) {
            // Gap area. Snap to nearest boundary.
            normalizedAngle = normalizedAngle > 315 ? 0 : 270;
        }

        const range = this.max() - this.min();
        const percentage = normalizedAngle / 270;
        const rawValue = this.min() + percentage * range;
        
        // Round to nearest step
        const steppedValue = Math.round(rawValue / this.step()) * this.step();
        this.updateValue(steppedValue);
    }

    private updateValue(val: number) {
        const clampedValue = Math.min(Math.max(val, this.min()), this.max());
        if (clampedValue !== this.value()) {
            this.value.set(clampedValue);
            this.onModelChange(clampedValue);
            this.onChange.emit(clampedValue);
        }
    }

    // CVA METHODS
    writeValue(value: any): void {
        this.value.set(value || 0);
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
