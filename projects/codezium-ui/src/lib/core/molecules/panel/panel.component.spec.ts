import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzPanelComponent } from './panel.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzPanelComponent', () => {
    let component: CzPanelComponent;
    let fixture: ComponentFixture<CzPanelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzPanelComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzPanelComponent);
        component = fixture.componentInstance;
    });

    it('should create and render the header', () => {
        fixture.componentRef.setInput('header', 'Panel');
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-panel-title').textContent).toContain('Panel');
    });

    it('should not render a toggle button by default', () => {
        fixture.componentRef.setInput('header', 'Panel');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-panel-toggle')).toBeNull();
        expect(fixture.nativeElement.querySelector('.cz-panel-content')).toBeTruthy();
    });

    it('should collapse and expand when toggleable', () => {
        fixture.componentRef.setInput('header', 'Panel');
        fixture.componentRef.setInput('toggleable', true);
        fixture.detectChanges();

        const toggleSpy = vi.fn();
        component.onToggle.subscribe(toggleSpy);

        const toggle = fixture.debugElement.query(By.css('.cz-panel-toggle')).nativeElement;
        toggle.click();
        fixture.detectChanges();

        expect(component.collapsed()).toBe(true);
        expect(toggleSpy).toHaveBeenCalledWith(true);
        expect(fixture.nativeElement.querySelector('.cz-panel-content')).toBeNull();
        expect(toggle.getAttribute('aria-expanded')).toBe('false');

        toggle.click();
        fixture.detectChanges();

        expect(component.collapsed()).toBe(false);
        expect(fixture.nativeElement.querySelector('.cz-panel-content')).toBeTruthy();
    });

    it('should ignore toggles when not toggleable', () => {
        fixture.componentRef.setInput('header', 'Panel');
        fixture.detectChanges();

        component.toggle();
        expect(component.collapsed()).toBe(false);
    });

    it('should apply the collapsed host class', () => {
        fixture.componentRef.setInput('header', 'Panel');
        fixture.componentRef.setInput('toggleable', true);
        fixture.componentRef.setInput('collapsed', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.classList.contains('cz-panel--collapsed')).toBe(true);
    });
});
