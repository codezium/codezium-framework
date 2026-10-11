import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzLabelComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { LABEL_DOC_I18N } from './label-doc.i18n';

@Component({
    selector: 'cz-label-doc-page',
    imports: [CzLabelComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="label">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md" style="max-width: 22rem;">
                    <cz-label htmlFor="username">Username</cz-label>
                    <input id="username" class="cz-input-native" placeholder="Type your username" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="required">{{ t().required }}</h2>
                <p [innerHTML]="t().requiredDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md" style="max-width: 22rem;">
                    <cz-label htmlFor="email" [required]="true">Email</cz-label>
                    <input id="email" class="cz-input-native" placeholder="you@example.com" required />
                </div>
                <app-code [code]="requiredCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>htmlFor</code></td><td><code>string</code></td><td><code>''</code></td><td>Id of the linked form control.</td></tr>
                            <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the required marker.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class LabelDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => LABEL_DOC_I18N[this.lang.currentLang()] || LABEL_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzLabelComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-label htmlFor="username">Username</cz-label>
<input id="username" class="cz-input-native" />`,
    };

    requiredCode: Code = {
        html: `<cz-label htmlFor="email" [required]="true">Email</cz-label>
<input id="email" class="cz-input-native" required />`,
    };
}
