import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzCascadeSelectComponent, CzCascadeSelectOption } from './cascade-select.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzCascadeSelectComponent', () => {
    let component: CzCascadeSelectComponent;
    let fixture: ComponentFixture<CzCascadeSelectComponent>;

    const options: CzCascadeSelectOption[] = [
        {
            label: 'USA',
            value: 'us',
            items: [
                { label: 'New York', value: 'ny' },
                { label: 'Florida', value: 'fl' },
            ],
        },
        {
            label: 'Italy',
            value: 'it',
            items: [{ label: 'Rome', value: 'rome' }],
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzCascadeSelectComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzCascadeSelectComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', options);
        fixture.componentRef.setInput('placeholder', 'Select a city');
    });

    function trigger(): HTMLElement {
        return fixture.debugElement.query(By.css('.cz-cascade-select-trigger')).nativeElement;
    }

    function columns(): HTMLElement[][] {
        return fixture.debugElement
            .queryAll(By.css('.cz-cascade-select-column'))
            .map((col) =>
                Array.from(col.queryAll(By.css('.cz-cascade-select-option')).map((el) => el.nativeElement)),
            ) as HTMLElement[][];
    }

    it('should create and show the placeholder', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-cascade-select-placeholder').textContent).toContain('Select a city');
        expect(trigger().getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should open showing the first column', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        expect(component.isOpen()).toBe(true);
        expect(columns().length).toBe(1);
        expect(columns()[0].length).toBe(2);
    });

    it('should drill down into child columns on hover', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        columns()[0][0].dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();

        expect(columns().length).toBe(2);
        expect(columns()[1].length).toBe(2);
        expect(columns()[1][0].textContent).toContain('New York');
    });

    it('should select a leaf option and notify CVA + output', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        const changeSpy = vi.fn();
        const outputSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onChangeEvent.subscribe(outputSpy);

        columns()[0][0].dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();
        columns()[1][0].click();
        fixture.detectChanges();

        expect(component.value()).toBe('ny');
        expect(changeSpy).toHaveBeenCalledWith('ny');
        expect(outputSpy).toHaveBeenCalled();
        expect(component.isOpen()).toBe(false);
        expect(fixture.nativeElement.querySelector('.cz-cascade-select-value').textContent).toContain('USA / New York');
    });

    it('should show the selected path with writeValue', () => {
        component.writeValue('rome');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-cascade-select-value').textContent).toContain('Italy / Rome');
    });

    it('should clear the value when clearable', () => {
        fixture.componentRef.setInput('clearable', true);
        component.writeValue('rome');
        fixture.detectChanges();

        const clear = fixture.debugElement.query(By.css('.cz-cascade-select-clear')).nativeElement;
        clear.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        fixture.detectChanges();

        expect(component.value()).toBeNull();
    });

    it('should not open when disabled', () => {
        component.setDisabledState?.(true);
        fixture.detectChanges();

        trigger().click();
        fixture.detectChanges();

        expect(component.isOpen()).toBe(false);
        expect(fixture.nativeElement.classList.contains('cz-cascade-select--disabled')).toBe(true);
    });

    it('should close with Escape', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        fixture.detectChanges();

        expect(component.isOpen()).toBe(false);
    });
});
