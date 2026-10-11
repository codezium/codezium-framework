import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzColorPickerComponent } from './color-picker.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzColorPickerComponent', () => {
    let component: CzColorPickerComponent;
    let fixture: ComponentFixture<CzColorPickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzColorPickerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzColorPickerComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should have a default value and expose the native color input', () => {
        fixture.detectChanges();

        expect(component.value()).toBe('#000000');
        const input = fixture.debugElement.query(By.css('.cz-color-picker-native')).nativeElement as HTMLInputElement;
        expect(input.type).toBe('color');
        expect(input.getAttribute('aria-label')).toBe('Color');
    });

    it('should update the value and notify CVA on input', () => {
        fixture.detectChanges();

        const changeSpy = vi.fn();
        component.registerOnChange(changeSpy);

        const input = fixture.debugElement.query(By.css('.cz-color-picker-native')).nativeElement as HTMLInputElement;
        input.value = '#ff0000';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.value()).toBe('#ff0000');
        expect(changeSpy).toHaveBeenCalledWith('#ff0000');
    });

    it('should reflect writeValue', () => {
        component.writeValue('#00ff00');
        fixture.detectChanges();

        expect(component.value()).toBe('#00ff00');
        const input = fixture.debugElement.query(By.css('.cz-color-picker-native')).nativeElement as HTMLInputElement;
        expect(input.value).toBe('#00ff00');
    });

    it('should ignore invalid writeValue values', () => {
        component.writeValue(null);
        fixture.detectChanges();

        expect(component.value()).toBe('#000000');
    });

    it('should disable the native input through the form control', () => {
        component.setDisabledState?.(true);
        fixture.detectChanges();

        const input = fixture.debugElement.query(By.css('.cz-color-picker-native')).nativeElement as HTMLInputElement;
        expect(input.disabled).toBe(true);
        expect(fixture.nativeElement.classList.contains('cz-color-picker--disabled')).toBe(true);
    });

    it('should apply size attribute and hide the value label when requested', () => {
        fixture.componentRef.setInput('size', 'lg');
        fixture.componentRef.setInput('showValue', false);
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.getAttribute('data-size')).toBe('lg');
        expect(fixture.nativeElement.querySelector('.cz-color-picker-value')).toBeNull();
    });

    it('should call onTouched on blur', () => {
        fixture.detectChanges();

        const touchedSpy = vi.fn();
        component.registerOnTouched(touchedSpy);

        const input = fixture.debugElement.query(By.css('.cz-color-picker-native')).nativeElement;
        input.dispatchEvent(new Event('blur'));

        expect(touchedSpy).toHaveBeenCalled();
    });
});
