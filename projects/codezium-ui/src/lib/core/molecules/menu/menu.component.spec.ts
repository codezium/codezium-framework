import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzMenuComponent } from './menu.component';
import { CzMenuItem } from '../../types';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzMenuComponent', () => {
    let component: CzMenuComponent;
    let fixture: ComponentFixture<CzMenuComponent>;

    const items: CzMenuItem[] = [
        { label: 'New', command: vi.fn() },
        { separator: true },
        {
            label: 'Export',
            items: [
                { label: 'PDF', command: vi.fn() },
                { label: 'CSV', disabled: true },
            ],
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzMenuComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzMenuComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('items', items);
    });

    function links(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-menu-link')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    it('should create and render the menu with a separator', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(links().length).toBe(2);
        expect(fixture.nativeElement.querySelector('.cz-menu-separator')).toBeTruthy();
    });

    it('should run the command and emit on leaf activation', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        links()[0].click();

        expect(items[0].command).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(items[0]);
    });

    it('should expand and collapse nested items', () => {
        fixture.detectChanges();

        links()[1].click();
        fixture.detectChanges();

        expect(component.isExpanded(items[2])).toBe(true);
        expect(links().length).toBe(4);

        links()[1].click();
        fixture.detectChanges();

        expect(links().length).toBe(2);
    });

    it('should not activate disabled nested items', () => {
        fixture.detectChanges();

        links()[1].click();
        fixture.detectChanges();

        const csv = links().find((l) => l.textContent?.includes('CSV')) as HTMLButtonElement;
        expect(csv.disabled).toBe(true);
    });

    it('should expose menuitem roles', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeTruthy();
        expect(links()[0].getAttribute('role')).toBe('menuitem');
    });
});
