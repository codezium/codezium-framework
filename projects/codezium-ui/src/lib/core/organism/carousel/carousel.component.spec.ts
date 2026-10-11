import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzCarouselComponent } from './carousel.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('CzCarouselComponent', () => {
    let component: CzCarouselComponent;
    let fixture: ComponentFixture<CzCarouselComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzCarouselComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzCarouselComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('items', [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]);
        fixture.componentRef.setInput('field', 'name');
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should create and render the slides with indicators', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelectorAll('.cz-carousel-slide').length).toBe(3);
        expect(fixture.nativeElement.querySelectorAll('.cz-carousel-indicator').length).toBe(3);
    });

    it('should navigate with next and prev', () => {
        fixture.detectChanges();

        component.next();
        expect(component.activeIndex()).toBe(1);

        component.prev();
        expect(component.activeIndex()).toBe(0);
    });

    it('should clamp navigation when not circular', () => {
        fixture.detectChanges();

        component.prev();
        expect(component.activeIndex()).toBe(0);

        component.goTo(2);
        component.next();
        expect(component.activeIndex()).toBe(2);
    });

    it('should wrap around when circular', () => {
        fixture.componentRef.setInput('circular', true);
        fixture.detectChanges();

        component.prev();
        expect(component.activeIndex()).toBe(2);

        component.next();
        expect(component.activeIndex()).toBe(0);
    });

    it('should navigate through indicator clicks', () => {
        fixture.detectChanges();

        fixture.debugElement.queryAll(By.css('.cz-carousel-indicator'))[2].nativeElement.click();
        fixture.detectChanges();

        expect(component.activeIndex()).toBe(2);
        expect(
            fixture.debugElement.queryAll(By.css('.cz-carousel-indicator'))[2].nativeElement.getAttribute('aria-selected'),
        ).toBe('true');
    });

    it('should auto play and advance with the interval', () => {
        vi.useFakeTimers();

        fixture.componentRef.setInput('autoPlay', true);
        fixture.componentRef.setInput('autoPlayInterval', 1000);
        fixture.detectChanges();

        vi.advanceTimersByTime(1000);
        expect(component.activeIndex()).toBe(1);

        vi.advanceTimersByTime(1000);
        expect(component.activeIndex()).toBe(2);
    });

    it('should apply the track translation', () => {
        fixture.detectChanges();

        component.goTo(1);
        fixture.detectChanges();

        const track = fixture.nativeElement.querySelector('.cz-carousel-track') as HTMLElement;
        expect(track.style.transform).toBe('translateX(-100%)');
    });
});
