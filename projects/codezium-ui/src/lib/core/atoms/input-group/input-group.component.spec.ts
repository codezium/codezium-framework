import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzInputGroupAddonComponent, CzInputGroupComponent } from './index';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzInputGroupComponent, CzInputGroupAddonComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-input-group>
            <cz-input-group-addon>$</cz-input-group-addon>
            <input id="amount" />
            <cz-input-group-addon>.00</cz-input-group-addon>
        </cz-input-group>
    `,
})
class TestHostComponent {}

describe('CzInputGroupComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should create the group', () => {
        expect(fixture.nativeElement.querySelector('.cz-input-group')).toBeTruthy();
    });

    it('should render addons around the control', () => {
        const addons = fixture.nativeElement.querySelectorAll('.cz-input-group-addon');
        expect(addons.length).toBe(2);
        expect(addons[0].textContent).toContain('$');
        expect(addons[1].textContent).toContain('.00');
    });

    it('should project the form control inside the group', () => {
        const input = fixture.nativeElement.querySelector('.cz-input-group input#amount');
        expect(input).toBeTruthy();
    });
});
