import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzDialogComponent } from './dialog.component';
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
});
