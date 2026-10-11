import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzOrgChartComponent, CzOrgChartNode } from './org-chart.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzOrgChartComponent', () => {
    let component: CzOrgChartComponent;
    let fixture: ComponentFixture<CzOrgChartComponent>;

    const root: CzOrgChartNode = {
        label: 'CEO',
        children: [
            {
                label: 'CTO',
                children: [{ label: 'Lead Dev' }, { label: 'QA' }],
            },
            { label: 'CFO' },
        ],
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzOrgChartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzOrgChartComponent);
        component = fixture.componentInstance;
    });

    function nodes(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-org-chart-node')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    it('should create and render nothing without a value', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(nodes().length).toBe(0);
    });

    it('should render the full hierarchy recursively', () => {
        fixture.componentRef.setInput('value', root);
        fixture.detectChanges();

        const labels = nodes().map((n) => n.textContent?.trim());
        expect(labels).toEqual(['CEO', 'CTO', 'Lead Dev', 'QA', 'CFO']);
    });

    it('should emit onNodeSelect when a node is clicked', () => {
        fixture.componentRef.setInput('value', root);
        fixture.detectChanges();

        const selectSpy = vi.fn();
        component.onNodeSelect.subscribe(selectSpy);

        nodes()[2].click();

        expect(selectSpy).toHaveBeenCalledWith(root.children![0].children![0]);
    });

    it('should render a single node without children', () => {
        fixture.componentRef.setInput('value', { label: 'Solo' });
        fixture.detectChanges();

        expect(nodes().length).toBe(1);
        expect(fixture.nativeElement.querySelector('.cz-org-chart-children')).toBeNull();
    });
});
