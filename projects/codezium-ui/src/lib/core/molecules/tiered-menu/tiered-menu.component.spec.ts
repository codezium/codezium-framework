import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTieredMenuComponent } from './tiered-menu.component';
import { CzMenuItem } from '../../types';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzTieredMenuComponent', () => {
    let component: CzTieredMenuComponent;
    let fixture: ComponentFixture<CzTieredMenuComponent>;

    const items: CzMenuItem[] = [
        { label: 'View', command: vi.fn() },
        {
            label: 'Share',
            items: [
                { label: 'Email', command: vi.fn() },
                {
                    label: 'Social',
                    items: [{ label: 'Twitter', command: vi.fn() }],
                },
            ],
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzTieredMenuComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzTieredMenuComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('items', items);
    });

    function leaf(text: string): HTMLButtonElement {
        return fixture.debugElement
            .queryAll(By.css('.cz-tiered-menu-link'))
            .map((el) => el.nativeElement as HTMLButtonElement)
            .find((el) => el.textContent?.includes(text))!;
    }

    it('should create and render the full hierarchy', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(leaf('View')).toBeTruthy();
        expect(leaf('Email')).toBeTruthy();
        expect(leaf('Twitter')).toBeTruthy();
        expect(fixture.nativeElement.querySelectorAll('.cz-tiered-menu-submenu').length).toBe(2);
    });

    it('should run the command and emit on leaf activation', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        leaf('View').click();

        expect(items[0].command).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(items[0]);
    });

    it('should not activate items with children', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        leaf('Share').click();

        expect(spy).not.toHaveBeenCalled();
    });

    it('should expose aria-haspopup on items with children', () => {
        fixture.detectChanges();

        expect(leaf('Share').getAttribute('aria-haspopup')).toBe('menu');
        expect(leaf('View').getAttribute('aria-haspopup')).toBeNull();
    });
});
