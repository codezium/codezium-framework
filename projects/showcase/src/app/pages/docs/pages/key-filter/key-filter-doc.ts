import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../core/services/language.service';
import { AppCodeComponent } from '../../../../shared/code-block/code-block.component';
import { CzInputTextComponent, CzKeyFilterDirective } from 'codezium-ui';
import { keyFilterDocI18n } from './key-filter-doc.i18n';

@Component({
    selector: 'app-key-filter-doc',
    standalone: true,
    imports: [
        CommonModule,
        AppCodeComponent,
        CzInputTextComponent,
        CzKeyFilterDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="input-text">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().description }}</p>

            <!-- ── IMPORT ── -->
            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── PRESETS ── -->
            <section>
                <h2 id="presets">{{ t().presetsTitle }}</h2>
                <p class="cz-doc-page__text">{{ t().presetsDesc }}</p>
                
                <div class="cz-doc-demo">
                    <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-3 cz-gap-md cz-p-md cz-border cz-border-surface-hover cz-rounded-lg">
                        <div class="cz-flex cz-flex-col cz-gap-xs">
                            <label class="cz-text-sm cz-font-medium">Integer</label>
                            <input type="text" czKeyFilter="integer" class="cz-input" placeholder="Only integers" />
                        </div>
                        <div class="cz-flex cz-flex-col cz-gap-xs">
                            <label class="cz-text-sm cz-font-medium">Number</label>
                            <input type="text" czKeyFilter="number" class="cz-input" placeholder="Numbers and decimal" />
                        </div>
                        <div class="cz-flex cz-flex-col cz-gap-xs">
                            <label class="cz-text-sm cz-font-medium">Money</label>
                            <input type="text" czKeyFilter="money" class="cz-input" placeholder="Money format" />
                        </div>
                        <div class="cz-flex cz-flex-col cz-gap-xs">
                            <label class="cz-text-sm cz-font-medium">Hex</label>
                            <input type="text" czKeyFilter="hex" class="cz-input" placeholder="Hex chars (0-9, A-F)" />
                        </div>
                        <div class="cz-flex cz-flex-col cz-gap-xs">
                            <label class="cz-text-sm cz-font-medium">Alpha</label>
                            <input type="text" czKeyFilter="alpha" class="cz-input" placeholder="Alphabetic only" />
                        </div>
                        <div class="cz-flex cz-flex-col cz-gap-xs">
                            <label class="cz-text-sm cz-font-medium">Alphanum</label>
                            <input type="text" czKeyFilter="alphanum" class="cz-input" placeholder="Alphanumeric only" />
                        </div>
                    </div>
                </div>
                <app-code [code]="presetsCode" selector="<input>" />
            </section>

            <!-- ── INTEGRATION ── -->
            <section>
                <h2 id="integration">{{ t().integrationTitle }}</h2>
                <p class="cz-doc-page__text">{{ t().integrationDesc }}</p>

                <div class="cz-doc-demo">
                    <div class="cz-flex cz-flex-col cz-gap-md cz-p-md cz-border cz-border-surface-hover cz-rounded-lg">
                        <cz-input-text czKeyFilter="alpha" label="First Name" placeholder="Alpha characters only" />
                        <cz-input-text czKeyFilter="alphanum" label="Username" placeholder="Alphanumeric string" />
                    </div>
                </div>
                <app-code [code]="integrationCode" selector="<cz-input-text>" />
            </section>

            <!-- ── CUSTOM REGEX ── -->
            <section>
                <h2 id="custom">{{ t().customTitle }}</h2>
                <p class="cz-doc-page__text">{{ t().customDesc }}</p>

                <div class="cz-doc-demo">
                    <div class="cz-p-md cz-border cz-border-surface-hover cz-rounded-lg">
                        <cz-input-text [czKeyFilter]="upperRegex" label="Product Key" placeholder="A-Z uppercase only" />
                    </div>
                </div>
                <app-code [code]="customCode" selector="<cz-input-text>" />
            </section>

            <!-- ── API REFERENCE ── -->
            <section>
                <h2 id="api">{{ t().apiTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr>
                                <th>{{ t().table.name }}</th>
                                <th>{{ t().table.type }}</th>
                                <th>{{ t().table.default }}</th>
                                <th>{{ t().table.description }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="cz-badge cz-badge-primary">czKeyFilter</span></td>
                                <td><code>CzKeyFilterPreset | RegExp</code></td>
                                <td><code>'alphanum'</code></td>
                                <td>{{ t().props.czKeyFilter }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
    styles: [`
        .cz-input {
            width: 100%;
            padding: var(--cz-spacing-sm, 0.5rem) var(--cz-spacing-md, 0.75rem);
            border: 1px solid var(--cz-theme-border-color, #d1d5db);
            border-radius: var(--cz-radius-base, 8px);
            background: var(--cz-theme-surface, #ffffff);
            color: var(--cz-theme-text-primary, #1f2937);
            outline: none;
            transition: border-color var(--cz-transition-base, 0.2s);
        }
        .cz-input:focus {
            border-color: var(--cz-color-primary, #3b82f6);
        }
    `]
})
export default class KeyFilterDocComponent {
    private readonly langService = inject(LanguageService);
    readonly t = computed(() => keyFilterDocI18n[this.langService.currentLang()] || keyFilterDocI18n['en']);

    readonly upperRegex = /^[A-Z]+$/;

    importCode = {
        typescript: `import { CzKeyFilterDirective } from 'codezium-ui';

@Component({
    imports: [CzKeyFilterDirective]
})
export class MyComponent {}`
    };

    presetsCode = {
        html: `<div class="cz-flex cz-flex-col cz-gap-md">
    <input type="text" czKeyFilter="integer" placeholder="Only integers" />
    <input type="text" czKeyFilter="number" placeholder="Numbers and decimal" />
    <input type="text" czKeyFilter="money" placeholder="Money format" />
    <input type="text" czKeyFilter="hex" placeholder="Hex chars (0-9, A-F)" />
    <input type="text" czKeyFilter="alpha" placeholder="Alphabetic only" />
    <input type="text" czKeyFilter="alphanum" placeholder="Alphanumeric only" />
</div>`
    };

    integrationCode = {
        html: `<cz-input-text czKeyFilter="alpha" label="First Name" />
<cz-input-text czKeyFilter="alphanum" label="Username" />`
    };

    customCode = {
        typescript: `import { Component } from '@angular/core';

@Component({
    templateUrl: './my-component.html'
})
export class MyComponent {
    // Only allow A-Z uppercase letters
    upperRegex = /^[A-Z]+$/;
}`,
        html: `<cz-input-text 
    [czKeyFilter]="upperRegex" 
    label="Product Key" 
    placeholder="A-Z uppercase only"
/>`
    };
}
