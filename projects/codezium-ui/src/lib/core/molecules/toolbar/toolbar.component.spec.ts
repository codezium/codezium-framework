import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzToolbarComponent } from './toolbar.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzToolbarComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-toolbar>
            <button id="start-btn" czToolbarStart>New</button>
            <button id="end-btn" czToolbarEnd>Save</button>
        </cz-toolbar>
    `,
})
class TestHostComponent {}

describe('CzToolbarComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should create the toolbar container', () => {
        expect(fixture.nativeElement.querySelector('.cz-toolbar-container')).toBeTruthy();
    });

    it('should project start content into the start group', () => {
        const start = fixture.nativeElement.querySelector('.cz-toolbar-start #start-btn');
        expect(start).toBeTruthy();
        expect(start.textContent).toContain('New');
    });

    it('should project end content into the end group', () => {
        const end = fixture.nativeElement.querySelector('.cz-toolbar-end #end-btn');
        expect(end).toBeTruthy();
        expect(end.textContent).toContain('Save');
    });
});
