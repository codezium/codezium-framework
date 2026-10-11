import {
    Directive,
    ElementRef,
    inject,
    input,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CzInputTextComponent } from '../input-text/input-text.component';

interface MaskSlot {
    literal?: string;
    test?: (char: string) => boolean;
}

/**
 * CzInputMaskDirective
 *
 * Formats the input value following a mask definition.
 * Mask chars: `9` digit, `a` letter, `*` alphanumeric. Any other char is a literal.
 *
 * Usage:
 *   <input czInputMask="(999) 999-9999" />
 *   <cz-input-text czInputMask="99/99/9999" [unmask]="true" />
 */
@Directive({
    selector: '[czInputMask]',
    host: {
        '(input)': 'onInput($event)',
        '(keydown)': 'onKeyDown($event)',
        '(blur)': 'onBlur()',
    },
})
export class CzInputMaskDirective implements ControlValueAccessor {
    /** Mask definition, e.g. `(999) 999-9999` */
    czInputMask = input<string>('');

    /** Placeholder char used for empty positions */
    slotChar = input<string>('_');

    /** Clears the mask when the last char is deleted */
    autoClear = input<boolean>(true);

    /** Emits the raw value without literals when true */
    unmask = input<boolean>(false);

    private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
    private readonly czInputText = inject(CzInputTextComponent, { optional: true });
    private readonly ngControl = inject(NgControl, { optional: true, self: true });

    private buffer = '';

    onModelChange: Function = (_: any) => {};
    onModelTouched: Function = () => {};

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    private get slots(): MaskSlot[] {
        return this.czInputMask()
            .split('')
            .map((char) => {
                switch (char) {
                    case '9':
                        return { test: (c: string) => /[0-9]/.test(c) };
                    case 'a':
                        return { test: (c: string) => /[a-zA-Z]/.test(c) };
                    case '*':
                        return { test: (c: string) => /[a-zA-Z0-9]/.test(c) };
                    default:
                        return { literal: char };
                }
            });
    }

    private applyMask(text: string): string {
        const slots = this.slots;
        let result = '';
        let lastContent = 0;
        let index = 0;

        for (const slot of slots) {
            if (slot.literal !== undefined) {
                result += slot.literal;
                continue;
            }

            let filled = false;
            while (index < text.length) {
                const char = text[index++];
                if (char === this.slotChar()) break;
                if (slot.test?.(char)) {
                    result += char;
                    lastContent = result.length;
                    filled = true;
                    break;
                }
            }
            if (!filled) break;
        }

        return result.slice(0, lastContent);
    }

    private get modelValue(): any {
        const maskLength = this.czInputMask().length;
        const trimmed = this.buffer.length >= maskLength
            ? this.buffer
            : this.buffer;

        if (this.unmask()) {
            return this.stripLiterals(trimmed);
        }
        return trimmed;
    }

    private stripLiterals(value: string): string {
        const slots = this.slots;
        let result = '';
        for (let i = 0; i < value.length && i < slots.length; i++) {
            if (slots[i].test) {
                result += value[i];
            }
        }
        return result;
    }

    private updateView(): void {
        const display = this.buffer || '';
        if (this.czInputText) {
            this.czInputText.value.set(display);
        } else {
            this.el.nativeElement.value = display;
        }
    }

    /* ── Host events ── */
    onInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        const text = target.value;

        if (this.autoClear() && text.length === 0) {
            this.buffer = '';
            this.updateView();
            this.onModelChange(null);
            return;
        }

        this.buffer = this.applyMask(text);
        this.updateView();
        this.onModelChange(this.modelValue);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Backspace' && this.buffer.length === 0) {
            event.preventDefault();
        }
    }

    onBlur(): void {
        this.onModelTouched();
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        this.buffer = value === null || value === undefined ? '' : this.applyMask(String(value));
        this.updateView();
    }

    registerOnChange(fn: any): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onModelTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        if (this.czInputText) {
            this.czInputText.setDisabledState(isDisabled);
        } else {
            this.el.nativeElement.disabled = isDisabled;
        }
    }
}
