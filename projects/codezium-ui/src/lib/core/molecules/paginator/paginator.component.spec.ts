import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzPaginatorComponent } from './paginator.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzPaginatorComponent', () => {
    let component: CzPaginatorComponent;
    let fixture: ComponentFixture<CzPaginatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzPaginatorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzPaginatorComponent);
        component = fixture.componentInstance;
    });

    function pageButtons(): HTMLButtonElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-paginator-page')).map((el) => el.nativeElement),
        ) as HTMLButtonElement[];
    }

    it('should create and compute the page count', () => {
        fixture.componentRef.setInput('totalRecords', 95);
        fixture.componentRef.setInput('rows', 10);
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(component.pageCount()).toBe(10);
        expect(pageButtons().length).toBe(5);
    });

    it('should slide the page link window and support showing all links', () => {
        fixture.componentRef.setInput('totalRecords', 120);
        fixture.componentRef.setInput('rows', 10);
        fixture.componentRef.setInput('pageLinkSize', 5);
        fixture.detectChanges();

        expect(component.pages()).toEqual([0, 1, 2, 3, 4]);

        component.goTo(8);
        fixture.detectChanges();
        expect(component.pages()).toEqual([6, 7, 8, 9, 10]);

        component.goTo(11);
        fixture.detectChanges();
        expect(component.pages()).toEqual([7, 8, 9, 10, 11]);

        fixture.componentRef.setInput('pageLinkSize', 0);
        fixture.detectChanges();
        expect(component.pages().length).toBe(12);
    });

    it('should navigate to a page and notify CVA + output', () => {
        fixture.componentRef.setInput('totalRecords', 50);
        fixture.detectChanges();

        const changeSpy = vi.fn();
        const outputSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onPageChange.subscribe(outputSpy);

        pageButtons()[2].click();
        fixture.detectChanges();

        expect(component.page()).toBe(2);
        expect(changeSpy).toHaveBeenCalledWith(2);
        expect(outputSpy).toHaveBeenCalledWith({
            page: 2,
            first: 20,
            rows: 10,
            pageCount: 5,
        });
    });

    it('should mark the active page with aria-current', () => {
        fixture.componentRef.setInput('totalRecords', 30);
        fixture.detectChanges();

        pageButtons()[1].click();
        fixture.detectChanges();

        expect(pageButtons()[1].getAttribute('aria-current')).toBe('page');
        expect(pageButtons()[0].getAttribute('aria-current')).toBeNull();
    });

    it('should disable prev/first on the first page and next/last on the last', () => {
        fixture.componentRef.setInput('totalRecords', 30);
        fixture.detectChanges();

        const navButtons = fixture.debugElement
            .queryAll(By.css('.cz-paginator-nav'))
            .map((el) => el.nativeElement) as HTMLButtonElement[];

        // first, prev, next, last
        expect(navButtons[0].disabled).toBe(true);
        expect(navButtons[1].disabled).toBe(true);
        expect(navButtons[2].disabled).toBe(false);
        expect(navButtons[3].disabled).toBe(false);

        component.lastPage();
        fixture.detectChanges();

        expect(navButtons[2].disabled).toBe(true);
        expect(navButtons[3].disabled).toBe(true);
    });

    it('should move with next and prev helpers', () => {
        fixture.componentRef.setInput('totalRecords', 50);
        fixture.detectChanges();

        component.nextPage();
        expect(component.page()).toBe(1);

        component.prevPage();
        expect(component.page()).toBe(0);

        component.lastPage();
        expect(component.page()).toBe(4);

        component.firstPage();
        expect(component.page()).toBe(0);
    });

    it('should change rows per page through the select', () => {
        fixture.componentRef.setInput('totalRecords', 100);
        fixture.componentRef.setInput('rowsPerPageOptions', [10, 20, 50]);
        fixture.detectChanges();

        const outputSpy = vi.fn();
        component.onPageChange.subscribe(outputSpy);

        const select = fixture.debugElement.query(By.css('.cz-paginator-rows')).nativeElement as HTMLSelectElement;
        select.value = '20';
        select.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        expect(component.effectiveRows()).toBe(20);
        expect(component.pageCount()).toBe(5);
        expect(component.page()).toBe(0);
        expect(outputSpy).toHaveBeenCalledWith({ page: 0, first: 0, rows: 20, pageCount: 5 });
    });

    it('should show the records report', () => {
        fixture.componentRef.setInput('totalRecords', 95);
        fixture.componentRef.setInput('rows', 10);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-paginator-report').textContent).toContain('1 - 10 / 95');
    });

    it('should reflect writeValue and clamp invalid values', () => {
        fixture.componentRef.setInput('totalRecords', 50);
        component.writeValue(3);
        fixture.detectChanges();
        expect(component.page()).toBe(3);

        component.writeValue('nope');
        fixture.detectChanges();
        expect(component.page()).toBe(0);
    });

    it('should not change page when disabled', () => {
        fixture.componentRef.setInput('totalRecords', 50);
        component.setDisabledState?.(true);
        fixture.detectChanges();

        component.nextPage();
        expect(component.page()).toBe(0);
        expect(fixture.nativeElement.classList.contains('cz-paginator--disabled')).toBe(true);
    });
});
