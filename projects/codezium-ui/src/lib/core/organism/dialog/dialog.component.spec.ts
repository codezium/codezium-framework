import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzDialogComponent } from './dialog.component';
import { CzDialogService } from './dialog.service';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzDialogComponent', () => {
    let component: CzDialogComponent;
    let fixture: ComponentFixture<CzDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzDialogComponent);
        component = fixture.componentInstance;
    });

    it('should create and stay hidden by default', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeNull();
    });

    it('should render the dialog with header and mask when visible', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('header', 'Edit profile');
        fixture.detectChanges();

        const dialog = fixture.nativeElement.querySelector('.cz-dialog');
        expect(dialog).toBeTruthy();
        expect(dialog.getAttribute('role')).toBe('dialog');
        expect(dialog.getAttribute('aria-modal')).toBe('true');
        expect(fixture.nativeElement.querySelector('.cz-dialog-title').textContent).toContain('Edit profile');
        expect(fixture.nativeElement.querySelector('.cz-dialog-mask')).toBeTruthy();
    });

    it('should not render the mask when modal is false', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('modal', false);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-dialog-mask')).toBeNull();
    });

    it('should close with the close button and emit onHide', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.detectChanges();

        const hideSpy = vi.fn();
        component.onHide.subscribe(hideSpy);

        fixture.debugElement.query(By.css('.cz-dialog-close')).nativeElement.click();
        fixture.detectChanges();

        expect(component.visible()).toBe(false);
        expect(hideSpy).toHaveBeenCalled();
        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeNull();
    });

    it('should not close when closable is false', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('closable', false);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-dialog-close')).toBeNull();

        component.close();
        expect(component.visible()).toBe(true);
    });

    it('should close on mask click only when dismissableMask is true', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-dialog-mask')).nativeElement.click();
        fixture.detectChanges();
        expect(component.visible()).toBe(true);

        fixture.componentRef.setInput('dismissableMask', true);
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-dialog-mask')).nativeElement.click();
        fixture.detectChanges();
        expect(component.visible()).toBe(false);
    });

    it('should close on Escape', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.detectChanges();

        component.onEscape();
        expect(component.visible()).toBe(false);
    });

    it('should apply position and width', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('position', 'bottomright');
        fixture.componentRef.setInput('width', '40rem');
        fixture.detectChanges();

        const wrapper = fixture.nativeElement.querySelector('.cz-dialog-wrapper');
        expect(wrapper.getAttribute('data-position')).toBe('bottomright');

        const dialog = fixture.nativeElement.querySelector('.cz-dialog') as HTMLElement;
        expect(dialog.style.width).toBe('40rem');
    });

    it('should toggle maximize mode and emit onMaximize', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('maximizable', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onMaximize.subscribe(spy);

        const maximizeBtn = fixture.debugElement.query(By.css('.cz-dialog-maximize'));
        expect(maximizeBtn).toBeTruthy();

        maximizeBtn.nativeElement.click();
        fixture.detectChanges();

        expect(component.maximized()).toBe(true);
        expect(spy).toHaveBeenCalledWith(true);

        const dialog = fixture.nativeElement.querySelector('.cz-dialog') as HTMLElement;
        expect(dialog.classList.contains('cz-dialog--maximized')).toBe(true);
        expect(dialog.style.width).toBe('100vw');
    });

    it('should not close on Escape when closeOnEscape is false', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('closeOnEscape', false);
        fixture.detectChanges();

        component.onEscape();
        expect(component.visible()).toBe(true);
    });

    it('should apply the draggable and resizable classes', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('draggable', true);
        fixture.componentRef.setInput('resizable', true);
        fixture.detectChanges();

        const dialog = fixture.nativeElement.querySelector('.cz-dialog') as HTMLElement;
        expect(dialog.classList.contains('cz-dialog--draggable')).toBe(true);
        expect(dialog.classList.contains('cz-dialog--resizable')).toBe(true);
        expect(fixture.nativeElement.querySelector('.cz-dialog-resize-handle')).toBeTruthy();
    });

    it('should apply breakpoint widths based on the window size', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('breakpoints', { '2000px': '80vw', '600px': '95vw' });
        fixture.detectChanges();

        const dialog = fixture.nativeElement.querySelector('.cz-dialog') as HTMLElement;
        // jsdom window width is 1024 → first breakpoint >= 1024 wins
        expect(dialog.style.width).toBe('80vw');
    });

    it('should render the footer only when footer content is projected', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-dialog-footer')).toBeTruthy();
    });

    it('should be controllable through CzDialogService when dialogId is set', () => {
        const service = TestBed.inject(CzDialogService);

        fixture.componentRef.setInput('dialogId', 'profile');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeNull();

        service.open('profile');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeTruthy();

        service.close('profile');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeNull();
    });

    it('should apply the overlay z-index to the mask and wrapper', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('zIndex', 2000);
        fixture.detectChanges();

        const mask = fixture.nativeElement.querySelector('.cz-dialog-mask') as HTMLElement;
        const wrapper = fixture.nativeElement.querySelector('.cz-dialog-wrapper') as HTMLElement;
        expect(mask.style.zIndex).toBe('2000');
        expect(wrapper.style.zIndex).toBe('2001');

        fixture.componentRef.setInput('zIndex', 'none');
        fixture.detectChanges();
        expect(mask.style.zIndex).toBe('auto');
        expect(wrapper.style.zIndex).toBe('auto');
    });

    it('should block the body scroll while visible and restore it on hide', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.detectChanges();
        expect(document.body.style.overflow).toBe('hidden');

        component.close();
        fixture.detectChanges();
        expect(document.body.style.overflow).not.toBe('hidden');
    });
});
