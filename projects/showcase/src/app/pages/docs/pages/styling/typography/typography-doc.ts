import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { TYPOGRAPHY_DOC_I18N } from './typography-doc.i18n';

@Component({
    selector: 'cz-typography-doc-page',
    imports: [AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="typography">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="families">{{ t().families }}</h2>
                <p [innerHTML]="t().familiesDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <div class="cz-flex cz-flex-col cz-gap-xs cz-p-md cz-border cz-rounded-lg">
                        <code class="cz-text-xs">--cz-font-heading</code>
                        <span class="cz-font-heading" style="font-size: 1.5rem; font-weight: 600;">Sora — Ideas que se convierten en tecnología.</span>
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs cz-p-md cz-border cz-rounded-lg">
                        <code class="cz-text-xs">--cz-font-base</code>
                        <span class="cz-font-base">Inter — We design solutions for companies that want to move forward.</span>
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs cz-p-md cz-border cz-rounded-lg">
                        <code class="cz-text-xs">--cz-font-code</code>
                        <span class="cz-font-code">JetBrains Mono — const design = 'codezium';</span>
                    </div>
                </div>
                <app-code [code]="familiesCode" />
            </section>

            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p [innerHTML]="t().sizesDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    @for (size of sizes; track size.class) {
                        <div class="cz-flex cz-items-baseline cz-gap-md">
                            <code class="cz-text-xs">{{ size.class }}</code>
                            <span [class]="size.class">The quick brown fox</span>
                        </div>
                    }
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <section>
                <h2 id="weights">{{ t().weights }}</h2>
                <p>{{ t().weightsDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    @for (weight of weights; track weight) {
                        <div class="cz-flex cz-items-baseline cz-gap-md">
                            <code class="cz-text-xs">{{ weight.class }}</code>
                            <span [class]="weight.class">Weighted text</span>
                        </div>
                    }
                </div>
                <div class="cz-flex cz-flex-col cz-gap-sm">
                    @for (leading of leadings; track leading) {
                        <div class="cz-flex cz-items-baseline cz-gap-md">
                            <code class="cz-text-xs">{{ leading.class }}</code>
                            <span [class]="leading.class">Line one with a longer sentence to show the line height behaviour clearly.</span>
                        </div>
                    }
                </div>
                <app-code [code]="weightsCode" />
            </section>

            <section>
                <h2 id="helpers">{{ t().helpers }}</h2>
                <p>{{ t().helpersDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Family</th><th>Classes</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Font family</td><td><code>cz-font-base</code> (Inter), <code>cz-font-heading</code> (Sora), <code>cz-font-code</code> (JetBrains Mono), <code>cz-font-neo</code></td></tr>
                            <tr><td>Alignment</td><td><code>cz-text-left</code>, <code>cz-text-center</code>, <code>cz-text-right</code>, <code>cz-text-justify</code></td></tr>
                            <tr><td>Transform</td><td><code>cz-uppercase</code>, <code>cz-lowercase</code>, <code>cz-capitalize</code></td></tr>
                            <tr><td>Decoration</td><td><code>cz-underline</code>, <code>cz-line-through</code>, <code>cz-no-underline</code>, <code>cz-italic</code></td></tr>
                            <tr><td>Truncate</td><td><code>cz-truncate</code></td></tr>
                            <tr><td>Color</td><td><code>cz-text-muted</code>, <code>cz-text-glass</code>, <code>cz-text-neo</code> (see Colors page)</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mt-md">
                    <span class="cz-truncate cz-border cz-p-sm cz-w-1/3">This text is truncated when the container is too narrow for the content</span>
                    <span class="cz-uppercase cz-font-semibold cz-text-primary">uppercase + semibold + primary</span>
                </div>
                <app-code [code]="helpersCode" />
            </section>

            <section>
                <h2 id="combos">{{ t().combos }}</h2>
                <p [innerHTML]="t().combosDesc"></p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Class</th><th>Equivalent to</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>.cz-heading-1</code></td><td><code>h1</code> (2.25rem, bold, tight)</td></tr>
                            <tr><td><code>.cz-heading-2</code></td><td><code>h2</code> (1.875rem, bold, tight)</td></tr>
                            <tr><td><code>.cz-heading-3</code> / <code>.cz-heading-4</code></td><td><code>h3</code> / <code>h4</code> (semibold)</td></tr>
                            <tr><td><code>.cz-heading-5</code> / <code>.cz-heading-6</code></td><td><code>h5</code> / <code>h6</code> (medium)</td></tr>
                            <tr><td><code>.cz-paragraph</code></td><td><code>p</code> (base, relaxed, gray-800)</td></tr>
                            <tr><td><code>.cz-caption</code></td><td>Small muted text (xs, gray-500)</td></tr>
                            <tr><td><code>.cz-label-text</code></td><td>Uppercase small label (sm, medium, tracked)</td></tr>
                            <tr><td><code>.cz-code</code></td><td><code>code</code> inline chip (JetBrains Mono, bg-code)</td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="combosCode" />
            </section>
        </div>
    `,
})
export class TypographyDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TYPOGRAPHY_DOC_I18N[this.lang.currentLang()] || TYPOGRAPHY_DOC_I18N.es);

    readonly sizes = [
        { class: 'cz-text-xs', px: '12px' },
        { class: 'cz-text-sm', px: '14px' },
        { class: 'cz-text-base', px: '16px' },
        { class: 'cz-text-lg', px: '18px' },
        { class: 'cz-text-xl', px: '20px' },
        { class: 'cz-text-2xl', px: '24px' },
        { class: 'cz-text-3xl', px: '30px' },
        { class: 'cz-text-4xl', px: '36px' },
        { class: 'cz-text-5xl', px: '48px' },
    ];

    readonly weights = [
        { class: 'cz-font-light' },
        { class: 'cz-font-normal' },
        { class: 'cz-font-medium' },
        { class: 'cz-font-semibold' },
        { class: 'cz-font-bold' },
    ];

    readonly leadings = [
        { class: 'cz-leading-tight' },
        { class: 'cz-leading-sm' },
        { class: 'cz-leading-base' },
    ];

    familiesCode: Code = {
        html: `<span class="cz-font-heading">Sora heading</span>
<span class="cz-font-base">Inter body text</span>
<span class="cz-font-code">const mono = true;</span>`,
    };

    sizesCode: Code = {
        html: `<p class="cz-text-sm">Small text</p>
<p class="cz-text-base">Base text</p>
<p class="cz-text-3xl">Large title</p>`,
    };

    weightsCode: Code = {
        html: `<span class="cz-font-semibold">Semibold</span>
<span class="cz-font-bold cz-leading-tight">Bold with tight leading</span>`,
    };

    helpersCode: Code = {
        html: `<span class="cz-truncate">Long text that gets cut off…</span>
<span class="cz-uppercase cz-font-semibold cz-text-primary">Styled text</span>
<span class="cz-text-center cz-text-muted">Centered muted text</span>`,
    };

    combosCode: Code = {
        html: `<h2>Native heading</h2>
<div class="cz-heading-2">Same style with a class</div>

<p class="cz-paragraph">Paragraph text</p>
<span class="cz-caption">Caption</span>
<span class="cz-label-text">Section label</span>
<code class="cz-code">inline-code</code>`,
    };
}
