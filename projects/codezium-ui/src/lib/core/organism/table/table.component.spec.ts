import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTableComponent, CzTableColumn } from './table.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzTableComponent', () => {
    let component: CzTableComponent;
    let fixture: ComponentFixture<CzTableComponent>;

    const columns: CzTableColumn[] = [
        { field: 'name', header: 'Name', sortable: true },
        { field: 'age', header: 'Age' },
    ];

    const rows = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 40 },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzTableComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('columns', columns);
        fixture.componentRef.setInput('value', rows);
    });

    function bodyRows(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-table-row')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    it('should create and render headers and rows', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        const headers = fixture.nativeElement.querySelectorAll('th');
        expect(headers.length).toBe(2);
        expect(headers[0].textContent).toContain('Name');
        expect(bodyRows().length).toBe(3);
        expect(bodyRows()[0].textContent).toContain('Charlie');
    });

    it('should show the empty message when there are no rows', () => {
        fixture.componentRef.setInput('value', []);
        fixture.componentRef.setInput('emptyMessage', 'Nothing here');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-table-empty-row').textContent).toContain('Nothing here');
    });

    it('should sort asc, desc and reset on header clicks', () => {
        fixture.detectChanges();

        const sortSpy = vi.fn();
        component.onSort.subscribe(sortSpy);

        const sortBtn = fixture.debugElement.query(By.css('.cz-table-sort-btn')).nativeElement;

        sortBtn.click();
        fixture.detectChanges();
        expect(component.sortOrder()).toBe('asc');
        expect(bodyRows()[0].textContent).toContain('Alice');
        expect(sortSpy).toHaveBeenLastCalledWith({ field: 'name', order: 'asc' });

        sortBtn.click();
        fixture.detectChanges();
        expect(component.sortOrder()).toBe('desc');
        expect(bodyRows()[0].textContent).toContain('Charlie');

        sortBtn.click();
        fixture.detectChanges();
        expect(component.sortOrder()).toBeNull();
        expect(bodyRows()[0].textContent).toContain('Charlie');
    });

    it('should not sort on non sortable columns', () => {
        fixture.detectChanges();

        const buttons = fixture.debugElement.queryAll(By.css('.cz-table-sort-btn'));
        expect(buttons[1].nativeElement.disabled).toBe(true);
    });

    it('should select a row in single selection mode', () => {
        fixture.componentRef.setInput('selectionMode', 'single');
        fixture.detectChanges();

        const selectSpy = vi.fn();
        component.onRowSelect.subscribe(selectSpy);

        bodyRows()[1].click();
        fixture.detectChanges();

        expect(component.selectedRow()).toBe(rows[1]);
        expect(selectSpy).toHaveBeenCalledWith(rows[1]);
        expect(bodyRows()[1].classList.contains('cz-table-row--selected')).toBe(true);
    });

    it('should apply striped and gridlines classes', () => {
        fixture.componentRef.setInput('striped', true);
        fixture.componentRef.setInput('gridlines', true);
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.classList.contains('cz-table--striped')).toBe(true);
        expect(host.classList.contains('cz-table--gridlines')).toBe(true);
    });

    it('should expose aria-sort on sorted headers', () => {
        fixture.detectChanges();

        const sortBtn = fixture.debugElement.query(By.css('.cz-table-sort-btn')).nativeElement;
        sortBtn.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('th').getAttribute('aria-sort')).toBe('ascending');
    });

    it('should paginate rows when rows is set', () => {
        fixture.componentRef.setInput('rows', 2);
        fixture.detectChanges();

        expect(bodyRows().length).toBe(2);
        expect(bodyRows()[0].textContent).toContain('Charlie');
        expect(fixture.nativeElement.querySelector('cz-paginator')).toBeTruthy();

        component.page.set(1);
        fixture.detectChanges();

        expect(bodyRows().length).toBe(1);
        expect(bodyRows()[0].textContent).toContain('Bob');
    });

    it('should not render the paginator when rows is 0', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('cz-paginator')).toBeNull();
    });

    it('should reset the page when sorting', () => {
        fixture.componentRef.setInput('rows', 2);
        fixture.detectChanges();

        component.page.set(1);
        component.toggleSort(columns[0]);

        expect(component.page()).toBe(0);
    });
});
