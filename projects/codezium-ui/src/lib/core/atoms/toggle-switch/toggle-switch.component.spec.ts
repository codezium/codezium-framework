import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzToggleSwitchComponent } from './toggle-switch.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzToggleSwitchComponent', () => {
    let component: CzToggleSwitchComponent;
    let fixture: ComponentFixture<CzToggleSwitchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzToggleSwitchComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzToggleSwitchComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should have default values', () => {
        fixture.detectChanges();
        expect(component.size()).toBe('md');
        expect(component.checked()).toBe(false);
        expect(component.actualDisabled()).toBe(false);
    });

    it('should expose switch role and aria-checked state', () => {
        fixture.detectChanges();

        const track = fixture.debugElement.query(By.css('.cz-toggle-switch-track')).nativeElement;
        expect(track.getAttribute('role')).toBe('switch');
        expect(track.getAttribute('aria-checked')).toBe('false');
    });

    it('should toggle on click and notify CVA + output', () => {
        fixture.detectChanges();

        const changeSpy = vi.fn();
        const outputSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onChange.subscribe(outputSpy);

        const track = fixture.debugElement.query(By.css('.cz-toggle-switch-track')).nativeElement;
        track.click();
        fixture.detectChanges();

        expect(component.checked()).toBe(true);
        expect(changeSpy).toHaveBeenCalledWith(true);
        expect(outputSpy).toHaveBeenCalledWith(true);
        expect(track.getAttribute('aria-checked')).toBe('true');
    });

    it('should map trueValue and falseValue', () => {
        fixture.componentRef.setInput('trueValue', 'on');
        fixture.componentRef.setInput('falseValue', 'off');
        fixture.detectChanges();

        const changeSpy = vi.fn();
        component.registerOnChange(changeSpy);

        const track = fixture.debugElement.query(By.css('.cz-toggle-switch-track')).nativeElement;
        track.click();
        expect(changeSpy).toHaveBeenLastCalledWith('on');

        track.click();
        expect(changeSpy).toHaveBeenLastCalledWith('off');
    });

    it('should reflect writeValue with mapped values', () => {
        fixture.componentRef.setInput('trueValue', 'on');
        fixture.detectChanges();

        component.writeValue('on');
        fixture.detectChanges();
        expect(component.checked()).toBe(true);

        component.writeValue('off');
        fixture.detectChanges();
        expect(component.checked()).toBe(false);
    });

    it('should toggle with Enter and Space', () => {
        fixture.detectChanges();
        const track = fixture.debugElement.query(By.css('.cz-toggle-switch-track')).nativeElement;

        track.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        fixture.detectChanges();
        expect(component.checked()).toBe(true);

        track.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        fixture.detectChanges();
        expect(component.checked()).toBe(false);
    });

    it('should not toggle when readonly', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();

        component.toggle();
        expect(component.checked()).toBe(false);
    });

    it('should not toggle when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const track = fixture.debugElement.query(By.css('.cz-toggle-switch-track')).nativeElement;
        expect(track.disabled).toBe(true);
        track.click();
        expect(component.checked()).toBe(false);
    });

    it('should update disabled state via setDisabledState', () => {
        component.setDisabledState?.(true);
        fixture.detectChanges();

        expect(component.actualDisabled()).toBe(true);
        expect(fixture.nativeElement.classList.contains('cz-toggle-switch--disabled')).toBe(true);
    });

    it('should render the label and use it as aria-label fallback', () => {
        fixture.componentRef.setInput('label', 'Notifications');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-toggle-switch-label').textContent).toContain('Notifications');
        const track = fixture.debugElement.query(By.css('.cz-toggle-switch-track')).nativeElement;
        expect(track.getAttribute('aria-label')).toBe('Notifications');
    });

    it('should apply size attribute and checked class', () => {
        fixture.componentRef.setInput('size', 'lg');
        component.writeValue(true);
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.getAttribute('data-size')).toBe('lg');
        expect(host.classList.contains('cz-toggle-switch--checked')).toBe(true);
    });
    it('should apply the invalid state from the invalid input', () => {
        fixture.componentRef.setInput('invalid', true);
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('cz-toggle-switch--has-error')).toBe(true);
    });

    it('should expose inputId and aria attributes', () => {
        fixture.componentRef.setInput('inputId', 'my-switch');
        fixture.componentRef.setInput('ariaLabelledBy', 'switch-label');
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.cz-toggle-switch-track')).nativeElement;
        expect(button.getAttribute('id')).toBe('my-switch');
        expect(button.getAttribute('aria-labelledby')).toBe('switch-label');
        expect(button.getAttribute('role')).toBe('switch');
    });

});
