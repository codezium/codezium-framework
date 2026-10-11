import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzTableColumn, CzTableComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TABLE_DOC_I18N } from './table-doc.i18n';

@Component({
    selector: 'cz-table-doc-page',
    imports: [CzTableComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="table">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-table [columns]="columns" [value]="customers" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <cz-table [columns]="columns" [value]="customers" [sortable]="true" [striped]="true" (onSort)="lastSort.set($event)" />
                    <span class="cz-text-sm">Last sort: {{ lastSort() ? lastSort()!.field + ' ' + lastSort()!.order : '-' }}</span>
                    <cz-table [columns]="columns" [value]="customers" [gridlines]="true" selectionMode="single" (onRowSelect)="selected.set($event)" />
                    <span class="cz-text-sm">Selected: {{ selected() ? selected()!['name'] : '-' }}</span>
                    <cz-table [columns]="columns" [value]="customers" [rows]="2" />
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
                            <tr><td><code>columns</code></td><td><code>CzTableColumn[]</code></td><td><code>[]</code></td><td>Column definitions (field, header, sortable, width).</td></tr>
                            <tr><td><code>value</code></td><td><code>Record&lt;string, any&gt;[]</code></td><td><code>[]</code></td><td>Row data.</td></tr>
                            <tr><td><code>sortable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables sorting on all columns.</td></tr>
                            <tr><td><code>striped</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Alternating row background.</td></tr>
                            <tr><td><code>gridlines</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Cell borders.</td></tr>
                            <tr><td><code>selectionMode</code></td><td><code>'none' | 'single'</code></td><td><code>'none'</code></td><td>Row selection mode.</td></tr>
                            <tr><td><code>rows</code></td><td><code>number</code></td><td><code>0</code></td><td>Rows per page (0 disables pagination).</td></tr>
                            <tr><td><code>onSort</code></td><td><code>output&lt;CzTableSortEvent&gt;</code></td><td>-</td><td>Emitted on sort.</td></tr>
                            <tr><td><code>onRowSelect</code></td><td><code>output&lt;Record&gt;</code></td><td>-</td><td>Emitted on row selection.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TableDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TABLE_DOC_I18N[this.lang.currentLang()] || TABLE_DOC_I18N.es);

    readonly columns: CzTableColumn[] = [
        { field: 'name', header: 'Name', sortable: true },
        { field: 'country', header: 'Country' },
        { field: 'company', header: 'Company' },
        { field: 'status', header: 'Status' },
    ];

    readonly customers = [
        { name: 'James Butt', country: 'Algeria', company: 'Benton', status: 'unqualified' },
        { name: 'Josephine Darakjy', country: 'Egypt', company: 'Chanay', status: 'negotiation' },
        { name: 'Art Venere', country: 'Panama', company: 'Chemel', status: 'qualified' },
        { name: 'Lenna Paprocki', country: 'Slovenia', company: 'Feltz', status: 'new' },
    ];

    readonly lastSort = signal<{ field: string; order: string } | null>(null);
    readonly selected = signal<Record<string, any> | null>(null);

    importCode: Code = {
        typescript: `import { CzTableComponent, CzTableColumn } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-table [columns]="columns" [value]="customers" />`,
        typescript: `columns: CzTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'country', header: 'Country' },
];`,
    };

    optionsCode: Code = {
        html: `<cz-table [columns]="columns" [value]="customers" [sortable]="true" [striped]="true" (onSort)="onSort($event)" />

<cz-table [columns]="columns" [value]="customers" [gridlines]="true" selectionMode="single" (onRowSelect)="onRowSelect($event)" />

<!-- Built-in pagination -->
<cz-table [columns]="columns" [value]="customers" [rows]="2" />`,
    };
}
