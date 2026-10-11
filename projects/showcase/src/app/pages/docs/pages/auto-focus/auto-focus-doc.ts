import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzAutoFocusDirective, CzInputTextComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { AUTO_FOCUS_DOC_I18N } from './auto-focus-doc.i18n';

@Component({
    selector: 'cz-auto-focus-doc-page',
    imports: [CzAutoFocusDirective, CzInputTextComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="auto-focus">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md" style="max-width: 22rem;">
                    <input class="cz-input-native" [czAutoFocus]="true" placeholder="I get focused on load" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md" style="max-width: 22rem;">
                    <cz-input-text label="Not focused" labelPosition="float" [czAutoFocus]="false" />
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
                            <tr><td><code>czAutoFocus</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether to focus the element.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class AutoFocusDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => AUTO_FOCUS_DOC_I18N[this.lang.currentLang()] || AUTO_FOCUS_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzAutoFocusDirective } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<input [czAutoFocus]="true" placeholder="I get focused on load" />`,
    };

    optionsCode: Code = {
        html: `<cz-input-text label="Not focused" [czAutoFocus]="false" />`,
    };
}
