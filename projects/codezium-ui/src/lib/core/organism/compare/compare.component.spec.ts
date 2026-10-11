import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzCompareComponent } from './compare.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzCompareComponent', () => {
    let component: CzCompareComponent;
    let fixture: ComponentFixture<CzCompareComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzCompareComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzCompareComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('leftImage', 'before.png');
        fixture.componentRef.setInput('rightImage', 'after.png');
    });

    it('should create and render both images and labels', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        const images = fixture.debugElement.queryAll(By.css('.cz-compare-image'));
        expect(images.length).toBe(2);
        expect(fixture.nativeElement.textContent).toContain('Before');
        expect(fixture.nativeElement.textContent).toContain('After');
    });

    it('should clip the left image based on the value', () => {
        fixture.detectChanges();

        expect(component.clipPath()).toBe('inset(0 50% 0 0)');

        component.value.set(30);
        fixture.detectChanges();

        expect(component.clipPath()).toBe('inset(0 70% 0 0)');
    });

    it('should update the value through the range input', () => {
        fixture.detectChanges();

        const range = fixture.debugElement.query(By.css('.cz-compare-range')).nativeElement as HTMLInputElement;
        range.value = '75';
        range.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.value()).toBe(75);
        expect(component.clipPath()).toBe('inset(0 25% 0 0)');
    });

    it('should ignore invalid range values', () => {
        fixture.detectChanges();

        component.onRangeInput({ target: { value: 'nope' } } as unknown as Event);
        expect(component.value()).toBe(50);
    });

    it('should position the handle with the value', () => {
        fixture.detectChanges();

        component.value.set(20);
        fixture.detectChanges();

        const handle = fixture.nativeElement.querySelector('.cz-compare-handle') as HTMLElement;
        expect(handle.style.left).toBe('20%');
    });
});
