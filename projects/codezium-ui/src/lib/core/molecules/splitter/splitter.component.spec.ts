import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzSplitterComponent } from './splitter.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzSplitterComponent', () => {
    let component: CzSplitterComponent;
    let fixture: ComponentFixture<CzSplitterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzSplitterComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzSplitterComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('panelSizes', [20, 80]);
    });

    function container(): HTMLElement {
        return fixture.debugElement.query(By.css('.cz-splitter-container')).nativeElement;
    }

    it('should create with panels and a gutter', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.debugElement.queryAll(By.css('.cz-splitter-panel')).length).toBe(2);
        expect(fixture.debugElement.queryAll(By.css('.cz-splitter-gutter')).length).toBe(1);
        expect(component.sizes()).toEqual([20, 80]);
    });

    it('should resize panels while dragging', () => {
        fixture.detectChanges();

        vi.spyOn(container(), 'getBoundingClientRect').mockReturnValue({
            left: 0,
            width: 200,
        } as DOMRect);

        component.startResize(new MouseEvent('mousedown'), 0);
        component.onMouseMove(new MouseEvent('mousemove', { clientX: 100 }));
        fixture.detectChanges();

        expect(component.sizes()[0]).toBe(50);
        expect(component.sizes()[1]).toBe(50);

        component.stopResize();
        component.onMouseMove(new MouseEvent('mousemove', { clientX: 150 }));

        expect(component.sizes()[0]).toBe(50);
    });

    it('should clamp resizing to a minimum of 10%', () => {
        fixture.detectChanges();

        vi.spyOn(container(), 'getBoundingClientRect').mockReturnValue({
            left: 0,
            width: 200,
        } as DOMRect);

        component.startResize(new MouseEvent('mousedown'), 0);
        component.onMouseMove(new MouseEvent('mousemove', { clientX: 5 }));

        expect(component.sizes()[0]).toBe(10);
        expect(component.sizes()[1]).toBe(90);
    });

    it('should resize with keyboard arrows on the gutter', () => {
        fixture.detectChanges();

        const gutter = fixture.debugElement.query(By.css('.cz-splitter-gutter')).nativeElement;
        expect(gutter.getAttribute('role')).toBe('separator');

        component.onGutterKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), 0);
        expect(component.sizes()[0]).toBe(25);

        component.onGutterKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }), 0);
        expect(component.sizes()[0]).toBe(20);
    });

    it('should ignore vertical arrows in horizontal orientation', () => {
        fixture.detectChanges();

        component.onGutterKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }), 0);
        expect(component.sizes()[0]).toBe(20);
    });
});
