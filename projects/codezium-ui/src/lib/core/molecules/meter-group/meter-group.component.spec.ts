import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzMeterGroupComponent } from './meter-group.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzMeterGroupComponent', () => {
    let component: CzMeterGroupComponent;
    let fixture: ComponentFixture<CzMeterGroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzMeterGroupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzMeterGroupComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('value', [
            { label: 'Apps', value: 40 },
            { label: 'Media', value: 25, color: 'red' },
        ]);
    });

    it('should create and render the segments and legend', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.debugElement.queryAll(By.css('.cz-meter-group-segment')).length).toBe(2);
        expect(fixture.debugElement.queryAll(By.css('.cz-meter-group-legend-item')).length).toBe(2);
        expect(fixture.nativeElement.textContent).toContain('Apps');
        expect(fixture.nativeElement.textContent).toContain('25');
    });

    it('should compute the total clamped to max', () => {
        fixture.detectChanges();

        expect(component.total()).toBe(65);

        fixture.componentRef.setInput('max', 50);
        fixture.detectChanges();

        expect(component.total()).toBe(50);
    });

    it('should compute segment percentages', () => {
        fixture.detectChanges();

        expect(component.percentOf({ label: 'a', value: 40 })).toBe(40);
        expect(component.percentOf({ label: 'a', value: 150 })).toBe(100);
        expect(component.percentOf({ label: 'a', value: -5 })).toBe(0);
    });

    it('should use custom and fallback colors', () => {
        fixture.detectChanges();

        expect(component.colorOf({ label: 'a', value: 1, color: 'red' }, 0)).toBe('red');
        expect(component.colorOf({ label: 'a', value: 1 }, 0)).toContain('--cz-color-primary');
        expect(component.colorOf({ label: 'a', value: 1 }, 1)).toContain('--cz-color-success');
    });

    it('should set the segment flex basis', () => {
        fixture.detectChanges();

        const segment = fixture.debugElement.query(By.css('.cz-meter-group-segment')).nativeElement as HTMLElement;
        expect(segment.style.flexBasis).toBe('40%');
    });

    it('should expose the orientation attribute', () => {
        fixture.componentRef.setInput('orientation', 'vertical');
        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLElement).getAttribute('data-orientation')).toBe('vertical');
    });
});
