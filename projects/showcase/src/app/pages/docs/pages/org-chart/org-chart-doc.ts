import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzOrgChartComponent, CzOrgChartNode } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { ORG_CHART_DOC_I18N } from './org-chart-doc.i18n';

@Component({
    selector: 'cz-org-chart-doc-page',
    imports: [CzOrgChartComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="org-chart">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-org-chart [value]="org" (onNodeSelect)="selected.set($event)" />
                    <span class="cz-text-sm">Selected: {{ selected()?.label || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-org-chart [value]="flat" />
                </div>
                <app-code [code]="optionsCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>value</code></td><td><code>CzOrgChartNode | null</code></td><td><code>null</code></td><td>Root node (label, value, children).</td></tr>
                            <tr><td><code>onNodeSelect</code></td><td><code>output&lt;CzOrgChartNode&gt;</code></td><td>-</td><td>Emitted when a node is clicked.</td></tr>
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

    readonly org: CzOrgChartNode = {
        label: 'CEO',
        children: [
            {
                label: 'CTO',
                children: [{ label: 'Lead Developer' }, { label: 'QA Engineer' }],
            },
            {
                label: 'CFO',
                children: [{ label: 'Accountant' }],
            },
        ],
    };

    readonly flat: CzOrgChartNode = { label: 'Solo Founder' };

    readonly selected = signal<CzOrgChartNode | null>(null);

    importCode: Code = {
        typescript: `import { CzOrgChartComponent, CzOrgChartNode } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-org-chart [value]="org" (onNodeSelect)="onSelect($event)" />`,
        typescript: `org: CzOrgChartNode = {
    label: 'CEO',
    children: [
        { label: 'CTO', children: [{ label: 'Lead Developer' }] },
        { label: 'CFO' },
    ],
};`,
    };

    optionsCode: Code = {
        html: `<cz-org-chart [value]="{ label: 'Solo Founder' }" />`,
    };
}
