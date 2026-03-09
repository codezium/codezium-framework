import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzCheckboxComponent } from './checkbox.component';
import { By } from '@angular/platform-browser';

describe('CzCheckboxComponent', () => {
    let component: CzCheckboxComponent;
    let fixture: ComponentFixture<CzCheckboxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzCheckboxComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CzCheckboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should handle binary boolean logic properly', () => {
        fixture.componentRef.setInput('binary', true);
        fixture.detectChanges();

        expect(component.checked()).toBe(false);

        // Simulate click natively via Component Class
        component.onClick(new MouseEvent('click', { bubbles: true, cancelable: true }));
        fixture.detectChanges();

        expect(component.model()).toBe(true);
        expect(component.checked()).toBe(true);

        // Second click
        component.onClick(new MouseEvent('click', { bubbles: true, cancelable: true }));
        fixture.detectChanges();
        expect(component.model()).toBe(false);
        expect(component.checked()).toBe(false);
    });

    it('should handle multi-value array logic properly', () => {
        // Setup array binding simulation
        fixture.componentRef.setInput('binary', false);
        fixture.componentRef.setInput('value', 'Apple');
        component.writeValue(['Banana']); // Initial mock model from a fake form
        fixture.detectChanges();

        expect(component.checked()).toBe(false); // Apple is not in ['Banana']

        // Click to add Apple
        component.onClick(new MouseEvent('click', { bubbles: true, cancelable: true }));
        fixture.detectChanges();

        expect(component.model()).toEqual(['Banana', 'Apple']);
        expect(component.checked()).toBe(true);

        // Click to remove Apple
        component.onClick(new MouseEvent('click', { bubbles: true, cancelable: true }));
        fixture.detectChanges();

        expect(component.model()).toEqual(['Banana']);
        expect(component.checked()).toBe(false);
    });

    it('should disabled input correctly', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const event = new MouseEvent('click');
        let emitted = false;

        component.onChangeEvent.subscribe(() => {
            emitted = true;
        });

        // Test the disabled gate
        component.onClick(event);

        expect(emitted).toBe(false);
    });
});
