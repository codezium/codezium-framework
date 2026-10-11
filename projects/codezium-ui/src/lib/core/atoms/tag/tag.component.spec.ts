import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTagComponent } from './tag.component';
import { LucideTag } from '@lucide/angular';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzTagComponent', () => {
    let component: CzTagComponent;
    let fixture: ComponentFixture<CzTagComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzTagComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzTagComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render the value', () => {
        fixture.componentRef.setInput('value', 'New');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-tag-value').textContent).toContain('New');
    });

    it('should render an optional icon', () => {
        fixture.componentRef.setInput('value', 'New');
        fixture.componentRef.setInput('icon', LucideTag);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-tag-icon')).toBeTruthy();
    });

    it('should apply severity, size and rounded', () => {
        fixture.componentRef.setInput('severity', 'success');
        fixture.componentRef.setInput('size', 'sm');
        fixture.componentRef.setInput('rounded', true);
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.getAttribute('data-severity')).toBe('success');
        expect(host.getAttribute('data-size')).toBe('sm');
        expect(host.classList.contains('cz-tag--rounded')).toBe(true);
    });
});
