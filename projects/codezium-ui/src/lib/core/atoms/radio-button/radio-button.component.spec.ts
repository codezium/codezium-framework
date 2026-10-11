import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzRadioButtonComponent } from './radio-button.component';
import { vi } from 'vitest';

describe('CzRadioButtonComponent', () => {
  let component: CzRadioButtonComponent;
  let fixture: ComponentFixture<CzRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CzRadioButtonComponent],
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

  it('should render a native radio input linked to its label', () => {
    fixture.componentRef.setInput('name', 'group1');
    fixture.componentRef.setInput('label', 'Option');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('radio');
    expect(input.getAttribute('name')).toBe('group1');
    expect(input.id).toBe('group1_val1');

    const label = fixture.nativeElement.querySelector('label');
    expect(label.getAttribute('for')).toBe('group1_val1');
  });
});


describe('CzRadioButtonComponent — PrimeNG parity', () => {
    let fixture: ComponentFixture<CzRadioButtonComponent>;
    let component: CzRadioButtonComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzRadioButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzRadioButtonComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('value', 'strawberry');
    });

    function input(): HTMLInputElement {
        return fixture.nativeElement.querySelector('.cz-radio-native') as HTMLInputElement;
    }

    it('should use inputId for the input and the label', () => {
        fixture.componentRef.setInput('inputId', 'ingredient-strawberry');
        fixture.componentRef.setInput('label', 'Strawberry');
        fixture.detectChanges();

        expect(input().getAttribute('id')).toBe('ingredient-strawberry');
        expect(fixture.nativeElement.querySelector('.cz-radio-label').getAttribute('for')).toBe('ingredient-strawberry');
    });

    it('should apply accessibility and native attributes', () => {
        fixture.componentRef.setInput('ariaLabel', 'Strawberry option');
        fixture.componentRef.setInput('ariaLabelledBy', 'external-label');
        fixture.componentRef.setInput('tabindex', 3);
        fixture.componentRef.setInput('autofocus', true);
        fixture.detectChanges();

        expect(input().getAttribute('aria-label')).toBe('Strawberry option');
        expect(input().getAttribute('aria-labelledby')).toBe('external-label');
        expect(input().getAttribute('tabindex')).toBe('3');
        expect(input().hasAttribute('autofocus')).toBe(true);
    });

    it('should support binary mode', () => {
        fixture.componentRef.setInput('binary', true);
        component.writeValue(true);
        fixture.detectChanges();

        expect(component.checked()).toBe(true);
        expect(input().checked).toBe(true);

        const spy = vi.fn();
        component.registerOnChange(spy);

        component.writeValue(false);
        fixture.detectChanges();

        input().click();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith(true);
    });

    it('should apply the filled variant', () => {
        fixture.componentRef.setInput('variant', 'filled');
        fixture.detectChanges();

        expect(fixture.nativeElement.classList.contains('cz-radio--filled')).toBe(true);
    });

    it('should apply the invalid state', () => {
        fixture.componentRef.setInput('invalid', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-radio-invalid')).toBeTruthy();
        expect(input().getAttribute('aria-invalid')).toBe('true');
    });

    it('should emit onClick, onFocus and onBlur', () => {
        fixture.detectChanges();

        const clickSpy = vi.fn();
        const focusSpy = vi.fn();
        const blurSpy = vi.fn();
        component.onClick.subscribe(clickSpy);
        component.onFocusEvent.subscribe(focusSpy);
        component.onBlurEvent.subscribe(blurSpy);

        input().click();
        input().dispatchEvent(new FocusEvent('focus'));
        input().dispatchEvent(new FocusEvent('blur'));
        fixture.detectChanges();

        expect(clickSpy).toHaveBeenCalledWith(expect.objectContaining({ value: 'strawberry' }));
        expect(focusSpy).toHaveBeenCalled();
        expect(blurSpy).toHaveBeenCalled();
    });

    it('should expose a focus method', () => {
        fixture.detectChanges();

        component.focus();

        expect(document.activeElement).toBe(input());
    });
});
