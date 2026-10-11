import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzIftaLabelComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { IFTA_LABEL_DOC_I18N } from './ifta-label-doc.i18n';

@Component({
    selector: 'cz-ifta-label-doc-page',
    imports: [CzIftaLabelComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="ifta-label">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md" style="max-width: 20rem;">
                    <cz-ifta-label>
                        <input id="ifta-email" class="cz-input-native" />
                        <label for="ifta-email">Email</label>
                    </cz-ifta-label>

                    <cz-ifta-label>
                        <input id="ifta-user" class="cz-input-native" value="mike" />
                        <label for="ifta-user">Username</label>
                    </cz-ifta-label>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Selector</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>cz-ifta-label</code></td><td>Wrapper that renders the label on the top border.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class IftaLabelDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => IFTA_LABEL_DOC_I18N[this.lang.currentLang()] || IFTA_LABEL_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzIftaLabelComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-ifta-label>
    <input id="email" class="cz-input-native" />
    <label for="email">Email</label>
</cz-ifta-label>`,
    };
}
