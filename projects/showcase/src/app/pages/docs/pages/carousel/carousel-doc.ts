import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzCarouselComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { CAROUSEL_DOC_I18N } from './carousel-doc.i18n';

@Component({
    selector: 'cz-carousel-doc-page',
    imports: [CzCarouselComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="carousel">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-carousel [items]="slides" field="title" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-carousel [items]="slides" field="title" [circular]="true" [autoPlay]="true" [autoPlayInterval]="4000" />
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
                            <tr><td><code>items</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>Slides data.</td></tr>
                            <tr><td><code>field</code></td><td><code>string</code></td><td><code>''</code></td><td>Property used to display slides.</td></tr>
                            <tr><td><code>circular</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Wraps around at the edges.</td></tr>
                            <tr><td><code>autoPlay</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Advances automatically.</td></tr>
                            <tr><td><code>activeIndex</code></td><td><code>number (model)</code></td><td><code>0</code></td><td>Active slide index.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class CarouselDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => CAROUSEL_DOC_I18N[this.lang.currentLang()] || CAROUSEL_DOC_I18N.es);

    readonly slides = [
        { title: 'Angular-first design system' },
        { title: 'Atomic design architecture' },
        { title: 'Base, Glass and Neo themes' },
        { title: 'Accessible by default' },
    ];

    importCode: Code = {
        typescript: `import { CzCarouselComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-carousel [items]="slides" field="title" />`,
        typescript: `slides = [
    { title: 'Angular-first design system' },
    { title: 'Atomic design architecture' },
];`,
    };

    optionsCode: Code = {
        html: `<cz-carousel [items]="slides" field="title" [circular]="true" [autoPlay]="true" [autoPlayInterval]="4000" />`,
    };
}
