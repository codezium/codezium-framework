import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzFloatLabelComponent } from './float-label.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzFloatLabelComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-float-label [variant]="variant">
            <input id="name" placeholder=" " />
            <label for="name">Name</label>
        </cz-float-label>
    `,
})
class TestHostComponent {
    variant: 'over' | 'in' | 'on' = 'over';
}

describe('CzFloatLabelComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        // Note: no initial detectChanges() here to prevent NG0100 when tests mutate inputs afterwards
    });

    it('should render the wrapper with the default variant', () => {
        fixture.detectChanges();

        const host = fixture.nativeElement.querySelector('.cz-float-label');
        expect(host).toBeTruthy();
        expect(host.getAttribute('data-variant')).toBe('over');
    });

    it('should project the input and the label', () => {
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('.cz-float-label #name');
        const label = fixture.nativeElement.querySelector('.cz-float-label label');
        expect(input).toBeTruthy();
        expect(label.textContent).toContain('Name');
    });

    it('should apply the selected variant', () => {
        fixture.componentInstance.variant = 'in';
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-float-label').getAttribute('data-variant')).toBe('in');
    });
});
