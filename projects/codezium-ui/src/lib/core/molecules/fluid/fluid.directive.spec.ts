import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzFluidDirective } from './fluid.directive';
import { CzInputTextComponent } from '../../atoms/input-text';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzFluidDirective, CzInputTextComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <div id="fluid" czFluid>
            <cz-input-text label="Name" />
        </div>
    `,
})
class TestHostComponent {}

describe('CzFluidDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should add the cz-fluid class to the host', () => {
        const host = fixture.debugElement.query(By.css('#fluid')).nativeElement as HTMLElement;
        expect(host.classList.contains('cz-fluid')).toBe(true);
    });

    it('should keep the projected content inside', () => {
        expect(fixture.nativeElement.querySelector('#fluid cz-input-text')).toBeTruthy();
    });
});
