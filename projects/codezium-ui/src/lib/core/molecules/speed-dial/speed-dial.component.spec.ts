import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzSpeedDialComponent } from './speed-dial.component';
import { CzMenuItem } from '../../types';
import { LucidePencil, LucideTrash } from '@lucide/angular';
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

    function list(): HTMLElement {
        return fixture.debugElement.query(By.css('.cz-speed-dial-actions')).nativeElement as HTMLElement;
    }

    it('should create with the trigger and hidden actions', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(trigger()).toBeTruthy();
        expect(list().classList.contains('cz-speed-dial-actions--visible')).toBe(false);
        expect(trigger().getAttribute('aria-expanded')).toBe('false');
    });

    it('should toggle the actions and emit visibility events', () => {
        fixture.detectChanges();

        const visibleSpy = vi.fn();
        const showSpy = vi.fn();
        const hideSpy = vi.fn();
        component.onVisibleChange.subscribe(visibleSpy);
        component.onShow.subscribe(showSpy);
        component.onHide.subscribe(hideSpy);

        trigger().click();
        fixture.detectChanges();

        expect(component.visible()).toBe(true);
        expect(list().classList.contains('cz-speed-dial-actions--visible')).toBe(true);
        expect(trigger().getAttribute('aria-expanded')).toBe('true');
        expect(visibleSpy).toHaveBeenCalledWith(true);
        expect(showSpy).toHaveBeenCalled();

        trigger().click();
        fixture.detectChanges();

        expect(component.visible()).toBe(false);
        expect(visibleSpy).toHaveBeenCalledWith(false);
        expect(hideSpy).toHaveBeenCalled();
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
        expect(component.visible()).toBe(false);
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

    it('should apply the direction and type attributes', () => {
        fixture.componentRef.setInput('direction', 'up-left');
        fixture.componentRef.setInput('type', 'quarter-circle');
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.getAttribute('data-direction')).toBe('up-left');
        expect(host.getAttribute('data-type')).toBe('quarter-circle');
    });

    it('should compute radial offsets for circle layouts', () => {
        fixture.componentRef.setInput('type', 'circle');
        fixture.componentRef.setInput('radius', 100);
        fixture.detectChanges();

        const offsets = component.itemOffsets();
        expect(offsets).toBeTruthy();
        // First item starts at the top: (0, -radius)
        expect(Math.round(offsets![0].x)).toBe(0);
        expect(Math.round(offsets![0].y)).toBe(-100);
    });

    it('should apply transforms and transition delays to radial items', () => {
        fixture.componentRef.setInput('type', 'semi-circle');
        fixture.componentRef.setInput('direction', 'up');
        fixture.componentRef.setInput('transitionDelay', 50);
        fixture.detectChanges();

        trigger().click();
        fixture.detectChanges();

        const itemsEls = fixture.debugElement.queryAll(By.css('.cz-speed-dial-item'));
        expect(itemsEls[0].nativeElement.style.transitionDelay).toBe('0ms');
        expect(itemsEls[1].nativeElement.style.transitionDelay).toBe('50ms');
        expect(itemsEls[0].nativeElement.style.transform).toContain('translate');
    });

    it('should render the mask only when enabled and open', () => {
        fixture.componentRef.setInput('mask', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-speed-dial-mask')).toBeNull();

        trigger().click();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-speed-dial-mask')).toBeTruthy();
    });

    it('should not open when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        trigger().click();
        fixture.detectChanges();

        expect(component.visible()).toBe(false);
        expect(trigger().disabled).toBe(true);
    });

    it('should rotate the trigger icon while open unless a hideIcon is provided', () => {
        fixture.detectChanges();

        trigger().click();
        fixture.detectChanges();
        expect(trigger().classList.contains('cz-speed-dial-trigger--rotated')).toBe(true);

        fixture.componentRef.setInput('hideIcon', LucideTrash);
        fixture.detectChanges();
        expect(trigger().classList.contains('cz-speed-dial-trigger--rotated')).toBe(false);
    });

    it('should apply the overlay z-index to the actions and mask', () => {
        fixture.componentRef.setInput('mask', true);
        fixture.componentRef.setInput('zIndex', 3000);
        fixture.detectChanges();

        trigger().click();
        fixture.detectChanges();

        expect(list().style.zIndex).toBe('3000');
        const mask = fixture.nativeElement.querySelector('.cz-speed-dial-mask') as HTMLElement;
        expect(mask.style.zIndex).toBe('2999');

        fixture.componentRef.setInput('zIndex', 'none');
        fixture.detectChanges();
        expect(list().style.zIndex).toBe('auto');
    });

    it('should close on outside document click when hideOnClickOutside is true', () => {
        fixture.detectChanges();

        trigger().click();
        fixture.detectChanges();

        component.onDocumentClick({ target: document.body } as unknown as Event);
        expect(component.visible()).toBe(false);
    });
});
