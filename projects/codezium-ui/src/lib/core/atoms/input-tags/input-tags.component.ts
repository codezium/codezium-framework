import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    Optional,
    output,
    Self,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CzChipComponent } from '../chip';

@Component({
    selector: 'cz-input-tags',
    imports: [CommonModule, CzChipComponent],
    templateUrl: './input-tags.component.html',
    styleUrl: './input-tags.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-input-tags',
        '[class.cz-input-tags--disabled]': 'actualDisabled()',
        '[class.cz-input-tags--focused]': 'isFocused()',
    },
})
export class CzInputTagsComponent implements ControlValueAccessor {
    /** Current tags */
    value = signal<string[]>([]);

    /** Placeholder of the inner input */
    placeholder = input<string>('Add tag...');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Readonly state */
    readonly = input<boolean>(false);

    /** Characters that trigger tag creation */
    separators = input<string>(',');

    /** Maximum number of tags (0 = unlimited) */
    max = input<number>(0);

    /** Accessible label */
    ariaLabel = input<string>('Tags');

    /** Emitted when a tag is added */
    onAdd = output<string>();

    /** Emitted when a tag is removed */
    onRemove = output<string>();

    /** Current text of the inner input */
    inputValue = signal<string>('');

    isFocused = signal<boolean>(false);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    private emitChange(): void {
        this.onChange([...this.value()]);
    }

    addTag(raw: string): void {
        if (this.actualDisabled() || this.readonly()) return;

        const tag = raw.trim();
        if (!tag) return;

        const max = this.max();
        if (max > 0 && this.value().length >= max) return;
        if (this.value().includes(tag)) return;

        this.value.update((tags) => [...tags, tag]);
        this.onAdd.emit(tag);
        this.emitChange();
    }

    removeTag(tag: string): void {
        if (this.actualDisabled() || this.readonly()) return;

        this.value.update((tags) => tags.filter((t) => t !== tag));
        this.onRemove.emit(tag);
        this.emitChange();
    }

    onInputChange(event: Event): void {
        const text = (event.target as HTMLInputElement).value;
        const separators = this.separators();

        if (separators && [...separators].some((sep) => text.includes(sep))) {
            const parts = text.split(new RegExp(`[${this.escapeForRegex(separators)}]`));
            const pending = parts.pop() ?? '';
            for (const part of parts) {
                this.addTag(part);
            }
            this.inputValue.set(pending);
            return;
        }

        this.inputValue.set(text);
    }

    private escapeForRegex(chars: string): string {
        return chars.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.addTag(this.inputValue());
            this.inputValue.set('');
            return;
        }

        if (event.key === 'Backspace' && this.inputValue() === '' && this.value().length > 0) {
            this.removeTag(this.value()[this.value().length - 1]);
        }
    }

    onFocus(): void {
        this.isFocused.set(true);
    }

    onBlur(): void {
        this.isFocused.set(false);
        this.onTouched();
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        this.value.set(Array.isArray(value) ? [...value] : []);
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
