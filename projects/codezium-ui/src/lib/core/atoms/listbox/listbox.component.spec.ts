import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzListboxComponent } from './listbox.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzListboxComponent', () => {
    let component: CzListboxComponent;
    let fixture: ComponentFixture<CzListboxComponent>;

    const options = [
        { name: 'Option 1', val: 1 },
        { name: 'Option 2', val: 2 },
        { name: 'Option 3', val: 3 },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzListboxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzListboxComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', options);
        fixture.componentRef.setInput('optionLabel', 'name');
        fixture.componentRef.setInput('optionValue', 'val');
    });

    function items(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-listbox-item')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    it('should create and render the options', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(items().length).toBe(3);
        expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeTruthy();
        expect(items()[0].getAttribute('role')).toBe('option');
    });

    it('should select a single option and notify CVA + output', () => {
        fixture.detectChanges();

        const changeSpy = vi.fn();
        const outputSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onChangeEvent.subscribe(outputSpy);

        items()[1].click();
        fixture.detectChanges();

        expect(component.value()).toBe(2);
        expect(changeSpy).toHaveBeenCalledWith(2);
        expect(outputSpy).toHaveBeenCalled();
        expect(items()[1].getAttribute('aria-selected')).toBe('true');
    });

    it('should toggle multiple selections', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.detectChanges();

        items()[0].click();
        items()[2].click();
        fixture.detectChanges();
        expect(component.value()).toEqual([1, 3]);

        items()[0].click();
        fixture.detectChanges();
        expect(component.value()).toEqual([3]);
    });

    it('should expose aria-multiselectable in multiple mode', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.detectChanges();

        const list = fixture.nativeElement.querySelector('[role="listbox"]');
        expect(list.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('should navigate with arrows and select with Enter', () => {
        fixture.detectChanges();

        const list = fixture.debugElement.query(By.css('[role="listbox"]')).nativeElement;
        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        fixture.detectChanges();
        expect(component.focusedIndex()).toBe(0);

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        fixture.detectChanges();
        expect(component.focusedIndex()).toBe(1);

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        fixture.detectChanges();
        expect(component.value()).toBe(2);
    });

    it('should support Home and End keys', () => {
        fixture.detectChanges();

        const list = fixture.debugElement.query(By.css('[role="listbox"]')).nativeElement;
        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
        fixture.detectChanges();
        expect(component.focusedIndex()).toBe(2);

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
        fixture.detectChanges();
        expect(component.focusedIndex()).toBe(0);
    });

    it('should filter options', () => {
        fixture.componentRef.setInput('filter', true);
        fixture.detectChanges();

        const filterInput = fixture.debugElement.query(By.css('.cz-listbox-filter-input')).nativeElement;
        filterInput.value = 'Option 2';
        filterInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(items().length).toBe(1);
        expect(items()[0].textContent).toContain('Option 2');
    });

    it('should show the empty message', () => {
        fixture.componentRef.setInput('options', []);
        fixture.componentRef.setInput('emptyMessage', 'Nothing here');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-listbox-empty').textContent).toContain('Nothing here');
    });

    it('should not select when disabled', () => {
        component.setDisabledState?.(true);
        fixture.detectChanges();

        items()[0].click();
        fixture.detectChanges();

        expect(component.value()).toBeNull();
        expect(fixture.nativeElement.classList.contains('cz-listbox--disabled')).toBe(true);
    });

    it('should not select when readonly', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();

        items()[0].click();
        fixture.detectChanges();

        expect(component.value()).toBeNull();
    });

    it('should reflect writeValue', () => {
        component.writeValue(3);
        fixture.detectChanges();

        expect(component.value()).toBe(3);
        expect(items()[2].getAttribute('aria-selected')).toBe('true');
    });

    it('should apply the size attribute', () => {
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLElement).getAttribute('data-size')).toBe('lg');
    });
});
