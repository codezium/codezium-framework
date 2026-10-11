import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzBindDirective } from './bind.directive';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzBindDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<div id="bound" [czBind]="record()">Content</div>`,
})
class TestHostComponent {
    record = signal<Record<string, unknown> | null>({
        'aria-label': 'Save',
        'data-role': 'primary',
        disabled: true,
        hidden: false,
    });
}

describe('CzBindDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    function host(): HTMLElement {
        return fixture.debugElement.query(By.css('#bound')).nativeElement as HTMLElement;
    }

    it('should apply string attributes', () => {
        expect(host().getAttribute('aria-label')).toBe('Save');
        expect(host().getAttribute('data-role')).toBe('primary');
    });

    it('should apply boolean attributes', () => {
        expect(host().hasAttribute('disabled')).toBe(true);
        expect(host().hasAttribute('hidden')).toBe(false);
    });

    it('should update attributes when the record changes', () => {
        fixture.componentInstance.record.set({ 'aria-label': 'Delete', disabled: false });
        fixture.detectChanges();

        expect(host().getAttribute('aria-label')).toBe('Delete');
        expect(host().hasAttribute('disabled')).toBe(false);
        expect(host().hasAttribute('data-role')).toBe(false);
    });

    it('should clear attributes when the record is null', () => {
        fixture.componentInstance.record.set(null);
        fixture.detectChanges();

        expect(host().hasAttribute('aria-label')).toBe(false);
        expect(host().hasAttribute('data-role')).toBe(false);
    });
});
