import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzContextMenuComponent } from './context-menu.component';
import { CzMenuItem } from '../../types';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
    imports: [CzContextMenuComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-context-menu [items]="items">
            <div id="target">Right click me</div>
        </cz-context-menu>
    `,
})
class TestHostComponent {
    items: CzMenuItem[] = [
        { label: 'Copy', command: vi.fn() },
        { separator: true },
        { label: 'Delete', disabled: true },
    ];
}

describe('CzContextMenuComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    function menuComponent(): CzContextMenuComponent {
        return fixture.debugElement.query(By.directive(CzContextMenuComponent)).componentInstance;
    }

    it('should create with the projected target and stay hidden', () => {
        expect(fixture.nativeElement.querySelector('#target')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-context-menu-panel')).toBeNull();
    });

    it('should open the menu at the pointer position on contextmenu', () => {
        const target = fixture.debugElement.query(By.css('#target')).nativeElement;
        const event = new MouseEvent('contextmenu', { clientX: 120, clientY: 80, bubbles: true, cancelable: true });
        target.dispatchEvent(event);
        fixture.detectChanges();

        expect(event.defaultPrevented).toBe(true);
        const panel = fixture.nativeElement.querySelector('.cz-context-menu-panel') as HTMLElement;
        expect(panel).toBeTruthy();
        expect(panel.style.left).toBe('120px');
        expect(panel.style.top).toBe('80px');
    });

    it('should activate items and close', () => {
        const target = fixture.debugElement.query(By.css('#target')).nativeElement;
        target.dispatchEvent(new MouseEvent('contextmenu', { clientX: 10, clientY: 10, bubbles: true }));
        fixture.detectChanges();

        const spy = vi.fn();
        menuComponent().onItemSelect.subscribe(spy);

        const links = fixture.debugElement.queryAll(By.css('.cz-context-menu-link'));
        links[0].nativeElement.click();
        fixture.detectChanges();

        const items = fixture.componentInstance.items;
        expect(items[0].command).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(items[0]);
        expect(fixture.nativeElement.querySelector('.cz-context-menu-panel')).toBeNull();
    });

    it('should render separators and disabled items', () => {
        const target = fixture.debugElement.query(By.css('#target')).nativeElement;
        target.dispatchEvent(new MouseEvent('contextmenu', { clientX: 10, clientY: 10, bubbles: true }));
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-context-menu-separator')).toBeTruthy();
        const links = fixture.debugElement.queryAll(By.css('.cz-context-menu-link'));
        expect((links[1].nativeElement as HTMLButtonElement).disabled).toBe(true);
    });

    it('should close when clicking the document', () => {
        const target = fixture.debugElement.query(By.css('#target')).nativeElement;
        target.dispatchEvent(new MouseEvent('contextmenu', { clientX: 10, clientY: 10, bubbles: true }));
        fixture.detectChanges();

        menuComponent().close();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-context-menu-panel')).toBeNull();
    });
});
