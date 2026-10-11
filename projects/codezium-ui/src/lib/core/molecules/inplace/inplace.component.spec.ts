import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzInplaceComponent } from './inplace.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
    imports: [CzInplaceComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-inplace display="Edit me">
            <input id="editor" />
        </cz-inplace>
    `,
})
class TestHostComponent {}

describe('CzInplaceComponent', () => {
    let component: CzInplaceComponent;
    let fixture: ComponentFixture<CzInplaceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzInplaceComponent, TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzInplaceComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('display', 'Click to edit');
    });

    it('should create and show the display text in view mode', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        const display = fixture.debugElement.query(By.css('.cz-inplace-display')).nativeElement;
        expect(display.textContent).toContain('Click to edit');
        expect(fixture.nativeElement.querySelector('.cz-inplace-editor')).toBeNull();
    });

    it('should activate the editor on display click', () => {
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-inplace-display')).nativeElement.click();
        fixture.detectChanges();

        expect(component.active()).toBe(true);
        expect(fixture.nativeElement.querySelector('.cz-inplace-editor')).toBeTruthy();
    });

    it('should save and emit onSave', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onSave.subscribe(spy);

        component.activate();
        fixture.detectChanges();

        const buttons = fixture.debugElement.queryAll(By.css('.cz-button-native'));
        buttons[1].nativeElement.click();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
        expect(component.active()).toBe(false);
    });

    it('should cancel and emit onCancel', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onCancel.subscribe(spy);

        component.activate();
        fixture.detectChanges();

        const buttons = fixture.debugElement.queryAll(By.css('.cz-button-native'));
        buttons[0].nativeElement.click();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
        expect(component.active()).toBe(false);
    });

    it('should project the editor content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();

        const inplace = hostFixture.debugElement.query(By.directive(CzInplaceComponent)).componentInstance;
        inplace.activate();
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.cz-inplace-editor #editor')).toBeTruthy();
    });
});
