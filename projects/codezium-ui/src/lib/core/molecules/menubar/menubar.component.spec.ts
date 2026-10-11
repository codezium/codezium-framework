import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzMenubarComponent } from './menubar.component';
import { CzMenuItem } from '../../types';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzMenubarComponent', () => {
    let component: CzMenubarComponent;
    let fixture: ComponentFixture<CzMenubarComponent>;

    const items: CzMenuItem[] = [
        { label: 'File', items: [{ label: 'New', command: vi.fn() }, { label: 'Open' }] },
        { label: 'Help', command: vi.fn() },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzMenubarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzMenubarComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('items', items);
    });

    function rootLinks(): HTMLButtonElement[] {
        return fixture.debugElement
            .queryAll(By.css('.cz-menubar-link'))
            .map((el) => el.nativeElement as HTMLButtonElement);
    }

    it('should create with the menubar role', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[role="menubar"]')).toBeTruthy();
        expect(rootLinks().length).toBe(2);
    });

    it('should open and close the dropdown on root clicks', () => {
        fixture.detectChanges();

        rootLinks()[0].click();
        fixture.detectChanges();

        expect(component.openIndex()).toBe(0);
        expect(fixture.nativeElement.querySelector('.cz-menubar-dropdown')).toBeTruthy();
        expect(rootLinks()[0].getAttribute('aria-expanded')).toBe('true');

        rootLinks()[0].click();
        fixture.detectChanges();
        expect(component.openIndex()).toBe(-1);
    });

    it('should activate leaf dropdown items and close the menu', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        rootLinks()[0].click();
        fixture.detectChanges();

        const dropdownLinks = fixture.debugElement.queryAll(By.css('.cz-menubar-dropdown-link'));
        dropdownLinks[0].nativeElement.click();
        fixture.detectChanges();

        expect(items[0].items![0].command).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(items[0].items![0]);
        expect(component.openIndex()).toBe(-1);
    });

    it('should activate root leaf items directly', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        rootLinks()[1].click();

        expect(items[1].command).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(items[1]);
    });

    it('should close on Escape', () => {
        fixture.detectChanges();

        rootLinks()[0].click();
        fixture.detectChanges();

        component.close();
        expect(component.openIndex()).toBe(-1);
    });
});
