import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzClassNamesDirective, CzClassNamesValue } from './class-names.directive';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzClassNamesDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<div id="target" [czClassNames]="value()">Content</div>`,
})
class TestHostComponent {
    value = signal<CzClassNamesValue>(null);
}

describe('CzClassNamesDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    function host(): HTMLElement {
        return fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    }

    it('should apply a string of classes', () => {
        fixture.componentInstance.value.set('alpha beta');
        fixture.detectChanges();

        expect(host().classList.contains('alpha')).toBe(true);
        expect(host().classList.contains('beta')).toBe(true);
    });

    it('should apply an array of classes', () => {
        fixture.componentInstance.value.set(['one', 'two']);
        fixture.detectChanges();

        expect(host().classList.contains('one')).toBe(true);
        expect(host().classList.contains('two')).toBe(true);
    });

    it('should apply conditional records', () => {
        fixture.componentInstance.value.set({ active: true, hidden: false });
        fixture.detectChanges();

        expect(host().classList.contains('active')).toBe(true);
        expect(host().classList.contains('hidden')).toBe(false);
    });

    it('should remove classes that are no longer present', () => {
        fixture.componentInstance.value.set(['old']);
        fixture.detectChanges();
        expect(host().classList.contains('old')).toBe(true);

        fixture.componentInstance.value.set(['new']);
        fixture.detectChanges();

        expect(host().classList.contains('old')).toBe(false);
        expect(host().classList.contains('new')).toBe(true);
    });

    it('should clear all managed classes when null', () => {
        fixture.componentInstance.value.set(['a', 'b']);
        fixture.detectChanges();

        fixture.componentInstance.value.set(null);
        fixture.detectChanges();

        expect(host().classList.contains('a')).toBe(false);
        expect(host().classList.contains('b')).toBe(false);
    });
});
