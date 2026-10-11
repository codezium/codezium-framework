import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTabComponent, CzTabsComponent } from './tabs.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzTabsComponent, CzTabComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-tabs>
            <cz-tab header="First">Content 1</cz-tab>
            <cz-tab header="Second">Content 2</cz-tab>
            <cz-tab header="Disabled" [disabled]="true">Content 3</cz-tab>
        </cz-tabs>
    `,
})
class TestHostComponent {}

describe('CzTabsComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    function tabButtons(): HTMLButtonElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-tabs-tab')).map((el) => el.nativeElement),
        ) as HTMLButtonElement[];
    }

    it('should render the tab list with tab roles', () => {
        expect(fixture.nativeElement.querySelector('[role="tablist"]')).toBeTruthy();
        expect(tabButtons().length).toBe(3);
        expect(tabButtons()[0].textContent).toContain('First');
    });

    it('should activate the first tab by default', () => {
        expect(tabButtons()[0].getAttribute('aria-selected')).toBe('true');
        expect(fixture.nativeElement.querySelector('.cz-tab-panel').textContent).toContain('Content 1');
    });

    it('should switch panels when clicking a tab', () => {
        tabButtons()[1].click();
        fixture.detectChanges();

        expect(tabButtons()[1].getAttribute('aria-selected')).toBe('true');
        expect(tabButtons()[0].getAttribute('aria-selected')).toBe('false');
        expect(fixture.nativeElement.querySelector('.cz-tab-panel').textContent).toContain('Content 2');
    });

    it('should not activate a disabled tab', () => {
        tabButtons()[2].click();
        fixture.detectChanges();

        expect(tabButtons()[2].disabled).toBe(true);
        expect(tabButtons()[2].getAttribute('aria-selected')).toBe('false');
        expect(fixture.nativeElement.querySelector('.cz-tab-panel').textContent).toContain('Content 1');
    });

    it('should link tabs with their panels through aria attributes', () => {
        const tab = tabButtons()[0];
        const panel = fixture.nativeElement.querySelector('.cz-tab-panel');

        expect(tab.getAttribute('aria-controls')).toBe(panel.getAttribute('id'));
        expect(panel.getAttribute('aria-labelledby')).toBe(tab.getAttribute('id'));
    });
});
