import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, vi } from 'vitest';
import { TableDocPage } from './pages/table/table-doc';
import { TreeTableDocPage } from './pages/tree-table/tree-table-doc';
import { TreeDocPage } from './pages/tree/tree-doc';
import { TimelineDocPage } from './pages/timeline/timeline-doc';
import { VirtualScrollerDocPage } from './pages/virtual-scroller/virtual-scroller-doc';

describe('Docs data rendering', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    const pages: { name: string; type: Type<unknown> }[] = [
        { name: 'TableDocPage', type: TableDocPage },
        { name: 'TreeTableDocPage', type: TreeTableDocPage },
        { name: 'TreeDocPage', type: TreeDocPage },
        { name: 'TimelineDocPage', type: TimelineDocPage },
        { name: 'VirtualScrollerDocPage', type: VirtualScrollerDocPage },
    ];

    for (const page of pages) {
        it(`${page.name} should not render [object Object]`, async () => {
            await TestBed.configureTestingModule({ imports: [page.type] }).compileComponents();

            const fixture = TestBed.createComponent(page.type);
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const text = (fixture.nativeElement as HTMLElement).textContent || '';
            const offenders = text
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.includes('[object'));
            expect(offenders).toEqual([]);
        });
    }

    it('TableDocPage should build dynamic columns from a simulated server response', async () => {
        vi.useFakeTimers();

        await TestBed.configureTestingModule({ imports: [TableDocPage] }).compileComponents();

        const fixture = TestBed.createComponent(TableDocPage);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        fixture.componentInstance.loadFromServer();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-table-loading')).toBeTruthy();

        vi.advanceTimersByTime(1200);
        fixture.detectChanges();

        expect(fixture.componentInstance.dynamicColumns().map(column => column.field)).toEqual([
            'id', 'name', 'category', 'price', 'stock',
        ]);
        expect(fixture.componentInstance.dynamicRows().length).toBe(8);

        const text = (fixture.nativeElement as HTMLElement).textContent || '';
        expect(text).not.toContain('[object');
        expect(text).toContain('UltraBook Pro');
    });
});
