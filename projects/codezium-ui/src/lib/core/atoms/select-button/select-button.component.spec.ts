import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzSelectButtonComponent } from './select-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzSelectButtonComponent', () => {
    let component: CzSelectButtonComponent;
    let fixture: ComponentFixture<CzSelectButtonComponent>;

    const options = [
        { name: 'Option 1', value: 1 },
        { name: 'Option 2', value: 2 },
        { name: 'Option 3', value: 3 }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzSelectButtonComponent, FormsModule, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(CzSelectButtonComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', options);
        fixture.componentRef.setInput('optionLabel', 'name');
        fixture.componentRef.setInput('optionValue', 'value');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render all options', () => {
        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        expect(buttons.length).toBe(3);
        expect(buttons[0].textContent.trim()).toBe('Option 1');
    });

    it('should select an option on click (single)', () => {
        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        buttons[1].click();
        fixture.detectChanges();
        
        expect(component.value()).toBe(2);
        expect(buttons[1].classList.contains('cz-select-button-option--active')).toBe(true);
    });

    it('should unselect if same option is clicked (single)', () => {
        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        buttons[0].click();
        fixture.detectChanges();
        expect(component.value()).toBe(1);

        buttons[0].click();
        fixture.detectChanges();
        expect(component.value()).toBeNull();
    });

    it('should allow multiple selection', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        buttons[0].click();
        buttons[2].click();
        fixture.detectChanges();

        expect(component.value()).toEqual([1, 3]);
        expect(buttons[0].classList.contains('cz-select-button-option--active')).toBe(true);
        expect(buttons[2].classList.contains('cz-select-button-option--active')).toBe(true);
    });

    it('should respect disabled state', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        buttons[0].click();
        fixture.detectChanges();

        expect(component.value()).toBeNull();
        expect(buttons[0].disabled).toBe(true);
    });

    it('should handle keyboard Enter key', () => {
        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        buttons[0].dispatchEvent(event);
        fixture.detectChanges();

        expect(component.value()).toBe(1);
    });

    it('should handle navigation with ArrowRight', () => {
        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        component.focusedIndex.set(0);
        
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        buttons[0].dispatchEvent(event);
        fixture.detectChanges();

        expect(component.focusedIndex()).toBe(1);
    });

    it('should integrate with writeValue (CVA)', () => {
        component.writeValue(2);
        fixture.detectChanges();
        expect(component.value()).toBe(2);
        
        const activeBtn = fixture.nativeElement.querySelector('.cz-select-button-option--active');
        expect(activeBtn.textContent.trim()).toBe('Option 2');
    });
});
