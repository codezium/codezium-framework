import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzProgressBarComponent } from './progress-bar.component';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzProgressBarComponent', () => {
    let component: CzProgressBarComponent;
    let fixture: ComponentFixture<CzProgressBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzProgressBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzProgressBarComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should clamp the value between 0 and 100', () => {
        fixture.componentRef.setInput('value', 150);
        fixture.detectChanges();
        expect(component.clampedValue()).toBe(100);

        fixture.componentRef.setInput('value', -20);
        fixture.detectChanges();
        expect(component.clampedValue()).toBe(0);

        fixture.componentRef.setInput('value', 42.5);
        fixture.detectChanges();
        expect(component.clampedValue()).toBe(42.5);
    });

    it('should handle invalid values as zero', () => {
        fixture.componentRef.setInput('value', Number.NaN);
        fixture.detectChanges();

        expect(component.clampedValue()).toBe(0);
    });

    it('should expose progressbar aria values in determinate mode', () => {
        fixture.componentRef.setInput('value', 30);
        fixture.detectChanges();

        const track = fixture.nativeElement.querySelector('.cz-progress-bar-track');
        expect(track.getAttribute('role')).toBe('progressbar');
        expect(track.getAttribute('aria-valuemin')).toBe('0');
        expect(track.getAttribute('aria-valuemax')).toBe('100');
        expect(track.getAttribute('aria-valuenow')).toBe('30');
    });

    it('should omit aria-valuenow in indeterminate mode', () => {
        fixture.componentRef.setInput('mode', 'indeterminate');
        fixture.detectChanges();

        const track = fixture.nativeElement.querySelector('.cz-progress-bar-track');
        expect(track.getAttribute('aria-valuenow')).toBeNull();
        expect(track.getAttribute('data-mode')).toBe('indeterminate');
    });

    it('should show the percentage label only when requested', () => {
        fixture.componentRef.setInput('value', 75);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-progress-bar-label')).toBeNull();

        fixture.componentRef.setInput('showValue', true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-progress-bar-label').textContent).toContain('75%');
    });

    it('should apply severity and size attributes', () => {
        fixture.componentRef.setInput('severity', 'success');
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.getAttribute('data-severity')).toBe('success');
        expect(host.getAttribute('data-size')).toBe('lg');
    });

    it('should size the value bar with the clamped percentage', () => {
        fixture.componentRef.setInput('value', 40);
        fixture.detectChanges();

        const value = fixture.nativeElement.querySelector('.cz-progress-bar-value') as HTMLElement;
        expect(value.style.width).toBe('40%');
    });
});
