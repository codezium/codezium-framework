import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzSliderComponent } from './slider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzSliderComponent', () => {
    let component: CzSliderComponent;
    let fixture: ComponentFixture<CzSliderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzSliderComponent, FormsModule, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(CzSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default values', () => {
        expect(component.min()).toBe(0);
        expect(component.max()).toBe(100);
        expect(component.step()).toBe(1);
        expect(component.value()).toBe(0);
        expect(component.range()).toBe(false);
        expect(component.orientation()).toBe('horizontal');
    });

    it('should update value via writeValue', () => {
        component.writeValue(50);
        expect(component.value()).toBe(50);
    });

    it('should update value on container click (horizontal)', () => {
        const container = component.containerViewChild.nativeElement;
        const rect = { left: 0, top: 0, width: 100, height: 10 };
        vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

        // Use mousedown as bound in template
        const event = new MouseEvent('mousedown', { clientX: 50, clientY: 5, bubbles: true });
        container.dispatchEvent(event);
        fixture.detectChanges();

        expect(component.value()).toBe(50);
    });

    it('should update range values in range mode', () => {
        fixture.componentRef.setInput('range', true);
        fixture.detectChanges();
        component.ngOnInit(); // Initialize range value
        
        expect(component.value()).toEqual([0, 100]);

        const container = component.containerViewChild.nativeElement;
        const rect = { left: 0, top: 0, width: 100, height: 10 };
        vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

        // Click at 25% (closer to 0)
        const event1 = new MouseEvent('mousedown', { clientX: 25, clientY: 5, bubbles: true });
        container.dispatchEvent(event1);
        fixture.detectChanges();
        expect(component.value()).toEqual([25, 100]);

        // Click at 75% (closer to 100)
        const event2 = new MouseEvent('mousedown', { clientX: 75, clientY: 5, bubbles: true });
        container.dispatchEvent(event2);
        fixture.detectChanges();
        expect(component.value()).toEqual([25, 75]);
    });

    it('should calculate value correctly in vertical orientation', () => {
        fixture.componentRef.setInput('orientation', 'vertical');
        fixture.detectChanges();

        const container = component.containerViewChild.nativeElement;
        const rect = { left: 0, top: 0, width: 10, height: 100 };
        vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

        // Click at middle (y=50 -> ratio 1 - (50-0)/100 = 0.5 -> value 50)
        const event = new MouseEvent('mousedown', { clientX: 5, clientY: 50, bubbles: true });
        container.dispatchEvent(event);
        fixture.detectChanges();

        expect(component.value()).toBe(50);
    });

    it('should respect step input', () => {
        fixture.componentRef.setInput('step', 10);
        fixture.detectChanges();

        const container = component.containerViewChild.nativeElement;
        const rect = { left: 0, top: 0, width: 100, height: 10 };
        vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

        // Click at 23% -> raw 23 -> step 20
        const event = new MouseEvent('mousedown', { clientX: 23, clientY: 5, bubbles: true });
        container.dispatchEvent(event);
        fixture.detectChanges();

        expect(component.value()).toBe(20);
    });

    it('should apply theme attribute', () => {
        fixture.componentRef.setInput('theme', 'glass');
        fixture.detectChanges();
        expect(fixture.nativeElement.getAttribute('data-theme')).toBe('glass');
    });

    it('should apply color attribute', () => {
        fixture.componentRef.setInput('color', 'success');
        fixture.detectChanges();
        expect(fixture.nativeElement.getAttribute('data-color')).toBe('success');
    });

    it('should disable interaction when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const container = component.containerViewChild.nativeElement;
        const rect = { left: 0, top: 0, width: 100, height: 10 };
        vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

        // Initial value 0
        const event = new MouseEvent('mousedown', { clientX: 80, clientY: 5, bubbles: true });
        container.dispatchEvent(event);
        fixture.detectChanges();

        expect(component.value()).toBe(0);
        expect(fixture.nativeElement.classList.contains('cz-slider--disabled')).toBe(true);
    });

    it('should handle validation errors', () => {
        // Mock NgControl if possible or test via public getters
        // For simplicity, we can test the getter logic directly if we provide a mock
        // but here we can check if isInvalid is false by default
        expect(component.isInvalid).toBe(false);
        expect(component.errorMessage).toBeNull();
    });
});
