import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzSkeletonComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SKELETON_DOC_I18N } from './skeleton-doc.i18n';

@Component({
    selector: 'cz-skeleton-doc-page',
    imports: [CzSkeletonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="skeleton">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    <cz-skeleton />
                    <cz-skeleton width="60%" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="shapes">{{ t().shapes }}</h2>
                <p [innerHTML]="t().shapesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-skeleton shape="circle" />
                    <cz-skeleton shape="circle" width="64" height="64" />
                    <cz-skeleton width="200" height="150" />
                </div>
                <app-code [code]="shapesCode" />
            </section>

            <section>
                <h2 id="animation">{{ t().animation }}</h2>
                <p [innerHTML]="t().animationDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    <cz-skeleton width="200" />
                    <cz-skeleton width="200" animation="none" />
                </div>
                <app-code [code]="animationCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>shape</code></td><td><code>'rectangle' | 'circle'</code></td><td><code>'rectangle'</code></td><td>Skeleton shape.</td></tr>
                            <tr><td><code>width</code></td><td><code>string | number | null</code></td><td><code>null</code></td><td>CSS width (number = px).</td></tr>
                            <tr><td><code>height</code></td><td><code>string | number | null</code></td><td><code>null</code></td><td>CSS height (number = px).</td></tr>
                            <tr><td><code>borderRadius</code></td><td><code>string | null</code></td><td><code>null</code></td><td>CSS border radius.</td></tr>
                            <tr><td><code>animation</code></td><td><code>'pulse' | 'none'</code></td><td><code>'pulse'</code></td><td>Animation style.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class SkeletonDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => SKELETON_DOC_I18N[this.lang.currentLang()] || SKELETON_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzSkeletonComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-skeleton />
<cz-skeleton width="60%" />`,
    };

    shapesCode: Code = {
        html: `<cz-skeleton shape="circle" />
<cz-skeleton shape="circle" width="64" height="64" />
<cz-skeleton width="200" height="150" />`,
    };

    animationCode: Code = {
        html: `<cz-skeleton width="200" />
<cz-skeleton width="200" animation="none" />`,
    };
}
