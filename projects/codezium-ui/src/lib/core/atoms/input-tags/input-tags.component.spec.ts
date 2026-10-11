import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzInputTagsComponent } from './input-tags.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzInputTagsComponent', () => {
    let component: CzInputTagsComponent;
    let fixture: ComponentFixture<CzInputTagsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzInputTagsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzInputTagsComponent);
        component = fixture.componentInstance;
    });

    function inputEl(): HTMLInputElement {
        return fixture.debugElement.query(By.css('.cz-input-tags-input')).nativeElement;
    }

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render chips for the current value (writeValue)', () => {
        component.writeValue(['angular', 'typescript']);
        fixture.detectChanges();

        const chips = fixture.nativeElement.querySelectorAll('cz-chip');
        expect(chips.length).toBe(2);
        expect(fixture.nativeElement.textContent).toContain('angular');
    });

    it('should ignore non array writeValue values', () => {
        component.writeValue(null);
        fixture.detectChanges();

        expect(component.value()).toEqual([]);
    });

    it('should add a tag on Enter and notify CVA + output', () => {
        fixture.detectChanges();

        const changeSpy = vi.fn();
        const addSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onAdd.subscribe(addSpy);

        const input = inputEl();
        input.value = 'angular';
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        fixture.detectChanges();

        expect(component.value()).toEqual(['angular']);
        expect(component.inputValue()).toBe('');
        expect(changeSpy).toHaveBeenCalledWith(['angular']);
        expect(addSpy).toHaveBeenCalledWith('angular');
    });

    it('should create tags when a separator is typed', () => {
        fixture.detectChanges();

        const input = inputEl();
        input.value = 'one,two';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.value()).toEqual(['one']);
        expect(component.inputValue()).toBe('two');
    });

    it('should ignore duplicates and empty values', () => {
        component.writeValue(['angular']);
        fixture.detectChanges();

        component.addTag('angular');
        component.addTag('   ');
        fixture.detectChanges();

        expect(component.value()).toEqual(['angular']);
    });

    it('should respect the max amount of tags', () => {
        fixture.componentRef.setInput('max', 2);
        component.writeValue(['one']);
        fixture.detectChanges();

        component.addTag('two');
        component.addTag('three');
        fixture.detectChanges();

        expect(component.value()).toEqual(['one', 'two']);
    });

    it('should remove a tag through the chip remove button', () => {
        component.writeValue(['one', 'two']);
        fixture.detectChanges();

        const removeSpy = vi.fn();
        component.onRemove.subscribe(removeSpy);

        const removeBtn = fixture.debugElement.query(By.css('cz-chip .cz-chip-remove')).nativeElement;
        removeBtn.click();
        fixture.detectChanges();

        expect(component.value()).toEqual(['two']);
        expect(removeSpy).toHaveBeenCalledWith('one');
    });

    it('should remove the last tag with Backspace when the input is empty', () => {
        component.writeValue(['one', 'two']);
        fixture.detectChanges();

        inputEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
        fixture.detectChanges();

        expect(component.value()).toEqual(['one']);
    });

    it('should not add or remove tags when disabled', () => {
        component.setDisabledState?.(true);
        component.writeValue(['one']);
        fixture.detectChanges();

        component.addTag('two');
        component.removeTag('one');
        fixture.detectChanges();

        expect(component.value()).toEqual(['one']);
        expect(fixture.nativeElement.classList.contains('cz-input-tags--disabled')).toBe(true);
    });
});
