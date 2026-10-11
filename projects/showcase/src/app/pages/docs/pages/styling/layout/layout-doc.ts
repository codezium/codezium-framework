import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { LAYOUT_DOC_I18N } from './layout-doc.i18n';

@Component({
    selector: 'cz-layout-doc-page',
    imports: [AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="layout">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="display">{{ t().display }}</h2>
                <p>{{ t().displayDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Class</th><th>CSS</th></tr></thead>
                        <tbody>
                            <tr><td><code>cz-grid</code> / <code>cz-inline-grid</code></td><td><code>display: grid / inline-grid</code></td></tr>
                            <tr><td><code>cz-flex</code> / <code>cz-inline-flex</code></td><td><code>display: flex / inline-flex</code></td></tr>
                            <tr><td><code>cz-block</code> / <code>cz-inline-block</code> / <code>cz-inline</code></td><td>Block and inline modes</td></tr>
                            <tr><td><code>cz-hidden</code></td><td><code>display: none</code></td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 id="grid">{{ t().grid }}</h2>
                <p>{{ t().gridDesc }}</p>
                <div class="cz-grid cz-grid-cols-12 cz-gap-sm cz-mb-md">
                    @for (col of cols; track col) {
                        <div class="cz-bg-primary-100 cz-p-sm cz-text-center cz-text-xs cz-rounded-sm">{{ col }}</div>
                    }
                </div>
                <div class="cz-grid cz-grid-cols-4 cz-gap-md cz-mb-md">
                    <div class="cz-bg-success-100 cz-p-md cz-col-span-2 cz-text-center cz-rounded-sm">col-span-2</div>
                    <div class="cz-bg-success-100 cz-p-md cz-text-center cz-rounded-sm">1</div>
                    <div class="cz-bg-success-100 cz-p-md cz-text-center cz-rounded-sm">1</div>
                </div>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Columns</td><td><code>cz-grid-cols-1</code> … <code>cz-grid-cols-12</code></td></tr>
                            <tr><td>Span</td><td><code>cz-col-span-1</code> … <code>cz-col-span-12</code></td></tr>
                            <tr><td>Gap</td><td><code>cz-gap-&#123;none,xs,sm,md,lg,xl,2xl&#125;</code>, <code>cz-gap-x-*</code>, <code>cz-gap-y-*</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="gridCode" />
            </section>

            <section>
                <h2 id="flex">{{ t().flex }}</h2>
                <p>{{ t().flexDesc }}</p>
                <div class="cz-flex cz-justify-between cz-items-center cz-gap-md cz-p-md cz-border cz-rounded-lg cz-mb-md">
                    <span class="cz-bg-primary-100 cz-p-sm cz-rounded-sm">justify-between</span>
                    <span class="cz-bg-primary-100 cz-p-sm cz-rounded-sm">items-center</span>
                    <span class="cz-bg-primary-100 cz-p-sm cz-rounded-sm cz-self-end">self-end</span>
                </div>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Direction</td><td><code>cz-flex-row</code>, <code>cz-flex-row-reverse</code>, <code>cz-flex-col</code>, <code>cz-flex-col-reverse</code></td></tr>
                            <tr><td>Wrap</td><td><code>cz-flex-wrap</code>, <code>cz-flex-nowrap</code>, <code>cz-flex-wrap-reverse</code></td></tr>
                            <tr><td>Justify</td><td><code>cz-justify-&#123;start,end,center,between,around,evenly&#125;</code></td></tr>
                            <tr><td>Items</td><td><code>cz-items-&#123;start,end,center,baseline,stretch&#125;</code></td></tr>
                            <tr><td>Content</td><td><code>cz-content-&#123;start,center,end,between,around,stretch&#125;</code></td></tr>
                            <tr><td>Self</td><td><code>cz-self-&#123;auto,start,center,end,stretch&#125;</code></td></tr>
                            <tr><td>Grow / shrink</td><td><code>cz-flex-1</code>, <code>cz-flex-auto</code>, <code>cz-flex-none</code>, <code>cz-flex-initial</code>, <code>cz-grow</code>, <code>cz-grow-0</code>, <code>cz-shrink</code>, <code>cz-shrink-0</code></td></tr>
                            <tr><td>Order</td><td><code>cz-order-&#123;0..12&#125;</code>, <code>cz-order-first</code>, <code>cz-order-last</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="flexCode" />
            </section>

            <section>
                <h2 id="flex-grid">{{ t().flexGrid }}</h2>
                <p>{{ t().flexGridDesc }}</p>
                <div class="cz-row cz-mb-md">
                    <div class="cz-col-6"><div class="cz-bg-tertiary-100 cz-p-md cz-rounded-sm">cz-col-6</div></div>
                    <div class="cz-col-3"><div class="cz-bg-tertiary-100 cz-p-md cz-rounded-sm">cz-col-3</div></div>
                    <div class="cz-col-3"><div class="cz-bg-tertiary-100 cz-p-md cz-rounded-sm">cz-col-3</div></div>
                </div>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Class</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>cz-row</code> / <code>cz-no-gutters</code></td><td>Flex row with negative gutters / no gutters</td></tr>
                            <tr><td><code>cz-col</code> / <code>cz-col-auto</code></td><td>Equal-width column / auto width</td></tr>
                            <tr><td><code>cz-col-1</code> … <code>cz-col-12</code></td><td>Fixed width columns (percent based)</td></tr>
                            <tr><td><code>cz-offset-1</code> … <code>cz-offset-12</code></td><td>Left offsets</td></tr>
                            <tr><td><code>cz-row-cols-1</code> … <code>cz-row-cols-6</code></td><td>Equal columns for all direct children</td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="flexGridCode" />
            </section>

            <section>
                <h2 id="containers">{{ t().containers }}</h2>
                <p>{{ t().containersDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Class</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>cz-container</code></td><td>Centered, responsive max-width (640 → 1536px)</td></tr>
                            <tr><td><code>cz-container-fluid</code></td><td>Full width with horizontal padding</td></tr>
                            <tr><td><code>cz-layout</code></td><td>Full-height flex app shell</td></tr>
                            <tr><td><code>cz-app</code></td><td>App reset wrapper (fonts, colors, min-height)</td></tr>
                            <tr><td><code>cz-section</code></td><td>Vertical section padding (xl)</td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="containersCode" />
            </section>

            <section>
                <h2 id="sizing">{{ t().sizing }}</h2>
                <p>{{ t().sizingDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Width</td><td><code>cz-w-full</code>, <code>cz-w-screen</code>, <code>cz-w-auto</code>, <code>cz-w-0</code>, <code>cz-w-px</code>, <code>cz-w-1/2</code>, <code>cz-w-1/3</code>, <code>cz-w-2/3</code>, <code>cz-w-1/4</code>, <code>cz-w-3/4</code></td></tr>
                            <tr><td>Height</td><td><code>cz-h-full</code>, <code>cz-h-screen</code>, <code>cz-h-auto</code>, <code>cz-h-0</code>, <code>cz-h-px</code></td></tr>
                            <tr><td>Min / Max</td><td><code>cz-min-w-full</code>, <code>cz-min-w-0</code>, <code>cz-max-w-full</code>, <code>cz-max-w-screen</code>, <code>cz-min-h-full</code>, <code>cz-min-h-screen</code>, <code>cz-min-h-0</code>, <code>cz-max-h-full</code>, <code>cz-max-h-screen</code></td></tr>
                            <tr><td>Fluid wrapper</td><td><code>czFluid</code> directive stretches descendant components</td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="sizingCode" />
            </section>

            <section>
                <h2 id="position">{{ t().position }}</h2>
                <p>{{ t().positionDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Position</td><td><code>cz-static</code>, <code>cz-fixed</code>, <code>cz-absolute</code>, <code>cz-relative</code>, <code>cz-sticky</code></td></tr>
                            <tr><td>Insets</td><td><code>cz-inset-0</code>, <code>cz-inset-x-0</code>, <code>cz-inset-y-0</code></td></tr>
                            <tr><td>Corners</td><td><code>cz-top-0</code>, <code>cz-right-0</code>, <code>cz-bottom-0</code>, <code>cz-left-0</code> and <code>*-1/2</code> variants</td></tr>
                            <tr><td>Centering</td><td><code>cz-translate-center</code>, <code>cz-translate-x-center</code>, <code>cz-translate-y-center</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="cz-relative cz-border cz-rounded-lg cz-mb-md" style="height: 8rem;">
                    <span class="cz-absolute cz-top-0 cz-right-0 cz-bg-danger cz-text-white cz-p-sm cz-rounded-sm">top-0 right-0</span>
                    <span class="cz-absolute cz-top-1/2 cz-left-1/2 cz-translate-center cz-bg-primary cz-text-white cz-p-sm cz-rounded-sm">centered</span>
                </div>
                <app-code [code]="positionCode" />
            </section>

            <section>
                <h2 id="misc">{{ t().misc }}</h2>
                <p>{{ t().miscDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Overflow</td><td><code>cz-overflow-&#123;auto,hidden,visible,scroll,x-auto,y-auto&#125;</code></td></tr>
                            <tr><td>Visibility</td><td><code>cz-visible</code>, <code>cz-invisible</code>, <code>cz-opacity-0</code>, <code>cz-opacity-100</code></td></tr>
                            <tr><td>Cursor</td><td><code>cz-cursor-&#123;auto,default,pointer,wait,text,move,not-allowed&#125;</code></td></tr>
                            <tr><td>Selection</td><td><code>cz-select-&#123;none,text,all&#125;</code></td></tr>
                            <tr><td>A11y</td><td><code>cz-sr-only</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="miscCode" />
            </section>
        </div>
    `,
})
export class LayoutDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => LAYOUT_DOC_I18N[this.lang.currentLang()] || LAYOUT_DOC_I18N.es);

    readonly cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    gridCode: Code = {
        html: `<div class="cz-grid cz-grid-cols-3 cz-gap-md">
    <div>Column 1</div>
    <div>Column 2</div>
    <div>Column 3</div>
</div>

<div class="cz-grid cz-grid-cols-4 cz-gap-md">
    <div class="cz-col-span-2">Spans 2 columns</div>
    <div>1</div>
    <div>1</div>
</div>`,
    };

    flexCode: Code = {
        html: `<div class="cz-flex cz-justify-between cz-items-center cz-gap-md">
    <span>Left</span>
    <span class="cz-self-end">Right (self-end)</span>
</div>

<div class="cz-flex cz-flex-col cz-gap-sm">
    <span class="cz-flex-1">Grows</span>
    <span class="cz-flex-none">Fixed</span>
</div>`,
    };

    flexGridCode: Code = {
        html: `<div class="cz-row">
    <div class="cz-col-6">Half</div>
    <div class="cz-col-3">Quarter</div>
    <div class="cz-col-3">Quarter</div>
</div>

<div class="cz-row cz-row-cols-3">
    <div>Equal</div>
    <div>Equal</div>
    <div>Equal</div>
</div>`,
    };

    containersCode: Code = {
        html: `<div class="cz-container">
    <section class="cz-section">Centered page content</section>
</div>

<div class="cz-layout">
    <aside>Sidebar</aside>
    <main class="cz-content">Main content</main>
</div>`,
    };

    sizingCode: Code = {
        html: `<div class="cz-w-full">Full width</div>
<div class="cz-w-1/2">Half width</div>
<div class="cz-max-w-full cz-overflow-hidden">Clamped</div>

<div czFluid>
    <cz-input-text label="Full width input" />
</div>`,
    };

    positionCode: Code = {
        html: `<div class="cz-relative">
    <span class="cz-absolute cz-top-0 cz-right-0">Badge</span>
    <span class="cz-absolute cz-top-1/2 cz-left-1/2 cz-translate-center">Centered</span>
</div>`,
    };

    miscCode: Code = {
        html: `<div class="cz-overflow-y-auto cz-max-h-full">Scrollable area</div>
<span class="cz-cursor-pointer cz-select-none">Clickable, non selectable</span>
<span class="cz-sr-only">Screen reader only</span>`,
    };
}
