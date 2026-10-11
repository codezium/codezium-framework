import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzRippleDirective } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { RIPPLE_DOC_I18N } from './ripple-doc.i18n';

@Component({
    selector: 'cz-ripple-doc-page',
    imports: [CzButtonComponent, CzRippleDirective, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="ripple">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <button class="cz-btn cz-btn--primary" czRipple>Click me</button>
                    <button class="cz-btn cz-btn--secondary" czRipple>Secondary</button>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <button class="cz-btn cz-btn--success" czRipple [rippleCentered]="true">Centered</button>
                    <button class="cz-btn cz-btn--danger" czRipple rippleColor="rgba(255,255,255,0.6)">Custom color</button>
                    <button class="cz-btn cz-btn--dark" czRipple [rippleDisabled]="true">No ripple</button>
                    <cz-button label="cz-button + ripple" czRipple severity="info" />
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
                            <tr><td><code>rippleDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the ripple effect.</td></tr>
                            <tr><td><code>rippleColor</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Ripple color (defaults to currentColor).</td></tr>
                            <tr><td><code>rippleCentered</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Starts from the center.</td></tr>
                            <tr><td><code>rippleDuration</code></td><td><code>number</code></td><td><code>500</code></td><td>Duration in milliseconds.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class RippleDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => RIPPLE_DOC_I18N[this.lang.currentLang()] || RIPPLE_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzRippleDirective } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<button class="cz-btn cz-btn--primary" czRipple>Click me</button>`,
    };

    optionsCode: Code = {
        html: `<button czRipple [rippleCentered]="true">Centered</button>
<button czRipple rippleColor="rgba(255,255,255,0.6)">Custom color</button>
<button czRipple [rippleDisabled]="true">No ripple</button>
<cz-button label="cz-button + ripple" czRipple severity="info" />`,
    };
}
