import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzCommandMenuComponent } from './command-menu.component';
import { CzMenuItem } from '../../types';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzCommandMenuComponent', () => {
    let component: CzCommandMenuComponent;
    let fixture: ComponentFixture<CzCommandMenuComponent>;

    const items: CzMenuItem[] = [
        { label: 'New file', command: vi.fn() },
        { label: 'Open folder', command: vi.fn() },
        { label: 'Disabled', disabled: true },
        { separator: true },
        { label: 'New window', command: vi.fn() },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzCommandMenuComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzCommandMenuComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('items', items);
    });

    function resultItems(): HTMLElement[] {
        return fixture.debugElement
            .queryAll(By.css('.cz-command-menu-item'))
            .map((el) => el.nativeElement as HTMLElement);
    }

    it('should create and stay hidden by default', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-command-menu-panel')).toBeNull();
    });

    it('should open, exclude disabled/separators and focus the search input', async () => {
        component.open();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.visible()).toBe(true);
        expect(resultItems().length).toBe(3);

        const input = fixture.debugElement.query(By.css('.cz-command-menu-input')).nativeElement;
        expect(document.activeElement).toBe(input);
    });

    it('should filter commands by query', () => {
        component.open();
        component.onQueryChange('new');
        fixture.detectChanges();

        const labels = resultItems().map((el) => el.textContent?.trim());
        expect(labels.length).toBe(2);
        expect(labels[0]).toContain('New file');
    });

    it('should show the empty message when nothing matches', () => {
        fixture.componentRef.setInput('emptyMessage', 'Nothing here');
        component.open();
        component.onQueryChange('zzz');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-command-menu-empty').textContent).toContain('Nothing here');
    });

    it('should navigate with arrows and select with Enter', () => {
        component.open();
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(component.focusedIndex()).toBe(1);

        component.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(items[1].command).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(items[1]);
        expect(component.visible()).toBe(false);
    });

    it('should clamp arrow navigation within results', () => {
        component.open();
        fixture.detectChanges();

        component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        expect(component.focusedIndex()).toBe(0);

        for (let i = 0; i < 10; i++) {
            component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        }
        expect(component.focusedIndex()).toBe(2);
    });

    it('should select with click and close on Escape', () => {
        component.open();
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        resultItems()[0].click();

        expect(items[0].command).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(items[0]);
        expect(component.visible()).toBe(false);

        component.open();
        fixture.detectChanges();
        component.onEscape();
        expect(component.visible()).toBe(false);
    });

    it('should reset the query on every open', () => {
        component.open();
        component.onQueryChange('new');
        component.close();
        component.open();

        expect(component.query()).toBe('');
        expect(component.focusedIndex()).toBe(0);
    });
});
