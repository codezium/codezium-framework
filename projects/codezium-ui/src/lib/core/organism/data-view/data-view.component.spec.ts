import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzDataViewComponent } from './data-view.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzDataViewComponent', () => {
    let component: CzDataViewComponent;
    let fixture: ComponentFixture<CzDataViewComponent>;

    const items = [
        { name: 'Charlie' },
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Dana' },
        { name: 'Eve' },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzDataViewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzDataViewComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('value', items);
        fixture.componentRef.setInput('field', 'name');
    });

    function renderedItems(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-data-view-item')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    it('should create and render all items using the field', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(renderedItems().length).toBe(5);
        expect(renderedItems()[0].textContent).toContain('Charlie');
    });

    it('should apply the layout attribute', () => {
        fixture.componentRef.setInput('layout', 'grid');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-data-view-items').getAttribute('data-layout')).toBe('grid');
    });

    it('should show the empty message', () => {
        fixture.componentRef.setInput('value', []);
        fixture.componentRef.setInput('emptyMessage', 'Nothing');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-data-view-empty').textContent).toContain('Nothing');
    });

    it('should sort items when sortable', () => {
        fixture.componentRef.setInput('sortable', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-data-view-sort')).toBeTruthy();

        fixture.debugElement.query(By.css('.cz-data-view-sort')).nativeElement.click();
        fixture.detectChanges();

        expect(component.sortOrder()).toBe('asc');
        expect(renderedItems()[0].textContent).toContain('Alice');

        fixture.debugElement.query(By.css('.cz-data-view-sort')).nativeElement.click();
        fixture.detectChanges();

        expect(component.sortOrder()).toBe('desc');
        expect(renderedItems()[0].textContent).toContain('Eve');
    });

    it('should paginate items when rows is set', () => {
        fixture.componentRef.setInput('rows', 2);
        fixture.detectChanges();

        expect(renderedItems().length).toBe(2);
        expect(renderedItems()[0].textContent).toContain('Charlie');

        component.page.set(1);
        fixture.detectChanges();

        expect(renderedItems()[0].textContent).toContain('Bob');

        expect(fixture.nativeElement.querySelector('cz-paginator')).toBeTruthy();
    });

    it('should reset the page when sorting', () => {
        fixture.componentRef.setInput('rows', 2);
        fixture.componentRef.setInput('sortable', true);
        fixture.detectChanges();

        component.page.set(2);
        component.toggleSort();

        expect(component.page()).toBe(0);
    });
});
