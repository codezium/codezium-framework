import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzFieldsetComponent, CzInputTextComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { FIELDSET_DOC_I18N } from './fieldset-doc.i18n';

@Component({
    selector: 'cz-fieldset-doc-page',
    imports: [CzFieldsetComponent, CzInputTextComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="fieldset">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md">
                    <cz-fieldset legend="Personal data">
                        <div class="cz-flex cz-flex-col cz-gap-md">
                            <cz-input-text label="Name" labelPosition="float" />
                            <cz-input-text label="Email" labelPosition="float" />
                        </div>
                    </cz-fieldset>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="toggleable">{{ t().toggleable }}</h2>
                <p [innerHTML]="t().toggleableDesc"></p>
                <div class="cz-mb-md">
                    <cz-fieldset legend="Advanced" [toggleable]="true">
                        <p>Advanced settings go here.</p>
                    </cz-fieldset>
                </div>
                <app-code [code]="toggleableCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>legend</code></td><td><code>string</code></td><td><code>''</code></td><td>Legend text.</td></tr>
                            <tr><td><code>toggleable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Allows collapsing.</td></tr>
                            <tr><td><code>collapsed</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Collapsed state (two-way).</td></tr>
                            <tr><td><code>onToggle</code></td><td><code>output&lt;boolean&gt;</code></td><td>-</td><td>Emitted on toggle.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class FieldsetDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => FIELDSET_DOC_I18N[this.lang.currentLang()] || FIELDSET_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzFieldsetComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-fieldset legend="Personal data">
    <cz-input-text label="Name" labelPosition="float" />
    <cz-input-text label="Email" labelPosition="float" />
</cz-fieldset>`,
    };

    toggleableCode: Code = {
        html: `<cz-fieldset legend="Advanced" [toggleable]="true">
    <p>Advanced settings go here.</p>
</cz-fieldset>`,
    };
}
