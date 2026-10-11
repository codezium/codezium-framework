import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzDividerComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { DIVIDER_DOC_I18N } from './divider-doc.i18n';

@Component({
    selector: 'cz-divider-doc-page',
    imports: [CzDividerComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="divider">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md">
                    <cz-divider />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="content">{{ t().content }}</h2>
                <p [innerHTML]="t().contentDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-divider>OR</cz-divider>
                    <cz-divider align="left">Section</cz-divider>
                    <cz-divider align="right">End</cz-divider>
                    <cz-divider type="dashed">Dashed</cz-divider>
                </div>
                <app-code [code]="contentCode" />
            </section>

            <section>
                <h2 id="vertical">{{ t().vertical }}</h2>
                <p [innerHTML]="t().verticalDesc"></p>
                <div class="cz-flex cz-gap-md cz-mb-md" style="height: 6rem;">
                    <span>Left</span>
                    <cz-divider layout="vertical" />
                    <span>Center</span>
                    <cz-divider layout="vertical" type="dotted" />
                    <span>Right</span>
                </div>
                <app-code [code]="verticalCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>layout</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Divider direction.</td></tr>
                            <tr><td><code>type</code></td><td><code>'solid' | 'dashed' | 'dotted'</code></td><td><code>'solid'</code></td><td>Line style.</td></tr>
                            <tr><td><code>align</code></td><td><code>'left' | 'center' | 'right'</code></td><td><code>'center'</code></td><td>Content alignment.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class DividerDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => DIVIDER_DOC_I18N[this.lang.currentLang()] || DIVIDER_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzDividerComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-divider />`,
    };

    contentCode: Code = {
        html: `<cz-divider>OR</cz-divider>
<cz-divider align="left">Section</cz-divider>
<cz-divider align="right">End</cz-divider>
<cz-divider type="dashed">Dashed</cz-divider>`,
    };

    verticalCode: Code = {
        html: `<div class="cz-flex" style="height: 6rem;">
    <span>Left</span>
    <cz-divider layout="vertical" />
    <span>Right</span>
</div>`,
    };
}
