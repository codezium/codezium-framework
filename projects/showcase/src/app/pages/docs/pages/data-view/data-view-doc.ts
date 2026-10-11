import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzDataViewComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { DATA_VIEW_DOC_I18N } from './data-view-doc.i18n';

@Component({
    selector: 'cz-data-view-doc-page',
    imports: [CzDataViewComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="data-view">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-data-view [value]="products" field="name" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <cz-data-view [value]="products" field="name" layout="grid" />
                    <cz-data-view [value]="products" field="name" [sortable]="true" [rows]="3" />
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
                            <tr><td><code>value</code></td><td><code>Record&lt;string, any&gt;[]</code></td><td><code>[]</code></td><td>Data to display.</td></tr>
                            <tr><td><code>layout</code></td><td><code>'list' | 'grid'</code></td><td><code>'list'</code></td><td>Items layout.</td></tr>
                            <tr><td><code>field</code></td><td><code>string</code></td><td><code>''</code></td><td>Property used to display items.</td></tr>
                            <tr><td><code>rows</code></td><td><code>number</code></td><td><code>0</code></td><td>Rows per page (0 disables pagination).</td></tr>
                            <tr><td><code>sortable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables sorting by field.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class DataViewDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => DATA_VIEW_DOC_I18N[this.lang.currentLang()] || DATA_VIEW_DOC_I18N.es);

    readonly products = [
        { name: 'Laptop' },
        { name: 'Keyboard' },
        { name: 'Monitor' },
        { name: 'Mouse' },
        { name: 'Headphones' },
        { name: 'Webcam' },
        { name: 'Microphone' },
    ];

    importCode: Code = {
        typescript: `import { CzDataViewComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-data-view [value]="products" field="name" />`,
        typescript: `products = [
    { name: 'Laptop' },
    { name: 'Keyboard' },
];`,
    };

    optionsCode: Code = {
        html: `<cz-data-view [value]="products" field="name" layout="grid" />

<cz-data-view [value]="products" field="name" [sortable]="true" [rows]="3" />`,
    };
}
