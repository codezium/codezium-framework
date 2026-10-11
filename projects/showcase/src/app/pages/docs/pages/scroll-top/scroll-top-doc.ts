import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzScrollAreaComponent, CzScrollTopComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SCROLL_TOP_DOC_I18N } from './scroll-top-doc.i18n';

@Component({
    selector: 'cz-scroll-top-doc-page',
    imports: [CzScrollTopComponent, CzScrollAreaComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="scroll-top">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-scroll-area maxHeight="10rem">
                        <div class="cz-flex cz-flex-col cz-gap-sm cz-p-md">
                            @for (item of items; track item) {
                                <span>{{ item }}</span>
                            }
                        </div>
                    </cz-scroll-area>
                    <span class="cz-text-sm">The fixed button appears at the bottom-right of this page after scrolling 300px.</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
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
                            <tr><td><code>threshold</code></td><td><code>number</code></td><td><code>400</code></td><td>Scroll offset to show the button.</td></tr>
                            <tr><td><code>target</code></td><td><code>string | HTMLElement | null</code></td><td><code>null</code></td><td>Element or selector (defaults to window).</td></tr>
                            <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Scroll to top'</code></td><td>Accessible label.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>

        <cz-scroll-top [threshold]="300" />
    `,
})
export class ScrollTopDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => SCROLL_TOP_DOC_I18N[this.lang.currentLang()] || SCROLL_TOP_DOC_I18N.es);

    readonly items = Array.from({ length: 25 }, (_, i) => `Line ${i + 1}`);

    importCode: Code = {
        typescript: `import { CzScrollTopComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<!-- Once in the app root -->
<cz-scroll-top [threshold]="300" />`,
    };

    optionsCode: Code = {
        html: `<cz-scroll-top [threshold]="200" target="#scroll-container" />`,
    };
}
