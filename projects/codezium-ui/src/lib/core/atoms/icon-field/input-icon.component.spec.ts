import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzInputIconComponent } from './input-icon.component';
import { LucideSearch, LucideUser, provideLucideIcons } from '@lucide/angular';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('CzInputIconComponent', () => {
    let component: CzInputIconComponent;
    let fixture: ComponentFixture<CzInputIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzInputIconComponent],
            providers: [provideLucideIcons(LucideSearch)],
        }).compileComponents();

        fixture = TestBed.createComponent(CzInputIconComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should create with a lucide icon component and render an svg', () => {
        fixture.componentRef.setInput('icon', LucideSearch);
        fixture.detectChanges();

        expect(component).toBeTruthy();
        const svg = fixture.nativeElement.querySelector('.cz-input-icon-element');
        expect(svg).toBeTruthy();
        expect(svg.tagName.toLowerCase()).toBe('svg');
    });

    it('should accept LucideIconData', () => {
        fixture.componentRef.setInput('icon', LucideSearch.icon);
        fixture.detectChanges();

        const svg = fixture.nativeElement.querySelector('.cz-input-icon-element');
        expect(svg).toBeTruthy();
        expect(svg.querySelectorAll('path, circle, line, rect, polyline, polygon').length).toBeGreaterThan(0);
    });

    it('should resolve icons registered by name via provideLucideIcons', () => {
        fixture.componentRef.setInput('icon', 'search');
        fixture.detectChanges();

        const svg = fixture.nativeElement.querySelector('.cz-input-icon-element');
        expect(svg).toBeTruthy();
        expect(svg.querySelectorAll('path, circle, line, rect, polyline, polygon').length).toBeGreaterThan(0);
    });

    it('should apply default size (18)', () => {
        fixture.componentRef.setInput('icon', LucideSearch);
        fixture.detectChanges();

        const svg = fixture.nativeElement.querySelector('.cz-input-icon-element');
        expect(svg.getAttribute('width')).toBe('18');
    });

    it('should apply custom size', () => {
        fixture.componentRef.setInput('icon', LucideSearch);
        fixture.componentRef.setInput('size', 24);
        fixture.detectChanges();

        const svg = fixture.nativeElement.querySelector('.cz-input-icon-element');
        expect(svg.getAttribute('width')).toBe('24');
    });

    describe('Color handling', () => {
        it('should default to currentColor', () => {
            fixture.componentRef.setInput('icon', LucideSearch);
            fixture.detectChanges();

            expect(component.actualColor()).toBe('currentColor');
        });

        it('should map semantic colors to css variables and expose them on the host', () => {
            fixture.componentRef.setInput('icon', LucideSearch);
            fixture.componentRef.setInput('color', 'primary');
            fixture.detectChanges();

            expect(component.actualColor()).toBe('var(--cz-color-primary)');
            expect(component.isSemanticColor()).toBe(true);
            expect(fixture.nativeElement.getAttribute('data-color')).toBe('primary');
        });

        it('should map dark semantic color to gray-900', () => {
            fixture.componentRef.setInput('icon', LucideSearch);
            fixture.componentRef.setInput('color', 'dark');
            fixture.detectChanges();

            expect(component.actualColor()).toBe('var(--cz-color-gray-900)');
        });

        it('should pass through custom css colors', () => {
            fixture.componentRef.setInput('icon', LucideSearch);
            fixture.componentRef.setInput('color', '#e11d48');
            fixture.detectChanges();

            expect(component.actualColor()).toBe('#e11d48');
            expect(component.isSemanticColor()).toBe(false);
            expect(fixture.nativeElement.getAttribute('data-color')).toBeNull();
        });
    });

    describe('Animation on icon change', () => {
        it('should animate when the icon changes', () => {
            vi.useFakeTimers();

            fixture.componentRef.setInput('icon', LucideSearch);
            fixture.detectChanges();
            expect(component.isAnimating()).toBe(false);

            fixture.componentRef.setInput('icon', LucideUser);
            fixture.detectChanges();
            expect(component.isAnimating()).toBe(true);

            vi.advanceTimersByTime(300);
            expect(component.isAnimating()).toBe(false);
        });
    });
});
