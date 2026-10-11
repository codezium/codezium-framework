import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzMegaMenuComponent } from './mega-menu.component';
import { CzMenuItem } from '../../types';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzMegaMenuComponent', () => {
    let component: CzMegaMenuComponent;
    let fixture: ComponentFixture<CzMegaMenuComponent>;

    const items: CzMenuItem[] = [
        {
            label: 'Products',
            items: [
                { label: 'Editor', group: 'Tools' },
                { label: 'Terminal', group: 'Tools' },
                { label: 'Cloud', group: 'Services' },
            ],
        },
        { label: 'Docs', command: vi.fn() },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzMegaMenuComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzMegaMenuComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('items', items);
    });

    function rootLinks(): HTMLButtonElement[] {
        return fixture.debugElement
            .queryAll(By.css('.cz-mega-menu-link'))
            .map((el) => el.nativeElement as HTMLButtonElement);
    }

    it('should create and render the root items', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(rootLinks().length).toBe(2);
    });

    it('should open a panel grouping children by group', () => {
        fixture.detectChanges();

        rootLinks()[0].click();
        fixture.detectChanges();

        const columns = fixture.debugElement.queryAll(By.css('.cz-mega-menu-column'));
        expect(columns.length).toBe(2);

        const labels = fixture.debugElement
            .queryAll(By.css('.cz-mega-menu-group-label'))
            .map((el) => el.nativeElement.textContent?.trim());
        expect(labels).toEqual(['Tools', 'Services']);
    });

    it('should activate a leaf and close the panel', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        rootLinks()[0].click();
        fixture.detectChanges();

        const leaves = fixture.debugElement.queryAll(By.css('.cz-mega-menu-leaf'));
        leaves[0].nativeElement.click();
        fixture.detectChanges();

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
});
