import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzScrollTopComponent } from './scroll-top.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzScrollTopComponent', () => {
    let component: CzScrollTopComponent;
    let fixture: ComponentFixture<CzScrollTopComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzScrollTopComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzScrollTopComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('threshold', 100);
    });

    function setScrollY(value: number): void {
        Object.defineProperty(window, 'scrollY', { value, configurable: true });
    }

    it('should create and stay hidden below the threshold', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-scroll-top-button')).toBeNull();

        setScrollY(50);
        component.onWindowScroll();

        expect(component.visible()).toBe(false);
    });

    it('should show the button above the threshold', () => {
        fixture.detectChanges();

        setScrollY(500);
        component.onWindowScroll();
        fixture.detectChanges();

        expect(component.visible()).toBe(true);
        expect(fixture.nativeElement.querySelector('.cz-scroll-top-button')).toBeTruthy();
    });

    it('should scroll to top on click', () => {
        fixture.detectChanges();

        const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        setScrollY(500);
        component.onWindowScroll();
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-scroll-top-button')).nativeElement.click();

        expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should track a custom target element', () => {
        const target = document.createElement('div');
        target.scrollTop = 300;
        const targetScrollSpy = vi.fn();
        (target as any).scrollTo = targetScrollSpy;

        fixture.componentRef.setInput('target', target);
        fixture.detectChanges();

        component.onWindowScroll();
        expect(component.visible()).toBe(true);

        component.scrollToTop();
        expect(targetScrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should resolve selector targets', () => {
        const target = document.createElement('div');
        target.id = 'scroll-target';
        target.scrollTop = 300;
        document.body.appendChild(target);

        fixture.componentRef.setInput('target', '#scroll-target');
        fixture.detectChanges();

        component.onWindowScroll();
        expect(component.visible()).toBe(true);

        document.body.removeChild(target);
    });

    it('should expose an accessible label', () => {
        fixture.componentRef.setInput('ariaLabel', 'Go up');
        fixture.detectChanges();

        setScrollY(500);
        component.onWindowScroll();
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('.cz-scroll-top-button')).nativeElement.getAttribute('aria-label')).toBe('Go up');
    });
});
