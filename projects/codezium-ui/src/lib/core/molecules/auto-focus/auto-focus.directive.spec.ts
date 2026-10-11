import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzAutoFocusDirective } from './auto-focus.directive';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzAutoFocusDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <input id="auto" [czAutoFocus]="true" />
        <input id="disabled" [czAutoFocus]="false" />
    `,
})
class TestHostComponent {}

describe('CzAutoFocusDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
    });

    it('should focus the host element after view init', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.nativeElement.querySelector('#auto') as HTMLInputElement;
        expect(document.activeElement).toBe(input);
    });

    it('should not focus when disabled', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const disabled = fixture.nativeElement.querySelector('#disabled') as HTMLInputElement;
        expect(document.activeElement).not.toBe(disabled);
    });
});
