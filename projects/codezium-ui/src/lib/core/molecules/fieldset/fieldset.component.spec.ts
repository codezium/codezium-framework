import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzFieldsetComponent } from './fieldset.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzFieldsetComponent', () => {
    let component: CzFieldsetComponent;
    let fixture: ComponentFixture<CzFieldsetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzFieldsetComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzFieldsetComponent);
        component = fixture.componentInstance;
    });

    it('should create with a native fieldset and legend', () => {
        fixture.componentRef.setInput('legend', 'Personal data');
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('fieldset')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('legend').textContent).toContain('Personal data');
    });

    it('should collapse and expand when toggleable', () => {
        fixture.componentRef.setInput('legend', 'Data');
        fixture.componentRef.setInput('toggleable', true);
        fixture.detectChanges();

        const toggleSpy = vi.fn();
        component.onToggle.subscribe(toggleSpy);

        const toggle = fixture.debugElement.query(By.css('.cz-fieldset-toggle')).nativeElement;
        toggle.click();
        fixture.detectChanges();

        expect(component.collapsed()).toBe(true);
        expect(toggleSpy).toHaveBeenCalledWith(true);
        expect(fixture.nativeElement.querySelector('.cz-fieldset-content')).toBeNull();

        toggle.click();
        fixture.detectChanges();

        expect(component.collapsed()).toBe(false);
        expect(fixture.nativeElement.querySelector('.cz-fieldset-content')).toBeTruthy();
    });

    it('should not render a toggle button by default', () => {
        fixture.componentRef.setInput('legend', 'Data');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-fieldset-toggle')).toBeNull();
    });

    it('should ignore toggles when not toggleable', () => {
        fixture.componentRef.setInput('legend', 'Data');
        fixture.detectChanges();

        component.toggle();
        expect(component.collapsed()).toBe(false);
    });
});
