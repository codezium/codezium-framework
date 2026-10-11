import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzStepComponent, CzStepperComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { STEPPER_DOC_I18N } from './stepper-doc.i18n';

@Component({
    selector: 'cz-stepper-doc-page',
    imports: [CzStepperComponent, CzStepComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="stepper">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-stepper>
                        <cz-step label="Account">
                            <p>Set up your account details.</p>
                        </cz-step>
                        <cz-step label="Profile">
                            <p>Tell us about yourself.</p>
                        </cz-step>
                        <cz-step label="Confirm">
                            <p>Review and confirm everything.</p>
                        </cz-step>
                    </cz-stepper>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-xl cz-mb-md">
                    <cz-stepper [linear]="true">
                        <cz-step label="One">
                            <p>Linear: you can only advance step by step.</p>
                        </cz-step>
                        <cz-step label="Two">
                            <p>Second step.</p>
                        </cz-step>
                        <cz-step label="Locked" [disabled]="true">
                            <p>This step is disabled.</p>
                        </cz-step>
                    </cz-stepper>

                    <cz-stepper [showNavigation]="false">
                        <cz-step label="Silent">
                            <p>No prev/next footer, only the header indicators.</p>
                        </cz-step>
                        <cz-step label="Next">
                            <p>Click the indicators to navigate.</p>
                        </cz-step>
                    </cz-stepper>
                </div>
                <app-code [code]="optionsCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Component</th><th>Name</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>cz-stepper</code></td><td><code>activeStep</code></td><td><code>number</code></td><td>Initial active index.</td></tr>
                            <tr><td><code>cz-stepper</code></td><td><code>linear</code></td><td><code>boolean</code></td><td>Blocks jumping forward.</td></tr>
                            <tr><td><code>cz-stepper</code></td><td><code>showNavigation</code></td><td><code>boolean</code></td><td>Shows the prev/next footer.</td></tr>
                            <tr><td><code>cz-stepper</code></td><td><code>prevLabel / nextLabel</code></td><td><code>string</code></td><td>Footer button labels.</td></tr>
                            <tr><td><code>cz-step</code></td><td><code>label</code></td><td><code>string</code></td><td>Step label.</td></tr>
                            <tr><td><code>cz-step</code></td><td><code>disabled</code></td><td><code>boolean</code></td><td>Disabled step.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class StepperDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => STEPPER_DOC_I18N[this.lang.currentLang()] || STEPPER_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzStepComponent, CzStepperComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-stepper>
    <cz-step label="Account">
        <p>Set up your account details.</p>
    </cz-step>
    <cz-step label="Profile">
        <p>Tell us about yourself.</p>
    </cz-step>
    <cz-step label="Confirm">
        <p>Review and confirm everything.</p>
    </cz-step>
</cz-stepper>`,
    };

    optionsCode: Code = {
        html: `<cz-stepper [linear]="true">
    <cz-step label="One">...</cz-step>
    <cz-step label="Two">...</cz-step>
    <cz-step label="Locked" [disabled]="true">...</cz-step>
</cz-stepper>

<cz-stepper [showNavigation]="false">
    <cz-step label="Silent">...</cz-step>
    <cz-step label="Next">...</cz-step>
</cz-stepper>`,
    };
}
