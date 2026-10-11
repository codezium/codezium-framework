import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzMeterGroupComponent, CzMeterItem } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { METER_GROUP_DOC_I18N } from './meter-group-doc.i18n';

@Component({
    selector: 'cz-meter-group-doc-page',
    imports: [CzMeterGroupComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="meter-group">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-meter-group [value]="storage" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-meter-group [value]="storage" orientation="vertical" [max]="120" />
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
                            <tr><td><code>value</code></td><td><code>CzMeterItem[]</code></td><td><code>[]</code></td><td>Items (label, value, color).</td></tr>
                            <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Scale maximum.</td></tr>
                            <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Bar orientation.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class MeterGroupDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => METER_GROUP_DOC_I18N[this.lang.currentLang()] || METER_GROUP_DOC_I18N.es);

    readonly storage: CzMeterItem[] = [
        { label: 'Apps', value: 35 },
        { label: 'Media', value: 25 },
        { label: 'Documents', value: 15 },
        { label: 'Free', value: 25, color: 'var(--cz-color-gray-300)' },
    ];

    importCode: Code = {
        typescript: `import { CzMeterGroupComponent, CzMeterItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-meter-group [value]="storage" />`,
        typescript: `storage: CzMeterItem[] = [
    { label: 'Apps', value: 35 },
    { label: 'Media', value: 25 },
    { label: 'Free', value: 40, color: 'var(--cz-color-gray-300)' },
];`,
    };

    optionsCode: Code = {
        html: `<cz-meter-group [value]="storage" orientation="vertical" [max]="120" />`,
    };
}
