import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CzInputMaskDirective, CzInputTextComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { INPUT_MASK_DOC_I18N } from './input-mask-doc.i18n';

@Component({
    selector: 'cz-input-mask-doc-page',
    imports: [CzInputMaskDirective, CzInputTextComponent, AppCodeComponent, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="input-mask">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md" style="max-width: 22rem;">
                    <input class="cz-input-native" czInputMask="(999) 999-9999" [formControl]="phone" placeholder="(999) 999-9999" />
                    <cz-input-text czInputMask="999-99-9999" [formControl]="ssn" label="SSN" labelPosition="float" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="masks">{{ t().masks }}</h2>
                <p [innerHTML]="t().masksDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md" style="max-width: 22rem;">
                    <input class="cz-input-native" czInputMask="99/99/9999" placeholder="99/99/9999" />
                    <input class="cz-input-native" czInputMask="aaa-999" placeholder="aaa-999" />
                    <input class="cz-input-native" czInputMask="****-****" placeholder="****-****" />
                </div>
                <app-code [code]="masksCode" />
            </section>

            <section>
                <h2 id="unmask">{{ t().unmask }}</h2>
                <p [innerHTML]="t().unmaskDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md" style="max-width: 22rem;">
                    <input class="cz-input-native" czInputMask="(999) 999-9999" [unmask]="true" [formControl]="unmasked" placeholder="Unmasked model" />
                    <span class="cz-text-sm">Model: {{ unmasked.value || '-' }}</span>
                    <input class="cz-input-native" czInputMask="(999) 999-9999" [formControl]="disabled" placeholder="Disabled" [disabled]="true" />
                </div>
                <app-code [code]="unmaskCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>czInputMask</code></td><td><code>string</code></td><td><code>''</code></td><td>Mask definition.</td></tr>
                            <tr><td><code>slotChar</code></td><td><code>string</code></td><td><code>'_'</code></td><td>Placeholder char for empty positions.</td></tr>
                            <tr><td><code>autoClear</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Clears the model when emptied.</td></tr>
                            <tr><td><code>unmask</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Emits the raw value without literals.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class InputMaskDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => INPUT_MASK_DOC_I18N[this.lang.currentLang()] || INPUT_MASK_DOC_I18N.es);

    readonly phone = new FormControl('');
    readonly ssn = new FormControl('', [Validators.required]);
    readonly unmasked = new FormControl('');
    readonly disabled = new FormControl({ value: '5551234567', disabled: true });

    importCode: Code = {
        typescript: `import { CzInputMaskDirective } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<input czInputMask="(999) 999-9999" [formControl]="phone" />
<cz-input-text czInputMask="999-99-9999" [formControl]="ssn" label="SSN" />`,
    };

    masksCode: Code = {
        html: `<input czInputMask="99/99/9999" />   <!-- date -->
<input czInputMask="aaa-999" />      <!-- letters + digits -->
<input czInputMask="****-****" />    <!-- alphanumeric -->`,
    };

    unmaskCode: Code = {
        html: `<input czInputMask="(999) 999-9999" [unmask]="true" [formControl]="phone" />`,
        typescript: `// typing 5551234567 emits "5551234567" instead of "(555) 123-4567"`,
    };
}
