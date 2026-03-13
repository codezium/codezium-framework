import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CzInputTextComponent, CzInputNumberDirective } from '../../../../../../../codezium-ui/src/public-api';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { INPUT_NUMBER_DOC_I18N } from './input-number-doc.i18n';

@Component({
    selector: 'cz-input-number-doc-page',
    imports: [CzInputTextComponent, CzInputNumberDirective, AppCodeComponent, ReactiveFormsModule, FormsModule, JsonPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <header class="doc-header">
                <h1 class="doc-title">{{ t().title }}</h1>
                <p class="doc-lead" [innerHTML]="t().lead"></p>
            </header>

            <!-- ── IMPORT ── -->
            <section>
                <h2>{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── NUMERALS ── -->
            <section>
                <h2 id="numerals">{{ t().numeralsTitle }}</h2>
                <p [innerHTML]="t().numeralsDesc"></p>
                <form [formGroup]="testForm" class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-input-text 
                        formControlName="val1" 
                        label="Quantity" 
                        czInputNumber 
                        mode="decimal" 
                        [minFractionDigits]="2">
                    </cz-input-text>
                    <div class="cz-text-sm cz-text-muted cz-font-mono">
                        Model Value: {{ testForm.get('val1')?.value }} | Type: {{ typeOf(testForm.get('val1')?.value) }}
                    </div>
                </form>
                <app-code [code]="numeralsCode" />
            </section>

            <!-- ── CURRENCY ── -->
            <section>
                <h2 id="currency">{{ t().currencyTitle }}</h2>
                <p [innerHTML]="t().currencyDesc"></p>
                <form [formGroup]="testForm" class="cz-flex cz-flex-wrap cz-gap-xl cz-mb-md cz-items-end">
                    <cz-input-text formControlName="val2" label="US Dollar ($)" czInputNumber mode="currency" currency="USD" locale="en"></cz-input-text>
                    <cz-input-text formControlName="val3" label="Euro (€ - German)" czInputNumber mode="currency" currency="EUR" locale="de"></cz-input-text>
                    <cz-input-text formControlName="val4" label="Japanese Yen (¥)" czInputNumber mode="currency" currency="JPY" locale="es" [minFractionDigits]="0"></cz-input-text>
                </form>
                <div class="cz-text-sm cz-text-muted cz-font-mono cz-mb-md">
                    {{ testForm.value | json }}
                </div>
                <app-code [code]="currencyCode" />
            </section>

            <!-- ── PREFIX & SUFFIX ── -->
            <section>
                <h2 id="prefix-suffix">{{ t().prefixSuffixTitle }}</h2>
                <p [innerHTML]="t().prefixSuffixDesc"></p>
                <form [formGroup]="testForm" class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-input-text formControlName="val5" label="Weight" czInputNumber mode="decimal" suffix=" kg"></cz-input-text>
                    <cz-input-text formControlName="val6" label="Temperature" czInputNumber mode="decimal" suffix=" °C" [maxFractionDigits]="1"></cz-input-text>
                    <div class="cz-text-sm cz-text-muted cz-font-mono">
                        Weight: {{ testForm.get('val5')?.value }}, Temp: {{ testForm.get('val6')?.value }}
                    </div>
                </form>
                <app-code [code]="prefixSuffixCode" />
            </section>

            <!-- ── CONSTRAINTS ── -->
            <section>
                <h2 id="constraints">{{ t().constraintsTitle }}</h2>
                <p [innerHTML]="t().constraintsDesc"></p>
                <form [formGroup]="testForm" class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-input-text 
                        formControlName="val7" 
                        label="Percentage (0 - 100)" 
                        helpText="Types > 100 will cap to 100 on blur blur."
                        czInputNumber 
                        mode="decimal" 
                        [min]="0" 
                        [max]="100" 
                        suffix=" %">
                    </cz-input-text>
                </form>
                <app-code [code]="constraintsCode" />
            </section>

            <!-- ── NATIVE INPUT ── -->
            <section>
                <h2 id="native">{{ t().nativeTitle }}</h2>
                <p [innerHTML]="t().nativeDesc"></p>
                <form [formGroup]="testForm" class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    <input type="text" formControlName="val8" czInputNumber mode="currency" currency="GBP" locale="en-GB" class="cz-w-full cz-p-3 border cz-rounded-md cz-bg-surface-hover cz-text-primary" placeholder="Enter Pounds (£)">
                    <div class="cz-text-sm cz-text-muted cz-font-mono">
                        Native Value: {{ testForm.get('val8')?.value }}
                    </div>
                </form>
                <app-code [code]="nativeCode" />
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().apiTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr>
                                <th>{{ t().table.prop }}</th>
                                <th>{{ t().table.type }}</th>
                                <th>{{ t().table.default }}</th>
                                <th>{{ t().table.desc }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>mode</td>
                                <td><code class="cz-badge cz-badge-primary">'decimal' | 'currency'</code></td>
                                <td><code class="cz-badge cz-badge-primary">'decimal'</code></td>
                                <td>Formatting style algorithms from Intl.</td>
                            </tr>
                            <tr>
                                <td>currency</td>
                                <td><code class="cz-badge cz-badge-primary">string</code></td>
                                <td><code class="cz-badge cz-badge-primary">'USD'</code></td>
                                <td>The currency to use in currency formatting. Possible values are the ISO 4217 currency codes.</td>
                            </tr>
                            <tr>
                                <td>locale</td>
                                <td><code class="cz-badge cz-badge-primary">string</code></td>
                                <td><code class="cz-badge cz-badge-primary">'en-US'</code></td>
                                <td>Locale to be used in formatting. Usually matches browser or application standard.</td>
                            </tr>
                            <tr>
                                <td>useGrouping</td>
                                <td><code class="cz-badge cz-badge-primary">boolean</code></td>
                                <td><code class="cz-badge cz-badge-primary">true</code></td>
                                <td>Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators.</td>
                            </tr>
                            <tr>
                                <td>minFractionDigits</td>
                                <td><code class="cz-badge cz-badge-primary">number</code></td>
                                <td><code class="cz-badge cz-badge-primary">0</code></td>
                                <td>The minimum number of fraction digits to use.</td>
                            </tr>
                            <tr>
                                <td>maxFractionDigits</td>
                                <td><code class="cz-badge cz-badge-primary">number</code></td>
                                <td><code class="cz-badge cz-badge-primary">2</code></td>
                                <td>The maximum number of fraction digits to use.</td>
                            </tr>
                            <tr>
                                <td>prefix</td>
                                <td><code class="cz-badge cz-badge-primary">string</code></td>
                                <td><code class="cz-badge cz-badge-primary">''</code></td>
                                <td>Text to display before the value (Decimal mode only).</td>
                            </tr>
                            <tr>
                                <td>suffix</td>
                                <td><code class="cz-badge cz-badge-primary">string</code></td>
                                <td><code class="cz-badge cz-badge-primary">''</code></td>
                                <td>Text to display after the value (Decimal mode only).</td>
                            </tr>
                            <tr>
                                <td>min</td>
                                <td><code class="cz-badge cz-badge-primary">number</code></td>
                                <td><code class="cz-badge cz-badge-primary">undefined</code></td>
                                <td>Mininum boundary value. Re-calculates on blur events.</td>
                            </tr>
                            <tr>
                                <td>max</td>
                                <td><code class="cz-badge cz-badge-primary">number</code></td>
                                <td><code class="cz-badge cz-badge-primary">undefined</code></td>
                                <td>Maximum boundary value. Re-calculates on blur events.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    `
})
export class InputNumberDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => INPUT_NUMBER_DOC_I18N[this.lang.currentLang() as keyof typeof INPUT_NUMBER_DOC_I18N]);

    testForm = new FormGroup({
        val1: new FormControl(1250),
        val2: new FormControl(250000.5),
        val3: new FormControl(250000.5),
        val4: new FormControl(250000),
        val5: new FormControl(75.5),
        val6: new FormControl(36.1),
        val7: new FormControl(85),
        val8: new FormControl(999.99),
    });

    typeOf(val: any) {
        return typeof val;
    }

    importCode: Code = {
        typescript: "import { CzInputNumberDirective } from 'codezium-ui';"
    };

    numeralsCode: Code = {
        html: `<!-- Number Input wrapped in CzInputTextComponent -->
<cz-input-text 
    formControlName="val1" 
    label="Quantity" 
    czInputNumber 
    mode="decimal" 
    [minFractionDigits]="2">
</cz-input-text>`
    };

    currencyCode: Code = {
        html: `<!-- Intl Formatting applies correct symbols safely depending on Locale -->
<cz-input-text formControlName="val2" label="US Dollar ($)" czInputNumber mode="currency" currency="USD" locale="en"></cz-input-text>
<cz-input-text formControlName="val3" label="Euro (€)" czInputNumber mode="currency" currency="EUR" locale="de"></cz-input-text>
<cz-input-text formControlName="val4" label="Japanese Yen (¥)" czInputNumber mode="currency" currency="JPY" locale="es" [minFractionDigits]="0"></cz-input-text>`
    };

    prefixSuffixCode: Code = {
        html: `<!-- Static prefixes and suffixes in visual strings without breaking reactive form integers -->
<cz-input-text formControlName="val5" label="Weight" czInputNumber mode="decimal" suffix=" kg"></cz-input-text>
<cz-input-text formControlName="val6" label="Temperature" czInputNumber mode="decimal" suffix=" °C" [maxFractionDigits]="1"></cz-input-text>`
    };

    constraintsCode: Code = {
        html: `<!-- Limits to 100 onBlur automatically -->
<cz-input-text formControlName="val7" label="Percentage" czInputNumber mode="decimal" [min]="0" [max]="100" suffix=" %"></cz-input-text>`
    };

    nativeCode: Code = {
        html: `<!-- Fully compatible bypassing UI wrappers -->
<input type="text" formControlName="val8" czInputNumber mode="currency" currency="GBP" locale="en-GB">`
    };
}
