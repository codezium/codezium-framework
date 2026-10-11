import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzIftaLabelComponent } from './ifta-label.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzIftaLabelComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-ifta-label>
            <input id="email" />
            <label for="email">Email</label>
        </cz-ifta-label>
    `,
})
class TestHostComponent {}

describe('CzIftaLabelComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should render the wrapper', () => {
        expect(fixture.nativeElement.querySelector('.cz-ifta-label')).toBeTruthy();
    });

    it('should project the input and the label', () => {
        const input = fixture.nativeElement.querySelector('.cz-ifta-label #email');
        const label = fixture.nativeElement.querySelector('.cz-ifta-label label');
        expect(input).toBeTruthy();
        expect(label.textContent).toContain('Email');
        expect(label.getAttribute('for')).toBe('email');
    });
});
