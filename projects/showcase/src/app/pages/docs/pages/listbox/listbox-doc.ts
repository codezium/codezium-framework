import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzListboxComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { LISTBOX_DOC_I18N } from './listbox-doc.i18n';

@Component({
    selector: 'cz-listbox-doc-page',
    imports: [CzListboxComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="listbox">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-grid cz-grid-cols-1 md:cz-grid-cols-2 cz-gap-md cz-mb-md">
                    <cz-listbox [options]="cities" optionLabel="label" optionValue="value" [(ngModel)]="single" ariaLabel="Cities" />
                    <div class="cz-text-sm">Selected: {{ single() ?? '-' }}</div>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="multiple">{{ t().multiple }}</h2>
                <p [innerHTML]="t().multipleDesc"></p>
                <div class="cz-grid cz-grid-cols-1 md:cz-grid-cols-2 cz-gap-md cz-mb-md">
                    <cz-listbox [options]="cities" optionLabel="label" optionValue="value" [multiple]="true" [(ngModel)]="multi" ariaLabel="Cities" />
                    <div class="cz-text-sm">Selected: {{ multi().join(', ') || '-' }}</div>
                </div>
                <app-code [code]="multipleCode" />
            </section>

            <section>
                <h2 id="filter">{{ t().filter }}</h2>
                <p [innerHTML]="t().filterDesc"></p>
                <div class="cz-grid cz-grid-cols-1 md:cz-grid-cols-2 cz-gap-md cz-mb-md">
                    <cz-listbox [options]="cities" optionLabel="label" optionValue="value" [filter]="true" size="sm" [(ngModel)]="single" ariaLabel="Cities" />
                    <cz-listbox [options]="cities" optionLabel="label" optionValue="value" [filter]="true" size="lg" [(ngModel)]="single" ariaLabel="Cities" />
                </div>
                <app-code [code]="filterCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>options</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>Items to display.</td></tr>
                            <tr><td><code>optionLabel</code></td><td><code>string</code></td><td><code>''</code></td><td>Property used as label.</td></tr>
                            <tr><td><code>optionValue</code></td><td><code>string</code></td><td><code>''</code></td><td>Property used as value.</td></tr>
                            <tr><td><code>multiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Allows multiple selection.</td></tr>
                            <tr><td><code>filter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the filter input.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Component size.</td></tr>
                            <tr><td><code>onChange</code></td><td><code>output&lt;CzListboxChangeEvent&gt;</code></td><td>-</td><td>Emitted on selection change.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ListboxDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => LISTBOX_DOC_I18N[this.lang.currentLang()] || LISTBOX_DOC_I18N.es);

    readonly cities = [
        { label: 'New York', value: 'NY' },
        { label: 'Rome', value: 'RM' },
        { label: 'London', value: 'LDN' },
        { label: 'Istanbul', value: 'IST' },
        { label: 'Paris', value: 'PRS' },
    ];

    readonly single = signal<string | null>('RM');
    readonly multi = signal<string[]>(['NY', 'LDN']);

    importCode: Code = {
        typescript: `import { CzListboxComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-listbox [options]="cities" optionLabel="label" optionValue="value" [(ngModel)]="selected" />`,
        typescript: `cities = [
    { label: 'New York', value: 'NY' },
    { label: 'Rome', value: 'RM' },
];
selected = signal<string | null>('RM');`,
    };

    multipleCode: Code = {
        html: `<cz-listbox [options]="cities" optionLabel="label" optionValue="value" [multiple]="true" [(ngModel)]="selected" />`,
        typescript: `selected = signal<string[]>(['NY', 'LDN']);`,
    };

    filterCode: Code = {
        html: `<cz-listbox [options]="cities" optionLabel="label" optionValue="value" [filter]="true" size="sm" [(ngModel)]="selected" />`,
    };
}
