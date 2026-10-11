import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzRatingComponent } from './rating.component';
import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideHeart, LucideHeartOff } from '@lucide/angular';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
    standalone: true,
    imports: [CzRatingComponent, FormsModule],
    template: `
        <cz-rating [ngModel]="3">
            <ng-template #onicon let-index>
                <i class="custom-on-icon">{{ index }}</i>
            </ng-template>
            <ng-template #officon>
                <i class="custom-off-icon"></i>
            </ng-template>
        </cz-rating>
    `
})
class RatingTemplateHostComponent { }

describe('CzRatingComponent', () => {
    let component: CzRatingComponent;
    let fixture: ComponentFixture<CzRatingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzRatingComponent, FormsModule, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(CzRatingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct number of stars', () => {
        fixture.componentRef.setInput('stars', 10);
        fixture.detectChanges();
        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        expect(stars.length).toBe(10);
    });

    it('should update value on star click', () => {
        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        stars[3].click();
        fixture.detectChanges();
        expect(component.value()).toBe(4);
    });

    it('should clear the value when the same star is clicked again', () => {
        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        stars[2].click();
        fixture.detectChanges();
        expect(component.value()).toBe(3);

        stars[2].click();
        fixture.detectChanges();
        expect(component.value()).toBeNull();
    });

    it('should respect readonly state', () => {
        fixture.componentRef.setInput('readonly', true);
        component.value.set(1);
        fixture.detectChanges();

        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        stars[4].click();
        fixture.detectChanges();

        expect(component.value()).toBe(1);
    });

    it('should respect disabled state', () => {
        fixture.componentRef.setInput('disabled', true);
        component.value.set(1);
        fixture.detectChanges();

        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        stars[4].click();
        fixture.detectChanges();

        expect(component.value()).toBe(1);
        expect(component.isDisabled()).toBe(true);
    });

    it('should update value when a hidden radio is selected (native keyboard support)', () => {
        const radios = fixture.nativeElement.querySelectorAll('.cz-rating-input');
        radios[2].click();
        fixture.detectChanges();
        expect(component.value()).toBe(3);
    });

    it('should render hidden radio inputs with name and aria labels', () => {
        fixture.componentRef.setInput('name', 'my-rating');
        fixture.detectChanges();

        const radios = fixture.nativeElement.querySelectorAll('.cz-rating-input');
        expect(radios.length).toBe(5);
        expect(radios[0].getAttribute('name')).toBe('my-rating');
        expect(radios[0].getAttribute('aria-label')).toBe('1 star');
        expect(radios[3].getAttribute('aria-label')).toBe('4 stars');
    });

    it('should generate a unique radio group name when name is not provided', () => {
        const radios = fixture.nativeElement.querySelectorAll('.cz-rating-input');
        expect(radios[0].getAttribute('name')).toBeTruthy();

        const second = TestBed.createComponent(CzRatingComponent);
        second.detectChanges();
        const otherRadios = second.nativeElement.querySelectorAll('.cz-rating-input');
        expect(otherRadios[0].getAttribute('name')).not.toBe(radios[0].getAttribute('name'));
    });

    it('should support half stars when allowHalf is enabled', () => {
        fixture.componentRef.setInput('allowHalf', true);
        fixture.detectChanges();

        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        const target = stars[3];
        vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
            left: 0, top: 0, width: 20, height: 20, right: 20, bottom: 20, x: 0, y: 0, toJSON: () => ({})
        } as DOMRect);

        target.dispatchEvent(new MouseEvent('pointermove', { clientX: 5, bubbles: true }));
        fixture.detectChanges();
        expect(component.activeValue()).toBe(3.5);

        target.dispatchEvent(new MouseEvent('click', { clientX: 5, bubbles: true }));
        fixture.detectChanges();
        expect(component.value()).toBe(3.5);
    });

    it('should resolve half value vertically based on clientY', () => {
        fixture.componentRef.setInput('allowHalf', true);
        fixture.componentRef.setInput('orientation', 'vertical');
        fixture.detectChanges();

        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        const target = stars[1];
        vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
            left: 0, top: 0, width: 20, height: 20, right: 20, bottom: 20, x: 0, y: 0, toJSON: () => ({})
        } as DOMRect);

        target.dispatchEvent(new MouseEvent('pointermove', { clientY: 5, bubbles: true }));
        fixture.detectChanges();
        expect(component.activeValue()).toBe(1.5);

        target.dispatchEvent(new MouseEvent('click', { clientY: 15, bubbles: true }));
        fixture.detectChanges();
        expect(component.value()).toBe(2);
    });

    it('should render two radios per star when allowHalf is enabled', () => {
        fixture.componentRef.setInput('allowHalf', true);
        fixture.detectChanges();

        const radios = fixture.nativeElement.querySelectorAll('.cz-rating-input');
        expect(radios.length).toBe(10);

        const fullRadio = radios[1];
        fullRadio.click();
        fixture.detectChanges();
        expect(component.value()).toBe(1);
    });

    it('should update hover state on pointer move and reset on pointer leave', () => {
        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        const host = fixture.nativeElement as HTMLElement;

        host.dispatchEvent(new MouseEvent('pointerenter'));
        fixture.detectChanges();
        expect(component.hovering()).toBe(true);

        stars[3].dispatchEvent(new MouseEvent('pointermove', { clientX: 0, bubbles: true }));
        fixture.detectChanges();
        expect(component.hoveringValue()).toBe(4);
        expect(component.activeValue()).toBe(4);

        host.dispatchEvent(new MouseEvent('pointerleave'));
        fixture.detectChanges();
        expect(component.hovering()).toBe(false);
        expect(component.hoveringValue()).toBe(0);
    });

    it('should integrate with Angular Forms (writeValue)', async () => {
        component.writeValue(5);
        fixture.detectChanges();
        expect(component.value()).toBe(5);
    });

    it('should handle focus/blur states and emit onFocus/onBlur', () => {
        const focusSpy = vi.fn();
        const blurSpy = vi.fn();
        component.onFocusEvent.subscribe(focusSpy);
        component.onBlurEvent.subscribe(blurSpy);

        const radios = fixture.nativeElement.querySelectorAll('.cz-rating-input');
        radios[0].dispatchEvent(new FocusEvent('focus'));
        fixture.detectChanges();
        expect(component.focusedStar()).toBe(1);
        expect(focusSpy).toHaveBeenCalledTimes(1);

        radios[0].dispatchEvent(new FocusEvent('blur'));
        fixture.detectChanges();
        expect(component.focusedStar()).toBeNull();
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit onFocus when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onFocusEvent.subscribe(spy);

        const radios = fixture.nativeElement.querySelectorAll('.cz-rating-input');
        radios[0].dispatchEvent(new FocusEvent('focus'));
        fixture.detectChanges();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should display label and respect labelPosition', () => {
        fixture.componentRef.setInput('label', 'Test Label');
        fixture.componentRef.setInput('labelPosition', 'left');
        fixture.detectChanges();

        let label = fixture.nativeElement.querySelector('.cz-rating-label');
        expect(label).toBeTruthy();
        expect(label.textContent).toBe('Test Label');
        expect(label.classList.contains('cz-rating-label--left')).toBe(true);

        fixture.componentRef.setInput('labelPosition', 'right');
        fixture.detectChanges();
        label = fixture.nativeElement.querySelector('.cz-rating-label');
        expect(label.classList.contains('cz-rating-label--right')).toBe(true);
    });

    it('should change icon size based on size input', () => {
        fixture.componentRef.setInput('size', 'sm');
        fixture.detectChanges();
        expect(component.iconSize()).toBe(16);

        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();
        expect(component.iconSize()).toBe(32);

        fixture.componentRef.setInput('size', 'md');
        fixture.detectChanges();
        expect(component.iconSize()).toBe(24);
    });

    it('should emit onRate with the change payload on star click', () => {
        const spy = vi.fn();
        component.onRateEvent.subscribe(spy);

        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        stars[2].click();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledTimes(1);
        const payload = spy.mock.calls[0][0];
        expect(payload.value).toBe(3);
        expect(payload.originalEvent).toBeTruthy();
    });

    it('should apply the invalid class from the invalid input', () => {
        fixture.componentRef.setInput('invalid', true);
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('cz-rating--invalid')).toBe(true);
    });

    it('should apply icon class and style inputs', () => {
        fixture.componentRef.setInput('iconOnClass', 'my-on-class');
        fixture.componentRef.setInput('iconOnStyle', { opacity: 0.5 });
        fixture.componentRef.setInput('iconOffClass', 'my-off-class');
        fixture.detectChanges();

        const onIcon = fixture.nativeElement.querySelector('.cz-rating-on-icon');
        const offIcon = fixture.nativeElement.querySelector('.cz-rating-off-icon');
        expect(onIcon.classList.contains('my-on-class')).toBe(true);
        expect(onIcon.style.opacity).toBe('0.5');
        expect(offIcon.classList.contains('my-off-class')).toBe(true);
    });

    it('should render custom on/off icons', () => {
        fixture.componentRef.setInput('iconOn', LucideHeart);
        fixture.componentRef.setInput('iconOff', LucideHeartOff);
        component.value.set(2);
        fixture.detectChanges();

        const activeStar = fixture.nativeElement.querySelector('.cz-rating-star--highlighted svg');
        expect(activeStar).toBeTruthy();
    });

    it('should render custom onicon/officon templates with the star index as implicit context', () => {
        const hostFixture = TestBed.createComponent(RatingTemplateHostComponent);
        hostFixture.detectChanges();

        const onIcons = hostFixture.nativeElement.querySelectorAll('.custom-on-icon');
        const offIcons = hostFixture.nativeElement.querySelectorAll('.custom-off-icon');
        expect(onIcons.length).toBe(5);
        expect(offIcons.length).toBe(5);
        expect(onIcons[0].textContent.trim()).toBe('1');
        expect(onIcons[4].textContent.trim()).toBe('5');
    });

    it('should reflect the orientation on the host element', () => {
        fixture.componentRef.setInput('orientation', 'vertical');
        fixture.detectChanges();
        expect(fixture.nativeElement.getAttribute('data-orientation')).toBe('vertical');
    });
});
