import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    TemplateRef,
    ViewChild,
    computed,
    contentChild,
    inject,
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
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronUp,
    LucideDynamicIcon,
    LucideX,
} from '@lucide/angular';
import { CzInputSize, CzOverlayZIndex, czOverlayZIndex } from '../../types';

export type CzDatePickerSelectionMode = 'single' | 'multiple' | 'range';
export type CzDatePickerView = 'date' | 'month' | 'year';
export type CzDatePickerDataType = 'date' | 'string';
export type CzDatePickerIconDisplay = 'input' | 'button';

export interface CzDatePickerChangeEvent {
    value: any;
    originalEvent: Event;
}

export interface CzDatePickerMonthChangeEvent {
    month: number;
    year: number;
}

interface DayCell {
    date: Date;
    otherMonth: boolean;
}

interface WeekRow {
    weekNumber: number;
    days: DayCell[];
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
        '[class.cz-date-picker--filled]': 'isFilled()',
        '[class.cz-date-picker--fluid]': 'fluid()',
        '[class.cz-date-picker--invalid]': 'isInvalid()',
        '[class.cz-date-picker--touch-ui]': 'touchUI()',
        '[class.cz-date-picker--inline]': 'inline()',
        '[class]': 'styleClass()',
        '[attr.data-size]': 'size()',
        '(document:click)': 'onDocumentClick($event)',
    },
})
export class CzDatePickerComponent implements ControlValueAccessor {
    private readonly host = inject(ElementRef<HTMLElement>);

    @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

    private static nextId = 0;
    private readonly autoId = `cz-date-picker-${++CzDatePickerComponent.nextId}`;

    /** Input placeholder */
    placeholder = input<string>('');

    /** Visible label */
    label = input<string>('');

    /** Label position: none (static above), over (infield top), in (inline) or float */
    labelPosition = input<'none' | 'over' | 'in' | 'float'>('none');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Readonly state */
    readonly = input<boolean>(false);

    /** Shows the clear button */
    showClear = input<boolean>(false);

    /** Shows today/clear buttons at the footer */
    showButtonBar = input<boolean>(false);

    /** Style class of the today button */
    todayButtonStyleClass = input<string>('');

    /** Style class of the clear button */
    clearButtonStyleClass = input<string>('');

    /** Locale used to format month and day names (BCP 47) */
    locale = input<string>('en-US');

    /** Date format (PrimeNG tokens: d, dd, m, mm, M, MM, y, yy, ...) */
    dateFormat = input<string>('mm/dd/yy');

    /** Type of the value written back to the model */
    dataType = input<CzDatePickerDataType>('date');

    /** Selection mode */
    selectionMode = input<CzDatePickerSelectionMode>('single');

    /** Maximum number of selectable dates in multiple mode */
    maxDateCount = input<number | null>(null);

    /** Separator for multiple selection mode */
    multipleSeparator = input<string>(',');

    /** Separator for joining start and end dates on range mode */
    rangeSeparator = input<string>('-');

    /** First day of the week (0 = Sunday) */
    firstDayOfWeek = input<number>(0);

    /** Minimum selectable date */
    minDate = input<Date | null>(null);

    /** Maximum selectable date */
    maxDate = input<Date | null>(null);

    /** Dates that should be disabled */
    disabledDates = input<Date[]>([]);

    /** Weekdays that should be disabled (0 = Sunday) */
    disabledDays = input<number[]>([]);

    /** Date highlighted on first opening if the field is blank */
    defaultDate = input<Date | null>(null);

    /** Displays the calendar inline instead of a popup */
    inline = input<boolean>(false);

    /** Optimizes the overlay for touch devices */
    touchUI = input<boolean>(false);

    /** Displays dates of other months */
    showOtherMonths = input<boolean>(true);

    /** Makes dates of other months selectable */
    selectOtherMonths = input<boolean>(false);

    /** Shows the week numbers column */
    showWeek = input<boolean>(false);

    /** Starts week numbers from the first day of the year */
    startWeekFromFirstDayOfYear = input<boolean>(false);

    /** Number of months to display */
    numberOfMonths = input<number>(1);

    /** Displays the calendar icon */
    showIcon = input<boolean>(false);

    /** Icon display mode */
    iconDisplay = input<CzDatePickerIconDisplay>('button');

    /** Prevents entering the date manually */
    readonlyInput = input<boolean>(false);

    /** Keeps an invalid value when the input blurs */
    keepInvalid = input<boolean>(false);

    /** Hides the overlay on date selection */
    hideOnDateTimeSelect = input<boolean>(true);

    /** Opens the overlay on input focus */
    showOnFocus = input<boolean>(true);

    /** Displays the time picker */
    showTime = input<boolean>(false);

    /** Displays only the time picker */
    timeOnly = input<boolean>(false);

    /** Hour format 12 or 24 */
    hourFormat = input<12 | 24>(24);

    /** Hours to change per step */
    stepHour = input<number>(1);

    /** Minutes to change per step */
    stepMinute = input<number>(1);

    /** Seconds to change per step */
    stepSecond = input<number>(1);

    /** Shows the seconds in the time picker */
    showSeconds = input<boolean>(false);

    /** Separator of the time selector */
    timeSeparator = input<string>(':');

    /** Type of view to display */
    view = input<CzDatePickerView>('date');

    /** Component size */
    size = input<CzInputSize>('md');

    /** Input variant */
    variant = input<'outlined' | 'filled'>('outlined');

    /** Spans 100% width of the container */
    fluid = input<boolean>(false);

    /** Invalid state */
    invalid = input<boolean>(false);

    /** Identifier of the input to match a label */
    inputId = input<string>('');

    /** Style class of the host element */
    styleClass = input<string>('');

    /** Style class of the input field */
    inputStyleClass = input<string>('');

    /** Style class of the panel */
    panelStyleClass = input<string>('');

    /** Accessible label */
    ariaLabel = input<string>('Date');

    /** IDs of elements that label the input */
    ariaLabelledBy = input<string | null>(null);

    /** Accessible label of the icon button */
    iconAriaLabel = input<string>('Choose date');

    /** Index of the element in tabbing order */
    tabindex = input<number | null>(null);

    /** Overlay z-index: a number overrides it, 'none' keeps it in normal flow, null = theme default */
    zIndex = input<CzOverlayZIndex>(null);

    readonly panelZIndex = computed(() => czOverlayZIndex(this.zIndex()));

    /* ── Templates ── */
    dateTemplate = contentChild<TemplateRef<any>>('dateTemplate');
    headerTemplate = contentChild<TemplateRef<any>>('headerTemplate');
    footerTemplate = contentChild<TemplateRef<any>>('footerTemplate');
    disabledDateTemplate = contentChild<TemplateRef<any>>('disabledDateTemplate');
    decadeTemplate = contentChild<TemplateRef<any>>('decadeTemplate');
    previousIconTemplate = contentChild<TemplateRef<any>>('previousIconTemplate');
    nextIconTemplate = contentChild<TemplateRef<any>>('nextIconTemplate');
    triggerIconTemplate = contentChild<TemplateRef<any>>('triggerIconTemplate');
    clearIconTemplate = contentChild<TemplateRef<any>>('clearIconTemplate');
    incrementIconTemplate = contentChild<TemplateRef<any>>('incrementIconTemplate');
    decrementIconTemplate = contentChild<TemplateRef<any>>('decrementIconTemplate');
    inputIconTemplate = contentChild<TemplateRef<any>>('inputIconTemplate');
    buttonBarTemplate = contentChild<TemplateRef<any>>('buttonBarTemplate');

    /* ── Outputs ── */
    onChangeEvent = output<CzDatePickerChangeEvent>({ alias: 'onChange' });
    onSelect = output<any>();
    onFocus = output<Event>();
    onBlur = output<Event>();
    onClose = output<Event>();
    onShow = output<Event>();
    onClickOutside = output<Event>();
    onInput = output<string>();
    onTodayClick = output<Event>();
    onClearClick = output<Event>();
    onMonthChange = output<CzDatePickerMonthChangeEvent>();
    onYearChange = output<CzDatePickerMonthChangeEvent>();
    onClear = output<void>();

    /* ── State ── */
    value = signal<Date | Date[] | null>(null);
    inputText = signal<string>('');
    isOpen = signal<boolean>(false);
    isFocused = signal<boolean>(false);
    viewMode = signal<CzDatePickerView>('date');
    viewMonth = signal<number>(new Date().getMonth());
    viewYear = signal<number>(new Date().getFullYear());
    rangeStart = signal<Date | null>(null);
    hour = signal<number>(0);
    minute = signal<number>(0);
    second = signal<number>(0);
    isPM = signal<boolean>(false);
    formsDisabled = signal<boolean>(false);

    actualDisabled = computed(() => this.disabled() || this.formsDisabled());
    isFilled = computed(() => this.variant() === 'filled');
    isInvalid = computed(() => this.invalid());
    effectiveInputId = computed(() => this.inputId() || this.autoId);
    panelId = computed(() => `${this.effectiveInputId()}-panel`);
    isMultiple = computed(() => this.selectionMode() === 'multiple');
    isRange = computed(() => this.selectionMode() === 'range');
    isArrayMode = computed(() => this.selectionMode() !== 'single');
    showClearButton = computed(() => this.showClear() && this.hasValue() && !this.actualDisabled() && !this.readonly());
    use12Hours = computed(() => this.hourFormat() === 12);

    readonly CalendarIcon = LucideCalendar;
    readonly ChevronLeftIcon = LucideChevronLeft;
    readonly ChevronRightIcon = LucideChevronRight;
    readonly ChevronUpIcon = LucideChevronUp;
    readonly ChevronDownIcon = LucideChevronDown;
    readonly XIcon = LucideX;

    readonly hasValue = computed(() => {
        const value = this.value();
        if (Array.isArray(value)) return value.length > 0;
        return value !== null;
    });

    readonly displayValue = computed(() => {
        const value = this.value();
        if (value === null) return '';
        if (Array.isArray(value)) {
            return value.map(date => this.formatDate(date, this.dateFormat())).join(this.rangeSeparator());
        }
        return this.formatDate(value, this.dateFormat());
    });

    readonly weekDays = computed(() => {
        const formatter = new Intl.DateTimeFormat(this.locale(), { weekday: 'short' });
        const longFormatter = new Intl.DateTimeFormat(this.locale(), { weekday: 'long' });
        const base = new Date(2023, 0, 1);
        const days: { short: string; long: string }[] = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(base);
            day.setDate(base.getDate() + ((i + this.firstDayOfWeek()) % 7));
            days.push({ short: formatter.format(day), long: longFormatter.format(day) });
        }
        return days;
    });

    readonly monthLabel = computed(() =>
        new Intl.DateTimeFormat(this.locale(), { month: 'long', year: 'numeric' }).format(
            new Date(this.viewYear(), this.viewMonth(), 1),
        ),
    );

    readonly yearLabel = computed(() => String(this.viewYear()));
    readonly decadeLabel = computed(() => {
        const start = Math.floor(this.viewYear() / 10) * 10;
        return `${start} - ${start + 9}`;
    });

    readonly months = computed(() => {
        const formatter = new Intl.DateTimeFormat(this.locale(), { month: 'short' });
        return Array.from({ length: 12 }, (_, month) => ({
            month,
            label: formatter.format(new Date(2023, month, 1)),
        }));
    });

    readonly years = computed(() => {
        const start = Math.floor(this.viewYear() / 10) * 10;
        return Array.from({ length: 10 }, (_, index) => start + index);
    });

    /** Month tables for the date view (one per displayed month) */
    readonly monthTables = computed(() => {
        const count = this.timeOnly() ? 0 : Math.max(1, this.numberOfMonths());
        return Array.from({ length: count }, (_, index) => {
            const month = (this.viewMonth() + index) % 12;
            const year = this.viewYear() + Math.floor((this.viewMonth() + index) / 12);
            return { month, year, weeks: this.buildWeeks(year, month) };
        });
    });

    readonly selectedLabel = computed(() => this.displayValue());

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnInit(): void {
        this.viewMode.set(this.view());
        this.syncTimeFromValue();
    }

    private syncTimeFromValue(): void {
        const value = this.value();
        const date = Array.isArray(value) ? value[0] : value;
        if (date) {
            this.hour.set(date.getHours() % 12 || 12);
            this.minute.set(date.getMinutes());
            this.second.set(date.getSeconds());
            this.isPM.set(date.getHours() >= 12);
        }
    }

    /* ── Calendar building ── */

    private buildWeeks(year: number, month: number): WeekRow[] {
        const first = new Date(year, month, 1);
        const offset = (first.getDay() - this.firstDayOfWeek() + 7) % 7;
        const cursor = new Date(year, month, 1 - offset);
        const weeks: WeekRow[] = [];

        for (let w = 0; w < 6; w++) {
            const days: DayCell[] = [];
            for (let d = 0; d < 7; d++) {
                days.push({ date: new Date(cursor), otherMonth: cursor.getMonth() !== month });
                cursor.setDate(cursor.getDate() + 1);
            }
            weeks.push({ weekNumber: this.weekNumber(days[0].date), days });
        }

        return weeks;
    }

    private weekNumber(date: Date): number {
        if (this.startWeekFromFirstDayOfYear()) {
            const start = new Date(date.getFullYear(), 0, 1);
            const diff = Math.floor((date.getTime() - start.getTime()) / 86400000);
            return Math.floor((diff + start.getDay()) / 7) + 1;
        }

        const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNumber = (target.getUTCDay() + 6) % 7;
        target.setUTCDate(target.getUTCDate() - dayNumber + 3);
        const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
        const firstDayNumber = (firstThursday.getUTCDay() + 6) % 7;
        firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNumber + 3);
        return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 86400000));
    }

    /* ── Format / parse ── */

    formatDate(date: Date, format: string): string {
        const locale = this.locale();
        const monthShort = new Intl.DateTimeFormat(locale, { month: 'short' });
        const monthLong = new Intl.DateTimeFormat(locale, { month: 'long' });
        const dayShort = new Intl.DateTimeFormat(locale, { weekday: 'short' });
        const dayLong = new Intl.DateTimeFormat(locale, { weekday: 'long' });
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

        const pad = (value: number, length = 2) => String(value).padStart(length, '0');
        let result = '';
        let index = 0;

        while (index < format.length) {
            const char = format[index];
            const next = format[index + 1];

            if (char === "'") {
                let literal = '';
                index++;
                while (index < format.length && format[index] !== "'") {
                    literal += format[index++];
                }
                index++;
                result += literal || "'";
                continue;
            }

            if (char === 'd' && next === 'd') { result += pad(date.getDate()); index += 2; continue; }
            if (char === 'd') { result += date.getDate(); index++; continue; }
            if (char === 'o' && next === 'o') { result += pad(dayOfYear, 3); index += 2; continue; }
            if (char === 'o') { result += dayOfYear; index++; continue; }
            if (char === 'D' && next === 'D') { result += dayLong.format(date); index += 2; continue; }
            if (char === 'D') { result += dayShort.format(date); index++; continue; }
            if (char === 'm' && next === 'm') { result += pad(date.getMonth() + 1); index += 2; continue; }
            if (char === 'm') { result += date.getMonth() + 1; index++; continue; }
            if (char === 'M' && next === 'M') { result += monthLong.format(date); index += 2; continue; }
            if (char === 'M') { result += monthShort.format(date); index++; continue; }
            if (char === 'y' && next === 'y') { result += date.getFullYear(); index += 2; continue; }
            if (char === 'y') { result += String(date.getFullYear()).slice(-2); index++; continue; }
            if (char === '@') { result += date.getTime(); index++; continue; }
            if (char === '!') { result += (date.getTime() * 10000 + 621355968000000000); index++; continue; }

            result += char;
            index++;
        }

        return result;
    }

    parseDate(text: string, format: string): Date | null {
        if (!text) return null;

        const locale = this.locale();
        const monthShort = new Intl.DateTimeFormat(locale, { month: 'short' });
        const monthLong = new Intl.DateTimeFormat(locale, { month: 'long' });
        const monthNames: { value: number; names: string[] }[] = Array.from({ length: 12 }, (_, month) => {
            const date = new Date(2023, month, 1);
            return {
                value: month,
                names: [monthShort.format(date), monthLong.format(date)].map(name => name.toLowerCase()),
            };
        });

        let day: number | null = null;
        let month: number | null = null;
        let year: number | null = null;
        let pattern = '^';

        let index = 0;
        while (index < format.length) {
            const char = format[index];
            const next = format[index + 1];

            if (char === "'") {
                let literal = '';
                index++;
                while (index < format.length && format[index] !== "'") literal += format[index++];
                index++;
                pattern += literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                continue;
            }

            if (char === 'd' && next === 'd') { pattern += '(\\d{2})'; index += 2; continue; }
            if (char === 'd') { pattern += '(\\d{1,2})'; index++; continue; }
            if (char === 'm' && next === 'm') { pattern += '(\\d{2})'; index += 2; continue; }
            if (char === 'm') { pattern += '(\\d{1,2})'; index++; continue; }
            if ((char === 'M' && next === 'M') || char === 'M') { pattern += '([A-Za-zÀ-ÿ]+)'; index += next === 'M' ? 2 : 1; continue; }
            if (char === 'y' && next === 'y') { pattern += '(\\d{4})'; index += 2; continue; }
            if (char === 'y') { pattern += '(\\d{2})'; index++; continue; }
            if (char === 'o' && next === 'o') { pattern += '(\\d{3})'; index += 2; continue; }
            if (char === 'o') { pattern += '(\\d{1,3})'; index++; continue; }
            if (char === 'D' && next === 'D') { pattern += '[A-Za-zÀ-ÿ]+'; index += 2; continue; }
            if (char === 'D') { pattern += '[A-Za-zÀ-ÿ]+'; index++; continue; }
            if (char === '@' || char === '!') { pattern += '(\\d+)'; index++; continue; }

            pattern += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            index++;
        }
        pattern += '$';

        const match = new RegExp(pattern).exec(text.trim());
        if (!match) return null;

        let group = 1;
        index = 0;
        while (index < format.length) {
            const char = format[index];
            const next = format[index + 1];

            if (char === "'") {
                index++;
                while (index < format.length && format[index] !== "'") index++;
                index++;
                continue;
            }

            if (char === 'd') { day = parseInt(match[group++], 10); index += next === 'd' ? 2 : 1; continue; }
            if (char === 'm') { month = parseInt(match[group++], 10) - 1; index += next === 'm' ? 2 : 1; continue; }
            if (char === 'M') {
                const name = match[group++].toLowerCase();
                month = monthNames.find(entry => entry.names.includes(name))?.value ?? null;
                index += next === 'M' ? 2 : 1;
                continue;
            }
            if (char === 'y') {
                year = parseInt(match[group++], 10);
                if (next !== 'y' && year < 100) year += year < 50 ? 2000 : 1900;
                index += next === 'y' ? 2 : 1;
                continue;
            }
            if (char === 'o') { group++; index += next === 'o' ? 2 : 1; continue; }
            if (char === 'D') { index += next === 'D' ? 2 : 1; continue; }
            if (char === '@') { const stamp = parseInt(match[group++], 10); index++; const date = new Date(stamp); if (Number.isNaN(date.getTime())) return null; return date; }
            if (char === '!') { group++; index++; continue; }

            index++;
        }

        if (day === null && month === null && year === null) return null;
        const date = new Date(year ?? new Date().getFullYear(), month ?? 0, day ?? 1);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    /* ── Value helpers ── */

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
        const dates = Array.isArray(value) ? value : [value];
        return dates.some(selected => this.isSameDay(selected, date));
    }

    isInRange(date: Date): boolean {
        if (!this.isRange()) return false;
        const value = this.value();
        if (!Array.isArray(value) || value.length < 2) return false;
        const [start, end] = value;
        if (!start || !end) return false;
        const time = date.getTime();
        return time >= Math.min(start.getTime(), end.getTime()) && time <= Math.max(start.getTime(), end.getTime());
    }

    isRangeStart(date: Date): boolean {
        const value = this.value();
        return this.isRange() && Array.isArray(value) && value.length > 0 && !!value[0] && this.isSameDay(value[0], date);
    }

    isRangeEnd(date: Date): boolean {
        const value = this.value();
        return this.isRange() && Array.isArray(value) && value.length > 1 && !!value[1] && this.isSameDay(value[1], date);
    }

    isDateDisabled(date: Date): boolean {
        const min = this.minDate();
        const max = this.maxDate();
        if (min && date.getTime() < new Date(min).setHours(0, 0, 0, 0)) return true;
        if (max && date.getTime() > new Date(max).setHours(23, 59, 59, 999)) return true;
        if (this.disabledDays().includes(date.getDay())) return true;
        if (this.disabledDates().some(disabled => this.isSameDay(disabled, date))) return true;
        return false;
    }

    isMonthDisabled(month: number): boolean {
        const first = new Date(this.viewYear(), month, 1);
        const last = new Date(this.viewYear(), month + 1, 0);
        return this.isDateDisabled(first) && this.isDateDisabled(last);
    }

    isYearDisabled(year: number): boolean {
        const first = new Date(year, 0, 1);
        const last = new Date(year, 11, 31);
        return this.isDateDisabled(first) && this.isDateDisabled(last);
    }

    isSameDay(a: Date, b: Date): boolean {
        return (
            a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
        );
    }

    dateAriaLabel(date: Date): string {
        return new Intl.DateTimeFormat(this.locale(), { dateStyle: 'full' }).format(date);
    }

    monthName(month: number): string {
        return new Intl.DateTimeFormat(this.locale(), { month: 'long' }).format(new Date(2023, month, 1));
    }

    /* ── Panel control ── */

    toggle(): void {
        if (this.actualDisabled()) return;
        this.isOpen() ? this.close() : this.open();
    }

    open(): void {
        if (this.actualDisabled()) return;

        const value = this.value();
        const reference = (Array.isArray(value) ? value[0] : value) ?? this.defaultDate();
        if (reference) {
            this.viewMonth.set(reference.getMonth());
            this.viewYear.set(reference.getFullYear());
        }
        this.syncTimeFromValue();
        this.isOpen.set(true);
        this.onShow.emit(new Event('show'));
    }

    close(): void {
        if (!this.isOpen()) return;
        this.isOpen.set(false);
        this.onClose.emit(new Event('close'));
    }

    prevMonth(): void {
        const month = this.viewMonth();
        if (month === 0) {
            this.viewMonth.set(11);
            this.viewYear.update(year => year - 1);
        } else {
            this.viewMonth.set(month - 1);
        }
        this.onMonthChange.emit({ month: this.viewMonth(), year: this.viewYear() });
    }

    nextMonth(): void {
        const month = this.viewMonth();
        if (month === 11) {
            this.viewMonth.set(0);
            this.viewYear.update(year => year + 1);
        } else {
            this.viewMonth.set(month + 1);
        }
        this.onMonthChange.emit({ month: this.viewMonth(), year: this.viewYear() });
    }

    prevYear(): void {
        this.viewYear.update(year => year - 1);
        this.onYearChange.emit({ month: this.viewMonth(), year: this.viewYear() });
    }

    nextYear(): void {
        this.viewYear.update(year => year + 1);
        this.onYearChange.emit({ month: this.viewMonth(), year: this.viewYear() });
    }

    prevDecade(): void {
        this.viewYear.update(year => year - 10);
        this.onYearChange.emit({ month: this.viewMonth(), year: this.viewYear() });
    }

    nextDecade(): void {
        this.viewYear.update(year => year + 10);
        this.onYearChange.emit({ month: this.viewMonth(), year: this.viewYear() });
    }

    onTitleClick(): void {
        if (this.timeOnly()) return;
        if (this.viewMode() === 'date') {
            this.viewMode.set('month');
        } else if (this.viewMode() === 'month') {
            this.viewMode.set('year');
        } else {
            this.viewMode.set('month');
        }
    }

    selectMonth(month: number): void {
        if (this.isMonthDisabled(month)) return;
        this.viewMonth.set(month);
        this.viewMode.set('date');
        this.onMonthChange.emit({ month, year: this.viewYear() });
    }

    selectYear(year: number): void {
        if (this.isYearDisabled(year)) return;
        this.viewYear.set(year);
        this.viewMode.set('month');
        this.onYearChange.emit({ month: this.viewMonth(), year });
    }

    /* ── Selection ── */

    selectDay(date: Date, event: Event): void {
        if (this.isDateDisabled(date)) return;

        if (this.timeOnly()) return;

        const withTime = (source: Date) => {
            if (!this.showTime() && !this.timeOnly()) {
                return new Date(source.getFullYear(), source.getMonth(), source.getDate());
            }
            const hours = this.use12Hours() ? (this.hour() % 12) + (this.isPM() ? 12 : 0) : this.hour();
            return new Date(source.getFullYear(), source.getMonth(), source.getDate(), hours, this.minute(), this.second());
        };

        if (this.isMultiple()) {
            const currentValue = this.value();
            const current = Array.isArray(currentValue) ? [...currentValue] : [];
            const existing = current.findIndex(selected => this.isSameDay(selected, date));

            if (existing >= 0) {
                current.splice(existing, 1);
            } else {
                if (this.maxDateCount() && current.length >= this.maxDateCount()!) return;
                current.push(date);
            }

            this.value.set(current);
            this.commit(current, event);
            this.onSelect.emit(current);
            return;
        }

        if (this.isRange()) {
            const start = this.rangeStart();
            const currentValue = this.value();

            if (!start || (Array.isArray(currentValue) && currentValue.length === 2)) {
                this.rangeStart.set(date);
                this.value.set([date]);
                this.commit([date], event);
                return;
            }

            const [from, to] = start.getTime() <= date.getTime() ? [start, date] : [date, start];
            const range = [from, to];
            this.rangeStart.set(null);
            this.value.set(range);
            this.commit(range, event);
            this.onSelect.emit(range);
            if (this.hideOnDateTimeSelect()) this.close();
            return;
        }

        const selected = withTime(date);
        this.value.set(selected);
        this.commit(selected, event);
        this.onSelect.emit(selected);
        if (this.hideOnDateTimeSelect()) this.close();
    }

    private commit(value: Date | Date[] | null, event: Event): void {
        this.inputText.set(this.formatValue(value));
        this.onChange(this.toModelValue(value));
        this.onChangeEvent.emit({ value: this.toModelValue(value), originalEvent: event });
        this.onTouched();
    }

    private formatValue(value: Date | Date[] | null): string {
        if (value === null) return '';
        if (Array.isArray(value)) return value.map(date => this.formatDate(date, this.dateFormat())).join(this.rangeSeparator());
        return this.formatDate(value, this.dateFormat());
    }

    private toModelValue(value: Date | Date[] | null): any {
        if (value === null) return null;
        if (this.dataType() === 'string') {
            if (Array.isArray(value)) return value.map(date => this.formatDate(date, this.dateFormat()));
            return this.formatDate(value, this.dateFormat());
        }
        return value;
    }

    /* ── Time ── */

    incrementHour(event: Event): void {
        const step = this.stepHour();
        const max = this.use12Hours() ? 12 : 23;
        let next = this.hour() + step;
        if (next > max) next = this.use12Hours() ? 1 : next - 24;
        this.hour.set(next);
        this.applyTime(event);
    }

    decrementHour(event: Event): void {
        const step = this.stepHour();
        let next = this.hour() - step;
        if (next < 1) next = this.use12Hours() ? 12 : next + 24;
        this.hour.set(next);
        this.applyTime(event);
    }

    incrementMinute(event: Event): void {
        this.minute.set((this.minute() + this.stepMinute()) % 60);
        this.applyTime(event);
    }

    decrementMinute(event: Event): void {
        this.minute.set((this.minute() - this.stepMinute() + 60) % 60);
        this.applyTime(event);
    }

    incrementSecond(event: Event): void {
        this.second.set((this.second() + this.stepSecond()) % 60);
        this.applyTime(event);
    }

    decrementSecond(event: Event): void {
        this.second.set((this.second() - this.stepSecond() + 60) % 60);
        this.applyTime(event);
    }

    toggleMeridiem(): void {
        this.isPM.update(value => !value);
        this.applyTime(new Event('change'));
    }

    private applyTime(event: Event): void {
        if (!this.showTime() && !this.timeOnly()) return;

        const currentValue = this.value();
        const base = Array.isArray(currentValue) ? currentValue[0] : currentValue;
        const source = base ?? this.defaultDate() ?? new Date();
        const hours = this.use12Hours() ? (this.hour() % 12) + (this.isPM() ? 12 : 0) : this.hour();
        const next = new Date(source.getFullYear(), source.getMonth(), source.getDate(), hours, this.minute(), this.second());

        if (this.isArrayMode()) {
            const arrayValue = this.value();
            const current = Array.isArray(arrayValue) ? [...arrayValue] : [];
            if (current.length) current[0] = next;
            else current.push(next);
            this.value.set(current);
            this.commit(current, event);
        } else {
            this.value.set(next);
            this.commit(next, event);
        }
    }

    timeLabel(): string {
        const pad = (value: number) => String(value).padStart(2, '0');
        const seconds = this.showSeconds() ? `${this.timeSeparator()}${pad(this.second())}` : '';
        if (this.use12Hours()) {
            return `${pad(this.hour())}${this.timeSeparator()}${pad(this.minute())}${seconds} ${this.isPM() ? 'PM' : 'AM'}`;
        }
        return `${pad(this.hour())}${this.timeSeparator()}${pad(this.minute())}${seconds}`;
    }

    /* ── Input ── */

    onInputChange(event: Event): void {
        if (this.actualDisabled() || this.readonly() || this.readonlyInput()) return;

        const text = (event.target as HTMLInputElement).value;
        this.inputText.set(text);
        this.onInput.emit(text);

        const parsed = this.parseDate(text, this.dateFormat());
        if (parsed) {
            if (this.isArrayMode()) {
                this.value.set([parsed]);
                this.onChange(this.toModelValue([parsed]));
            } else {
                this.value.set(parsed);
                this.onChange(this.toModelValue(parsed));
            }
        } else if (!text) {
            this.value.set(this.isArrayMode() ? [] : null);
            this.onChange(this.toModelValue(this.isArrayMode() ? [] : null));
        }
    }

    onInputBlur(event: Event): void {
        this.isFocused.set(false);
        this.onTouched();
        this.onBlur.emit(event);

        if (this.keepInvalid()) return;

        const parsed = this.parseDate(this.inputText(), this.dateFormat());
        if (!parsed && this.inputText()) {
            const reverted = this.formatValue(this.value());
            this.inputText.set(reverted);
            if (this.inputEl) {
                this.inputEl.nativeElement.value = reverted;
            }
        }
    }

    onInputFocus(event: Event): void {
        this.isFocused.set(true);
        this.onFocus.emit(event);
        if (this.showOnFocus() && !this.inline()) {
            this.open();
        }
    }

    onInputKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.close();
            return;
        }
        if (event.key === 'Enter') {
            const parsed = this.parseDate(this.inputText(), this.dateFormat());
            if (parsed) {
                this.selectDay(parsed, event);
            }
            event.preventDefault();
            return;
        }
        if (event.key === 'ArrowDown' && event.altKey) {
            event.preventDefault();
            this.open();
        }
    }

    clear(event: Event): void {
        event.stopPropagation();
        if (this.actualDisabled() || this.readonly()) return;

        this.value.set(this.isArrayMode() ? [] : null);
        this.rangeStart.set(null);
        this.inputText.set('');
        this.onChange(this.toModelValue(this.isArrayMode() ? [] : null));
        this.onChangeEvent.emit({ value: this.toModelValue(this.isArrayMode() ? [] : null), originalEvent: event });
        this.onClearClick.emit(event);
        this.onClear.emit();
    }

    readonly todayCallback = (event: Event): void => {
        const today = new Date();
        this.viewMonth.set(today.getMonth());
        this.viewYear.set(today.getFullYear());
        this.viewMode.set('date');
        this.selectDay(today, event);
        this.onTodayClick.emit(event);
    };

    readonly clearCallback = (event: Event): void => this.clear(event);

    readonly iconClickCallback = (event?: Event): void => this.toggle();

    onDocumentClick(event: Event): void {
        if (!this.isOpen() || this.inline()) return;
        const target = event.target as Node | null;
        if (target && !this.host.nativeElement.contains(target)) {
            this.close();
            this.onClickOutside.emit(event);
        }
    }

    /* ── ControlValueAccessor ── */

    writeValue(value: any): void {
        const parsed = this.parseModelValue(value);
        this.value.set(parsed);
        this.inputText.set(this.formatValue(parsed));
        this.syncTimeFromValue();

        const reference = (Array.isArray(parsed) ? parsed[0] : parsed) ?? this.defaultDate();
        if (reference) {
            this.viewMonth.set(reference.getMonth());
            this.viewYear.set(reference.getFullYear());
        }
    }

    private parseModelValue(value: any): Date | Date[] | null {
        if (value === null || value === undefined || value === '') {
            return this.isArrayMode() ? [] : null;
        }

        const toDate = (item: any): Date | null => {
            if (item instanceof Date) return item;
            if (typeof item === 'string') {
                const parsed = this.parseDate(item, this.dateFormat());
                if (parsed) return parsed;
                const fallback = new Date(item);
                return Number.isNaN(fallback.getTime()) ? null : fallback;
            }
            return null;
        };

        if (Array.isArray(value)) {
            return value.map(toDate).filter((date): date is Date => !!date);
        }

        const date = toDate(value);
        return date ?? (this.isArrayMode() ? [] : null);
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
