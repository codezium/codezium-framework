import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { RESPONSIVE_DOC_I18N } from './responsive-doc.i18n';

@Component({
    selector: 'cz-responsive-doc-page',
    imports: [AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="responsive">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="breakpoints">{{ t().breakpoints }}</h2>
                <p [innerHTML]="t().breakpointsDesc"></p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Breakpoint</th><th>Min width</th><th>Typical device</th></tr></thead>
                        <tbody>
                            <tr><td><code>sm</code></td><td><code>640px</code></td><td>Large phones</td></tr>
                            <tr><td><code>md</code></td><td><code>768px</code></td><td>Tablets</td></tr>
                            <tr><td><code>lg</code></td><td><code>1024px</code></td><td>Laptops</td></tr>
                            <tr><td><code>xl</code></td><td><code>1280px</code></td><td>Desktops</td></tr>
                            <tr><td><code>2xl</code></td><td><code>1536px</code></td><td>Large monitors</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 id="pattern">{{ t().pattern }}</h2>
                <p [innerHTML]="t().patternDesc"></p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Display</td><td><code>cz-&#123;bp&#125;:hidden</code>, <code>cz-&#123;bp&#125;:block</code>, <code>cz-&#123;bp&#125;:inline-block</code>, <code>cz-&#123;bp&#125;:flex</code>, <code>cz-&#123;bp&#125;:grid</code></td></tr>
                            <tr><td>Grid</td><td><code>cz-&#123;bp&#125;:grid-cols-1..12</code>, <code>cz-&#123;bp&#125;:col-span-1..12</code>, <code>cz-&#123;bp&#125;:gap-&#123;size&#125;</code></td></tr>
                            <tr><td>Spacing</td><td><code>cz-&#123;bp&#125;:&#123;m|p&#125;&#123;t,b,l,r,x,y&#125;-&#123;none..4xl|auto&#125;</code></td></tr>
                            <tr><td>Typography</td><td><code>cz-&#123;bp&#125;:text-&#123;xs..5xl&#125;</code>, <code>cz-&#123;bp&#125;:text-&#123;left,center,right,justify&#125;</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="cz-bg-warning-100 cz-border cz-border-warning-300 cz-rounded-lg cz-p-md cz-mb-md">
                    <strong>{{ t().warning }}:</strong>
                    <span [innerHTML]="t().warningDesc"></span>
                </div>
                <app-code [code]="patternCode" />
            </section>

            <section>
                <h2 id="flex-grid">{{ t().flexGrid }}</h2>
                <p>{{ t().flexGridDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Columns</td><td><code>cz-col-&#123;bp&#125;</code>, <code>cz-col-&#123;bp&#125;-auto</code>, <code>cz-col-&#123;bp&#125;-1..12</code></td></tr>
                            <tr><td>Offsets</td><td><code>cz-offset-&#123;bp&#125;-1..12</code></td></tr>
                            <tr><td>Row cols</td><td><code>cz-row-cols-&#123;bp&#125;-1..6</code></td></tr>
                            <tr><td>Order</td><td><code>cz-order-&#123;bp&#125;-&#123;first,last,0..12&#125;</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="flexGridCode" />
            </section>

            <section>
                <h2 id="demo">{{ t().demo }}</h2>
                <p [innerHTML]="t().demoDesc"></p>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-2 cz-lg:grid-cols-4 cz-gap-md cz-mb-md">
                    <div class="cz-bg-primary-100 cz-p-md cz-rounded-sm cz-text-center">1</div>
                    <div class="cz-bg-primary-100 cz-p-md cz-rounded-sm cz-text-center">2</div>
                    <div class="cz-bg-primary-100 cz-p-md cz-rounded-sm cz-text-center">3</div>
                    <div class="cz-bg-primary-100 cz-p-md cz-rounded-sm cz-text-center">4</div>
                </div>
                <div class="cz-flex cz-flex-col cz-md:flex-row cz-gap-md cz-mb-md">
                    <div class="cz-flex-1 cz-bg-success-100 cz-p-md cz-rounded-sm">flex-col → md:flex-row</div>
                    <div class="cz-flex-1 cz-bg-success-100 cz-p-md cz-rounded-sm">Child</div>
                </div>
                <div class="cz-hidden cz-md:block cz-bg-info-100 cz-p-md cz-rounded-sm">
                    Hidden on mobile, visible from md (cz-hidden cz-md:block)
                </div>
                <app-code [code]="demoCode" />
            </section>
        </div>
    `,
})
export class ResponsiveDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => RESPONSIVE_DOC_I18N[this.lang.currentLang()] || RESPONSIVE_DOC_I18N.es);

    patternCode: Code = {
        html: `<!-- 1 column on mobile, 2 from md, 4 from lg -->
<div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-2 cz-lg:grid-cols-4 cz-gap-md">
    <div>1</div><div>2</div><div>3</div><div>4</div>
</div>

<!-- Larger padding from lg -->
<div class="cz-p-sm cz-lg:p-xl">Content</div>`,
    };

    flexGridCode: Code = {
        html: `<div class="cz-row">
    <div class="cz-col-12 cz-col-md-6 cz-col-lg-3">Responsive column</div>
</div>`,
    };

    demoCode: Code = {
        html: `<div class="cz-flex cz-flex-col cz-md:flex-row cz-gap-md">
    <div class="cz-flex-1">A</div>
    <div class="cz-flex-1">B</div>
</div>

<div class="cz-hidden cz-md:block">Desktop only</div>`,
    };
}
