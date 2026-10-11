import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzDockComponent } from './dock.component';
import { CzMenuItem } from '../../types';
import { LucideHouse } from '@lucide/angular';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzDockComponent', () => {
    let component: CzDockComponent;
    let fixture: ComponentFixture<CzDockComponent>;

    const items: CzMenuItem[] = [
        { label: 'Home', icon: LucideHouse, command: vi.fn() },
        { label: 'Disabled', disabled: true },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzDockComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzDockComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('items', items);
    });

    afterEach(() => {
        document.querySelectorAll('.cz-tooltip').forEach((el) => el.remove());
    });

    function dockItems(): HTMLButtonElement[] {
        return fixture.debugElement
            .queryAll(By.css('.cz-dock-item'))
            .map((el) => el.nativeElement as HTMLButtonElement);
    }

    it('should create and render the items with the toolbar role', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[role="toolbar"]')).toBeTruthy();
        expect(dockItems().length).toBe(2);
        expect(dockItems()[0].querySelector('svg')).toBeTruthy();
    });

    it('should activate an item and emit onItemSelect', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        dockItems()[0].click();

        expect(items[0].command).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(items[0]);
    });

    it('should not activate disabled items', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        expect(dockItems()[1].disabled).toBe(true);
        dockItems()[1].click();

        expect(spy).not.toHaveBeenCalled();
    });

    it('should use the label as accessible name and tooltip', () => {
        fixture.detectChanges();

        expect(dockItems()[0].getAttribute('aria-label')).toBe('Home');

        dockItems()[0].dispatchEvent(new MouseEvent('mouseenter'));
        const tooltip = document.querySelector('.cz-tooltip');
        expect(tooltip?.textContent).toContain('Home');
    });

    it('should render a letter fallback when there is no icon', () => {
        fixture.detectChanges();

        expect(dockItems()[1].querySelector('.cz-dock-fallback')?.textContent).toBe('D');
    });
});
