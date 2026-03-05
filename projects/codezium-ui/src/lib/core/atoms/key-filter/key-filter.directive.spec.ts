import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { CzKeyFilterDirective } from './key-filter.directive';

@Component({
    standalone: true,
    imports: [CzKeyFilterDirective],
    template: `<input id="test-input" czKeyFilter="integer" />`
})
class TestHostComponent { }

function dispatchKey(input: HTMLInputElement, key: string, options: Partial<KeyboardEventInit> = {}): boolean {
    const event = new KeyboardEvent('keydown', { key, cancelable: true, ...options });
    const dispatched = input.dispatchEvent(event);
    return dispatched; // returns false if preventDefault() was called
}

describe('CzKeyFilterDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let inputEl: HTMLInputElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('#test-input')).nativeElement;
    });

    it('should create host component', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('(integer preset) should block letters', () => {
        const result = dispatchKey(inputEl, 'a');
        expect(result).toBe(false); // preventDefault was called, event was blocked
    });

    it('(integer preset) should allow digits', () => {
        const result = dispatchKey(inputEl, '5');
        expect(result).toBe(true); // allowed
    });

    it('should always allow navigation keys (ArrowLeft, Backspace, Tab)', () => {
        expect(dispatchKey(inputEl, 'ArrowLeft')).toBe(true);
        expect(dispatchKey(inputEl, 'Backspace')).toBe(true);
        expect(dispatchKey(inputEl, 'Tab')).toBe(true);
        expect(dispatchKey(inputEl, 'Delete')).toBe(true);
    });

    it('should always allow Ctrl+C, Ctrl+V combinations', () => {
        expect(dispatchKey(inputEl, 'c', { ctrlKey: true })).toBe(true);
        expect(dispatchKey(inputEl, 'v', { ctrlKey: true })).toBe(true);
    });

    it('should block an invalid paste (directive blocks clipboard via preventDefault)', () => {
        // Use spyOn approach instead of ClipboardEvent (not always available in jsdom)
        const directive = fixture.debugElement.query(By.directive(CzKeyFilterDirective)).injector.get(CzKeyFilterDirective);
        const fakeEvent = {
            clipboardData: { getData: () => 'abc12' }, // 'abc' chars invalid for integer
            preventDefault: vi.fn()
        } as unknown as ClipboardEvent;

        directive.onPaste(fakeEvent);
        expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });
});
