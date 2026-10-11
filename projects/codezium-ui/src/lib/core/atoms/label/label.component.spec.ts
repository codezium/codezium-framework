import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzLabelComponent } from './label.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzLabelComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<cz-label htmlFor="email" [required]="true">Email</cz-label>`,
})
class TestHostComponent {}

describe('CzLabelComponent', () => {
    let component: CzLabelComponent;
    let fixture: ComponentFixture<CzLabelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzLabelComponent, TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzLabelComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should link the label to a form control with htmlFor', () => {
        fixture.componentRef.setInput('htmlFor', 'email');
        fixture.detectChanges();

        const label = fixture.nativeElement.querySelector('label');
        expect(label.getAttribute('for')).toBe('email');
    });

    it('should omit the for attribute when htmlFor is empty', () => {
        fixture.detectChanges();

        const label = fixture.nativeElement.querySelector('label');
        expect(label.getAttribute('for')).toBeNull();
    });

    it('should show a required marker', () => {
        fixture.componentRef.setInput('required', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-label-required')).toBeTruthy();
    });

    it('should not show the required marker by default', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-label-required')).toBeNull();
    });

    it('should project content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();

        const label = hostFixture.nativeElement.querySelector('label');
        expect(label.textContent).toContain('Email');
        expect(label.getAttribute('for')).toBe('email');
        expect(label.querySelector('.cz-label-required')).toBeTruthy();
    });
});
