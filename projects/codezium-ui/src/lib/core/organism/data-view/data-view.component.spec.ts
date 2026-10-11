import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CzDataViewComponent,
    CzDataViewEmptyDirective,
    CzDataViewFooterDirective,
    CzDataViewHeaderDirective,
    CzDataViewListDirective,
} from './data-view.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
    imports: [
        CzDataViewComponent,
        CzDataViewHeaderDirective,
        CzDataViewListDirective,
        CzDataViewEmptyDirective,
        CzDataViewFooterDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-data-view [value]="items()" [layout]="'list'" [rows]="2" [paginator]="true">
            <ng-template czDataViewHeader>
                <span class="custom-header">Header slot</span>
            </ng-template>

            <ng-template czDataViewList let-listItems>
                @for (item of listItems; track item.name) {
                    <div class="custom-list-item">{{ item.name }}</div>
                }
            </ng-template>

            <ng-template czDataViewEmpty>
                <span class="custom-empty">Nothing here</span>
            </ng-template>

            <ng-template czDataViewFooter>
                <span class="custom-footer">Footer slot</span>
            </ng-template>
        </cz-data-view>
    `,
})
class TemplatesHostComponent {
    readonly items = signal([{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]);
}

@Component({
    imports: [CzDataViewComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-data-view [value]="items()" [rows]="2" [listTemplate]="list" [headerTemplate]="header"
            [emptyTemplate]="empty" [footerTemplate]="footer"></cz-data-view>

        <ng-template #header><span class="input-header">Header</span></ng-template>
        <ng-template #list let-listItems>
            @for (item of listItems; track item.name) {
                <div class="input-item">{{ item.name }}</div>
            }
        </ng-template>
        <ng-template #empty><span class="input-empty">Nothing here</span></ng-template>
        <ng-template #footer><span class="input-footer">Footer</span></ng-template>
    `,
})
class InputTemplatesHostComponent {
    readonly items = signal([{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]);
}

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

    it('should sort items with the built-in sortable button and emit onSort', () => {
        fixture.componentRef.setInput('sortable', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onSort.subscribe(spy);

        expect(fixture.nativeElement.querySelector('.cz-data-view-sort')).toBeTruthy();

        fixture.debugElement.query(By.css('.cz-data-view-sort')).nativeElement.click();
        fixture.detectChanges();

        expect(component.activeSortOrder()).toBe(1);
        expect(renderedItems()[0].textContent).toContain('Alice');
        expect(spy).toHaveBeenCalledWith({ sortField: 'name', sortOrder: 1 });

        fixture.debugElement.query(By.css('.cz-data-view-sort')).nativeElement.click();
        fixture.detectChanges();

        expect(component.activeSortOrder()).toBe(-1);
        expect(renderedItems()[0].textContent).toContain('Eve');
    });

    it('should sort through the external sortField and sortOrder inputs', () => {
        fixture.componentRef.setInput('sortField', 'name');
        fixture.componentRef.setInput('sortOrder', -1);
        fixture.detectChanges();

        expect(renderedItems()[0].textContent).toContain('Eve');
        expect(fixture.nativeElement.querySelector('.cz-data-view-sort')).toBeNull();
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

    it('should render the paginator and emit onPage when the page changes', () => {
        fixture.componentRef.setInput('paginator', true);
        fixture.componentRef.setInput('rows', 2);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onPage.subscribe(spy);

        expect(fixture.nativeElement.querySelector('.cz-data-view-paginator--bottom')).toBeTruthy();

        component.changePage(1);
        fixture.detectChanges();

        expect(component.page()).toBe(1);
        expect(spy).toHaveBeenCalledWith({ page: 1, first: 2, rows: 2, pageCount: 3 });
        expect(renderedItems()[0].textContent).toContain('Bob');
    });

    it('should position the paginator on top when requested', () => {
        fixture.componentRef.setInput('paginator', true);
        fixture.componentRef.setInput('rows', 2);
        fixture.componentRef.setInput('paginatorPosition', 'top');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-data-view-paginator--top')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-data-view-paginator--bottom')).toBeNull();
    });

    it('should show the loading overlay', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        const overlay = fixture.nativeElement.querySelector('.cz-data-view-loading');
        expect(overlay).toBeTruthy();
        expect(overlay.getAttribute('role')).toBe('status');
    });

    it('should reset the page when sorting', () => {
        fixture.componentRef.setInput('rows', 2);
        fixture.componentRef.setInput('sortable', true);
        fixture.detectChanges();

        component.page.set(2);
        component.toggleSort();

        expect(component.page()).toBe(0);
    });

    it('should render templates passed as inputs with only the component imported', () => {
        const hostFixture = TestBed.createComponent(InputTemplatesHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.input-header')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelectorAll('.input-item').length).toBe(2);
        expect(hostFixture.nativeElement.querySelector('.input-footer')).toBeTruthy();

        hostFixture.componentInstance.items.set([]);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.input-empty')).toBeTruthy();
    });

    it('should render the header, list, empty and footer template slots', () => {
        const hostFixture = TestBed.createComponent(TemplatesHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-header')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelectorAll('.custom-list-item').length).toBe(2);
        expect(hostFixture.nativeElement.querySelector('.custom-footer')).toBeTruthy();

        // Empty slot
        hostFixture.componentInstance.items.set([]);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-empty')).toBeTruthy();
    });
});
