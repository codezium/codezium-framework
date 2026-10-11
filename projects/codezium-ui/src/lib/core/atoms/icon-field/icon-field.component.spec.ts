import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzIconFieldComponent } from './icon-field.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzIconFieldComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-icon-field>
            <span id="projected-icon">icon</span>
        </cz-icon-field>
    `,
})
class TestHostComponent {}

describe('CzIconFieldComponent', () => {
    let component: CzIconFieldComponent;
    let fixture: ComponentFixture<CzIconFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzIconFieldComponent, TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzIconFieldComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render host classes with defaults', () => {
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.classList.contains('cz-icon-field')).toBe(true);
        expect(host.classList.contains('cz-icon-field--left')).toBe(true);
        expect(host.getAttribute('data-size')).toBe('md');
        expect(host.classList.contains('cz-icon-field-fluid')).toBe(false);
    });

    it('should apply right position class', () => {
        fixture.componentRef.setInput('iconPosition', 'right');
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.classList.contains('cz-icon-field--right')).toBe(true);
        expect(host.classList.contains('cz-icon-field--left')).toBe(false);
    });

    it('should apply size attribute', () => {
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLElement).getAttribute('data-size')).toBe('lg');
    });

    it('should apply fluid class', () => {
        fixture.componentRef.setInput('fluid', true);
        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLElement).classList.contains('cz-icon-field-fluid')).toBe(true);
    });

    it('should project content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();

        const projected = hostFixture.nativeElement.querySelector('cz-icon-field #projected-icon');
        expect(projected).toBeTruthy();
        expect(projected.textContent).toContain('icon');
    });
});
