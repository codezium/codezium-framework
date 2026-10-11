import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzSpeedDialComponent } from './speed-dial.component';
import { CzMenuItem } from '../../types';
import { LucidePencil } from '@lucide/angular';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzSpeedDialComponent', () => {
    let component: CzSpeedDialComponent;
    let fixture: ComponentFixture<CzSpeedDialComponent>;

    const items: CzMenuItem[] = [
        { label: 'Edit', icon: LucidePencil, command: vi.fn() },
        { label: 'Disabled', disabled: true },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzSpeedDialComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzSpeedDialComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('items', items);
    });

    function trigger(): HTMLButtonElement {
        return fixture.debugElement.query(By.css('.cz-speed-dial-trigger')).nativeElement as HTMLButtonElement;
    }

    function actions(): HTMLButtonElement[] {
        return fixture.debugElement
            .queryAll(By.css('.cz-speed-dial-action'))
            .map((el) => el.nativeElement as HTMLButtonElement);
    }

    it('should create with the trigger and closed actions', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(trigger()).toBeTruthy();
        expect(actions().length).toBe(0);
    });

    it('should toggle the actions', () => {
        fixture.detectChanges();

        trigger().click();
        fixture.detectChanges();

        expect(component.open()).toBe(true);
        expect(actions().length).toBe(2);
        expect(trigger().getAttribute('aria-expanded')).toBe('true');

        trigger().click();
        fixture.detectChanges();
        expect(component.open()).toBe(false);
    });

    it('should activate an action and close', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        trigger().click();
        fixture.detectChanges();

        actions()[0].click();

        expect(items[0].command).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(items[0]);
        expect(component.open()).toBe(false);
    });

    it('should not activate disabled actions', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onItemSelect.subscribe(spy);

        trigger().click();
        fixture.detectChanges();

        expect(actions()[1].disabled).toBe(true);
        actions()[1].click();

        expect(spy).not.toHaveBeenCalled();
    });

    it('should apply the direction attribute', () => {
        fixture.componentRef.setInput('direction', 'left');
        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLElement).getAttribute('data-direction')).toBe('left');
    });

    it('should close on outside document click', () => {
        fixture.detectChanges();

        trigger().click();
        fixture.detectChanges();

        component.onDocumentClick({ target: document.body } as unknown as Event);
        expect(component.open()).toBe(false);
    });
});
