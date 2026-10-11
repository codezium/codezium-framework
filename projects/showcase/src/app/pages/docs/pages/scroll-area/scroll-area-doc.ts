import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzScrollAreaComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SCROLL_AREA_DOC_I18N } from './scroll-area-doc.i18n';

@Component({
    selector: 'cz-scroll-area-doc-page',
    imports: [CzScrollAreaComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="scroll-area">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md">
                    <cz-scroll-area maxHeight="10rem">
                        <div class="cz-flex cz-flex-col cz-gap-sm cz-p-md">
                            @for (item of items; track item) {
                                <span>{{ item }}</span>
                            }
                        </div>
                    </cz-scroll-area>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-scroll-area variant="hover" maxHeight="8rem">
                        <div class="cz-flex cz-flex-col cz-gap-sm cz-p-md">
                            @for (item of items; track item) {
                                <span>{{ item }}</span>
                            }
                        </div>
                    </cz-scroll-area>
                    <cz-scroll-area variant="always" maxHeight="8rem">
                        <div class="cz-flex cz-flex-col cz-gap-sm cz-p-md">
                            @for (item of items; track item) {
                                <span>{{ item }}</span>
                            }
                        </div>
                    </cz-scroll-area>
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
                            <tr><td><code>variant</code></td><td><code>'default' | 'hover' | 'always'</code></td><td><code>'default'</code></td><td>Scrollbar visibility.</td></tr>
                            <tr><td><code>maxHeight</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Optional max height of the viewport.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ScrollAreaDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => SCROLL_AREA_DOC_I18N[this.lang.currentLang()] || SCROLL_AREA_DOC_I18N.es);

    readonly items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

    importCode: Code = {
        typescript: `import { CzScrollAreaComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-scroll-area maxHeight="10rem">
    <div>Scrollable content...</div>
</cz-scroll-area>`,
    };

    optionsCode: Code = {
        html: `<cz-scroll-area variant="hover" maxHeight="8rem">...</cz-scroll-area>
<cz-scroll-area variant="always" maxHeight="8rem">...</cz-scroll-area>`,
    };
}
