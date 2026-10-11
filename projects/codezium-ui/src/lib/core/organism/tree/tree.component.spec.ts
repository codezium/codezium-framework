import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CzTreeComponent, CzTreeNode } from './tree.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzTreeComponent', () => {
    let component: CzTreeComponent;
    let fixture: ComponentFixture<CzTreeComponent>;

    const nodes: CzTreeNode[] = [
        {
            label: 'Documents',
            value: 'docs',
            children: [
                { label: 'Work', value: 'work' },
                { label: 'Personal', value: 'personal' },
            ],
        },
        { label: 'Photos', value: 'photos' },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzTreeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzTreeComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', nodes);
    });

    function treeNodes(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-tree-node')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    function toggles(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-tree-toggle')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    function checkboxes(): HTMLInputElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-tree-checkbox input')).map((el) => el.nativeElement),
        ) as HTMLInputElement[];
    }

    it('should create with the tree role and render roots', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[role="tree"]')).toBeTruthy();
        expect(treeNodes().length).toBe(2);
        expect(treeNodes()[0].textContent).toContain('Documents');
    });

    it('should support the value input as alias of options', () => {
        fixture.componentRef.setInput('options', []);
        fixture.componentRef.setInput('value', nodes);
        fixture.detectChanges();

        expect(treeNodes().length).toBe(2);
    });

    it('should expand and collapse nodes emitting the node events', () => {
        fixture.detectChanges();

        const expandSpy = vi.fn();
        const collapseSpy = vi.fn();
        component.onNodeExpand.subscribe(expandSpy);
        component.onNodeCollapse.subscribe(collapseSpy);

        toggles()[0].click();
        fixture.detectChanges();

        expect(treeNodes().length).toBe(4);
        expect(treeNodes()[0].getAttribute('aria-expanded')).toBe('true');
        expect(expandSpy).toHaveBeenCalledWith(nodes[0]);

        toggles()[0].click();
        fixture.detectChanges();

        expect(treeNodes().length).toBe(2);
        expect(collapseSpy).toHaveBeenCalledWith(nodes[0]);
    });

    it('should select a node and emit onNodeSelect', () => {
        fixture.detectChanges();

        const selectSpy = vi.fn();
        component.onNodeSelect.subscribe(selectSpy);

        treeNodes()[1].click();
        fixture.detectChanges();

        expect(component.selectedNode()).toBe(nodes[1]);
        expect(selectSpy).toHaveBeenCalledWith(nodes[1]);
        expect(treeNodes()[1].getAttribute('aria-selected')).toBe('true');
    });

    it('should not select when selectionMode is none', () => {
        fixture.componentRef.setInput('selectionMode', 'none');
        fixture.detectChanges();

        treeNodes()[0].click();
        fixture.detectChanges();

        expect(component.selectedNode()).toBeNull();
    });

    it('should indent nested nodes', () => {
        fixture.detectChanges();

        toggles()[0].click();
        fixture.detectChanges();

        expect(treeNodes()[1].style.paddingLeft).toBe('1.75rem');
    });

    it('should support multiple selection with onSelectionChange', () => {
        fixture.componentRef.setInput('selectionMode', 'multiple');
        fixture.componentRef.setInput('metaKeySelection', false);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onSelectionChange.subscribe(spy);

        treeNodes()[0].click();
        fixture.detectChanges();
        treeNodes()[1].click();
        fixture.detectChanges();

        expect(component.selection().length).toBe(2);
        expect(spy).toHaveBeenCalled();
        expect(treeNodes()[0].classList.contains('cz-tree-node--selected')).toBe(true);

        treeNodes()[0].click();
        fixture.detectChanges();

        expect(component.selection().length).toBe(1);
    });

    it('should require metaKey to add to the selection when metaKeySelection is enabled', () => {
        fixture.componentRef.setInput('selectionMode', 'multiple');
        fixture.detectChanges();

        treeNodes()[0].click();
        fixture.detectChanges();
        treeNodes()[1].click();
        fixture.detectChanges();

        expect(component.selection().length).toBe(1);
        expect(component.isSelected(nodes[1])).toBe(true);

        treeNodes()[1].dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
        fixture.detectChanges();

        expect(component.selection().length).toBe(0);
        expect(component.isSelected(nodes[1])).toBe(false);

        treeNodes()[0].dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }));
        fixture.detectChanges();

        expect(component.selection().length).toBe(1);
        expect(component.isSelected(nodes[0])).toBe(true);
    });

    it('should propagate checkbox selection down and up', async () => {
        fixture.componentRef.setInput('selectionMode', 'checkbox');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(checkboxes().length).toBe(2);

        checkboxes()[0].click();
        fixture.detectChanges();

        expect(component.selection().length).toBe(3);

        toggles()[0].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const boxes = checkboxes();
        expect(boxes[0].checked).toBe(true);
        expect(boxes[1].checked).toBe(true);
        expect(boxes[2].checked).toBe(true);

        boxes[1].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component.selection().length).toBe(1);
        expect(component.isIndeterminate(nodes[0])).toBe(true);
        expect(fixture.nativeElement.querySelectorAll('.cz-tree-checkbox .cz-checkbox-box')[0].getAttribute('aria-checked')).toBe('mixed');

        checkboxes()[0].click();
        fixture.detectChanges();

        expect(component.selection().length).toBe(3);
    });

    it('should honor propagateSelectionDown and propagateSelectionUp flags', () => {
        fixture.componentRef.setInput('selectionMode', 'checkbox');
        fixture.componentRef.setInput('propagateSelectionDown', false);
        fixture.componentRef.setInput('propagateSelectionUp', false);
        fixture.detectChanges();

        checkboxes()[0].click();
        fixture.detectChanges();

        expect(component.selection().length).toBe(1);
        expect(component.isChecked(nodes[0])).toBe(false);
    });

    it('should expand nodes from expandedKeys and the initial expanded flag', () => {
        fixture.componentRef.setInput('dataKey', 'value');
        fixture.componentRef.setInput('expandedKeys', { docs: true });
        fixture.detectChanges();

        expect(treeNodes().length).toBe(4);

        toggles()[0].click();
        fixture.detectChanges();

        expect(treeNodes().length).toBe(2);
        expect(component.expandedKeys()).toEqual({ docs: false });

        const expandedNode: CzTreeNode = { label: 'Photos', expanded: true, children: [{ label: 'Vacation' }] };
        fixture.componentRef.setInput('value', [expandedNode]);
        fixture.detectChanges();

        expect(treeNodes().length).toBe(2);
        expect(treeNodes()[1].textContent).toContain('Vacation');
    });

    it('should filter keeping ancestors of matches', () => {
        fixture.componentRef.setInput('globalFilter', 'work');
        fixture.detectChanges();

        expect(treeNodes().length).toBe(2);
        expect(treeNodes()[0].textContent).toContain('Documents');
        expect(treeNodes()[1].textContent).toContain('Work');
    });

    it('should show the empty message and custom empty template', () => {
        fixture.componentRef.setInput('options', []);
        fixture.componentRef.setInput('emptyMessage', 'Nothing here');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-tree-empty').textContent).toContain('Nothing here');

        const hostFixture = TestBed.createComponent(EmptyTemplateHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-tree-empty')).toBeTruthy();
    });

    it('should open the built-in context menu on node right click', () => {
        const command = vi.fn();
        fixture.componentRef.setInput('contextMenuItems', [
            { label: 'Edit', command },
            { separator: true },
            { label: 'Delete', disabled: true },
        ]);
        fixture.detectChanges();

        const nodeSpy = vi.fn();
        const selectSpy = vi.fn();
        component.onNodeContextMenu.subscribe(nodeSpy);
        component.onContextMenuSelect.subscribe(selectSpy);

        treeNodes()[1].dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 90, clientY: 40 }));
        fixture.detectChanges();

        expect(nodeSpy).toHaveBeenCalledWith({ node: nodes[1], event: expect.any(MouseEvent) });
        const menu = fixture.nativeElement.querySelector('.cz-tree-context-menu');
        expect(menu).toBeTruthy();
        expect(menu.style.left).toBe('90px');
        expect(menu.querySelectorAll('.cz-tree-context-menu-item').length).toBe(2);

        menu.querySelectorAll('.cz-tree-context-menu-item')[0].click();
        fixture.detectChanges();

        expect(command).toHaveBeenCalled();
        expect(selectSpy).toHaveBeenCalledWith({ item: expect.objectContaining({ label: 'Edit' }), node: nodes[1] });
        expect(fixture.nativeElement.querySelector('.cz-tree-context-menu')).toBeNull();
    });

    it('should render the custom node template', () => {
        const hostFixture = TestBed.createComponent(NodeTemplateHostComponent);
        hostFixture.detectChanges();

        const labels = hostFixture.nativeElement.querySelectorAll('.custom-node');
        expect(labels.length).toBe(2);
        expect(labels[0].textContent).toContain('Documents (depth 0)');
    });

    it('should filter with the built-in filter input', () => {
        fixture.componentRef.setInput('filter', true);
        fixture.componentRef.setInput('filterPlaceholder', 'Search');
        fixture.detectChanges();

        const filterSpy = vi.fn();
        component.onFilter.subscribe(filterSpy);

        const input = fixture.nativeElement.querySelector('.cz-tree-filter-input') as HTMLInputElement;
        expect(input).toBeTruthy();
        expect(input.getAttribute('placeholder')).toBe('Search');

        input.value = 'work';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(filterSpy).toHaveBeenCalledWith({ filter: 'work' });
        expect(treeNodes().length).toBe(2);
        expect(treeNodes()[1].textContent).toContain('Work');

        component.resetFilter();
        fixture.detectChanges();

        expect(treeNodes().length).toBe(2);
        expect(treeNodes()[0].textContent).toContain('Documents');
    });

    it('should support strict filter mode', () => {
        fixture.componentRef.setInput('filter', true);
        fixture.componentRef.setInput('filterMode', 'strict');
        component.filterValue.set('pho');
        fixture.detectChanges();

        expect(treeNodes().length).toBe(1);
        expect(treeNodes()[0].textContent).toContain('Photos');

        component.filterValue.set('hotos');
        fixture.detectChanges();

        expect(treeNodes().length).toBe(0);
        expect(fixture.nativeElement.querySelector('.cz-tree-empty')).toBeTruthy();
    });

    it('should navigate and act with the keyboard', () => {
        fixture.detectChanges();

        treeNodes()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        fixture.detectChanges();
        expect(component.focusedIndex()).toBe(1);

        treeNodes()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();
        expect(component.isExpanded(nodes[0])).toBe(true);
        expect(treeNodes().length).toBe(4);

        treeNodes()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        fixture.detectChanges();
        expect(component.isExpanded(nodes[0])).toBe(false);

        treeNodes()[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
        fixture.detectChanges();
        expect(component.selectedNode()).toBe(nodes[0]);
    });

    it('should expose aria attributes for the tree and rows', () => {
        fixture.detectChanges();

        const tree = fixture.nativeElement.querySelector('[role="tree"]');
        expect(tree.getAttribute('aria-multiselectable')).toBeNull();

        const first = treeNodes()[0];
        expect(first.getAttribute('role')).toBe('treeitem');
        expect(first.getAttribute('aria-level')).toBe('1');
        expect(first.getAttribute('aria-setsize')).toBe('2');
        expect(first.getAttribute('aria-posinset')).toBe('1');
        expect(first.getAttribute('aria-expanded')).toBe('false');
    });

    it('should emit onNodeDoubleClick', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onNodeDoubleClick.subscribe(spy);

        treeNodes()[1].dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

        expect(spy).toHaveBeenCalledWith(nodes[1]);
    });

    it('should treat leaf:false nodes as expandable (lazy)', () => {
        const lazy: CzTreeNode[] = [{ label: 'Lazy Folder', leaf: false, loading: true }];
        fixture.componentRef.setInput('value', lazy);
        fixture.detectChanges();

        expect(treeNodes()[0].querySelector('.cz-tree-toggle')).toBeTruthy();

        toggles()[0].click();
        fixture.detectChanges();

        expect(component.isExpanded(lazy[0])).toBe(true);
    });

    it('should show the loading overlay with mask and icon modes', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-tree-loading')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-tree-loading--icon')).toBeNull();

        fixture.componentRef.setInput('loadingMode', 'icon');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-tree-loading--icon')).toBeTruthy();
    });

    it('should window rows with virtual scroll', () => {
        const many: CzTreeNode[] = Array.from({ length: 100 }, (_, i) => ({ label: `Node ${i}` }));
        fixture.componentRef.setInput('value', many);
        fixture.componentRef.setInput('virtualScroll', true);
        fixture.componentRef.setInput('virtualScrollItemSize', 30);
        fixture.componentRef.setInput('scrollHeight', '150px');
        fixture.detectChanges();

        expect(component.displayRows().length).toBeLessThan(100);
        expect(treeNodes().length).toBe(component.displayRows().length);
        expect(fixture.nativeElement.querySelector('.cz-tree-spacer-row')).toBeTruthy();

        const viewport = fixture.nativeElement.querySelector('.cz-tree-viewport') as HTMLElement;
        viewport.scrollTop = 900;
        viewport.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();

        expect(component.virtualStart()).toBeGreaterThan(0);
        expect(component.displayRows()[0].node.label).not.toBe('Node 0');
    });

    it('should render header, footer and toggler icon templates', () => {
        const hostFixture = TestBed.createComponent(SlotsHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-tree-header')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelector('.custom-tree-footer')).toBeTruthy();

        const host = hostFixture.componentInstance;
        const togglers = hostFixture.nativeElement.querySelectorAll('.custom-toggler');
        expect(togglers[0].textContent).toContain('closed');
        expect(togglers[1].textContent).toContain('loading');

        (hostFixture.nativeElement.querySelector('.cz-tree-toggle') as HTMLElement).click();
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelectorAll('.custom-toggler')[0].textContent).toContain('open');
    });
});

@Component({
    imports: [CzTreeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-tree [options]="[]" [emptyTemplate]="emptyTpl"></cz-tree>

        <ng-template #emptyTpl>
            <span class="custom-tree-empty">Empty state</span>
        </ng-template>
    `,
})
class EmptyTemplateHostComponent {}

@Component({
    imports: [CzTreeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-tree [value]="nodes()" [nodeTemplate]="nodeTpl"></cz-tree>

        <ng-template #nodeTpl let-node let-depth="depth">
            <span class="custom-node">{{ node.label }} (depth {{ depth }})</span>
        </ng-template>
    `,
})
class NodeTemplateHostComponent {
    readonly nodes = signal<CzTreeNode[]>([
        { label: 'Documents', children: [{ label: 'Work' }] },
        { label: 'Photos' },
    ]);
}

@Component({
    imports: [CzTreeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-tree [value]="nodes" [headerTemplate]="headerTpl" [footerTemplate]="footerTpl"
            [togglerIconTemplate]="togglerTpl"></cz-tree>

        <ng-template #headerTpl>
            <div class="custom-tree-header">Header</div>
        </ng-template>

        <ng-template #footerTpl>
            <div class="custom-tree-footer">Footer</div>
        </ng-template>

        <ng-template #togglerTpl let-expanded let-loading="loading">
            <span class="custom-toggler">{{ expanded ? 'open' : 'closed' }}{{ loading ? ' loading' : '' }}</span>
        </ng-template>
    `,
})
class SlotsHostComponent {
    readonly nodes: CzTreeNode[] = [
        { label: 'Documents', children: [{ label: 'Work' }] },
        { label: 'Lazy Folder', leaf: false, loading: true },
    ];
}
