import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzDividerComponent } from './divider.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzDividerComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<cz-divider>OR</cz-divider>`,
})
class TestHostComponent {}

describe('CzDividerComponent', () => {
    let component: CzDividerComponent;
    let fixture: ComponentFixture<CzDividerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzDividerComponent, TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzDividerComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should expose the separator role and orientation', () => {
        fixture.detectChanges();

        const divider = fixture.nativeElement.querySelector('.cz-divider');
        expect(divider.getAttribute('role')).toBe('separator');
        expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should switch to vertical orientation', () => {
        fixture.componentRef.setInput('layout', 'vertical');
        fixture.detectChanges();

        const divider = fixture.nativeElement.querySelector('.cz-divider');
        expect(divider.getAttribute('aria-orientation')).toBe('vertical');
        expect(fixture.nativeElement.classList.contains('cz-divider-host--vertical')).toBe(true);
    });

    it('should apply type and align attributes', () => {
        fixture.componentRef.setInput('type', 'dashed');
        fixture.componentRef.setInput('align', 'left');
        fixture.detectChanges();

        const divider = fixture.nativeElement.querySelector('.cz-divider');
        expect(divider.getAttribute('data-type')).toBe('dashed');
        expect(divider.getAttribute('data-align')).toBe('left');
    });

    it('should project content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();

        const content = hostFixture.nativeElement.querySelector('.cz-divider-content');
        expect(content.textContent).toContain('OR');
    });
});
