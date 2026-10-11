import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTreeComponent, CzTreeNode } from './tree.component';
import { By } from '@angular/platform-browser';
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

    it('should create with the tree role and render roots', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[role="tree"]')).toBeTruthy();
        expect(treeNodes().length).toBe(2);
        expect(treeNodes()[0].textContent).toContain('Documents');
    });

    it('should expand and collapse nodes', () => {
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-tree-toggle')).nativeElement.click();
        fixture.detectChanges();

        expect(treeNodes().length).toBe(4);
        expect(treeNodes()[0].getAttribute('aria-expanded')).toBe('true');

        fixture.debugElement.query(By.css('.cz-tree-toggle')).nativeElement.click();
        fixture.detectChanges();
        expect(treeNodes().length).toBe(2);
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

        fixture.debugElement.query(By.css('.cz-tree-toggle')).nativeElement.click();
        fixture.detectChanges();

        expect(treeNodes()[1].style.paddingLeft).toBe('1.75rem');
    });
});
