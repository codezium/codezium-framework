import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    input,
    Optional,
    QueryList,
    Self,
    signal,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'cz-input-otp',
    imports: [CommonModule],
    templateUrl: './input-otp.component.html',
    styleUrl: './input-otp.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-input-otp',
        '[class.cz-input-otp--disabled]': 'actualDisabled()',
    },
})
export class CzInputOtpComponent implements ControlValueAccessor {
    /** Number of digits */
    length = input<number>(4);

    /** Masks the digits */
    mask = input<boolean>(false);

    /** Only allow integer characters */
    integerOnly = input<boolean>(true);

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Readonly state */
    readonly = input<boolean>(false);

    /** Accessible label for the group */
    ariaLabel = input<string>('One time password');

    /** Current value */
    value = signal<string>('');

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    /** Indexes used for the @for loop */
    indexes = computed(() => Array.from({ length: this.length() }, (_, i) => i));

    @ViewChildren('otpInput') private otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    charAt(index: number): string {
        return this.value()[index] ?? '';
    }

    private sanitize(char: string): string {
        if (this.integerOnly()) {
            return /[0-9]/.test(char) ? char : '';
        }
        return char;
    }

    private setChars(chars: string): void {
        this.value.set(chars.slice(0, this.length()));
        this.onChange(this.value());
    }

    private focusInput(index: number): void {
        const inputs = this.otpInputs?.toArray();
        if (!inputs || inputs.length === 0) return;
        const target = Math.max(0, Math.min(index, inputs.length - 1));
        inputs[target].nativeElement.focus();
        inputs[target].nativeElement.select();
    }

    onInput(event: Event, index: number): void {
        const inputEl = event.target as HTMLInputElement;
        const char = this.sanitize(inputEl.value.slice(-1));

        const chars = this.value().split('');
        chars[index] = char;
        this.setChars(chars.join(''));

        inputEl.value = char;

        if (char && index < this.length() - 1) {
            this.focusInput(index + 1);
        }
    }

    onKeyDown(event: KeyboardEvent, index: number): void {
        if (event.key === 'Backspace') {
            event.preventDefault();
            const chars = this.value().split('');
            if (chars[index]) {
                chars[index] = '';
                this.setChars(chars.join(''));
            } else if (index > 0) {
                chars[index - 1] = '';
                this.setChars(chars.join(''));
                this.focusInput(index - 1);
            }
            return;
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.focusInput(index - 1);
            return;
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.focusInput(index + 1);
            return;
        }

        if (event.key === 'Home') {
            event.preventDefault();
            this.focusInput(0);
            return;
        }

        if (event.key === 'End') {
            event.preventDefault();
            this.focusInput(this.length() - 1);
        }
    }

    onPaste(event: ClipboardEvent, index: number): void {
        event.preventDefault();
        const pasted = event.clipboardData?.getData('text') ?? '';
        const sanitized = pasted
            .split('')
            .map((c) => this.sanitize(c))
            .join('');

        if (!sanitized) return;

        const chars = this.value().split('');
        for (let i = 0; i < sanitized.length && index + i < this.length(); i++) {
            chars[index + i] = sanitized[i];
        }
        this.setChars(chars.join(''));
        this.focusInput(index + sanitized.length);
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        this.value.set(value === null || value === undefined ? '' : String(value));
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
