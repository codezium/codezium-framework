import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzDrawerComponent } from './drawer.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzDrawerComponent', () => {
    let component: CzDrawerComponent;
    let fixture: ComponentFixture<CzDrawerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzDrawerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzDrawerComponent);
        component = fixture.componentInstance;
    });

    it('should create and stay hidden by default', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-drawer')).toBeNull();
    });

    it('should render the drawer with header when visible', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('header', 'Settings');
        fixture.detectChanges();

        const drawer = fixture.nativeElement.querySelector('.cz-drawer');
        expect(drawer).toBeTruthy();
        expect(drawer.getAttribute('role')).toBe('dialog');
        expect(fixture.nativeElement.querySelector('.cz-drawer-title').textContent).toContain('Settings');
        expect(fixture.nativeElement.querySelector('.cz-drawer-mask')).toBeTruthy();
    });

    it('should apply position and size', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('position', 'left');
        fixture.componentRef.setInput('size', '18rem');
        fixture.detectChanges();

        const drawer = fixture.nativeElement.querySelector('.cz-drawer') as HTMLElement;
        expect(drawer.getAttribute('data-position')).toBe('left');
        expect(drawer.style.getPropertyValue('--cz-drawer-size')).toBe('18rem');
    });

    it('should close with the close button and emit onHide', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('header', 'Settings');
        fixture.detectChanges();

        const hideSpy = vi.fn();
        component.onHide.subscribe(hideSpy);

        fixture.debugElement.query(By.css('.cz-drawer-close')).nativeElement.click();
        fixture.detectChanges();

        expect(component.visible()).toBe(false);
        expect(hideSpy).toHaveBeenCalled();
    });

    it('should close on mask click by default', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-drawer-mask')).nativeElement.click();
        fixture.detectChanges();

        expect(component.visible()).toBe(false);
    });

    it('should not close on mask click when dismissableMask is false', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('dismissableMask', false);
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-drawer-mask')).nativeElement.click();
        fixture.detectChanges();

        expect(component.visible()).toBe(true);
    });

    it('should close on Escape', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.detectChanges();

        component.onEscape();
        expect(component.visible()).toBe(false);
    });
});
