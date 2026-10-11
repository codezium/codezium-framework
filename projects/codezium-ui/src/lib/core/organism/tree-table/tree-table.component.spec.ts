import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CzAvatarComponent } from '../../atoms/avatar';
import { CzTreeTableColumn, CzTreeTableComponent, CzTreeTableNode } from './tree-table.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzTreeTableComponent', () => {
    let component: CzTreeTableComponent;
    let fixture: ComponentFixture<CzTreeTableComponent>;

    const columns: CzTreeTableColumn[] = [
        { field: 'name', header: 'Name' },
        { field: 'size', header: 'Size' },
    ];

    const nodes: CzTreeTableNode[] = [
        {
            data: { name: 'Documents', size: '-' },
            children: [
                {
                    data: { name: 'Work', size: '2MB' },
                    children: [{ data: { name: 'Reports', size: '1MB' } }],
                },
                { data: { name: 'Personal', size: '1MB' } },
            ],
        },
        { data: { name: 'Photos', size: '5MB' } },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzTreeTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzTreeTableComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('columns', columns);
        fixture.componentRef.setInput('value', nodes);
    });

    function bodyRows(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-tree-table-row')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    function toggles(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-tree-table-toggle')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    it('should create and render only root rows initially', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(bodyRows().length).toBe(2);
        expect(bodyRows()[0].textContent).toContain('Documents');
    });

    it('should expand and collapse children emitting the node events', () => {
        fixture.detectChanges();

        const expandSpy = vi.fn();
        const collapseSpy = vi.fn();
        component.onNodeExpand.subscribe(expandSpy);
        component.onNodeCollapse.subscribe(collapseSpy);

        const toggle = toggles()[0];
        toggle.click();
        fixture.detectChanges();

        expect(bodyRows().length).toBe(4);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        expect(bodyRows()[1].textContent).toContain('Work');
        expect(expandSpy).toHaveBeenCalledWith(nodes[0]);

        toggle.click();
        fixture.detectChanges();

        expect(bodyRows().length).toBe(2);
        expect(collapseSpy).toHaveBeenCalledWith(nodes[0]);
    });

    it('should indent children and show non first column values', () => {
        fixture.detectChanges();

        toggles()[0].click();
        fixture.detectChanges();

        const childCell = bodyRows()[1].querySelector('.cz-tree-table-cell') as HTMLElement;
        expect(childCell.style.paddingLeft).toBe('1.5rem');
        expect(bodyRows()[1].textContent).toContain('2MB');
    });

    it('should support nested expansion across levels', () => {
        fixture.detectChanges();

        toggles()[0].click();
        fixture.detectChanges();
        toggles()[1].click();
        fixture.detectChanges();

        expect(bodyRows().length).toBe(5);
        expect(bodyRows()[2].textContent).toContain('Reports');
    });

    it('should show the empty message', () => {
        fixture.componentRef.setInput('value', []);
        fixture.componentRef.setInput('emptyMessage', 'No files');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-tree-table-empty-row').textContent).toContain('No files');
    });

    it('should expand nodes from expandedKeys and the initial expanded flag', () => {
        fixture.componentRef.setInput('dataKey', 'name');
        fixture.componentRef.setInput('expandedKeys', { Documents: true });
        fixture.detectChanges();

        expect(bodyRows().length).toBe(4);

        toggles()[0].click();
        fixture.detectChanges();

        expect(bodyRows().length).toBe(2);
        expect(component.expandedKeys()).toEqual({ Documents: false });

        const photos: CzTreeTableNode = { data: { name: 'Photos', size: '5MB' }, expanded: true, children: [{ data: { name: 'Vacation', size: '3MB' } }] };
        fixture.componentRef.setInput('value', [photos]);
        fixture.detectChanges();

        expect(bodyRows().length).toBe(2);
        expect(bodyRows()[1].textContent).toContain('Vacation');
    });

    it('should select a single node on click', () => {
        fixture.componentRef.setInput('selectionMode', 'single');
        fixture.detectChanges();

        const selectSpy = vi.fn();
        component.onRowSelect.subscribe(selectSpy);

        bodyRows()[1].click();
        fixture.detectChanges();

        expect(selectSpy).toHaveBeenCalledWith(nodes[1]);
        expect(component.isRowHighlighted(nodes[1])).toBe(true);
        expect(bodyRows()[1].classList.contains('cz-tree-table-row--selected')).toBe(true);
    });

    it('should support multiple selection with checkboxes and select all', () => {
        fixture.componentRef.setInput('selectionMode', 'multiple');
        fixture.detectChanges();

        const spy = vi.fn();
        component.onSelectionChange.subscribe(spy);

        const checkbox = fixture.debugElement.query(By.css('.cz-tree-table-td--selection cz-checkbox input'));
        checkbox.nativeElement.click();
        fixture.detectChanges();

        expect(component.selection().length).toBe(1);
        expect(spy).toHaveBeenCalled();

        const headerCheckbox = fixture.debugElement.query(By.css('.cz-tree-table-th--selection cz-checkbox input'));
        headerCheckbox.nativeElement.click();
        fixture.detectChanges();

        expect(component.selection().length).toBe(2);
        expect(component.allSelected()).toBe(true);
    });

    it('should sort siblings per level and emit the sort event', () => {
        fixture.componentRef.setInput('sortable', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onSort.subscribe(spy);

        toggles()[0].click();
        fixture.detectChanges();

        const sortButton = fixture.debugElement.query(By.css('.cz-tree-table-sort-btn'));
        sortButton.nativeElement.click();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith({ field: 'name', order: 'asc' });
        const names = bodyRows().map(row => row.querySelector('.cz-tree-table-cell')?.textContent?.trim());
        expect(names).toEqual(['Documents', 'Personal', 'Work', 'Photos']);
    });

    it('should filter the tree keeping ancestors of matches', () => {
        fixture.componentRef.setInput('globalFilter', 'reports');
        fixture.detectChanges();

        expect(bodyRows().length).toBe(3);
        expect(bodyRows()[0].textContent).toContain('Documents');
        expect(bodyRows()[1].textContent).toContain('Work');
        expect(bodyRows()[2].textContent).toContain('Reports');
    });

    it('should paginate the visible rows', () => {
        fixture.componentRef.setInput('rows', 1);
        fixture.componentRef.setInput('rowsPerPageOptions', [1, 2]);
        fixture.detectChanges();

        expect(bodyRows().length).toBe(1);
        expect(bodyRows()[0].textContent).toContain('Documents');
        expect(fixture.nativeElement.querySelector('cz-paginator')).toBeTruthy();

        component.page.set(1);
        fixture.detectChanges();

        expect(bodyRows()[0].textContent).toContain('Photos');
    });

    it('should show the loading overlay and apply the scroll height', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.componentRef.setInput('scrollHeight', '20rem');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-tree-table-loading')).toBeTruthy();
        const container = fixture.nativeElement.querySelector('.cz-tree-table-container') as HTMLElement;
        expect(container.style.maxHeight).toBe('20rem');
        expect(container.classList.contains('cz-tree-table-container--scroll')).toBe(true);
    });

    it('should apply striped, gridlines and size classes', () => {
        fixture.componentRef.setInput('striped', true);
        fixture.componentRef.setInput('gridlines', true);
        fixture.componentRef.setInput('size', 'sm');
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.classList.contains('cz-tree-table--striped')).toBe(true);
        expect(host.classList.contains('cz-tree-table--gridlines')).toBe(true);
        expect(host.getAttribute('data-size')).toBe('sm');
    });

    it('should open the built-in context menu on node right click', () => {
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

        expect(rowSpy).toHaveBeenCalledWith({ node: nodes[1], event: expect.any(MouseEvent) });
        const menu = fixture.nativeElement.querySelector('.cz-tree-table-context-menu');
        expect(menu).toBeTruthy();
        expect(menu.style.left).toBe('120px');
        expect(menu.querySelectorAll('.cz-tree-table-context-menu-item').length).toBe(2);

        menu.querySelectorAll('.cz-tree-table-context-menu-item')[0].click();
        fixture.detectChanges();

        expect(command).toHaveBeenCalled();
        expect(selectSpy).toHaveBeenCalledWith({ item: expect.objectContaining({ label: 'Edit' }), node: nodes[1] });
        expect(fixture.nativeElement.querySelector('.cz-tree-table-context-menu')).toBeNull();
    });

    it('should render custom cell templates with library components (avatar)', () => {
        const hostFixture = TestBed.createComponent(CellTemplateHostComponent);
        hostFixture.detectChanges();

        const avatars = hostFixture.nativeElement.querySelectorAll('.cz-tree-table-native tbody cz-avatar');
        expect(avatars.length).toBe(2);
        expect(avatars[0].querySelector('.cz-avatar-label')?.textContent).toContain('D');
    });

    it('should render the custom row template', () => {
        const hostFixture = TestBed.createComponent(RowTemplateHostComponent);
        hostFixture.detectChanges();

        const rows = hostFixture.nativeElement.querySelectorAll('.custom-tree-row');
        expect(rows.length).toBe(2);
        expect(rows[0].textContent).toContain('Documents (depth 0)');
    });

    it('should render the custom header, footer and empty templates', () => {
        const hostFixture = TestBed.createComponent(SlotsHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-tree-header')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelector('.custom-tree-footer')).toBeTruthy();

        hostFixture.componentInstance.rows.set([]);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-tree-empty')).toBeTruthy();
    });
});

@Component({
    imports: [CzTreeTableComponent, CzAvatarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-tree-table [columns]="columns" [value]="rows"></cz-tree-table>

        <ng-template #avatarTpl let-row>
            <cz-avatar [label]="row.name" shape="circle" size="sm" />
        </ng-template>
    `,
})
class CellTemplateHostComponent {
    @ViewChild('avatarTpl', { static: true }) avatarTpl!: TemplateRef<unknown>;
    columns: CzTreeTableColumn[] = [];
    readonly rows: CzTreeTableNode[] = [
        { data: { name: 'Documents' } },
        { data: { name: 'Photos' } },
    ];

    ngOnInit(): void {
        this.columns = [{ field: 'name', header: 'Name', template: this.avatarTpl }];
    }
}

@Component({
    imports: [CzTreeTableComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-tree-table [columns]="columns" [value]="rows" [rowTemplate]="rowTpl"></cz-tree-table>

        <ng-template #rowTpl let-node let-depth="depth">
            <tr class="custom-tree-row">
                <td>{{ node.data.name }} (depth {{ depth }})</td>
            </tr>
        </ng-template>
    `,
})
class RowTemplateHostComponent {
    readonly columns: CzTreeTableColumn[] = [{ field: 'name', header: 'Name' }];
    readonly rows: CzTreeTableNode[] = [
        { data: { name: 'Documents' } },
        { data: { name: 'Photos' } },
    ];
}

@Component({
    imports: [CzTreeTableComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-tree-table [columns]="columns" [value]="rows()" [headerTemplate]="headerTpl"
            [footerTemplate]="footerTpl" [emptyTemplate]="emptyTpl"></cz-tree-table>

        <ng-template #headerTpl>
            <tr>
                <th class="custom-tree-header">Custom header</th>
            </tr>
        </ng-template>

        <ng-template #footerTpl>
            <tr>
                <td class="custom-tree-footer">Custom footer</td>
            </tr>
        </ng-template>

        <ng-template #emptyTpl>
            <span class="custom-tree-empty">Empty state</span>
        </ng-template>
    `,
})
class SlotsHostComponent {
    readonly columns: CzTreeTableColumn[] = [{ field: 'name', header: 'Name' }];
    readonly rows = signal<CzTreeTableNode[]>([{ data: { name: 'Documents' } }]);
}
