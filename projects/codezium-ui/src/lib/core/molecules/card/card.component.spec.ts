import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzCardComponent } from './card.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzCardComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-card header="Title" subheader="Subtitle">
            <p id="body">Body content</p>
            <button id="footer-btn" czCardFooter>Save</button>
        </cz-card>
    `,
})
class TestHostComponent {}

describe('CzCardComponent', () => {
    let component: CzCardComponent;
    let fixture: ComponentFixture<CzCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzCardComponent, TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzCardComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render header and subheader', () => {
        fixture.componentRef.setInput('header', 'Card title');
        fixture.componentRef.setInput('subheader', 'Card subtitle');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-card-title').textContent).toContain('Card title');
        expect(fixture.nativeElement.querySelector('.cz-card-subtitle').textContent).toContain('Card subtitle');
    });

    it('should omit the header block when there is no title', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-card-header')).toBeNull();
    });

    it('should project body and footer content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();

        const body = hostFixture.nativeElement.querySelector('.cz-card-body #body');
        expect(body).toBeTruthy();

        const footer = hostFixture.nativeElement.querySelector('.cz-card-footer #footer-btn');
        expect(footer).toBeTruthy();
    });
});
