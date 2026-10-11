import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzAvatarComponent } from '../../atoms/avatar';
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

    it('should filter rows with the global filter and count pages from filtered rows', () => {
        fixture.componentRef.setInput('globalFilter', 'ali');
        fixture.componentRef.setInput('rows', 1);
        fixture.detectChanges();

        expect(bodyRows().length).toBe(1);
        expect(bodyRows()[0].textContent).toContain('Alice');
        expect(component.sortedValue().length).toBe(1);
    });

    it('should support multiple selection with checkboxes and select all', () => {
        fixture.componentRef.setInput('dataKey', 'name');
        fixture.componentRef.setInput('selectionMode', 'multiple');
        fixture.detectChanges();

        const spy = vi.fn();
        component.onSelectionChange.subscribe(spy);

        const checkboxes = fixture.debugElement.queryAll(By.css('.cz-table-td--selection cz-checkbox'));
        expect(checkboxes.length).toBe(3);

        checkboxes[1].nativeElement.querySelector('input').click();
        fixture.detectChanges();

        expect(component.selection().map(r => r['name'])).toEqual(['Alice']);
        expect(spy).toHaveBeenCalled();

        // Header select all
        const headerCheckbox = fixture.debugElement.query(By.css('.cz-table-th--selection cz-checkbox input'));
        headerCheckbox.nativeElement.click();
        fixture.detectChanges();

        expect(component.selection().length).toBe(3);
        expect(component.allSelected()).toBe(true);
    });

    it('should expand and collapse rows with the expansion template', () => {
        const hostFixture = TestBed.createComponent(ExpansionHostComponent);
        hostFixture.detectChanges();

        const expandSpy = vi.fn();
        const collapseSpy = vi.fn();
        const table = hostFixture.debugElement.query(By.directive(CzTableComponent)).componentInstance as CzTableComponent;
        table.onRowExpand.subscribe(expandSpy);
        table.onRowCollapse.subscribe(collapseSpy);

        expect(hostFixture.nativeElement.querySelector('.cz-table-expansion-row')).toBeNull();

        hostFixture.nativeElement.querySelector('.cz-table-expander').click();
        hostFixture.detectChanges();

        const expansion = hostFixture.nativeElement.querySelector('.cz-table-expansion-row');
        expect(expansion).toBeTruthy();
        expect(expansion.textContent).toContain('Details of Charlie');
        expect(expandSpy).toHaveBeenCalled();

        hostFixture.nativeElement.querySelector('.cz-table-expander').click();
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.cz-table-expansion-row')).toBeNull();
        expect(collapseSpy).toHaveBeenCalled();
    });

    it('should render custom cell templates with library components (avatar)', () => {
        const hostFixture = TestBed.createComponent(CellTemplateHostComponent);
        hostFixture.detectChanges();

        const avatars = hostFixture.nativeElement.querySelectorAll('.cz-table-native tbody cz-avatar');
        expect(avatars.length).toBe(3);
        expect(avatars[0].querySelector('.cz-avatar-label')?.textContent).toContain('C');
    });

    it('should render the custom header, footer and empty templates', () => {
        const hostFixture = TestBed.createComponent(SlotsHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-table-header')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelector('.custom-table-footer')).toBeTruthy();

        hostFixture.componentInstance.rows.set([]);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-table-empty')).toBeTruthy();
    });

    it('should open the built-in context menu on row right click', () => {
        const command = vi.fn();
        fixture.componentRef.setInput('contextMenuItems', [
            { label: 'Edit', command },
            { separator: true },
            { label: 'Delete', disabled: true },
        ]);
        fixture.detectChanges();

        const rowSpy = vi.fn();
        const selectSpy = vi.fn();
        component.onRowContextMenu.subscribe(rowSpy);
        component.onContextMenuSelect.subscribe(selectSpy);

        const row = bodyRows()[1];
        row.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 120, clientY: 80 }));
        fixture.detectChanges();

        expect(rowSpy).toHaveBeenCalledWith({ row: rows[1], event: expect.any(MouseEvent) });
        const menu = fixture.nativeElement.querySelector('.cz-table-context-menu');
        expect(menu).toBeTruthy();
        expect(menu.style.left).toBe('120px');
        expect(menu.querySelectorAll('.cz-table-context-menu-item').length).toBe(2);

        menu.querySelectorAll('.cz-table-context-menu-item')[0].click();
        fixture.detectChanges();

        expect(command).toHaveBeenCalled();
        expect(selectSpy).toHaveBeenCalledWith({ item: expect.objectContaining({ label: 'Edit' }), row: rows[1] });
        expect(fixture.nativeElement.querySelector('.cz-table-context-menu')).toBeNull();
    });

    it('should not open the context menu without items and close it on document click', () => {
        fixture.detectChanges();

        bodyRows()[0].dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-table-context-menu')).toBeNull();

        fixture.componentRef.setInput('contextMenuItems', [{ label: 'View' }]);
        fixture.detectChanges();
        bodyRows()[0].dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-table-context-menu')).toBeTruthy();

        component.closeContextMenu();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-table-context-menu')).toBeNull();
    });

    it('should show the loading overlay and apply the scroll height', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.componentRef.setInput('scrollHeight', '20rem');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-table-loading')).toBeTruthy();
        const container = fixture.nativeElement.querySelector('.cz-table-container') as HTMLElement;
        expect(container.style.maxHeight).toBe('20rem');
        expect(container.classList.contains('cz-table-container--scroll')).toBe(true);
    });
});

@Component({
    imports: [CzTableComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-table [columns]="columns" [value]="rows" [expansionTemplate]="expansionTpl"></cz-table>

        <ng-template #expansionTpl let-row>
            <span class="expansion-content">Details of {{ row.name }}</span>
        </ng-template>
    `,
})
class ExpansionHostComponent {
    readonly columns: CzTableColumn[] = [{ field: 'name', header: 'Name' }];
    readonly rows = [{ name: 'Charlie' }, { name: 'Alice' }];
}

@Component({
    imports: [CzTableComponent, CzAvatarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-table [columns]="columns" [value]="rows"></cz-table>

        <ng-template #avatarTpl let-row>
            <cz-avatar [label]="row.name" shape="circle" size="sm" />
        </ng-template>
    `,
})
class CellTemplateHostComponent {
    @ViewChild('avatarTpl', { static: true }) avatarTpl!: TemplateRef<unknown>;
    columns: CzTableColumn[] = [];
    readonly rows = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

    ngOnInit(): void {
        this.columns = [{ field: 'name', header: 'Name', template: this.avatarTpl }];
    }
}

@Component({
    imports: [CzTableComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-table [columns]="columns" [value]="rows()" [headerTemplate]="headerTpl" [footerTemplate]="footerTpl"
            [emptyTemplate]="emptyTpl"></cz-table>

        <ng-template #headerTpl>
            <tr>
                <th class="custom-table-header">Custom header</th>
            </tr>
        </ng-template>

        <ng-template #footerTpl>
            <tr>
                <td class="custom-table-footer">Custom footer</td>
            </tr>
        </ng-template>

        <ng-template #emptyTpl>
            <span class="custom-table-empty">Empty state</span>
        </ng-template>
    `,
})
class SlotsHostComponent {
    readonly columns: CzTableColumn[] = [{ field: 'name', header: 'Name' }];
    readonly rows = signal([{ name: 'Charlie' }]);
}
