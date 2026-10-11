import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzFocusTrapDirective } from './focus-trap.directive';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzFocusTrapDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <div [czFocusTrap]="active" [focusTrapAutoFocus]="autoFocus">
            <button id="first">First</button>
            <button id="second">Second</button>
            <button id="last">Last</button>
        </div>
    `,
})
class TestHostComponent {
    active = true;
    autoFocus = true;
}

describe('CzFocusTrapDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
    });

    function button(id: string): HTMLButtonElement {
        return fixture.debugElement.query(By.css(`#${id}`)).nativeElement as HTMLButtonElement;
    }

    it('should focus the first focusable element on init', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(document.activeElement).toBe(button('first'));
    });

    it('should wrap focus from the last to the first with Tab', () => {
        fixture.detectChanges();

        const last = button('last');
        last.focus();

        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        last.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(button('first'));
    });

    it('should wrap focus from the first to the last with Shift+Tab', () => {
        fixture.detectChanges();

        const first = button('first');
        first.focus();

        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
        first.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(button('last'));
    });

    it('should not trap when inactive', async () => {
        fixture.componentInstance.active = false;
        fixture.detectChanges();
        await fixture.whenStable();

        expect(document.activeElement).not.toBe(button('first'));

        const last = button('last');
        last.focus();

        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        last.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(false);
        expect(document.activeElement).toBe(last);
    });

    it('should not steal focus when focusTrapAutoFocus is false but still trap Tab', async () => {
        fixture.componentInstance.autoFocus = false;
        fixture.detectChanges();
        await fixture.whenStable();

        expect(document.activeElement).not.toBe(button('first'));

        const last = button('last');
        last.focus();

        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        last.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(button('first'));
    });

    it('should ignore non Tab keys', () => {
        fixture.detectChanges();

        const last = button('last');
        last.focus();

        const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
        last.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(false);
    });
});
