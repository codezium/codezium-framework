import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzSelectButtonComponent } from './select-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    imports: [CzSelectButtonComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <cz-select-button [options]="options" optionLabel="name" optionValue="value">
            <ng-template #itemTemplate let-option>
                <span class="custom-item">[{{ option.name }}]</span>
            </ng-template>
        </cz-select-button>
    `,
})
class SelectButtonTemplateHostComponent {
    options = [
        { name: 'Option 1', value: 1 },
        { name: 'Option 2', value: 2 },
    ];
}

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

    it('should disable specific options with optionDisabled as a field name', () => {
        fixture.componentRef.setInput('options', [
            { name: 'Off', value: 'off' },
            { name: 'On', value: 'on', constant: true }
        ]);
        fixture.componentRef.setInput('optionDisabled', 'constant');
        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        expect(buttons[1].disabled).toBe(true);

        buttons[1].click();
        fixture.detectChanges();
        expect(component.value()).toBeNull();

        buttons[0].click();
        fixture.detectChanges();
        expect(component.value()).toBe('off');
    });

    it('should disable specific options with optionDisabled as a function', () => {
        fixture.componentRef.setInput('optionDisabled', (item: any) => item.value === 2);
        fixture.detectChanges();

        expect(component.isOptionDisabled(options[1])).toBe(true);
        expect(component.isButtonDisabled(options[1])).toBe(true);
        expect(component.isOptionDisabled(options[0])).toBe(false);
    });

    it('should not clear the selection when unselectable is enabled', () => {
        fixture.componentRef.setInput('unselectable', true);
        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        buttons[0].click();
        fixture.detectChanges();
        expect(component.value()).toBe(1);

        buttons[0].click();
        fixture.detectChanges();
        expect(component.value()).toBe(1);
    });

    it('should keep the selection when allowEmpty is false (single)', () => {
        fixture.componentRef.setInput('allowEmpty', false);
        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        buttons[0].click();
        fixture.detectChanges();
        expect(component.value()).toBe(1);

        buttons[0].click();
        fixture.detectChanges();
        expect(component.value()).toBe(1);
    });

    it('should prevent removing the last value in multiple mode when allowEmpty is false', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.componentRef.setInput('allowEmpty', false);
        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        buttons[0].click();
        buttons[1].click();
        fixture.detectChanges();
        expect(component.value()).toEqual([1, 2]);

        buttons[0].click();
        fixture.detectChanges();
        expect(component.value()).toEqual([2]);

        // Last remaining value cannot be removed
        buttons[1].click();
        fixture.detectChanges();
        expect(component.value()).toEqual([2]);
    });

    it('should apply the invalid state from the invalid input', () => {
        fixture.componentRef.setInput('invalid', true);
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('cz-select-button--has-error')).toBe(true);
    });

    it('should emit onChange with originalEvent and value', () => {
        const spy = vi.fn();
        component.onChangeEvent.subscribe(spy);

        fixture.nativeElement.querySelectorAll('.cz-select-button-option')[1].click();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0].value).toBe(2);
        expect(spy.mock.calls[0][0].originalEvent).toBeTruthy();
    });

    it('should emit onOptionClick with option and index', () => {
        const spy = vi.fn();
        component.onOptionClickEvent.subscribe(spy);

        fixture.nativeElement.querySelectorAll('.cz-select-button-option')[2].click();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0].option).toEqual(options[2]);
        expect(spy.mock.calls[0][0].index).toBe(2);
    });

    it('should compare values with dataKey when provided', () => {
        fixture.componentRef.setInput('dataKey', 'id');
        fixture.componentRef.setInput('optionValue', undefined);
        fixture.componentRef.setInput('options', [
            { id: 1, name: 'Option 1' },
            { id: 2, name: 'Option 2' }
        ]);
        component.writeValue({ id: 2, name: 'Option 2' });
        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll('.cz-select-button-option');
        expect(buttons[1].classList.contains('cz-select-button-option--active')).toBe(true);
        expect(component.isSelected({ id: 2, name: 'Anything' })).toBe(true);
    });

    it('should expose group and button aria attributes', () => {
        fixture.componentRef.setInput('ariaLabelledBy', 'external-label');
        fixture.componentRef.setInput('label', 'Group Label');
        fixture.detectChanges();

        const container = fixture.nativeElement.querySelector('.cz-select-button-container');
        expect(container.getAttribute('role')).toBe('group');
        expect(container.getAttribute('aria-labelledby')).toBe('external-label');

        const button = fixture.nativeElement.querySelector('.cz-select-button-option');
        expect(button.getAttribute('aria-pressed')).toBe('false');
        expect(button.getAttribute('aria-label')).toBe('Option 1');

        fixture.componentRef.setInput('ariaLabelledBy', null);
        fixture.detectChanges();
        const labelEl = fixture.nativeElement.querySelector('.cz-select-button-label-group');
        expect(container.getAttribute('aria-labelledby')).toBe(labelEl.getAttribute('id'));
    });

    it('should render the item template with the option as implicit context', () => {
        const hostFixture = TestBed.createComponent(SelectButtonTemplateHostComponent);
        hostFixture.detectChanges();

        const items = hostFixture.nativeElement.querySelectorAll('.custom-item');
        expect(items.length).toBe(2);
        expect(items[0].textContent).toBe('[Option 1]');
    });
});
