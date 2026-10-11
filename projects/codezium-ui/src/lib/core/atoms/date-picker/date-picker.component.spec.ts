import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CzDatePickerComponent } from './date-picker.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzDatePickerComponent', () => {
    let component: CzDatePickerComponent;
    let fixture: ComponentFixture<CzDatePickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzDatePickerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzDatePickerComponent);
        component = fixture.componentInstance;
    });

    function input(): HTMLInputElement {
        return fixture.nativeElement.querySelector('.cz-date-picker-native') as HTMLInputElement;
    }

    function openPanel(): void {
        input().dispatchEvent(new FocusEvent('focus'));
        fixture.detectChanges();
    }

    function dayButtons(): HTMLButtonElement[] {
        return Array.from(
            fixture.nativeElement.querySelectorAll('.cz-date-picker-day:not(.cz-date-picker-day--other)'),
        ) as HTMLButtonElement[];
    }

    function findDay(day: number): HTMLButtonElement | undefined {
        return dayButtons().find((button) => button.textContent?.trim() === String(day));
    }

    it('should create with the placeholder and combobox ARIA', () => {
        fixture.componentRef.setInput('placeholder', 'Pick a date');
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(input().getAttribute('placeholder')).toBe('Pick a date');
        expect(input().getAttribute('role')).toBe('combobox');
        expect(input().getAttribute('aria-haspopup')).toBe('dialog');
        expect(input().getAttribute('aria-controls')).toBe(component.panelId());
    });

    it('should open on focus and close with Escape', () => {
        fixture.detectChanges();

        openPanel();
        expect(component.isOpen()).toBe(true);
        expect(fixture.nativeElement.querySelector('.cz-date-picker-panel')).toBeTruthy();

        input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        fixture.detectChanges();
        expect(component.isOpen()).toBe(false);
    });

    it('should not open on focus when showOnFocus is false', () => {
        fixture.componentRef.setInput('showOnFocus', false);
        fixture.detectChanges();

        openPanel();
        expect(component.isOpen()).toBe(false);
    });

    it('should render the weekday header with abbr and a full day grid', () => {
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();
        openPanel();

        const headers = fixture.nativeElement.querySelectorAll('.cz-date-picker-table thead th');
        expect(headers.length).toBe(7);
        expect(headers[0].getAttribute('abbr')).toBeTruthy();
        expect(dayButtons().length).toBeGreaterThanOrEqual(28);
    });

    it('should navigate between months emitting onMonthChange', () => {
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();
        openPanel();

        const spy = vi.fn();
        component.onMonthChange.subscribe(spy);

        const monthBefore = component.monthLabel();
        fixture.debugElement.queryAll(By.css('.cz-date-picker-nav'))[1].nativeElement.click();
        fixture.detectChanges();

        expect(component.monthLabel()).not.toBe(monthBefore);
        expect(component.viewMonth()).toBe(5);
        expect(spy).toHaveBeenCalledWith({ month: 5, year: 2024 });

        fixture.debugElement.queryAll(By.css('.cz-date-picker-nav'))[0].nativeElement.click();
        fixture.detectChanges();
        expect(component.viewMonth()).toBe(4);
    });

    it('should select a single day and notify CVA + outputs', () => {
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();
        openPanel();

        const changeSpy = vi.fn();
        const outputSpy = vi.fn();
        const selectSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onChangeEvent.subscribe(outputSpy);
        component.onSelect.subscribe(selectSpy);

        findDay(20)!.click();
        fixture.detectChanges();

        expect((component.value() as Date).getDate()).toBe(20);
        expect(changeSpy).toHaveBeenCalled();
        expect(outputSpy).toHaveBeenCalled();
        expect(selectSpy).toHaveBeenCalled();
        expect(component.isOpen()).toBe(false);
    });

    it('should support range selection', () => {
        fixture.componentRef.setInput('selectionMode', 'range');
        fixture.componentRef.setInput('readonlyInput', true);
        fixture.detectChanges();
        openPanel();

        component.viewMonth.set(4);
        component.viewYear.set(2024);
        fixture.detectChanges();

        const selectSpy = vi.fn();
        component.onSelect.subscribe(selectSpy);

        findDay(10)!.click();
        fixture.detectChanges();
        expect(component.value()).toEqual([new Date(2024, 4, 10)]);

        findDay(15)!.click();
        fixture.detectChanges();

        const range = component.value() as Date[];
        expect(range.length).toBe(2);
        expect(range[0].getDate()).toBe(10);
        expect(range[1].getDate()).toBe(15);
        expect(selectSpy).toHaveBeenCalled();
        expect(input().value).toContain('-');
    });

    it('should support multiple selection with maxDateCount', () => {
        fixture.componentRef.setInput('selectionMode', 'multiple');
        fixture.componentRef.setInput('maxDateCount', 2);
        fixture.detectChanges();
        openPanel();

        component.viewMonth.set(4);
        component.viewYear.set(2024);
        fixture.detectChanges();

        findDay(10)!.click();
        findDay(12)!.click();
        findDay(14)!.click();
        fixture.detectChanges();

        expect((component.value() as Date[]).length).toBe(2);

        findDay(10)!.click();
        fixture.detectChanges();

        expect((component.value() as Date[]).length).toBe(1);
    });

    it('should display the formatted value and clear it when showClear is enabled', () => {
        fixture.componentRef.setInput('showClear', true);
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();

        expect(input().value).toBe('05/15/2024');

        const clearSpy = vi.fn();
        component.onClear.subscribe(clearSpy);

        const clear = fixture.nativeElement.querySelector('.cz-date-picker-clear') as HTMLElement;
        clear.click();
        fixture.detectChanges();

        expect(component.value()).toBeNull();
        expect(clearSpy).toHaveBeenCalled();
        expect(input().value).toBe('');
    });

    it('should parse string values in writeValue and ignore invalid ones', () => {
        component.writeValue('2024-05-15T00:00:00.000Z');
        fixture.detectChanges();
        expect(component.value()).toBeInstanceOf(Date);

        component.writeValue('not-a-date');
        fixture.detectChanges();
        expect(component.value()).toBeNull();
    });

    it('should parse typed input and revert invalid text on blur', () => {
        fixture.componentRef.setInput('dateFormat', 'dd/mm/yy');
        fixture.detectChanges();

        const inputEl = input();
        inputEl.value = '15/05/2024';
        inputEl.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect((component.value() as Date).getDate()).toBe(15);
        expect((component.value() as Date).getMonth()).toBe(4);

        inputEl.value = 'invalid';
        inputEl.dispatchEvent(new Event('input'));
        inputEl.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(inputEl.value).toBe('15/05/2024');
    });

    it('should write string values with dataType string', () => {
        fixture.componentRef.setInput('dataType', 'string');
        fixture.componentRef.setInput('dateFormat', 'dd/mm/yy');
        fixture.detectChanges();
        openPanel();

        component.viewMonth.set(4);
        component.viewYear.set(2024);
        fixture.detectChanges();

        const changeSpy = vi.fn();
        component.registerOnChange(changeSpy);

        findDay(15)!.click();
        fixture.detectChanges();

        expect(changeSpy).toHaveBeenCalledWith('15/05/2024');
    });

    it('should disable out of range days, disabled days and disabled dates', () => {
        fixture.componentRef.setInput('minDate', new Date(2024, 4, 10));
        fixture.componentRef.setInput('disabledDays', [0]);
        fixture.componentRef.setInput('disabledDates', [new Date(2024, 4, 22)]);
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();
        openPanel();

        expect(findDay(5)?.disabled).toBe(true);
        expect(findDay(13)?.disabled).toBe(false);
        expect(findDay(22)?.disabled).toBe(true);

        const sunday = dayButtons().find((button) => {
            const label = button.getAttribute('aria-label') ?? '';
            return label.includes('Sunday');
        });
        expect(sunday?.disabled).toBe(true);
    });

    it('should mark today and the selected day with aria-selected', () => {
        const today = new Date();
        component.writeValue(today);
        fixture.detectChanges();
        openPanel();

        const todayButton = fixture.nativeElement.querySelector('.cz-date-picker-day--today');
        expect(todayButton).toBeTruthy();
        expect(todayButton.getAttribute('aria-current')).toBe('date');
        expect(fixture.nativeElement.querySelector('.cz-date-picker-day--selected')).toBeTruthy();
    });

    it('should switch between date, month and year views', () => {
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();
        openPanel();

        component.onTitleClick();
        fixture.detectChanges();
        expect(component.viewMode()).toBe('month');
        expect(fixture.nativeElement.querySelector('.cz-date-picker-month-view')).toBeTruthy();

        component.onTitleClick();
        fixture.detectChanges();
        expect(component.viewMode()).toBe('year');
        expect(fixture.nativeElement.querySelector('.cz-date-picker-year-view')).toBeTruthy();

        const yearSpy = vi.fn();
        component.onYearChange.subscribe(yearSpy);
        component.selectYear(2026);
        fixture.detectChanges();

        expect(component.viewYear()).toBe(2026);
        expect(component.viewMode()).toBe('month');
        expect(yearSpy).toHaveBeenCalled();

        component.selectMonth(0);
        fixture.detectChanges();
        expect(component.viewMonth()).toBe(0);
        expect(component.viewMode()).toBe('date');
    });

    it('should support the month and year pickers through the view input', () => {
        fixture.componentRef.setInput('view', 'month');
        fixture.detectChanges();
        openPanel();

        expect(component.viewMode()).toBe('month');
        expect(fixture.nativeElement.querySelectorAll('.cz-date-picker-month-cell').length).toBe(12);

        fixture.componentRef.setInput('view', 'year');
        component.viewMode.set('year');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.cz-date-picker-year-cell').length).toBe(10);
    });

    it('should render the time picker with 12h format and seconds', () => {
        fixture.componentRef.setInput('showTime', true);
        fixture.componentRef.setInput('hourFormat', 12);
        fixture.componentRef.setInput('showSeconds', true);
        fixture.detectChanges();
        openPanel();

        expect(fixture.nativeElement.querySelector('.cz-date-picker-time')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-date-picker-meridiem')).toBeTruthy();
        expect(fixture.nativeElement.querySelectorAll('.cz-date-picker-spinner').length).toBe(3);

        component.hour.set(11);
        component.incrementHour(new Event('click'));
        fixture.detectChanges();
        expect(component.hour()).toBe(12);
    });

    it('should hide the calendar in timeOnly mode', () => {
        fixture.componentRef.setInput('timeOnly', true);
        fixture.detectChanges();
        openPanel();

        expect(fixture.nativeElement.querySelector('.cz-date-picker-table')).toBeNull();
        expect(fixture.nativeElement.querySelector('.cz-date-picker-time--only')).toBeTruthy();
    });

    it('should render the showButtonBar with today and clear callbacks', () => {
        fixture.componentRef.setInput('showButtonBar', true);
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();
        openPanel();

        const barButtons = fixture.nativeElement.querySelectorAll('.cz-date-picker-bar-btn');
        expect(barButtons.length).toBe(2);

        const todaySpy = vi.fn();
        component.onTodayClick.subscribe(todaySpy);

        barButtons[0].click();
        fixture.detectChanges();

        expect(todaySpy).toHaveBeenCalled();
        expect(component.isToday(component.value() as Date)).toBe(true);

        component.open();
        fixture.detectChanges();

        const freshButtons = fixture.nativeElement.querySelectorAll('.cz-date-picker-bar-btn');
        freshButtons[1].click();
        fixture.detectChanges();
        expect(component.value()).toBeNull();
    });

    it('should render inline without the input', () => {
        fixture.componentRef.setInput('inline', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-date-picker-native')).toBeNull();
        expect(fixture.nativeElement.querySelector('.cz-date-picker-panel')).toBeTruthy();
    });

    it('should render multiple months and week numbers', () => {
        fixture.componentRef.setInput('numberOfMonths', 2);
        fixture.componentRef.setInput('showWeek', true);
        fixture.componentRef.setInput('inline', true);
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelectorAll('.cz-date-picker-table').length).toBe(2);
        expect(fixture.nativeElement.querySelectorAll('.cz-date-picker-week-number').length).toBeGreaterThan(0);
    });

    it('should invoke todayCallback and clearCallback from the button bar context', () => {
        const hostFixture = TestBed.createComponent(ButtonBarCallbackHostComponent);
        hostFixture.detectChanges();

        const host = hostFixture.componentInstance.datePicker;
        host.open();
        hostFixture.detectChanges();

        const todayButton = hostFixture.nativeElement.querySelector('.ctx-today') as HTMLElement;
        expect(todayButton).toBeTruthy();
        todayButton.click();
        hostFixture.detectChanges();

        expect(host.isToday(host.value() as Date)).toBe(true);

        host.open();
        hostFixture.detectChanges();

        const clearButton = hostFixture.nativeElement.querySelector('.ctx-clear') as HTMLElement;
        clearButton.click();
        hostFixture.detectChanges();

        expect(host.value()).toBeNull();
    });

    it('should render the date, header and footer templates', () => {
        const hostFixture = TestBed.createComponent(TemplatesHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-dp-header')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelector('.custom-dp-footer')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelector('.custom-dp-day')).toBeTruthy();
    });

    it('should not open when disabled and apply the size attribute', () => {
        component.setDisabledState?.(true);
        fixture.componentRef.setInput('size', 'sm');
        fixture.detectChanges();

        component.open();
        fixture.detectChanges();

        expect(component.isOpen()).toBe(false);
        expect(fixture.nativeElement.classList.contains('cz-date-picker--disabled')).toBe(true);
        expect((fixture.nativeElement as HTMLElement).getAttribute('data-size')).toBe('sm');
    });

    it('should emit onClickOutside when clicking outside the open panel', () => {
        fixture.detectChanges();
        openPanel();

        const spy = vi.fn();
        component.onClickOutside.subscribe(spy);

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        fixture.detectChanges();

        expect(component.isOpen()).toBe(false);
        expect(spy).toHaveBeenCalled();
    });

    it('should format and parse dates with PrimeNG tokens', () => {
        const date = new Date(2024, 4, 15, 14, 30);
        expect(component.formatDate(date, 'dd/mm/yy')).toBe('15/05/2024');
        expect(component.formatDate(date, 'dd/mm/y')).toBe('15/05/24');
        expect(component.formatDate(date, 'DD, MM d, yy')).toContain('2024');

        const parsed = component.parseDate('15/05/2024', 'dd/mm/yy');
        expect(parsed?.getDate()).toBe(15);
        expect(parsed?.getMonth()).toBe(4);
        expect(parsed?.getFullYear()).toBe(2024);

        expect(component.parseDate('nope', 'dd/mm/yy')).toBeNull();
    });
});

@Component({
    imports: [CzDatePickerComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-date-picker [showButtonBar]="true">
            <ng-template #buttonBarTemplate let-todayCallback="todayCallback" let-clearCallback="clearCallback">
                <button type="button" class="ctx-today" (click)="todayCallback($event)">today</button>
                <button type="button" class="ctx-clear" (click)="clearCallback($event)">clear</button>
            </ng-template>
        </cz-date-picker>
    `,
})
class ButtonBarCallbackHostComponent {
    @ViewChild(CzDatePickerComponent) datePicker!: CzDatePickerComponent;
}

@Component({
    imports: [CzDatePickerComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-date-picker [inline]="true">
            <ng-template #headerTemplate>
                <span class="custom-dp-header">Header</span>
            </ng-template>

            <ng-template #footerTemplate>
                <span class="custom-dp-footer">Footer</span>
            </ng-template>

            <ng-template #dateTemplate let-date>
                <span class="custom-dp-day">{{ date.day }}</span>
            </ng-template>
        </cz-date-picker>
    `,
})
class TemplatesHostComponent {}
