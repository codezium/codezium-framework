import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzAccordionComponent, CzAccordionPanelComponent } from './accordion.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzAccordionComponent, CzAccordionPanelComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-accordion [multiple]="multiple">
            <cz-accordion-panel header="One">Body 1</cz-accordion-panel>
            <cz-accordion-panel header="Two">Body 2</cz-accordion-panel>
            <cz-accordion-panel header="Disabled" [disabled]="true">Body 3</cz-accordion-panel>
        </cz-accordion>
    `,
})
class TestHostComponent {
    multiple = false;
}

describe('CzAccordionComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        // Note: no initial detectChanges() here to prevent NG0100 when tests mutate inputs afterwards
    });

    function triggers(): HTMLButtonElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-accordion-trigger')).map((el) => el.nativeElement),
        ) as HTMLButtonElement[];
    }

    function contents(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-accordion-content')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    it('should render the panel headers', () => {
        fixture.detectChanges();

        expect(triggers().length).toBe(3);
        expect(triggers()[0].textContent).toContain('One');
    });

    it('should start collapsed', () => {
        fixture.detectChanges();

        expect(contents().length).toBe(0);
        expect(triggers()[0].getAttribute('aria-expanded')).toBe('false');
    });

    it('should expand and collapse a panel', () => {
        fixture.detectChanges();

        triggers()[0].click();
        fixture.detectChanges();

        expect(contents().length).toBe(1);
        expect(contents()[0].textContent).toContain('Body 1');
        expect(triggers()[0].getAttribute('aria-expanded')).toBe('true');

        triggers()[0].click();
        fixture.detectChanges();

        expect(contents().length).toBe(0);
    });

    it('should close the previous panel when multiple is false', () => {
        fixture.detectChanges();

        triggers()[0].click();
        fixture.detectChanges();
        triggers()[1].click();
        fixture.detectChanges();

        expect(contents().length).toBe(1);
        expect(contents()[0].textContent).toContain('Body 2');
    });

    it('should keep both panels open when multiple is true', () => {
        fixture.componentInstance.multiple = true;
        fixture.detectChanges();

        triggers()[0].click();
        fixture.detectChanges();
        triggers()[1].click();
        fixture.detectChanges();

        expect(contents().length).toBe(2);
    });

    it('should not toggle a disabled panel', () => {
        fixture.detectChanges();

        triggers()[2].click();
        fixture.detectChanges();

        expect(triggers()[2].disabled).toBe(true);
        expect(contents().length).toBe(0);
    });

    it('should link headers with their regions', () => {
        fixture.detectChanges();

        triggers()[0].click();
        fixture.detectChanges();

        const content = fixture.nativeElement.querySelector('.cz-accordion-content');
        expect(triggers()[0].getAttribute('aria-controls')).toBe(content.getAttribute('id'));
        expect(content.getAttribute('aria-labelledby')).toBe(triggers()[0].getAttribute('id'));
    });
});
