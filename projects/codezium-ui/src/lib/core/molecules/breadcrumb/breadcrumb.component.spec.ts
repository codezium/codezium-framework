import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzBreadcrumbComponent, CzBreadcrumbItem } from './breadcrumb.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzBreadcrumbComponent', () => {
    let component: CzBreadcrumbComponent;
    let fixture: ComponentFixture<CzBreadcrumbComponent>;

    const items: CzBreadcrumbItem[] = [
        { label: 'Components', routerLink: '/components' },
        { label: 'Breadcrumb' },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzBreadcrumbComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(CzBreadcrumbComponent);
        component = fixture.componentInstance;
    });

    it('should create a navigation landmark', () => {
        fixture.detectChanges();

        const nav = fixture.nativeElement.querySelector('nav');
        expect(nav).toBeTruthy();
        expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('should render the items with separators', () => {
        fixture.componentRef.setInput('items', items);
        fixture.detectChanges();

        const links = fixture.nativeElement.querySelectorAll('.cz-breadcrumb-link');
        expect(links.length).toBe(1);
        expect(links[0].textContent).toContain('Components');
        expect(fixture.nativeElement.querySelectorAll('.cz-breadcrumb-separator').length).toBe(1);
    });

    it('should mark the last item as the current page', () => {
        fixture.componentRef.setInput('items', items);
        fixture.detectChanges();

        const current = fixture.nativeElement.querySelector('.cz-breadcrumb-current');
        expect(current.textContent).toContain('Breadcrumb');
        expect(current.getAttribute('aria-current')).toBe('page');
    });

    it('should render the home item with a custom separator', () => {
        fixture.componentRef.setInput('home', { label: 'Home', routerLink: '/' });
        fixture.componentRef.setInput('items', items);
        fixture.componentRef.setInput('separator', '>');
        fixture.detectChanges();

        const firstLink = fixture.nativeElement.querySelector('.cz-breadcrumb-link');
        expect(firstLink.textContent).toContain('Home');
        expect(fixture.nativeElement.querySelector('.cz-breadcrumb-separator').textContent).toContain('>');
    });

    it('should emit itemClick when a link is clicked', () => {
        fixture.componentRef.setInput('items', items);
        fixture.detectChanges();

        const spy = vi.fn();
        component.itemClick.subscribe(spy);

        fixture.debugElement.query(By.css('.cz-breadcrumb-link')).nativeElement.click();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith(items[0]);
    });
});
