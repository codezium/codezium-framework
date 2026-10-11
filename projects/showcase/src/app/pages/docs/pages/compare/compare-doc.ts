import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzCompareComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { COMPARE_DOC_I18N } from './compare-doc.i18n';

@Component({
    selector: 'cz-compare-doc-page',
    imports: [CzCompareComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="compare">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-compare [leftImage]="before" [rightImage]="after" leftLabel="Base" rightLabel="Neo" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-compare [leftImage]="before" [rightImage]="after" leftLabel="Original" rightLabel="Edited" [value]="70" />
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
                            <tr><td><code>leftImage</code></td><td><code>string</code></td><td><code>''</code></td><td>Left (before) image.</td></tr>
                            <tr><td><code>rightImage</code></td><td><code>string</code></td><td><code>''</code></td><td>Right (after) image.</td></tr>
                            <tr><td><code>leftLabel</code> / <code>rightLabel</code></td><td><code>string</code></td><td><code>'Before' / 'After'</code></td><td>Corner labels.</td></tr>
                            <tr><td><code>value</code></td><td><code>number (model)</code></td><td><code>50</code></td><td>Split percentage (0-100).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class CompareDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => COMPARE_DOC_I18N[this.lang.currentLang()] || COMPARE_DOC_I18N.es);

    readonly before = 'https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg';
    readonly after = 'https://primefaces.org/cdn/primeng/images/galleria/galleria6.jpg';

    importCode: Code = {
        typescript: `import { CzCompareComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-compare [leftImage]="before" [rightImage]="after" leftLabel="Base" rightLabel="Neo" />`,
    };

    optionsCode: Code = {
        html: `<cz-compare [leftImage]="before" [rightImage]="after" leftLabel="Original" rightLabel="Edited" [value]="70" />`,
    };
}
