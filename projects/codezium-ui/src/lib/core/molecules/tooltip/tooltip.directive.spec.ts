import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTooltipDirective } from './tooltip.directive';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

@Component({
    imports: [CzTooltipDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <button id="with-tooltip" czTooltip="Save changes" tooltipPosition="top">Save</button>
        <button id="disabled-tooltip" czTooltip="Hidden" [tooltipDisabled]="true">Disabled</button>
        <button id="empty-tooltip" czTooltip="">Empty</button>
    `,
})
class TestHostComponent {}

describe('CzTooltipDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        document.querySelectorAll('.cz-tooltip').forEach((el) => el.remove());
    });

    function host(id: string): HTMLElement {
        return fixture.debugElement.query(By.css(`#${id}`)).nativeElement as HTMLElement;
    }

    it('should show a tooltip on mouseenter with the given text', () => {
        const button = host('with-tooltip');
        button.dispatchEvent(new MouseEvent('mouseenter'));

        const tooltip = document.querySelector('.cz-tooltip') as HTMLElement;
        expect(tooltip).toBeTruthy();
        expect(tooltip.textContent).toBe('Save changes');
        expect(tooltip.getAttribute('role')).toBe('tooltip');
        expect(tooltip.getAttribute('data-position')).toBe('top');
        expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
    });

    it('should remove the tooltip on mouseleave', () => {
        const button = host('with-tooltip');
        button.dispatchEvent(new MouseEvent('mouseenter'));
        expect(document.querySelector('.cz-tooltip')).toBeTruthy();

        button.dispatchEvent(new MouseEvent('mouseleave'));
        expect(document.querySelector('.cz-tooltip')).toBeNull();
        expect(button.getAttribute('aria-describedby')).toBeNull();
    });

    it('should show the tooltip on focus and hide on blur', () => {
        const button = host('with-tooltip');
        button.dispatchEvent(new Event('focus'));
        expect(document.querySelector('.cz-tooltip')).toBeTruthy();

        button.dispatchEvent(new Event('blur'));
        expect(document.querySelector('.cz-tooltip')).toBeNull();
    });

    it('should not show the tooltip when disabled', () => {
        host('disabled-tooltip').dispatchEvent(new MouseEvent('mouseenter'));
        expect(document.querySelector('.cz-tooltip')).toBeNull();
    });

    it('should not show the tooltip with empty text', () => {
        host('empty-tooltip').dispatchEvent(new MouseEvent('mouseenter'));
        expect(document.querySelector('.cz-tooltip')).toBeNull();
    });

    it('should not duplicate the tooltip when showing twice', () => {
        const button = host('with-tooltip');
        button.dispatchEvent(new MouseEvent('mouseenter'));
        button.dispatchEvent(new MouseEvent('mouseenter'));

        expect(document.querySelectorAll('.cz-tooltip').length).toBe(1);
    });
});
