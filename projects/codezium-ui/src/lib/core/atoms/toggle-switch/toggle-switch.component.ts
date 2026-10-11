import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    ElementRef,
    input,
    Optional,
    output,
    Self,
    signal,
    TemplateRef,
    viewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';

export type CzToggleSwitchSize = 'sm' | 'md' | 'lg';

export interface CzToggleSwitchChangeEvent {
    originalEvent: Event;
    checked: boolean;
}

@Component({
    selector: 'cz-toggle-switch',
    imports: [CommonModule],
    templateUrl: './toggle-switch.component.html',
    styleUrl: './toggle-switch.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-toggle-switch',
        '[class.cz-toggle-switch--checked]': 'checked()',
        '[class.cz-toggle-switch--disabled]': 'actualDisabled()',
        '[class.cz-toggle-switch--has-error]': 'isInvalid',
        '[attr.data-size]': 'size()',
    },
})
export class CzToggleSwitchComponent implements ControlValueAccessor, AfterViewInit {
    /** Label displayed next to the switch */
    label = input<string>('');

    /** Switch size */
    size = input<CzToggleSwitchSize>('md');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Readonly state */
    readonly = input<boolean>(false);

    /** Value emitted when checked */
    trueValue = input<any>(true);

    /** Value emitted when unchecked */
    falseValue = input<any>(false);

    /** Accessible label */
    ariaLabel = input<string>('');

    /** Establishes relationships between the component and label(s) */
    ariaLabelledBy = input<string>('');

    /** When present, it specifies that the component should have invalid state style */
    invalid = input<boolean>(false);

    /** Identifier of the input element to match a label */
    inputId = input<string>('');

    /** Index of the element in tabbing order */
    tabindex = input<number>(0);

    /** When present, it specifies that the component should automatically get focus on load */
    autofocus = input<boolean>(false);

    /** Custom handle template (context: checked) */
    handleTemplate = contentChild<TemplateRef<any>>('handleTemplate');

    private readonly switchRef = viewChild<ElementRef<HTMLButtonElement>>('switchButton');

    /** Emitted on value change with the mapped value */
    onChange = output<any>();

    /** Internal checked state */
    checked = signal<boolean>(false);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    // CVA callbacks
    onModelChange: Function = (_: any) => {};
    onModelTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngAfterViewInit(): void {
        if (this.autofocus() && !this.actualDisabled()) {
            this.switchRef()?.nativeElement.focus();
        }
    }

    toggle(event?: Event): void {
        if (this.actualDisabled() || this.readonly()) {
            return;
        }

        const next = !this.checked();
        this.checked.set(next);
        const mapped = next ? this.trueValue() : this.falseValue();
        this.onModelChange(mapped);
        this.onModelTouched();
        this.onChange.emit(mapped);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggle(event);
        }
    }

    get isInvalid(): boolean {
        if (this.invalid()) return true;
        if (!this.ngControl) return false;
        return !!(this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty));
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        this.checked.set(value === this.trueValue());
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
