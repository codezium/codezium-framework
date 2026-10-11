import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzProgressSpinnerComponent } from './progress-spinner.component';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzProgressSpinnerComponent', () => {
    let component: CzProgressSpinnerComponent;
    let fixture: ComponentFixture<CzProgressSpinnerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzProgressSpinnerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzProgressSpinnerComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should have default values', () => {
        fixture.detectChanges();
        expect(component.size()).toBe(50);
        expect(component.strokeWidth()).toBe(4);
        expect(component.fill()).toBe('none');
        expect(component.severity()).toBe('primary');
    });

    it('should render an accessible svg with the given size', () => {
        fixture.detectChanges();

        const svg = fixture.nativeElement.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg.getAttribute('width')).toBe('50');
        expect(svg.getAttribute('height')).toBe('50');
        expect(svg.getAttribute('role')).toBe('progressbar');
        expect(svg.getAttribute('aria-label')).toBe('Loading');
    });

    it('should apply size and stroke width inputs', () => {
        fixture.componentRef.setInput('size', 80);
        fixture.componentRef.setInput('strokeWidth', 2);
        fixture.detectChanges();

        const svg = fixture.nativeElement.querySelector('svg');
        expect(svg.getAttribute('width')).toBe('80');

        const circles = fixture.nativeElement.querySelectorAll('circle');
        expect(circles[0].getAttribute('stroke-width')).toBe('2');
        expect(circles[1].getAttribute('stroke-width')).toBe('2');
    });

    it('should apply the fill input on the spinner circle', () => {
        fixture.componentRef.setInput('fill', 'solid');
        fixture.detectChanges();

        const fillCircle = fixture.nativeElement.querySelector('.cz-progress-spinner-fill');
        expect(fillCircle.getAttribute('fill')).toBe('solid');
    });

    it('should apply the animation duration', () => {
        fixture.componentRef.setInput('animationDuration', '3s');
        fixture.detectChanges();

        const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
        expect(svg.style.animationDuration).toBe('3s');
    });

    it('should apply severity attribute and custom aria label', () => {
        fixture.componentRef.setInput('severity', 'danger');
        fixture.componentRef.setInput('ariaLabel', 'Saving');
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.getAttribute('data-severity')).toBe('danger');
        expect(host.querySelector('svg')?.getAttribute('aria-label')).toBe('Saving');
    });
});
