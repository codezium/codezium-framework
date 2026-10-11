import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzAnimateOnScrollDirective } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { ANIMATE_ON_SCROLL_DOC_I18N } from './animate-on-scroll-doc.i18n';

@Component({
    selector: 'cz-animate-on-scroll-doc-page',
    imports: [CzAnimateOnScrollDirective, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="animate-on-scroll">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <div class="cz-p-lg cz-border cz-rounded-lg" czAnimateOnScroll="fade-up">fade-up</div>
                    <div class="cz-p-lg cz-border cz-rounded-lg" czAnimateOnScroll="fade-left">fade-left</div>
                    <div class="cz-p-lg cz-border cz-rounded-lg" czAnimateOnScroll="zoom-in" [aosDelay]="200">zoom-in (delay 200ms)</div>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <div class="cz-p-lg cz-border cz-rounded-lg" [czAnimateOnScroll]="'fade-down'" [aosOnce]="false">
                        fade-down (replays every time)
                    </div>
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
                            <tr><td><code>czAnimateOnScroll</code></td><td><code>string</code></td><td><code>'fade-up'</code></td><td>Animation name.</td></tr>
                            <tr><td><code>aosDelay</code></td><td><code>number</code></td><td><code>0</code></td><td>Delay in milliseconds.</td></tr>
                            <tr><td><code>aosOnce</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Keeps visible after the first intersection.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class AnimateOnScrollDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(
        () => ANIMATE_ON_SCROLL_DOC_I18N[this.lang.currentLang()] || ANIMATE_ON_SCROLL_DOC_I18N.es,
    );

    importCode: Code = {
        typescript: `import { CzAnimateOnScrollDirective } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<div czAnimateOnScroll="fade-up">Content</div>
<div czAnimateOnScroll="fade-left">Content</div>
<div czAnimateOnScroll="zoom-in" [aosDelay]="200">Content</div>`,
    };

    optionsCode: Code = {
        html: `<div [czAnimateOnScroll]="'fade-down'" [aosOnce]="false">Replays every time</div>`,
    };
}
