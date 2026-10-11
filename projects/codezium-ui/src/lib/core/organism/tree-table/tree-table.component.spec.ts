import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTreeTableColumn, CzTreeTableComponent, CzTreeTableNode } from './tree-table.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

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
                { data: { name: 'Work', size: '2MB' } },
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

    it('should create and render only root rows initially', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(bodyRows().length).toBe(2);
        expect(bodyRows()[0].textContent).toContain('Documents');
    });

    it('should expand and collapse children', () => {
        fixture.detectChanges();

        const toggle = fixture.debugElement.query(By.css('.cz-tree-table-toggle')).nativeElement;
        toggle.click();
        fixture.detectChanges();

        expect(bodyRows().length).toBe(4);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        expect(bodyRows()[1].textContent).toContain('Work');

        toggle.click();
        fixture.detectChanges();
        expect(bodyRows().length).toBe(2);
    });

    it('should indent children and show non first column values', () => {
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-tree-table-toggle')).nativeElement.click();
        fixture.detectChanges();

        const childCell = bodyRows()[1].querySelector('.cz-tree-table-cell') as HTMLElement;
        expect(childCell.style.paddingLeft).toBe('1.5rem');
        expect(bodyRows()[1].textContent).toContain('2MB');
    });

    it('should show the empty message', () => {
        fixture.componentRef.setInput('value', []);
        fixture.componentRef.setInput('emptyMessage', 'No files');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-tree-table-empty-row').textContent).toContain('No files');
    });
});
