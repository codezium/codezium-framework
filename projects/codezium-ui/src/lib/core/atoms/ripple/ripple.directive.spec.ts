import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzRippleDirective } from './ripple.directive';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

@Component({
    imports: [CzRippleDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <button id="plain" czRipple>Plain</button>
        <button id="disabled" czRipple [rippleDisabled]="true">Disabled</button>
        <button id="custom" czRipple rippleColor="rgba(255,0,0,0.5)" [rippleCentered]="true" [rippleDuration]="200">
            Custom
        </button>
    `,
})
class TestHostComponent {}

describe('CzRippleDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    function mousedown(id: string, clientX = 10, clientY = 10): MouseEvent {
        const el = fixture.debugElement.query(By.css(`#${id}`)).nativeElement as HTMLElement;
        const event = new MouseEvent('mousedown', { clientX, clientY, bubbles: true });
        el.dispatchEvent(event);
        fixture.detectChanges();
        return event;
    }

    function getHost(id: string): HTMLElement {
        return fixture.debugElement.query(By.css(`#${id}`)).nativeElement as HTMLElement;
    }

    it('should add the ripple host class', () => {
        expect(getHost('plain').classList.contains('cz-ripple-host')).toBe(true);
    });

    it('should create a ripple element on mousedown', () => {
        mousedown('plain');

        const ripple = getHost('plain').querySelector('.cz-ripple') as HTMLElement;
        expect(ripple).toBeTruthy();
        expect(ripple.style.width).not.toBe('');
        expect(ripple.style.left).not.toBe('');
    });

    it('should not create a ripple when disabled', () => {
        mousedown('disabled');

        expect(getHost('disabled').querySelector('.cz-ripple')).toBeNull();
    });

    it('should apply the custom color and centered position', () => {
        mousedown('custom');

        const ripple = getHost('custom').querySelector('.cz-ripple') as HTMLElement;
        expect(ripple).toBeTruthy();
        expect(ripple.style.backgroundColor).toBe('rgba(255, 0, 0, 0.5)');
        expect(ripple.style.animationDuration).toBe('200ms');
    });

    it('should remove the ripple after its duration', () => {
        vi.useFakeTimers();

        mousedown('plain');
        expect(getHost('plain').querySelector('.cz-ripple')).toBeTruthy();

        vi.advanceTimersByTime(600);
        expect(getHost('plain').querySelector('.cz-ripple')).toBeNull();
    });
});
