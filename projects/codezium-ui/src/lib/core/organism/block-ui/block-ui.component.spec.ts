import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzBlockUiComponent } from './block-ui.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzBlockUiComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-block-ui [blocked]="true" message="Saving...">
            <p id="blocked-content">Panel content</p>
        </cz-block-ui>
    `,
})
class TestHostComponent {}

describe('CzBlockUiComponent', () => {
    let component: CzBlockUiComponent;
    let fixture: ComponentFixture<CzBlockUiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzBlockUiComponent, TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzBlockUiComponent);
        component = fixture.componentInstance;
    });

    it('should create without an overlay by default', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-block-ui-overlay')).toBeNull();
    });

    it('should render the overlay with spinner and message when blocked', () => {
        fixture.componentRef.setInput('blocked', true);
        fixture.componentRef.setInput('message', 'Saving...');
        fixture.detectChanges();

        const overlay = fixture.nativeElement.querySelector('.cz-block-ui-overlay');
        expect(overlay).toBeTruthy();
        expect(overlay.getAttribute('role')).toBe('status');
        expect(overlay.querySelector('svg')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-block-ui-message').textContent).toContain('Saving...');
        expect(fixture.nativeElement.classList.contains('cz-block-ui--blocked')).toBe(true);
    });

    it('should hide the spinner when showSpinner is false', () => {
        fixture.componentRef.setInput('blocked', true);
        fixture.componentRef.setInput('showSpinner', false);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-block-ui-overlay svg')).toBeNull();
    });

    it('should project content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('#blocked-content')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelector('.cz-block-ui-overlay')).toBeTruthy();
    });
});
