import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzIconFieldComponent } from './icon-field.component';
import { CzInputIconComponent } from './input-icon.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LucideSearch } from '@lucide/angular';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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


@Component({
    imports: [CzIconFieldComponent, CzInputIconComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-icon-field>
            <cz-input-icon [icon]="icon" />
            <div class="cz-input-container" style="height: 44px; margin-top: 30px;">
                <input class="cz-input-native" />
            </div>
        </cz-icon-field>
    `,
})
class CenteringHostComponent {
    readonly icon = LucideSearch;
}

describe('CzIconFieldComponent centering', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzIconFieldComponent, CzInputIconComponent, CenteringHostComponent],
        }).compileComponents();
    });

    it('should center the icon on the input box through CSS variables', () => {
        const hostFixture = TestBed.createComponent(CenteringHostComponent);
        hostFixture.detectChanges();

        const field = hostFixture.nativeElement.querySelector('cz-icon-field') as HTMLElement;
        const container = field.querySelector('.cz-input-container') as HTMLElement;

        const rect = (top: number, height: number): DOMRect => ({
            top, bottom: top + height, height, left: 50, right: 300, width: 250, x: 50, y: top,
            toJSON: () => ({}),
        }) as DOMRect;

        vi.spyOn(field, 'getBoundingClientRect').mockReturnValue(rect(100, 100));
        vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(rect(130, 44));

        const component = hostFixture.debugElement
            .query(By.directive(CzIconFieldComponent))
            .componentInstance as CzIconFieldComponent;

        (component as unknown as { updateIconCenter: () => void }).updateIconCenter();

        expect(field.style.getPropertyValue('--cz-icon-center-y')).toBe('52px');
        expect(field.style.getPropertyValue('--cz-icon-offset-left')).toBe('0px');
        expect(field.style.getPropertyValue('--cz-icon-offset-right')).toBe('0px');
    });
});
