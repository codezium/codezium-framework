import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzChipComponent } from './chip.component';
import { LucideUser } from '@lucide/angular';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzChipComponent', () => {
    let component: CzChipComponent;
    let fixture: ComponentFixture<CzChipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzChipComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzChipComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render the label', () => {
        fixture.componentRef.setInput('label', 'Angular');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-chip-label').textContent).toContain('Angular');
    });

    it('should render an icon when provided', () => {
        fixture.componentRef.setInput('label', 'User');
        fixture.componentRef.setInput('icon', LucideUser);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-chip-icon')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-chip-image')).toBeNull();
    });

    it('should prefer the image over the icon', () => {
        fixture.componentRef.setInput('label', 'User');
        fixture.componentRef.setInput('icon', LucideUser);
        fixture.componentRef.setInput('image', 'https://example.com/avatar.png');
        fixture.detectChanges();

        const img = fixture.nativeElement.querySelector('.cz-chip-image') as HTMLImageElement;
        expect(img).toBeTruthy();
        expect(img.getAttribute('src')).toBe('https://example.com/avatar.png');
        expect(fixture.nativeElement.querySelector('.cz-chip-icon')).toBeNull();
    });

    it('should not render the remove button by default', () => {
        fixture.componentRef.setInput('label', 'Angular');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-chip-remove')).toBeNull();
    });

    it('should emit onRemove when the remove button is clicked', () => {
        fixture.componentRef.setInput('label', 'Angular');
        fixture.componentRef.setInput('removable', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onRemove.subscribe(spy);

        const remove = fixture.debugElement.query(By.css('.cz-chip-remove')).nativeElement;
        remove.click();

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should expose an accessible label on the remove button', () => {
        fixture.componentRef.setInput('label', 'Angular');
        fixture.componentRef.setInput('removable', true);
        fixture.componentRef.setInput('removeAriaLabel', 'Remove Angular');
        fixture.detectChanges();

        const remove = fixture.debugElement.query(By.css('.cz-chip-remove')).nativeElement;
        expect(remove.getAttribute('aria-label')).toBe('Remove Angular');
    });

    it('should not emit onRemove when disabled', () => {
        fixture.componentRef.setInput('label', 'Angular');
        fixture.componentRef.setInput('removable', true);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onRemove.subscribe(spy);

        const remove = fixture.debugElement.query(By.css('.cz-chip-remove')).nativeElement;
        expect(remove.disabled).toBe(true);
        remove.click();

        expect(spy).not.toHaveBeenCalled();
        expect(fixture.nativeElement.classList.contains('cz-chip--disabled')).toBe(true);
    });
});
