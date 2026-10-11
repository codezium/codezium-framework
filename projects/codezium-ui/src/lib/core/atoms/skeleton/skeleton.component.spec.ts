import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzSkeletonComponent } from './skeleton.component';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzSkeletonComponent', () => {
    let component: CzSkeletonComponent;
    let fixture: ComponentFixture<CzSkeletonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzSkeletonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzSkeletonComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should have rectangle defaults', () => {
        fixture.detectChanges();

        expect(component.actualWidth()).toBe('100%');
        expect(component.actualHeight()).toBe('1rem');
        expect(component.actualBorderRadius()).toBe('var(--cz-skeleton-border-radius)');
    });

    it('should apply the size to width and height', () => {
        fixture.componentRef.setInput('size', '4rem');
        fixture.detectChanges();

        expect(component.actualWidth()).toBe('4rem');
        expect(component.actualHeight()).toBe('4rem');

        fixture.componentRef.setInput('size', 40);
        fixture.detectChanges();

        expect(component.actualWidth()).toBe('40px');
        expect(component.actualHeight()).toBe('40px');
    });

    it('should support the wave animation and none', () => {
        fixture.componentRef.setInput('animation', 'wave');
        fixture.detectChanges();

        let host = fixture.nativeElement as HTMLElement;
        expect(host.classList.contains('cz-skeleton--wave')).toBe(true);
        expect(host.classList.contains('cz-skeleton--pulse')).toBe(false);

        fixture.componentRef.setInput('animation', 'none');
        fixture.detectChanges();

        host = fixture.nativeElement as HTMLElement;
        expect(host.classList.contains('cz-skeleton--wave')).toBe(false);
        expect(host.classList.contains('cz-skeleton--pulse')).toBe(false);
    });

    it('should apply circle defaults', () => {
        fixture.componentRef.setInput('shape', 'circle');
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(component.actualWidth()).toBe('3rem');
        expect(component.actualHeight()).toBe('3rem');
        expect(component.actualBorderRadius()).toBe('50%');
        expect(host.classList.contains('cz-skeleton--circle')).toBe(true);
    });

    it('should convert numeric sizes to pixels', () => {
        fixture.componentRef.setInput('width', 120);
        fixture.componentRef.setInput('height', 24);
        fixture.detectChanges();

        expect(component.actualWidth()).toBe('120px');
        expect(component.actualHeight()).toBe('24px');
    });

    it('should accept css size strings and radius override', () => {
        fixture.componentRef.setInput('width', '50%');
        fixture.componentRef.setInput('borderRadius', '999px');
        fixture.detectChanges();

        expect(component.actualWidth()).toBe('50%');
        expect(component.actualBorderRadius()).toBe('999px');
    });

    it('should toggle the pulse animation', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('cz-skeleton--pulse')).toBe(true);

        fixture.componentRef.setInput('animation', 'none');
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('cz-skeleton--pulse')).toBe(false);
    });

    it('should be hidden from assistive technologies', () => {
        fixture.detectChanges();
        expect((fixture.nativeElement as HTMLElement).getAttribute('aria-hidden')).toBe('true');
    });
});
