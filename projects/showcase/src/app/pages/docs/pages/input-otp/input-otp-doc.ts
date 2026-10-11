import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzInputOtpComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { INPUT_OTP_DOC_I18N } from './input-otp-doc.i18n';

@Component({
    selector: 'cz-input-otp-doc-page',
    imports: [CzInputOtpComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="input-otp">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    <cz-input-otp [(ngModel)]="code" ariaLabel="One time password" />
                    <span class="cz-text-sm">Value: {{ code() || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-input-otp [length]="6" [(ngModel)]="code" />
                    <cz-input-otp [length]="4" [mask]="true" [(ngModel)]="code" />
                    <cz-input-otp [length]="4" [integerOnly]="false" [(ngModel)]="code" />
                    <cz-input-otp [length]="4" [disabled]="true" [(ngModel)]="code" />
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
                            <tr><td><code>length</code></td><td><code>number</code></td><td><code>4</code></td><td>Number of digits.</td></tr>
                            <tr><td><code>mask</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Masks the digits.</td></tr>
                            <tr><td><code>integerOnly</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Only allow digits.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Readonly state.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class InputOtpDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => INPUT_OTP_DOC_I18N[this.lang.currentLang()] || INPUT_OTP_DOC_I18N.es);

    readonly code = signal('1234');

    importCode: Code = {
        typescript: `import { CzInputOtpComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-input-otp [(ngModel)]="code" ariaLabel="One time password" />`,
        typescript: `code = signal('1234');`,
    };

    optionsCode: Code = {
        html: `<cz-input-otp [length]="6" [(ngModel)]="code" />
<cz-input-otp [length]="4" [mask]="true" [(ngModel)]="code" />
<cz-input-otp [length]="4" [integerOnly]="false" [(ngModel)]="code" />
<cz-input-otp [length]="4" [disabled]="true" [(ngModel)]="code" />`,
    };
}
