import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzSplitButtonComponent } from './split-button.component';
import { CzMenuItem } from '../../types';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzSplitButtonComponent', () => {
    let component: CzSplitButtonComponent;
    let fixture: ComponentFixture<CzSplitButtonComponent>;

    const items: CzMenuItem[] = [
        { label: 'Update', command: vi.fn() },
        { separator: true },
        { label: 'Delete', disabled: true },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzSplitButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzSplitButtonComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('label', 'Save');
        fixture.componentRef.setInput('items', items);
    });

    it('should create and render the default action', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-split-button-main').textContent).toContain('Save');
    });

    it('should emit onClick from the main button', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onClick.subscribe(spy);

        fixture.debugElement.query(By.css('.cz-split-button-main')).nativeElement.click();

        expect(spy).toHaveBeenCalled();
    });

    it('should open and close the dropdown from the toggle', () => {
        fixture.detectChanges();

        const toggle = fixture.debugElement.query(By.css('.cz-split-button-toggle')).nativeElement;
        toggle.click();
        fixture.detectChanges();

        expect(component.open()).toBe(true);
        expect(fixture.nativeElement.querySelector('.cz-split-button-menu')).toBeTruthy();
        expect(toggle.getAttribute('aria-expanded')).toBe('true');

        toggle.click();
        fixture.detectChanges();
        expect(component.open()).toBe(false);
    });

    it('should activate menu items and close', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        fixture.debugElement.query(By.css('.cz-split-button-toggle')).nativeElement.click();
        fixture.detectChanges();

        const menuItems = fixture.debugElement.queryAll(By.css('.cz-split-button-item'));
        menuItems[0].nativeElement.click();
        fixture.detectChanges();

        expect(items[0].command).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(items[0]);
        expect(component.open()).toBe(false);
    });

    it('should render separators and disabled items', () => {
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-split-button-toggle')).nativeElement.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-split-button-separator')).toBeTruthy();
        const menuItems = fixture.debugElement.queryAll(By.css('.cz-split-button-item'));
        expect((menuItems[1].nativeElement as HTMLButtonElement).disabled).toBe(true);
    });

    it('should block interaction when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onClick.subscribe(spy);

        const main = fixture.debugElement.query(By.css('.cz-split-button-main')).nativeElement as HTMLButtonElement;
        const toggle = fixture.debugElement.query(By.css('.cz-split-button-toggle')).nativeElement as HTMLButtonElement;

        expect(main.disabled).toBe(true);
        expect(toggle.disabled).toBe(true);

        main.click();
        toggle.click();
        fixture.detectChanges();

        expect(spy).not.toHaveBeenCalled();
        expect(component.open()).toBe(false);
    });

    it('should close on outside document click', () => {
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-split-button-toggle')).nativeElement.click();
        fixture.detectChanges();

        component.onDocumentClick({ target: document.body } as unknown as Event);
        expect(component.open()).toBe(false);
    });
});
