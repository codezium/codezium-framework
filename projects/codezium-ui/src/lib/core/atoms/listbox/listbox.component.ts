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
import { LucideCheck, LucideDynamicIcon } from '@lucide/angular';
import { CzInputSize } from '../../types';

export interface CzListboxChangeEvent {
    value: any;
    originalEvent: Event;
}

@Component({
    selector: 'cz-listbox',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './listbox.component.html',
    styleUrl: './listbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-listbox',
        '[class.cz-listbox--disabled]': 'actualDisabled()',
        '[attr.data-size]': 'size()',
    },
})
export class CzListboxComponent implements ControlValueAccessor {
    /** Items to display */
    options = input<any[]>([]);

    /** Property used as the visible label */
    optionLabel = input<string>('');

    /** Property used as the value */
    optionValue = input<string>('');

    /** Allows multiple selection */
    multiple = input<boolean>(false);

    /** Shows the filter input */
    filter = input<boolean>(false);

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Readonly state */
    readonly = input<boolean>(false);

    /** Component size */
    size = input<CzInputSize>('md');

    /** Message shown when there are no options */
    emptyMessage = input<string>('No results found');

    /** Placeholder of the filter input */
    filterPlaceholder = input<string>('Search...');

    /** Accessible label of the list */
    ariaLabel = input<string>('Listbox');

    /** Emitted on selection change */
    onChangeEvent = output<CzListboxChangeEvent>({ alias: 'onChange' });

    /** Current value (single or array) */
    value = signal<any>(null);

    /** Filter query */
    filterValue = signal<string>('');

    /** Keyboard focus index */
    focusedIndex = signal<number>(-1);

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    readonly CheckIcon = LucideCheck;

    filteredOptions = computed(() => {
        const query = this.filterValue().toLowerCase();
        const all = this.options();
        if (!query || !this.filter()) return all;
        return all.filter((opt) => this.getLabel(opt).toLowerCase().includes(query));
    });

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    getLabel(option: any): string {
        if (option === null || option === undefined) return '';
        if (this.optionLabel()) return option[this.optionLabel()] ?? '';
        return typeof option === 'object' ? (option.label ?? String(option)) : String(option);
    }

    getValue(option: any): any {
        if (option === null || option === undefined) return option;
        if (this.optionValue()) return option[this.optionValue()];
        return typeof option === 'object' ? (option.value ?? option) : option;
    }

    isSelected(option: any): boolean {
        const val = this.value();
        if (this.multiple()) {
            return Array.isArray(val) && val.some((v) => v === this.getValue(option));
        }
        return val === this.getValue(option);
    }

    toggleOption(option: any, event: Event): void {
        if (this.actualDisabled() || this.readonly()) return;

        const optionVal = this.getValue(option);

        if (this.multiple()) {
            const current: any[] = Array.isArray(this.value()) ? [...this.value()] : [];
            const index = current.indexOf(optionVal);
            if (index >= 0) {
                current.splice(index, 1);
            } else {
                current.push(optionVal);
            }
            this.value.set(current);
            this.onChange(current);
            this.onChangeEvent.emit({ value: current, originalEvent: event });
        } else {
            this.value.set(optionVal);
            this.onChange(optionVal);
            this.onChangeEvent.emit({ value: optionVal, originalEvent: event });
        }

        this.onTouched();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.actualDisabled() || this.readonly()) return;

        const options = this.filteredOptions();

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.focusedIndex.update((i) => (i < options.length - 1 ? i + 1 : i));
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.focusedIndex.update((i) => (i > 0 ? i - 1 : 0));
                break;
            case 'Home':
                event.preventDefault();
                this.focusedIndex.set(0);
                break;
            case 'End':
                event.preventDefault();
                this.focusedIndex.set(options.length - 1);
                break;
            case 'Enter':
            case ' ': {
                event.preventDefault();
                const index = this.focusedIndex();
                if (index >= 0 && options[index] !== undefined) {
                    this.toggleOption(options[index], event);
                }
                break;
            }
        }
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        if (this.multiple()) {
            this.value.set(Array.isArray(value) ? [...value] : []);
        } else {
            this.value.set(value ?? null);
        }
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
