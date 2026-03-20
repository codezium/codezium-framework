import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzKnobComponent } from './knob.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzKnobComponent', () => {
    let component: CzKnobComponent;
    let fixture: ComponentFixture<CzKnobComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzKnobComponent, FormsModule, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(CzKnobComponent);
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
        expect(component.size()).toBe(100);
        expect(component.theme()).toBe('base');
        expect(component.color()).toBe('primary');
    });

    it('should update value via writeValue', () => {
        component.writeValue(75);
        expect(component.value()).toBe(75);
    });

    it('should clamp value between min and max', () => {
        // Set value above max
        component.writeValue(150);
        fixture.detectChanges();
        // The writeValue sets the signal directly, but UI/interaction clamped it.
        // Let's test internal clamping logic via keyboard
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        fixture.componentRef.setInput('max', 50);
        component.writeValue(49);
        fixture.detectChanges();
        
        component.onKeyDown(event);
        expect(component.value()).toBe(50);
        
        component.onKeyDown(event);
        expect(component.value()).toBe(50); // Should stay at max
    });

    it('should handle ArrowDown keyboard event', () => {
        component.writeValue(10);
        fixture.detectChanges();
        
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        component.onKeyDown(event);
        expect(component.value()).toBe(9);
    });

    it('should handle Home and End keyboard events', () => {
        component.writeValue(50);
        fixture.detectChanges();
        
        const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
        component.onKeyDown(homeEvent);
        expect(component.value()).toBe(0);

        const endEvent = new KeyboardEvent('keydown', { key: 'End' });
        component.onKeyDown(endEvent);
        expect(component.value()).toBe(100);
    });

    it('should apply theme attribute to host', () => {
        fixture.componentRef.setInput('theme', 'neo');
        fixture.detectChanges();
        expect(fixture.nativeElement.getAttribute('data-theme')).toBe('neo');
    });

    it('should apply color attribute to host', () => {
        fixture.componentRef.setInput('color', 'danger');
        fixture.detectChanges();
        expect(fixture.nativeElement.getAttribute('data-color')).toBe('danger');
    });

    it('should respect disabled state from ControlValueAccessor', () => {
        component.setDisabledState?.(true);
        fixture.detectChanges();
        
        expect(component.actualDisabled()).toBe(true);
        expect(fixture.nativeElement.classList.contains('cz-knob--disabled')).toBe(true);
        
        // Interaction should be blocked
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        component.writeValue(10);
        component.onKeyDown(event);
        expect(component.value()).toBe(10); // No change
    });

    it('should calculate value from mouse horizontal/vertical coordinates', () => {
        // We need to mock getBoundingClientRect for the host element
        const rect = { left: 0, top: 0, width: 100, height: 100 };
        vi.spyOn(fixture.nativeElement, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

        // Center is at 50, 50
        // Our knob starts at 135 degrees (normalized 0)
        // Let's test bottom-middle (angle 90 degrees relative to center)
        // 90 relative to center (0 logic) -> dx=0, dy=50
        // angle = atan2(50, 0) = 90 deg.
        // normalizedAngle = (90 - 135 + 360) % 360 = 315.
        // Wait, 315 is in the "gap" (270 to 360).
        // Let's try top (angle -90 or 270 relative to center)
        // dx=0, dy=-50 -> atan2(-50, 0) = -90 or 270 deg.
        // normalizedAngle = (270 - 135) = 135 deg.
        // 135 deg out of 270 deg total arc is 50%.
        // Value should be middle of min/max (50 for 0-100).

        const event = { clientX: 50, clientY: 0 }; // Top point
        // Simulate updateValueFromEvent logic (it's private, but mousedown calls it)
        component.onMouseDown(event as MouseEvent);
        
        expect(component.value()).toBe(50);
    });

    it('should show helper text when provided', () => {
        fixture.componentRef.setInput('helperText', 'Select a value');
        fixture.detectChanges();
        const helper = fixture.nativeElement.querySelector('.cz-knob-helper');
        expect(helper.textContent).toContain('Select a value');
    });

    it('should format value template correctly', () => {
        fixture.componentRef.setInput('valueTemplate', '{value}°C');
        component.writeValue(25);
        fixture.detectChanges();
        
        const textElement = fixture.nativeElement.querySelector('.cz-knob-text');
        expect(textElement.textContent).toBe('25°C');
    });

    it('should handle step correctly', () => {
        fixture.componentRef.setInput('step', 10);
        component.writeValue(20);
        fixture.detectChanges();
        
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        component.onKeyDown(event);
        expect(component.value()).toBe(30);
    });
});
