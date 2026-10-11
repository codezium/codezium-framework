import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzVirtualScrollerComponent } from './virtual-scroller.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzVirtualScrollerComponent', () => {
    let component: CzVirtualScrollerComponent;
    let fixture: ComponentFixture<CzVirtualScrollerComponent>;

    const items = Array.from({ length: 100 }, (_, i) => ({ name: `Item ${i}` }));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzVirtualScrollerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzVirtualScrollerComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('items', items);
        fixture.componentRef.setInput('itemSize', 40);
        fixture.componentRef.setInput('height', 200);
        fixture.componentRef.setInput('field', 'name');
    });

    function scrollTo(scrollTop: number): void {
        const viewport = fixture.debugElement.query(By.css('.cz-virtual-scroller-viewport')).nativeElement;
        viewport.scrollTop = scrollTop;
        viewport.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
    }

    it('should create and only render the visible window plus overscan', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        // height 200 / itemSize 40 = 5 visible + 2 overscan on both sides = 9
        expect(component.visibleItems().length).toBe(9);
        expect(component.visibleItems()[0].index).toBe(0);
        expect(fixture.nativeElement.querySelectorAll('.cz-virtual-scroller-item').length).toBe(9);
    });

    it('should size the spacer with the total height', () => {
        fixture.detectChanges();

        const spacer = fixture.debugElement.query(By.css('.cz-virtual-scroller-spacer')).nativeElement as HTMLElement;
        expect(spacer.style.height).toBe('4000px');
    });

    it('should update the window on scroll', () => {
        fixture.detectChanges();

        scrollTo(400);

        expect(component.startIndex()).toBe(8);
        expect(component.visibleItems()[0].index).toBe(8);
        expect(component.offsetY()).toBe(320);

        const firstItem = fixture.debugElement.query(By.css('.cz-virtual-scroller-item')).nativeElement;
        expect(firstItem.textContent).toContain('Item 8');
    });

    it('should clamp the window at the end of the list', () => {
        fixture.detectChanges();

        scrollTo(4000);

        expect(component.endIndex()).toBe(100);
        expect(component.visibleItems().length).toBeLessThanOrEqual(9);
    });

    it('should display plain values when no field is set', () => {
        fixture.componentRef.setInput('items', ['alpha', 'beta']);
        fixture.componentRef.setInput('field', '');
        fixture.detectChanges();

        expect(component.display('alpha')).toBe('alpha');
    });
});
