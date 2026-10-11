import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzPopoverComponent } from './popover.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzPopoverComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-popover>
            <button id="trigger" czPopoverTrigger>Open</button>
            <div id="content">Popover content</div>
        </cz-popover>
    `,
})
class TestHostComponent {}

describe('CzPopoverComponent', () => {
    let component: CzPopoverComponent;
    let fixture: ComponentFixture<CzPopoverComponent>;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzPopoverComponent, TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzPopoverComponent);
        component = fixture.componentInstance;

        hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();
    });

    it('should create and stay hidden by default', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-popover-panel')).toBeNull();
    });

    it('should toggle from the trigger and project content', () => {
        const trigger = hostFixture.debugElement.query(By.css('#trigger')).nativeElement;
        trigger.click();
        hostFixture.detectChanges();

        const panel = hostFixture.nativeElement.querySelector('.cz-popover-panel');
        expect(panel).toBeTruthy();
        expect(panel.getAttribute('role')).toBe('dialog');
        expect(hostFixture.nativeElement.querySelector('.cz-popover-panel #content')).toBeTruthy();

        trigger.click();
        hostFixture.detectChanges();
        expect(hostFixture.nativeElement.querySelector('.cz-popover-panel')).toBeNull();
    });

    it('should apply the position attribute', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('position', 'right');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-popover-panel').getAttribute('data-position')).toBe('right');
    });

    it('should close when clicking outside when dismissable', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.detectChanges();

        component.onDocumentClick({ target: document.body } as unknown as Event);

        expect(component.visible()).toBe(false);
    });

    it('should not close on outside click when dismissable is false', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.componentRef.setInput('dismissable', false);
        fixture.detectChanges();

        component.onDocumentClick({ target: document.body } as unknown as Event);

        expect(component.visible()).toBe(true);
    });

    it('should keep open when clicking inside the host', () => {
        fixture.componentRef.setInput('visible', true);
        fixture.detectChanges();

        const inside = fixture.nativeElement.querySelector('.cz-popover-wrapper');
        component.onDocumentClick({ target: inside } as unknown as Event);

        expect(component.visible()).toBe(true);
    });
});
