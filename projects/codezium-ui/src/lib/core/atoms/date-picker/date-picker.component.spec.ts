import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzDatePickerComponent } from './date-picker.component';
import { By } from '@angular/platform-browser';
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

    function trigger(): HTMLElement {
        return fixture.debugElement.query(By.css('.cz-date-picker-input')).nativeElement;
    }

    function dayButtons(): HTMLButtonElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-date-picker-day:not(.cz-date-picker-day--empty)')).map((el) => el.nativeElement),
        ) as HTMLButtonElement[];
    }

    it('should create and show the placeholder', () => {
        fixture.componentRef.setInput('placeholder', 'Pick a date');
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-date-picker-placeholder').textContent).toContain('Pick a date');
        expect(trigger().getAttribute('aria-haspopup')).toBe('dialog');
    });

    it('should open and close the calendar', () => {
        fixture.detectChanges();

        trigger().click();
        fixture.detectChanges();
        expect(component.isOpen()).toBe(true);
        expect(fixture.nativeElement.querySelector('.cz-date-picker-panel')).toBeTruthy();

        trigger().click();
        fixture.detectChanges();
        expect(component.isOpen()).toBe(false);
    });

    it('should render weekdays and a full day grid', () => {
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        const weekdays = fixture.nativeElement.querySelectorAll('.cz-date-picker-weekdays span');
        expect(weekdays.length).toBe(7);
        expect(dayButtons().length).toBeGreaterThanOrEqual(28);
    });

    it('should navigate between months', () => {
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        const monthBefore = component.monthLabel();

        fixture.debugElement.queryAll(By.css('.cz-date-picker-nav'))[1].nativeElement.click();
        fixture.detectChanges();
        expect(component.monthLabel()).not.toBe(monthBefore);
        expect(component.viewMonth()).toBe(5);

        fixture.debugElement.queryAll(By.css('.cz-date-picker-nav'))[0].nativeElement.click();
        fixture.detectChanges();
        expect(component.viewMonth()).toBe(4);
    });

    it('should select a day and notify CVA + output', () => {
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        const changeSpy = vi.fn();
        const outputSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onChangeEvent.subscribe(outputSpy);

        const target = dayButtons().find((btn) => btn.textContent?.trim() === '20');
        expect(target).toBeTruthy();
        target!.click();
        fixture.detectChanges();

        expect(component.value()?.getDate()).toBe(20);
        expect(changeSpy).toHaveBeenCalled();
        expect(outputSpy).toHaveBeenCalled();
        expect(component.isOpen()).toBe(false);
    });

    it('should display the formatted value and clear it', () => {
        component.writeValue(new Date(2024, 4, 15));
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-date-picker-value')).toBeTruthy();

        const clear = fixture.debugElement.query(By.css('.cz-date-picker-clear')).nativeElement;
        clear.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        fixture.detectChanges();

        expect(component.value()).toBeNull();
        expect(fixture.nativeElement.querySelector('.cz-date-picker-placeholder')).toBeTruthy();
    });

    it('should parse string values in writeValue and ignore invalid ones', () => {
        component.writeValue('2024-05-15T00:00:00.000Z');
        fixture.detectChanges();
        expect(component.value()).toBeInstanceOf(Date);

        component.writeValue('not-a-date');
        fixture.detectChanges();
        expect(component.value()).toBeNull();
    });

    it('should disable out of range days', () => {
        component.writeValue(new Date(2024, 4, 15));
        fixture.componentRef.setInput('minDate', new Date(2024, 4, 10));
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        const day5 = dayButtons().find((btn) => btn.textContent?.trim() === '5');
        expect(day5?.disabled).toBe(true);

        const day12 = dayButtons().find((btn) => btn.textContent?.trim() === '12');
        expect(day12?.disabled).toBe(false);
    });

    it('should mark today and the selected day', () => {
        const today = new Date();
        component.writeValue(today);
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-date-picker-day--today')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-date-picker-day--selected')).toBeTruthy();
    });

    it('should close with Escape', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        fixture.detectChanges();

        expect(component.isOpen()).toBe(false);
    });

    it('should not open when disabled', () => {
        component.setDisabledState?.(true);
        fixture.detectChanges();

        trigger().click();
        fixture.detectChanges();

        expect(component.isOpen()).toBe(false);
        expect(fixture.nativeElement.classList.contains('cz-date-picker--disabled')).toBe(true);
    });

    it('should apply the size attribute', () => {
        fixture.componentRef.setInput('size', 'sm');
        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLElement).getAttribute('data-size')).toBe('sm');
    });
});
