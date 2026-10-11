import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzVirtualScrollerComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { VIRTUAL_SCROLLER_DOC_I18N } from './virtual-scroller-doc.i18n';

@Component({
    selector: 'cz-virtual-scroller-doc-page',
    imports: [CzVirtualScrollerComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="virtual-scroller">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-virtual-scroller [items]="items" [itemSize]="40" [height]="240" field="name" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-virtual-scroller [items]="numbers" [itemSize]="32" [height]="192" [overscan]="4" />
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
                            <tr><td><code>items</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>Items to render virtually.</td></tr>
                            <tr><td><code>itemSize</code></td><td><code>number</code></td><td><code>40</code></td><td>Height of each item in px.</td></tr>
                            <tr><td><code>height</code></td><td><code>number</code></td><td><code>288</code></td><td>Viewport height in px.</td></tr>
                            <tr><td><code>field</code></td><td><code>string</code></td><td><code>''</code></td><td>Property used to display items.</td></tr>
                            <tr><td><code>overscan</code></td><td><code>number</code></td><td><code>2</code></td><td>Extra items rendered outside the viewport.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class VirtualScrollerDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => VIRTUAL_SCROLLER_DOC_I18N[this.lang.currentLang()] || VIRTUAL_SCROLLER_DOC_I18N.es);

    readonly items = Array.from({ length: 1000 }, (_, i) => ({ name: `Item ${i + 1}` }));
    readonly numbers = Array.from({ length: 500 }, (_, i) => `Number ${i + 1}`);

    importCode: Code = {
        typescript: `import { CzVirtualScrollerComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-virtual-scroller [items]="items" [itemSize]="40" [height]="240" field="name" />`,
        typescript: `items = Array.from({ length: 1000 }, (_, i) => ({ name: \`Item \${i + 1}\` }));`,
    };

    optionsCode: Code = {
        html: `<cz-virtual-scroller [items]="numbers" [itemSize]="32" [height]="192" [overscan]="4" />`,
    };
}
