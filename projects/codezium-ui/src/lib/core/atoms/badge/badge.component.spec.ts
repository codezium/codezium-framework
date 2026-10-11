import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzBadgeComponent } from './badge.component';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzBadgeComponent', () => {
    let component: CzBadgeComponent;
    let fixture: ComponentFixture<CzBadgeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzBadgeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzBadgeComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render the value', () => {
        fixture.componentRef.setInput('value', 42);
        fixture.detectChanges();

        const value = fixture.nativeElement.querySelector('.cz-badge-value');
        expect(value.textContent).toContain('42');
    });

    it('should render zero as a valid value', () => {
        fixture.componentRef.setInput('value', 0);
        fixture.detectChanges();

        expect(component.hasValue()).toBe(true);
        expect(fixture.nativeElement.querySelector('.cz-badge-value')).toBeTruthy();
    });

    it('should render nothing when there is no value', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-badge-value')).toBeNull();
        expect(fixture.nativeElement.querySelector('.cz-badge-dot')).toBeNull();
    });

    it('should render a dot in dot mode even without value', () => {
        fixture.componentRef.setInput('dot', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-badge-dot')).toBeTruthy();
        expect(fixture.nativeElement.classList.contains('cz-badge--dot')).toBe(true);
    });

    it('should apply severity and size attributes', () => {
        fixture.componentRef.setInput('severity', 'warning');
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.getAttribute('data-severity')).toBe('warning');
        expect(host.getAttribute('data-size')).toBe('lg');
    });

    it('should forward the aria label', () => {
        fixture.componentRef.setInput('ariaLabel', '3 notifications');
        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLElement).getAttribute('aria-label')).toBe('3 notifications');
    });
});
