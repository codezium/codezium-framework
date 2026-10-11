import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzToggleButtonComponent } from './toggle-button.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
    imports: [CzToggleButtonComponent, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-toggle-button
            [formControl]="control"
            label="Notifications"
            locale="en"
            helperText="Enable notifications"
        />
    `,
})
class TestHostComponent {
    control = new FormControl<boolean>(false, [() => ({ required: true })]);
}

describe('CzToggleButtonComponent', () => {
    let component: CzToggleButtonComponent;
    let fixture: ComponentFixture<CzToggleButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzToggleButtonComponent, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CzToggleButtonComponent);
        component = fixture.componentInstance;
        // Note: no initial detectChanges() here to prevent NG0100 when tests mutate inputs afterwards
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should have default values', () => {
        fixture.detectChanges();
        expect(component.onLabel()).toBe('On');
        expect(component.offLabel()).toBe('Off');
        expect(component.size()).toBe('md');
        expect(component.color()).toBe('primary');
        expect(component.theme()).toBe('base');
        expect(component.checked()).toBe(false);
        expect(component.actualDisabled()).toBe(false);
    });

    describe('Interaction', () => {
        it('should toggle on click and notify CVA + output', () => {
            fixture.detectChanges();

            const changeSpy = vi.fn();
            const outputSpy = vi.fn();
            component.registerOnChange(changeSpy);
            component.onCheckedChange.subscribe(outputSpy);

            const button = fixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement;
            button.click();
            fixture.detectChanges();

            expect(component.checked()).toBe(true);
            expect(changeSpy).toHaveBeenCalledWith(true);
            expect(outputSpy).toHaveBeenCalledWith(true);
        });

        it('should toggle back off on second click', () => {
            fixture.detectChanges();

            const button = fixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement;
            button.click();
            fixture.detectChanges();
            button.click();
            fixture.detectChanges();

            expect(component.checked()).toBe(false);
        });

        it('should toggle with Enter and Space keys', () => {
            fixture.detectChanges();

            const button = fixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement;

            button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            fixture.detectChanges();
            expect(component.checked()).toBe(true);

            button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
            fixture.detectChanges();
            expect(component.checked()).toBe(false);
        });

        it('should ignore other keys', () => {
            fixture.detectChanges();

            const button = fixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement;
            button.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
            fixture.detectChanges();

            expect(component.checked()).toBe(false);
        });

        it('should not toggle when disabled', () => {
            fixture.componentRef.setInput('disabled', true);
            fixture.detectChanges();

            const changeSpy = vi.fn();
            component.registerOnChange(changeSpy);

            const button = fixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement;
            button.click();
            fixture.detectChanges();

            expect(component.checked()).toBe(false);
            expect(changeSpy).not.toHaveBeenCalled();
            expect(button.disabled).toBe(true);
        });

        it('should not toggle when readonly', () => {
            fixture.componentRef.setInput('readonly', true);
            fixture.detectChanges();

            component.toggle(new MouseEvent('click'));
            fixture.detectChanges();

            expect(component.checked()).toBe(false);
        });
    });

    describe('ControlValueAccessor', () => {
        it('should reflect writeValue in checked state', () => {
            component.writeValue(true);
            fixture.detectChanges();

            expect(component.checked()).toBe(true);
            const button = fixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement;
            expect(button.getAttribute('aria-pressed')).toBe('true');
        });

        it('should update disabled state via setDisabledState', () => {
            component.setDisabledState?.(true);
            fixture.detectChanges();

            expect(component.actualDisabled()).toBe(true);
            expect(fixture.nativeElement.classList.contains('cz-toggle-button--disabled')).toBe(true);
        });

        it('should call onTouched on blur', () => {
            fixture.detectChanges();

            const touchedSpy = vi.fn();
            component.registerOnTouched(touchedSpy);

            const button = fixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement;
            button.dispatchEvent(new Event('blur'));

            expect(touchedSpy).toHaveBeenCalled();
        });
    });

    describe('Rendering', () => {
        it('should render off label by default and on label when checked', () => {
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('.cz-toggle-button-text-off').textContent).toContain('Off');

            component.writeValue(true);
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('.cz-toggle-button-text-on').textContent).toContain('On');
        });

        it('should render custom on/off labels and icons', () => {
            fixture.componentRef.setInput('onLabel', 'Enabled');
            fixture.componentRef.setInput('offLabel', 'Disabled');
            fixture.componentRef.setInput('onIcon', 'pi pi-check');
            fixture.componentRef.setInput('offIcon', 'pi pi-times');
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('.cz-toggle-button-text-off').textContent).toContain('Disabled');
            expect(fixture.nativeElement.querySelector('.cz-toggle-button-icon-off')).toBeTruthy();

            component.writeValue(true);
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('.cz-toggle-button-text-on').textContent).toContain('Enabled');
            const onIcon = fixture.nativeElement.querySelector('.cz-toggle-button-icon-on');
            expect(onIcon).toBeTruthy();
            expect(onIcon.classList.contains('pi')).toBe(true);
        });

        it('should apply host attributes and state classes', () => {
            fixture.componentRef.setInput('size', 'lg');
            fixture.componentRef.setInput('color', 'success');
            fixture.componentRef.setInput('theme', 'neo');
            component.writeValue(true);
            fixture.detectChanges();

            const host = fixture.nativeElement as HTMLElement;
            expect(host.getAttribute('data-size')).toBe('lg');
            expect(host.getAttribute('data-color')).toBe('success');
            expect(host.getAttribute('data-theme')).toBe('neo');
            expect(host.classList.contains('cz-toggle-button--checked')).toBe(true);
        });

        it('should apply aria attributes', () => {
            fixture.componentRef.setInput('ariaLabel', 'Toggle notifications');
            fixture.componentRef.setInput('ariaLabelledBy', 'notif-label');
            fixture.detectChanges();

            const button = fixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement;
            expect(button.getAttribute('aria-label')).toBe('Toggle notifications');
            expect(button.getAttribute('aria-labelledby')).toBe('notif-label');
        });

        it('should apply label position classes', () => {
            fixture.componentRef.setInput('label', 'Toggle');
            fixture.componentRef.setInput('labelPosition', 'left');
            fixture.detectChanges();

            const container = fixture.nativeElement.querySelector('.cz-toggle-button-container');
            expect(container.classList.contains('cz-toggle-button-container--label-left')).toBe(true);
        });

        it('should show helper text when provided', () => {
            fixture.componentRef.setInput('helperText', 'Some help');
            fixture.detectChanges();

            const helper = fixture.nativeElement.querySelector('.cz-toggle-button-helper');
            expect(helper.textContent).toContain('Some help');
        });
    });

    describe('Reactive Forms integration', () => {
        let hostFixture: ComponentFixture<TestHostComponent>;

        beforeEach(() => {
            hostFixture = TestBed.createComponent(TestHostComponent);
        });

        it('should bind the form control value', () => {
            hostFixture.detectChanges();

            const button = hostFixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement;
            button.click();
            hostFixture.detectChanges();

            expect(hostFixture.componentInstance.control.value).toBe(true);
        });

        it('should show localized error message when invalid and touched', () => {
            hostFixture.componentInstance.control.markAsTouched();
            hostFixture.detectChanges();

            const error = hostFixture.nativeElement.querySelector('.cz-toggle-button-error');
            expect(error).toBeTruthy();
            expect(error.textContent).toContain('This field is required.');
            expect(hostFixture.nativeElement.querySelector('.cz-toggle-button-helper')).toBeNull();
        });

        it('should show error when disabled by form control', () => {
            hostFixture.componentInstance.control.disable();
            hostFixture.detectChanges();

            const button = hostFixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement;
            expect(button.disabled).toBe(true);

            const toggleHost = hostFixture.debugElement.query(By.directive(CzToggleButtonComponent)).nativeElement;
            expect(toggleHost.classList.contains('cz-toggle-button--disabled')).toBe(true);
        });
    });
        it('should apply the invalid state from the invalid input', () => {
            fixture.componentRef.setInput('invalid', true);
            fixture.detectChanges();
            expect(fixture.nativeElement.classList.contains('cz-toggle-button--has-error')).toBe(true);
        });

        it('should not clear the selection when allowEmpty is false', () => {
            fixture.componentRef.setInput('allowEmpty', false);
            component.writeValue(true);
            fixture.detectChanges();

            const button = fixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement;
            button.click();
            fixture.detectChanges();

            expect(component.checked()).toBe(true);
        });

        it('should emit onChange with originalEvent and checked', () => {
            fixture.detectChanges();
            const spy = vi.fn();
            component.onChangeEvent.subscribe(spy);

            fixture.debugElement.query(By.css('.cz-toggle-button-input')).nativeElement.click();

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0][0].checked).toBe(true);
            expect(spy.mock.calls[0][0].originalEvent).toBeTruthy();
        });

});
