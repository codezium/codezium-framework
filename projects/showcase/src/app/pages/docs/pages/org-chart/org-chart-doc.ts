import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzAvatarComponent, CzButtonComponent, CzOrgChartComponent, CzOrgChartNode } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { ORG_CHART_DOC_I18N } from './org-chart-doc.i18n';

@Component({
    selector: 'cz-org-chart-doc-page',
    imports: [CzOrgChartComponent, CzButtonComponent, CzAvatarComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="org-chart">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-org-chart [value]="org" (onNodeSelect)="selected.set($event)" />
                    <span class="cz-text-sm">Selected: {{ selected()?.label || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── COLLAPSIBLE ── -->
            <section>
                <h2 id="collapsible">{{ t().collapsible }}</h2>
                <p [innerHTML]="t().collapsibleDesc"></p>
                <div class="cz-flex cz-gap-md cz-mb-md">
                    <cz-button [label]="t().expandAll" size="sm" severity="secondary" variant="outlined"
                        (onClick)="collapsedKeys.set({})" />
                    <cz-button [label]="t().collapseAll" size="sm" severity="secondary" variant="outlined"
                        (onClick)="collapsedKeys.set({ ceo: true, cto: true })" />
                </div>
                <div class="cz-mb-md">
                    <cz-org-chart [value]="org" [collapsible]="true" [(collapsedKeys)]="collapsedKeys"
                        (onNodeExpand)="lastEvent.set('expanded: ' + $event.label)"
                        (onNodeCollapse)="lastEvent.set('collapsed: ' + $event.label)" />
                    <span class="cz-text-sm">{{ lastEvent() }}</span>
                </div>
                <app-code [code]="collapsibleCode" />
            </section>

            <!-- ── NODE TEMPLATE ── -->
            <section>
                <h2 id="template">{{ t().template }}</h2>
                <p [innerHTML]="t().templateDesc"></p>
                <div class="cz-mb-md">
                    <cz-org-chart [value]="team" [nodeTemplate]="nodeTpl" [gap]="56"></cz-org-chart>

                    <ng-template #nodeTpl let-node>
                        <span class="cz-flex cz-items-center cz-gap-sm">
                            <cz-avatar [label]="initials(node.label)" shape="circle" size="sm" />
                            <span class="cz-flex cz-flex-col cz-items-start">
                                <strong>{{ node.label }}</strong>
                                <span class="cz-text-xs cz-text-muted">{{ node.value }}</span>
                            </span>
                        </span>
                    </ng-template>
                </div>
                <app-code [code]="templateCode" />
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>value</code></td><td><code>CzOrgChartNode | null</code></td><td><code>null</code></td><td>Root node (<code>key</code>, <code>label</code>, <code>value</code>, <code>children</code>).</td></tr>
                            <tr><td><code>collapsible</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Makes nodes with children collapsible.</td></tr>
                            <tr><td><code>collapsedKeys</code></td><td><code>Record&lt;string, boolean&gt; (model)</code></td><td><code>&#123;&#125;</code></td><td>Map of collapsed node keys (<code>true</code> = collapsed). Two-way bindable.</td></tr>
                            <tr><td><code>nodeTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom node content (receives the node as <code>$implicit</code>).</td></tr>
                            <tr><td><code>gap</code></td><td><code>number | null</code></td><td><code>null</code></td><td>Gap between sibling nodes in px (null = theme default).</td></tr>
                            <tr><td><code>onNodeSelect</code></td><td><code>output&lt;CzOrgChartNode&gt;</code></td><td><code>—</code></td><td>Emitted when a node is clicked.</td></tr>
                            <tr><td><code>onNodeExpand</code></td><td><code>output&lt;CzOrgChartNode&gt;</code></td><td><code>—</code></td><td>Emitted when a node is expanded.</td></tr>
                            <tr><td><code>onNodeCollapse</code></td><td><code>output&lt;CzOrgChartNode&gt;</code></td><td><code>—</code></td><td>Emitted when a node is collapsed.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class OrgChartDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => ORG_CHART_DOC_I18N[this.lang.currentLang()] || ORG_CHART_DOC_I18N.es);

    readonly selected = signal<CzOrgChartNode | null>(null);
    readonly collapsedKeys = signal<Record<string, boolean>>({});
    readonly lastEvent = signal('');

    initials(name: string): string {
        return name.split(' ').map(part => part[0]).slice(0, 2).join('');
    }

    readonly org: CzOrgChartNode = {
        key: 'ceo',
        label: 'CEO',
        children: [
            {
                key: 'cto',
                label: 'CTO',
                children: [
                    { key: 'dev', label: 'Lead Developer' },
                    { key: 'qa', label: 'QA Engineer' },
                ],
            },
            {
                key: 'cfo',
                label: 'CFO',
                children: [{ key: 'acc', label: 'Accountant' }],
            },
        ],
    };

    readonly team: CzOrgChartNode = {
        label: 'Amy Elsner',
        value: 'Founder & CEO',
        children: [
            {
                label: 'Asiya Javayant',
                value: 'Product Lead',
                children: [
                    { label: 'Anna Fali', value: 'UX Designer' },
                    { label: 'Bernardo Dominic', value: 'Product Manager' },
                ],
            },
            {
                label: 'Onyama Limba',
                value: 'Engineering Lead',
                children: [
                    { label: 'Elwin Sharvill', value: 'Frontend Engineer' },
                    { label: 'Stephen Shaw', value: 'Backend Engineer' },
                ],
            },
        ],
    };

    importCode: Code = {
        typescript: `import { CzOrgChartComponent, CzOrgChartNode } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-org-chart [value]="org" (onNodeSelect)="onSelect($event)" />`,
        typescript: `org: CzOrgChartNode = {
    key: 'ceo',
    label: 'CEO',
    children: [
        { key: 'cto', label: 'CTO', children: [{ label: 'Lead Developer' }] },
        { key: 'cfo', label: 'CFO' },
    ],
};`,
    };

    collapsibleCode: Code = {
        html: `<cz-org-chart
    [value]="org"
    [collapsible]="true"
    [(collapsedKeys)]="collapsedKeys"
    (onNodeExpand)="onExpand($event)"
    (onNodeCollapse)="onCollapse($event)"
/>`,
        typescript: `collapsedKeys = signal<Record<string, boolean>>({});

expandAll(): void {
    this.collapsedKeys.set({});
}

collapseAll(): void {
    this.collapsedKeys.set({ ceo: true, cto: true });
}`,
    };

    templateCode: Code = {
        html: `<!-- Compose the node with any library component -->
<cz-org-chart [value]="team" [nodeTemplate]="nodeTpl" [gap]="56"></cz-org-chart>

<ng-template #nodeTpl let-node>
    <span class="node-content">
        <cz-avatar [label]="initials(node.label)" shape="circle" size="sm" />
        <span>
            <strong>{{ node.label }}</strong>
            <span>{{ node.value }}</span>
        </span>
    </span>
</ng-template>`,
        typescript: `initials(name: string): string {
    return name.split(' ').map(part => part[0]).slice(0, 2).join('');
}`,
    };
}
