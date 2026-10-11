import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzInputOtpComponent } from './input-otp.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzInputOtpComponent', () => {
    let component: CzInputOtpComponent;
    let fixture: ComponentFixture<CzInputOtpComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzInputOtpComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzInputOtpComponent);
        component = fixture.componentInstance;
    });

    function inputs(): HTMLInputElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-input-otp-input')).map((el) => el.nativeElement),
        ) as HTMLInputElement[];
    }

    it('should create and render the default amount of inputs', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(inputs().length).toBe(4);
        expect(fixture.nativeElement.querySelector('[role="group"]')).toBeTruthy();
    });

    it('should render a custom length', () => {
        fixture.componentRef.setInput('length', 6);
        fixture.detectChanges();

        expect(inputs().length).toBe(6);
    });

    it('should fill the value when typing and notify CVA', () => {
        fixture.detectChanges();

        const changeSpy = vi.fn();
        component.registerOnChange(changeSpy);

        const first = inputs()[0];
        first.value = '5';
        first.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.value()).toBe('5');
        expect(changeSpy).toHaveBeenCalledWith('5');
        expect(inputs()[1].value).toBe('');
    });

    it('should sanitize non integer characters when integerOnly', () => {
        fixture.detectChanges();

        const first = inputs()[0];
        first.value = 'a';
        first.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.value()).toBe('');
    });

    it('should allow letters when integerOnly is false', () => {
        fixture.componentRef.setInput('integerOnly', false);
        fixture.detectChanges();

        const first = inputs()[0];
        first.value = 'a';
        first.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.value()).toBe('a');
    });

    it('should reflect writeValue across the inputs', () => {
        component.writeValue('1234');
        fixture.detectChanges();

        const values = inputs().map((i) => i.value);
        expect(values).toEqual(['1', '2', '3', '4']);
    });

    it('should clear the current char with Backspace and move back when empty', () => {
        component.writeValue('12');
        fixture.detectChanges();

        const second = inputs()[1];
        second.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        fixture.detectChanges();
        expect(component.value()).toBe('1');

        const first = inputs()[0];
        first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        fixture.detectChanges();
        expect(component.value()).toBe('');
    });

    it('should move focus with arrow keys', () => {
        fixture.detectChanges();

        const first = inputs()[0];
        first.focus();
        first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        expect(document.activeElement).toBe(inputs()[1]);

        inputs()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        expect(document.activeElement).toBe(inputs()[0]);
    });

    it('should distribute pasted content from the focused input', () => {
        fixture.detectChanges();

        const fakeEvent = {
            preventDefault: vi.fn(),
            clipboardData: { getData: () => '5678' },
        } as unknown as ClipboardEvent;

        component.onPaste(fakeEvent, 0);
        fixture.detectChanges();

        expect(component.value()).toBe('5678');
        expect(inputs().map((i) => i.value)).toEqual(['5', '6', '7', '8']);
    });

    it('should mask the digits when mask is true', () => {
        fixture.componentRef.setInput('mask', true);
        fixture.detectChanges();

        expect(inputs()[0].type).toBe('password');
    });

    it('should disable the inputs through the form control', () => {
        component.setDisabledState?.(true);
        fixture.detectChanges();

        expect(inputs().every((i) => i.disabled)).toBe(true);
        expect(fixture.nativeElement.classList.contains('cz-input-otp--disabled')).toBe(true);
    });

    it('should respect the readonly input', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();

        expect(inputs().every((i) => i.readOnly)).toBe(true);
    });
});
