import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { EFFECTS_DOC_I18N } from './effects-doc.i18n';

@Component({
    selector: 'cz-effects-doc-page',
    imports: [AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="effects">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="borders">{{ t().borders }}</h2>
                <p>{{ t().bordersDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Width</td><td><code>cz-border</code>, <code>cz-border-0/2/4/8</code>, per-side <code>cz-border-&#123;t,b,l,r&#125;-*</code> and <code>cz-border-&#123;x,y&#125;</code></td></tr>
                            <tr><td>Style</td><td><code>cz-border-solid</code>, <code>cz-border-dashed</code>, <code>cz-border-dotted</code>, <code>cz-border-double</code>, <code>cz-border-none</code></td></tr>
                            <tr><td>Theme</td><td><code>cz-border-glass</code>, <code>cz-border-neo</code>, <code>cz-border-hidden</code></td></tr>
                            <tr><td>Dividers</td><td><code>cz-divide-x</code>, <code>cz-divide-y</code>, <code>cz-divide-x-2</code>, <code>cz-divide-y-2</code>, <code>cz-divide-&#123;dashed,dotted&#125;</code></td></tr>
                            <tr><td>Outline</td><td><code>cz-outline</code>, <code>cz-outline-2/4</code>, <code>cz-outline-none</code>, <code>cz-outline-offset-1/2</code>, <code>cz-outline-&#123;primary,secondary,success,danger&#125;</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="bordersCode" />
            </section>

            <section>
                <h2 id="radius">{{ t().radius }}</h2>
                <p>{{ t().radiusDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    @for (radius of radii; track radius) {
                        <div class="cz-bg-primary-100 cz-p-md" [class]="radius">
                            <code class="cz-text-xs">{{ radius }}</code>
                        </div>
                    }
                </div>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Scale</td><td><code>cz-rounded-none</code>, <code>cz-rounded-&#123;sm,md,lg,xl&#125;</code>, <code>cz-rounded-full</code></td></tr>
                            <tr><td>Directional</td><td><code>cz-rounded-&#123;t,b,l,r&#125;-&#123;sm,md,lg,full&#125;</code></td></tr>
                            <tr><td>Theme</td><td><code>cz-rounded-glass</code>, <code>cz-rounded-neo-&#123;xs,sm,md,lg,xl&#125;</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="radiusCode" />
            </section>

            <section>
                <h2 id="shadows">{{ t().shadows }}</h2>
                <p>{{ t().shadowsDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-mb-md">
                    @for (shadow of shadows; track shadow) {
                        <div class="cz-bg-white cz-p-md cz-rounded-md" [class]="shadow">
                            <code class="cz-text-xs">{{ shadow }}</code>
                        </div>
                    }
                </div>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Scale</td><td><code>cz-shadow-&#123;none,xs,sm,md,lg,xl,2xl,3xl,4xl,5xl,6xl&#125;</code></td></tr>
                            <tr><td>Special</td><td><code>cz-shadow-inner</code>, <code>cz-shadow-glow</code></td></tr>
                            <tr><td>Focus rings</td><td><code>cz-shadow-focus-&#123;primary,secondary,success,danger,warning,info,light,dark,default&#125;</code></td></tr>
                            <tr><td>Input rings</td><td><code>cz-shadow-input-focus-&#123;intents&#125;</code></td></tr>
                            <tr><td>Soft colored</td><td><code>cz-shadow-soft-&#123;primary,secondary,success,danger,warning,info,light,dark,white,black&#125;</code></td></tr>
                            <tr><td>Glass</td><td><code>cz-shadow-glass</code>, <code>cz-shadow-glass-inset</code>, <code>cz-shadow-glass-&#123;tints&#125;</code></td></tr>
                            <tr><td>Neo</td><td><code>cz-shadow-neo-box</code>, <code>cz-shadow-neo-&#123;raised,pressed,inset&#125;-box</code>, <code>cz-shadow-neo-&#123;sm,md,lg&#125;</code>, <code>cz-shadow-neo-&#123;theme&#125;</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="shadowsCode" />
            </section>

            <section>
                <h2 id="elevations">{{ t().elevations }}</h2>
                <p>{{ t().elevationsDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    @for (elevation of elevations; track elevation) {
                        <div class="cz-bg-surface cz-p-md cz-rounded-md" [class]="elevation">
                            <code class="cz-text-xs">{{ elevation }}</code>
                        </div>
                    }
                </div>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-mb-md">
                    <div class="cz-glass-box cz-text-black">cz-glass-box</div>
                    <div class="cz-neo-box">cz-neo-box</div>
                </div>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Scale</td><td><code>cz-elevation-0</code> … <code>cz-elevation-12</code></td></tr>
                            <tr><td>Glass</td><td><code>cz-elevation-glass</code>, <code>cz-elevation-glass-glow</code>, <code>cz-elevation-glass-inset</code></td></tr>
                            <tr><td>Neo</td><td><code>cz-elevation-neo-&#123;flat,raised,hover,pressed,inset,sm,md,lg&#125;</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="elevationsCode" />
            </section>

            <section>
                <h2 id="transitions">{{ t().transitions }}</h2>
                <p>{{ t().transitionsDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-mb-md">
                    <div class="cz-transition cz-hover-scale-up cz-bg-primary-100 cz-p-lg cz-rounded-md cz-cursor-pointer">hover-scale-up</div>
                    <div class="cz-transition cz-hover-opacity-50 cz-bg-primary-100 cz-p-lg cz-rounded-md cz-cursor-pointer">hover-opacity-50</div>
                    <div class="cz-animate-pulse cz-bg-primary-100 cz-p-lg cz-rounded-md">animate-pulse</div>
                    <div class="cz-animate-spin cz-bg-primary-100 cz-p-lg cz-rounded-md">animate-spin</div>
                </div>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Transition</td><td><code>cz-transition</code>, <code>cz-transition-&#123;all,colors,opacity,shadow,transform,fast,slow,soft,glass,neo&#125;</code></td></tr>
                            <tr><td>Duration</td><td><code>cz-duration-&#123;75,100,150,200,300,500,700,1000&#125;</code></td></tr>
                            <tr><td>Delay</td><td><code>cz-delay-&#123;75,100,150,200,300,500,700,1000&#125;</code></td></tr>
                            <tr><td>Easing</td><td><code>cz-ease-&#123;linear,in,out,in-out,bounce&#125;</code></td></tr>
                            <tr><td>Hover</td><td><code>cz-hover-opacity-&#123;50,75,100&#125;</code>, <code>cz-hover-scale-&#123;up,down&#125;</code>, <code>cz-hover-translate-&#123;x,y&#125;</code></td></tr>
                            <tr><td>Active</td><td><code>cz-active-scale-&#123;up,down&#125;</code></td></tr>
                            <tr><td>Animations</td><td><code>cz-animate-&#123;fade-in,fade-in-up/down/left/right,fade-out,slide-in-right,slide-in-up,zoom-in,zoom-out,bounce,bounce-in,flip-in-x,flip-in-y,pulse,spin,shimmer,glass-shine&#125;</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="transitionsCode" />
            </section>

            <section>
                <h2 id="zindex">{{ t().zindex }}</h2>
                <p>{{ t().zindexDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Family</th><th>Classes</th></tr></thead>
                        <tbody>
                            <tr><td>Numeric</td><td><code>cz-z-0</code>, <code>cz-z-10</code>, <code>cz-z-20</code>, <code>cz-z-30</code>, <code>cz-z-40</code>, <code>cz-z-50</code>, <code>cz-z-auto</code>, <code>cz-z-n1</code></td></tr>
                            <tr><td>Semantic</td><td><code>cz-z-&#123;base,content,dropdown,sticky,navbar,overlay,modal,popover,tooltip,toast,loader,max&#125;</code></td></tr>
                        </tbody>
                    </table>
                </div>
                <app-code [code]="zindexCode" />
            </section>

            <section>
                <h2 id="helpers">{{ t().helpers }}</h2>
                <p>{{ t().helpersDesc }}</p>
                <app-code [code]="helpersCode" />
            </section>
        </div>
    `,
})
export class EffectsDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => EFFECTS_DOC_I18N[this.lang.currentLang()] || EFFECTS_DOC_I18N.es);

    readonly radii = ['cz-rounded-sm', 'cz-rounded-md', 'cz-rounded-lg', 'cz-rounded-xl', 'cz-rounded-full'];
    readonly shadows = ['cz-shadow-sm', 'cz-shadow-md', 'cz-shadow-lg', 'cz-shadow-xl', 'cz-shadow-glow'];
    readonly elevations = ['cz-elevation-2', 'cz-elevation-6', 'cz-elevation-10', 'cz-elevation-glass'];

    bordersCode: Code = {
        html: `<div class="cz-border cz-border-dashed cz-rounded-md cz-p-md">Dashed border</div>
<div class="cz-border-t-4 cz-border-primary cz-p-md">Top border 4px</div>
<div class="cz-divide-y cz-divide-dashed">
    <div>Row 1</div>
    <div>Row 2</div>
</div>
<div class="cz-outline cz-outline-2 cz-outline-offset-2 cz-outline-primary">Outlined</div>`,
    };

    radiusCode: Code = {
        html: `<div class="cz-rounded-lg cz-bg-primary-100 cz-p-md">Rounded lg</div>
<div class="cz-rounded-t-lg cz-bg-primary-100 cz-p-md">Top only</div>
<div class="cz-rounded-full cz-bg-primary-100 cz-p-md">Pill</div>`,
    };

    shadowsCode: Code = {
        html: `<div class="cz-shadow-md cz-bg-white cz-p-md">Medium shadow</div>
<div class="cz-shadow-focus-primary cz-bg-white cz-p-md">Primary focus ring</div>
<div class="cz-shadow-soft-success cz-bg-white cz-p-md">Soft green shadow</div>
<div class="cz-shadow-neo-box cz-neo-box">Neomorphic depth</div>`,
    };

    elevationsCode: Code = {
        html: `<div class="cz-elevation-4">Elevation 4</div>
<div class="cz-elevation-glass">Glass elevation</div>
<div class="cz-glass-box">Glass box helper</div>
<div class="cz-neo-box">Neo box helper</div>`,
    };

    transitionsCode: Code = {
        html: `<div class="cz-transition cz-hover-scale-up">Scales on hover</div>
<div class="cz-transition-colors cz-duration-300 cz-hover-opacity-75">Color transition</div>
<div class="cz-animate-fade-in-up">Fades in</div>
<div class="cz-animate-spin">Spinner</div>`,
    };

    zindexCode: Code = {
        html: `<div class="cz-relative cz-z-10">Above siblings</div>
<div class="cz-fixed cz-z-modal">Modal layer</div>`,
    };

    helpersCode: Code = {
        html: `<span class="cz-sr-only">Only for screen readers</span>

<div class="cz-glass-box">Glass surface</div>
<div class="cz-neo-box">Neomorphic surface</div>

<!-- Ripple + scroll animations (directives) -->
<button czRipple>Ripple effect</button>
<div czAnimateOnScroll="fade-up">Animated on scroll</div>`,
    };
}
