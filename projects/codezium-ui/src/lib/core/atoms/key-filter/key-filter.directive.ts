import { Directive, input, HostListener } from '@angular/core';

export type CzKeyFilterPreset = 'integer' | 'number' | 'money' | 'hex' | 'alpha' | 'alphanum';

const CZ_KEY_FILTER_PRESETS: Record<CzKeyFilterPreset, RegExp> = {
    integer: /^[0-9]+$/,
    number: /^[0-9.,]+$/,
    money: /^[0-9.,]+$/,
    hex: /^[0-9a-fA-F]+$/,
    alpha: /^[a-zA-ZÀ-ÿ]+$/,
    alphanum: /^[a-zA-ZÀ-ÿ0-9]+$/,
};

/** Keys that should always be allowed through regardless of filter */
const ALWAYS_PERMITTED_KEYS = new Set([
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End', 'Tab', 'Enter', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5',
    'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
]);

/**
 * CzKeyFilterDirective
 * 
 * Restricts individual keystrokes on any <input> or <cz-input-text> element.
 * 
 * Usage:
 *   <!-- Using a preset -->
 *   <input czKeyFilter="integer" />
 *   <cz-input-text czKeyFilter="alphanum" />
 * 
 *   <!-- Using a custom RegExp -->
 *   <input [czKeyFilter]="/^[A-Z]+$/" />
 */
@Directive({
    selector: '[czKeyFilter]',
    host: {}, // Host bindings handled via @HostListener
})
export class CzKeyFilterDirective {
    /** Accept either a preset string or a raw RegExp */
    czKeyFilter = input<CzKeyFilterPreset | RegExp>('alphanum');

    private get regex(): RegExp {
        const val = this.czKeyFilter();
        if (val instanceof RegExp) {
            return val;
        }
        return CZ_KEY_FILTER_PRESETS[val] ?? CZ_KEY_FILTER_PRESETS['alphanum'];
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        // Never block meta combinations (Ctrl+C, Cmd+V, etc.)
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        // Never block navigation / utility keys
        if (ALWAYS_PERMITTED_KEYS.has(event.key)) return;

        // Test the pressed key character against the active regex
        if (!this.regex.test(event.key)) {
            event.preventDefault();
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent): void {
        const pastedText = event.clipboardData?.getData('text') ?? '';
        // Validate that every character in the pasted string is valid
        if (!pastedText.split('').every(char => this.regex.test(char))) {
            event.preventDefault();
        }
    }
}
