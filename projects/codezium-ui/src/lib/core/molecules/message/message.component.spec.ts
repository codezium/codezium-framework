import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzMessageComponent } from './message.component';
import { LucideBell } from '@lucide/angular';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzMessageComponent', () => {
    let component: CzMessageComponent;
    let fixture: ComponentFixture<CzMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzMessageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzMessageComponent);
        component = fixture.componentInstance;
    });

    it('should create and render the text', () => {
        fixture.componentRef.setInput('text', 'Saved successfully');
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-message-text').textContent).toContain('Saved successfully');
    });

    it('should apply the severity attribute and render an icon', () => {
        fixture.componentRef.setInput('severity', 'success');
        fixture.detectChanges();

        expect(fixture.nativeElement.getAttribute('data-severity')).toBe('success');
        expect(fixture.nativeElement.querySelector('.cz-message-icon')).toBeTruthy();
    });

    it('should expose an alert role', () => {
        fixture.componentRef.setInput('text', 'Hi');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    });

    it('should support a custom icon', () => {
        fixture.componentRef.setInput('icon', LucideBell);
        fixture.detectChanges();

        expect(component.actualIcon()).toBe(LucideBell);
    });

    it('should not render a close button by default', () => {
        fixture.componentRef.setInput('text', 'Hi');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-message-close')).toBeNull();
    });

    it('should hide the message and emit onClose when closable', () => {
        fixture.componentRef.setInput('text', 'Hi');
        fixture.componentRef.setInput('closable', true);
        fixture.detectChanges();

        const closeSpy = vi.fn();
        component.onClose.subscribe(closeSpy);

        fixture.debugElement.query(By.css('.cz-message-close')).nativeElement.click();
        fixture.detectChanges();

        expect(component.closed()).toBe(true);
        expect(closeSpy).toHaveBeenCalled();
        expect(fixture.nativeElement.querySelector('.cz-message-content')).toBeNull();
    });

    it('should project content', () => {
        fixture.componentRef.setInput('text', 'Title');
        fixture.detectChanges();

        const body = fixture.nativeElement.querySelector('.cz-message-body');
        expect(body).toBeTruthy();
    });
});
