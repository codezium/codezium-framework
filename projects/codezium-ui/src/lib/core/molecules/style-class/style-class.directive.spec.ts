import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzStyleClassDirective } from './style-class.directive';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

@Component({
    imports: [CzStyleClassDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <div
            id="target"
            [czStyleClass]="'panel-open'"
            [styleClassActive]="active()"
            styleClassEnter="enter-anim"
            styleClassLeave="leave-anim"
            [styleClassDuration]="200"
        >
            Panel
        </div>
    `,
})
class TestHostComponent {
    active = signal(false);
}

describe('CzStyleClassDirective', () => {
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

    function host(): HTMLElement {
        return fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    }

    it('should not apply the class while inactive', () => {
        expect(host().classList.contains('panel-open')).toBe(false);
    });

    it('should add the class and the enter animation when activated', () => {
        vi.useFakeTimers();

        fixture.componentInstance.active.set(true);
        fixture.detectChanges();

        expect(host().classList.contains('panel-open')).toBe(true);
        expect(host().classList.contains('enter-anim')).toBe(true);

        vi.advanceTimersByTime(200);
        expect(host().classList.contains('enter-anim')).toBe(false);
        expect(host().classList.contains('panel-open')).toBe(true);
    });

    it('should remove the class after the leave animation', () => {
        vi.useFakeTimers();

        fixture.componentInstance.active.set(true);
        fixture.detectChanges();
        vi.advanceTimersByTime(200);

        fixture.componentInstance.active.set(false);
        fixture.detectChanges();

        expect(host().classList.contains('leave-anim')).toBe(true);
        expect(host().classList.contains('panel-open')).toBe(true);

        vi.advanceTimersByTime(200);
        expect(host().classList.contains('leave-anim')).toBe(false);
        expect(host().classList.contains('panel-open')).toBe(false);
    });
});
