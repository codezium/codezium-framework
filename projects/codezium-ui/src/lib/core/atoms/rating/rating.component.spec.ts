import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzRatingComponent } from './rating.component';
import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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
        stars[3].click(); // Click 4th star (index 3)
        fixture.detectChanges();
        expect(component.value()).toBe(4);
    });

    it('should clear value on cancel click', () => {
        fixture.componentRef.setInput('cancel', true);
        component.value.set(3);
        fixture.detectChanges();
        
        const cancelBtn = fixture.nativeElement.querySelector('.cz-rating-cancel');
        cancelBtn.click();
        fixture.detectChanges();
        
        expect(component.value()).toBeNull();
    });

    it('should respect readonly state', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.componentRef.setInput('stars', 5);
        component.value.set(1);
        fixture.detectChanges();
        
        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        stars[4].click(); // Click 5th star
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

    it('should handle keyboard navigation (ArrowRight)', () => {
        component.value.set(2);
        fixture.detectChanges();
        
        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        const secondStar = stars[1];
        
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        secondStar.dispatchEvent(event);
        fixture.detectChanges();
        
        expect(component.value()).toBe(3);
    });

    it('should handle keyboard navigation (ArrowLeft)', () => {
        component.value.set(3);
        fixture.detectChanges();
        
        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        const thirdStar = stars[2];
        
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        thirdStar.dispatchEvent(event);
        fixture.detectChanges();
        
        expect(component.value()).toBe(2);
    });

    it('should update hover state on mouseenter', () => {
        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        const fourthStar = stars[3];
        
        fourthStar.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();
        
        expect(component.hoveredValue()).toBe(4);
        
        const container = fixture.nativeElement.querySelector('.cz-rating-container');
        container.dispatchEvent(new MouseEvent('mouseleave'));
        fixture.detectChanges();
        
        expect(component.hoveredValue()).toBeNull();
    });

    it('should integrate with Angular Forms (writeValue)', async () => {
        component.writeValue(5);
        fixture.detectChanges();
        expect(component.value()).toBe(5);
    });

    it('should handle focus/blur states', () => {
        const stars = fixture.nativeElement.querySelectorAll('.cz-rating-star');
        const star = stars[0];
        
        star.dispatchEvent(new FocusEvent('focus'));
        fixture.detectChanges();
        expect(component.focusedStar()).toBe(1);
        
        star.dispatchEvent(new FocusEvent('blur'));
        fixture.detectChanges();
        expect(component.focusedStar()).toBeNull();
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
});
