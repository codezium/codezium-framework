import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzSidebarComponent } from './sidebar.component';
import { CzMenuItem } from '../../types';
import { LucideHouse } from '@lucide/angular';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzSidebarComponent', () => {
    let component: CzSidebarComponent;
    let fixture: ComponentFixture<CzSidebarComponent>;

    const items: CzMenuItem[] = [
        { label: 'Home', icon: LucideHouse, command: vi.fn() },
        { separator: true },
        { label: 'Settings', items: [{ label: 'Profile', command: vi.fn() }] },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzSidebarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzSidebarComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('items', items);
        fixture.componentRef.setInput('header', 'Navigation');
    });

    function links(): HTMLButtonElement[] {
        return fixture.debugElement
            .queryAll(By.css('.cz-sidebar-link'))
            .map((el) => el.nativeElement as HTMLButtonElement);
    }

    it('should create and render the header, items and separator', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-sidebar-title').textContent).toContain('Navigation');
        expect(links().length).toBe(2);
        expect(fixture.nativeElement.querySelector('.cz-sidebar-separator')).toBeTruthy();
    });

    it('should activate leaf items and emit', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        links()[0].click();

        expect(items[0].command).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(items[0]);
    });

    it('should expand and collapse groups', () => {
        fixture.detectChanges();

        links()[1].click();
        fixture.detectChanges();

        expect(component.isExpanded(items[2])).toBe(true);
        expect(links().length).toBe(3);
        expect(fixture.nativeElement.querySelector('.cz-sidebar-list--nested')).toBeTruthy();

        links()[1].click();
        fixture.detectChanges();
        expect(links().length).toBe(2);
    });

    it('should toggle the collapsed mini mode', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.classList.contains('cz-sidebar--collapsed')).toBe(false);

        component.toggleCollapse();
        fixture.detectChanges();

        expect(component.collapsed()).toBe(true);
        expect(fixture.nativeElement.classList.contains('cz-sidebar--collapsed')).toBe(true);
        expect(fixture.nativeElement.querySelector('.cz-sidebar-collapse').getAttribute('aria-expanded')).toBe('false');
    });

    it('should expose title attribute on links when collapsed', () => {
        component.toggleCollapse();
        fixture.detectChanges();

        expect(links()[0].getAttribute('title')).toBe('Home');
    });
});
