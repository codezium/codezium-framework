import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzOrgChartComponent, CzOrgChartNode } from './org-chart.component';
import { CzAvatarComponent } from '../../atoms/avatar';
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

    it('should render collapsible toggles and collapse/expand subtrees', () => {
        const keyedRoot: CzOrgChartNode = {
            key: 'ceo',
            label: 'CEO',
            children: [
                { key: 'cto', label: 'CTO', children: [{ key: 'dev', label: 'Lead Dev' }] },
                { key: 'cfo', label: 'CFO' },
            ],
        };

        fixture.componentRef.setInput('value', keyedRoot);
        fixture.componentRef.setInput('collapsible', true);
        fixture.detectChanges();

        const collapseSpy = vi.fn();
        const expandSpy = vi.fn();
        component.onNodeCollapse.subscribe(collapseSpy);
        component.onNodeExpand.subscribe(expandSpy);

        const toggles = fixture.debugElement.queryAll(By.css('.cz-org-chart-toggle'));
        expect(toggles.length).toBe(2);

        toggles[0].nativeElement.click();
        fixture.detectChanges();

        expect(component.collapsedKeys()['ceo']).toBe(true);
        expect(collapseSpy).toHaveBeenCalledWith(keyedRoot);
        expect(nodes().map(n => n.textContent?.trim())).toEqual(['CEO']);

        toggles[0].nativeElement.click();
        fixture.detectChanges();

        expect(component.collapsedKeys()['ceo']).toBe(false);
        expect(expandSpy).toHaveBeenCalledWith(keyedRoot);
        expect(nodes().length).toBe(4);
    });

    it('should seed collapsed state from collapsedKeys and hide collapsed subtrees', () => {
        const keyedRoot: CzOrgChartNode = {
            key: 'ceo',
            label: 'CEO',
            children: [{ key: 'cto', label: 'CTO' }],
        };

        fixture.componentRef.setInput('value', keyedRoot);
        fixture.componentRef.setInput('collapsible', true);
        fixture.componentRef.setInput('collapsedKeys', { ceo: true });
        fixture.detectChanges();

        expect(nodes().map(n => n.textContent?.trim())).toEqual(['CEO']);
    });

    it('should apply the custom node template', () => {
        const hostFixture = TestBed.createComponent(NodeTemplateHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-node')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelector('.custom-node').textContent).toContain('CEO');
        expect(hostFixture.nativeElement.querySelector('.custom-node').textContent).toContain('Boss');

        // Library components (cz-avatar) can be composed inside the template
        const avatar = hostFixture.nativeElement.querySelector('.custom-node cz-avatar');
        expect(avatar).toBeTruthy();
        expect(avatar.querySelector('.cz-avatar-label')?.textContent).toContain('CEO');
    });

    it('should apply the gap input as a CSS variable', () => {
        fixture.componentRef.setInput('value', root);
        fixture.componentRef.setInput('gap', 48);
        fixture.detectChanges();

        const container = fixture.nativeElement.querySelector('.cz-org-chart-container') as HTMLElement;
        expect(container.style.getPropertyValue('--cz-org-chart-gap')).toBe('48px');
    });
});

@Component({
    imports: [CzOrgChartComponent, CzAvatarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-org-chart [value]="root" [nodeTemplate]="nodeTpl"></cz-org-chart>

        <ng-template #nodeTpl let-node>
            <span class="custom-node cz-flex cz-items-center cz-gap-sm">
                <cz-avatar [label]="node.label" shape="circle" size="sm" />
                {{ node.label }} · {{ node.value }}
            </span>
        </ng-template>
    `,
})
class NodeTemplateHostComponent {
    readonly root: CzOrgChartNode = { label: 'CEO', value: 'Boss' };
}
