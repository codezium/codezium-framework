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
import {
    LucideCalendar,
    LucideChevronLeft,
    LucideChevronRight,
    LucideDynamicIcon,
    LucideX,
} from '@lucide/angular';
import { CzInputSize, CzOverlayZIndex, czOverlayZIndex } from '../../types';

export interface CzDatePickerChangeEvent {
    value: Date | null;
    originalEvent: Event;
}

@Component({
    selector: 'cz-date-picker',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './date-picker.component.html',
    styleUrl: './date-picker.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-date-picker',
        '[class.cz-date-picker--disabled]': 'actualDisabled()',
        '[attr.data-size]': 'size()',
        '(document:click)': 'onDocumentClick($event)',
    },
})
export class CzDatePickerComponent implements ControlValueAccessor {
    /** Input placeholder */
    placeholder = input<string>('');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Readonly state */
    readonly = input<boolean>(false);

    /** Shows the clear button */
    showClear = input<boolean>(true);

    /** Locale used to format month and day names (BCP 47) */
    locale = input<string>('en-US');

    /** First day of the week (0 = Sunday) */
    firstDayOfWeek = input<number>(0);

    /** Minimum selectable date */
    minDate = input<Date | null>(null);

    /** Maximum selectable date */
    maxDate = input<Date | null>(null);

    /** Component size */
    size = input<CzInputSize>('md');
    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex()));


    /** Accessible label */
    ariaLabel = input<string>('Date');

    /** Emitted on date change */
    onChangeEvent = output<CzDatePickerChangeEvent>({ alias: 'onChange' });

    /** Selected date */
    value = signal<Date | null>(null);

    /** Overlay visibility */
    isOpen = signal<boolean>(false);

    /** Visible month/year */
    viewMonth = signal<number>(new Date().getMonth());
    viewYear = signal<number>(new Date().getFullYear());

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Combined disabled state */
    actualDisabled = computed(() => this.disabled() || this.formsDisabled());

    readonly CalendarIcon = LucideCalendar;
    readonly ChevronLeftIcon = LucideChevronLeft;
    readonly ChevronRightIcon = LucideChevronRight;
    readonly XIcon = LucideX;

    displayValue = computed(() => {
        const date = this.value();
        if (!date) return '';
        return new Intl.DateTimeFormat(this.locale(), {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    });

    weekDays = computed(() => {
        const formatter = new Intl.DateTimeFormat(this.locale(), { weekday: 'short' });
        const base = new Date(2023, 0, 1); // Sunday
        const days: string[] = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(base);
            day.setDate(base.getDate() + ((i + this.firstDayOfWeek()) % 7));
            days.push(formatter.format(day));
        }
        return days;
    });

    monthLabel = computed(() =>
        new Intl.DateTimeFormat(this.locale(), { month: 'long', year: 'numeric' }).format(
            new Date(this.viewYear(), this.viewMonth(), 1),
        ),
    );

    weeks = computed(() => {
        const year = this.viewYear();
        const month = this.viewMonth();
        const first = new Date(year, month, 1);
        const offset = (first.getDay() - this.firstDayOfWeek() + 7) % 7;
        const cursor = new Date(year, month, 1 - offset);
        const weeks: (Date | null)[][] = [];

        for (let w = 0; w < 6; w++) {
            const row: (Date | null)[] = [];
            for (let d = 0; d < 7; d++) {
                row.push(cursor.getMonth() === month ? new Date(cursor) : null);
                cursor.setDate(cursor.getDate() + 1);
            }
            weeks.push(row);
        }
        return weeks;
    });

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    isSelected(date: Date): boolean {
        const value = this.value();
        if (!value) return false;
        return (
            date.getDate() === value.getDate() &&
            date.getMonth() === value.getMonth() &&
            date.getFullYear() === value.getFullYear()
        );
    }

    isDateDisabled(date: Date): boolean {
        const min = this.minDate();
        const max = this.maxDate();
        if (min && date.getTime() < new Date(min).setHours(0, 0, 0, 0)) return true;
        if (max && date.getTime() > new Date(max).setHours(23, 59, 59, 999)) return true;
        return false;
    }

    toggle(): void {
        if (this.actualDisabled() || this.readonly()) return;
        this.isOpen.update((open) => !open);
    }

    open(): void {
        if (this.actualDisabled() || this.readonly()) return;
        const value = this.value();
        if (value) {
            this.viewMonth.set(value.getMonth());
            this.viewYear.set(value.getFullYear());
        }
        this.isOpen.set(true);
    }

    close(): void {
        this.isOpen.set(false);
    }

    prevMonth(): void {
        const month = this.viewMonth();
        if (month === 0) {
            this.viewMonth.set(11);
            this.viewYear.update((y) => y - 1);
        } else {
            this.viewMonth.set(month - 1);
        }
    }

    nextMonth(): void {
        const month = this.viewMonth();
        if (month === 11) {
            this.viewMonth.set(0);
            this.viewYear.update((y) => y + 1);
        } else {
            this.viewMonth.set(month + 1);
        }
    }

    selectDay(date: Date, event: Event): void {
        if (this.isDateDisabled(date)) return;

        this.value.set(date);
        this.onChange(date);
        this.onChangeEvent.emit({ value: date, originalEvent: event });
        this.onTouched();
        this.close();
    }

    clear(event: Event): void {
        event.stopPropagation();
        this.value.set(null);
        this.onChange(null);
        this.onChangeEvent.emit({ value: null, originalEvent: event });
        this.close();
    }

    onInputKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.close();
            return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.isOpen() ? this.close() : this.open();
        }
    }

    onDocumentClick(event: Event): void {
        if (!this.isOpen()) return;
        const host = (event.currentTarget as HTMLElement) ?? null;
        const target = event.target as Node | null;
        if (target && host && !host.contains(target)) {
            this.close();
        }
    }

    /* ── ControlValueAccessor ── */
    writeValue(value: any): void {
        if (value === null || value === undefined || value === '') {
            this.value.set(null);
            return;
        }

        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) {
            this.value.set(null);
            return;
        }

        this.value.set(date);
        this.viewMonth.set(date.getMonth());
        this.viewYear.set(date.getFullYear());
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
