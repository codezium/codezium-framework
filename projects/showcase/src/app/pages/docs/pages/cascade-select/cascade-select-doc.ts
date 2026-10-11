import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzCascadeSelectComponent, CzCascadeSelectOption } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { CASCADE_SELECT_DOC_I18N } from './cascade-select-doc.i18n';

@Component({
    selector: 'cz-cascade-select-doc-page',
    imports: [CzCascadeSelectComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="cascade-select">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md" style="max-width: 22rem;">
                    <cz-cascade-select [options]="regions" [(ngModel)]="city" placeholder="Select a city" ariaLabel="Select a city" />
                    <span class="cz-text-sm">Value: {{ city() ?? '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md" style="max-width: 22rem;">
                    <cz-cascade-select [options]="regions" [clearable]="true" [(ngModel)]="city" placeholder="Clearable" />
                    <cz-cascade-select [options]="regions" [(ngModel)]="city" size="sm" placeholder="Small" />
                    <cz-cascade-select [options]="regions" [disabled]="true" [(ngModel)]="city" placeholder="Disabled" />
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
                            <tr><td><code>options</code></td><td><code>CzCascadeSelectOption[]</code></td><td><code>[]</code></td><td>Hierarchical options.</td></tr>
                            <tr><td><code>optionLabel</code></td><td><code>string</code></td><td><code>'label'</code></td><td>Property used as label.</td></tr>
                            <tr><td><code>optionValue</code></td><td><code>string</code></td><td><code>'value'</code></td><td>Property used as value.</td></tr>
                            <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the clear button.</td></tr>
                            <tr><td><code>onChange</code></td><td><code>output&lt;&#123; value, originalEvent &#125;&gt;</code></td><td>-</td><td>Emitted on value change.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class CascadeSelectDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => CASCADE_SELECT_DOC_I18N[this.lang.currentLang()] || CASCADE_SELECT_DOC_I18N.es);

    readonly regions: CzCascadeSelectOption[] = [
        {
            label: 'USA',
            value: 'us',
            items: [
                { label: 'New York', value: 'ny' },
                { label: 'Florida', value: 'fl' },
                { label: 'California', value: 'ca' },
            ],
        },
        {
            label: 'Italy',
            value: 'it',
            items: [
                { label: 'Rome', value: 'rome' },
                { label: 'Milan', value: 'milan' },
            ],
        },
        {
            label: 'Spain',
            value: 'es',
            items: [
                { label: 'Madrid', value: 'madrid' },
                { label: 'Barcelona', value: 'bcn' },
            ],
        },
    ];

    readonly city = signal<string | null>('rome');

    importCode: Code = {
        typescript: `import { CzCascadeSelectComponent, CzCascadeSelectOption } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-cascade-select [options]="regions" [(ngModel)]="city" placeholder="Select a city" />`,
        typescript: `regions: CzCascadeSelectOption[] = [
    {
        label: 'USA',
        value: 'us',
        items: [
            { label: 'New York', value: 'ny' },
        ],
    },
];
city = signal<string | null>(null);`,
    };

    optionsCode: Code = {
        html: `<cz-cascade-select [options]="regions" [clearable]="true" [(ngModel)]="city" />
<cz-cascade-select [options]="regions" size="sm" [(ngModel)]="city" />
<cz-cascade-select [options]="regions" [disabled]="true" [(ngModel)]="city" />`,
    };
}
