import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzRadioButtonComponent, CzRadioButtonChangeEvent } from './radio-button.component';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { vi } from 'vitest';

@Component({
    template: `
        <cz-radio-button 
            [value]="'option1'" 
            [(ngModel)]="selectedValue"
            (onChange)="onChange($event)"
            label="Option 1">
        </cz-radio-button>
        <cz-radio-button 
            [value]="'option2'" 
            [(ngModel)]="selectedValue"
            label="Option 2">
        </cz-radio-button>
    `,
    standalone: true,
    imports: [CzRadioButtonComponent, FormsModule]
})
class TestHostComponent {
    selectedValue = 'option1';
    onChange(event: CzRadioButtonChangeEvent) {}
}

describe('CzRadioButtonComponent', () => {
    let component: CzRadioButtonComponent;
    let fixture: ComponentFixture<CzRadioButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzRadioButtonComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CzRadioButtonComponent);
        component = fixture.componentInstance;
        // Set required input
        fixture.componentRef.setInput('value', 'val1');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show label when provided', () => {
        fixture.componentRef.setInput('label', 'Test Label');
        fixture.detectChanges();
        const labelEl = fixture.nativeElement.querySelector('.cz-radio-label');
        expect(labelEl.textContent.trim()).toBe('Test Label');
    });

    it('should be checked when model value matches component value', () => {
        component.writeValue('val1');
        fixture.detectChanges();
        expect(component.checked()).toBe(true);
        const container = fixture.nativeElement.querySelector('.cz-radio-container');
        expect(container.classList.contains('cz-radio-checked')).toBe(true);
    });

    it('should not be checked when model value does not match component value', () => {
        component.writeValue('val2');
        fixture.detectChanges();
        expect(component.checked()).toBe(false);
        const container = fixture.nativeElement.querySelector('.cz-radio-container');
        expect(container.classList.contains('cz-radio-checked')).toBe(false);
    });

    it('should select value on click', () => {
        const spy = vi.spyOn(component.onChangeEvent, 'emit');
        const changeSpy = vi.fn();
        component.registerOnChange(changeSpy);
        
        const container = fixture.nativeElement.querySelector('.cz-radio-container');
        container.click();
        
        expect(component.model()).toBe('val1');
        expect(changeSpy).toHaveBeenCalledWith('val1');
        expect(spy).toHaveBeenCalled();
    });

    it('should not select value on click if disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        
        const changeSpy = vi.fn();
        component.registerOnChange(changeSpy);
        
        const container = fixture.nativeElement.querySelector('.cz-radio-container');
        container.click();
        
        expect(component.model()).toBeNull();
        expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should not select value on click if readonly', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        
        const changeSpy = vi.fn();
        component.registerOnChange(changeSpy);
        
        const container = fixture.nativeElement.querySelector('.cz-radio-container');
        container.click();
        
        expect(component.model()).toBeNull();
        expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should emit focused signal on focus and blur', () => {
        const input = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new Event('focus'));
        expect(component.focused()).toBe(true);
        
        input.dispatchEvent(new Event('blur'));
        expect(component.focused()).toBe(false);
    });

    it('should apply color and size classes', () => {
        fixture.componentRef.setInput('color', 'success');
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();
        
        const inner = fixture.nativeElement.querySelector('.cz-radio-inner');
        expect(inner.classList.contains('cz-radio-inner--success')).toBe(true);
        expect(inner.classList.contains('cz-radio-inner--lg')).toBe(true);
    });

    it('should display helper text', () => {
        fixture.componentRef.setInput('helperText', 'Select one');
        fixture.detectChanges();
        
        const helper = fixture.nativeElement.querySelector('.cz-radio-helper');
        expect(helper.textContent.trim()).toBe('Select one');
    });

    it('should update disabled state via ControlValueAccessor', () => {
        component.setDisabledState(true);
        fixture.detectChanges();
        expect(component.isDisabled()).toBe(true);
        
        expect(fixture.nativeElement.classList.contains('cz-radio--disabled')).toBe(true);
    });
});
