import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzScrollAreaComponent } from './scroll-area.component';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzScrollAreaComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-scroll-area [variant]="variant()" maxHeight="12rem">
            <p id="content">Scrollable content</p>
        </cz-scroll-area>
    `,
})
class TestHostComponent {
    variant = signal<'default' | 'hover' | 'always'>('default');
}

describe('CzScrollAreaComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should render the viewport with the default variant and project content', () => {
        const viewport = fixture.nativeElement.querySelector('.cz-scroll-area-viewport');
        expect(viewport).toBeTruthy();
        expect(viewport.getAttribute('data-variant')).toBe('default');
        expect(viewport.style.maxHeight).toBe('12rem');
        expect(fixture.nativeElement.querySelector('#content')).toBeTruthy();
    });

    it('should apply the selected variant', () => {
        fixture.componentInstance.variant.set('hover');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-scroll-area-viewport').getAttribute('data-variant')).toBe('hover');
    });
});
