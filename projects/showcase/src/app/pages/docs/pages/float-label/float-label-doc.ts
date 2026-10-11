import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzFloatLabelComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { FLOAT_LABEL_DOC_I18N } from './float-label-doc.i18n';

@Component({
    selector: 'cz-float-label-doc-page',
    imports: [CzFloatLabelComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="float-label">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md" style="max-width: 20rem;">
                    <cz-float-label>
                        <input id="fl-name" class="cz-input-native" placeholder=" " />
                        <label for="fl-name">Name</label>
                    </cz-float-label>

                    <cz-float-label>
                        <input id="fl-email" class="cz-input-native" placeholder=" " value="user@codezium.dev" />
                        <label for="fl-email">Email</label>
                    </cz-float-label>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="variants">{{ t().variants }}</h2>
                <p [innerHTML]="t().variantsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md" style="max-width: 20rem;">
                    <cz-float-label variant="over">
                        <input id="fl-over" class="cz-input-native" placeholder=" " />
                        <label for="fl-over">Over (default)</label>
                    </cz-float-label>

                    <cz-float-label variant="in">
                        <input id="fl-in" class="cz-input-native" placeholder=" " />
                        <label for="fl-in">In / On border</label>
                    </cz-float-label>
                </div>
                <app-code [code]="variantsCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>variant</code></td><td><code>'over' | 'in' | 'on'</code></td><td><code>'over'</code></td><td>Float style of the label.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class FloatLabelDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => FLOAT_LABEL_DOC_I18N[this.lang.currentLang()] || FLOAT_LABEL_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzFloatLabelComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-float-label>
    <input id="name" class="cz-input-native" placeholder=" " />
    <label for="name">Name</label>
</cz-float-label>`,
    };

    variantsCode: Code = {
        html: `<cz-float-label variant="over">
    <input id="over" placeholder=" " />
    <label for="over">Over (default)</label>
</cz-float-label>

<cz-float-label variant="in">
    <input id="in" placeholder=" " />
    <label for="in">In / On border</label>
</cz-float-label>`,
    };
}
