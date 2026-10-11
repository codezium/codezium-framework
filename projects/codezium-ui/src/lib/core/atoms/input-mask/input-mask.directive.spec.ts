import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzInputMaskDirective } from './input-mask.directive';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzInputMaskDirective, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<input [czInputMask]="mask" [unmask]="unmask" [formControl]="ctrl" />`,
})
class TestHostComponent {
    ctrl = new FormControl('');
    mask = '(999) 999-9999';
    unmask = false;
}

describe('CzInputMaskDirective', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        // Note: no initial detectChanges() here to prevent NG0100 when tests mutate inputs afterwards
    });

    function inputEl(): HTMLInputElement {
        return fixture.debugElement.query(By.css('input')).nativeElement;
    }

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should format the model value into the mask (writeValue)', () => {
        component.ctrl.setValue('1234567890');
        fixture.detectChanges();

        expect(inputEl().value).toBe('(123) 456-7890');
    });

    it('should format typed input and emit the masked value', () => {
        fixture.detectChanges();

        const input = inputEl();
        input.value = '1234567890';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(input.value).toBe('(123) 456-7890');
        expect(component.ctrl.value).toBe('(123) 456-7890');
    });

    it('should skip invalid characters', () => {
        fixture.detectChanges();

        const input = inputEl();
        input.value = '12ab34cd56';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(input.value).toBe('(123) 456');
    });

    it('should emit the unmasked value when unmask is true', () => {
        component.unmask = true;
        component.ctrl.setValue('1234567890');
        fixture.detectChanges();

        const input = inputEl();
        expect(input.value).toBe('(123) 456-7890');

        input.value = '(123) 456-9999';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.ctrl.value).toBe('1234569999');
    });

    it('should support letter masks', () => {
        component.mask = 'aaa-999';
        component.ctrl.setValue('abc12');
        fixture.detectChanges();

        const input = inputEl();
        input.value = 'abc12';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(input.value).toBe('abc-12');
    });

    it('should clear the model when the input is emptied', () => {
        component.ctrl.setValue('1234567890');
        fixture.detectChanges();

        const input = inputEl();
        input.value = '';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.ctrl.value).toBeNull();
    });

    it('should disable the native input through the form control', () => {
        component.ctrl.disable();
        fixture.detectChanges();

        expect(inputEl().disabled).toBe(true);
    });
});
