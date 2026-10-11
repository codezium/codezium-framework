import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzToggleSwitchComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TOGGLE_SWITCH_DOC_I18N } from './toggle-switch-doc.i18n';

@Component({
    selector: 'cz-toggle-switch-doc-page',
    imports: [CzToggleSwitchComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="toggle-switch">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-toggle-switch [(ngModel)]="value" ariaLabel="Basic switch" />
                    <span class="cz-text-sm">Value: {{ value() }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-toggle-switch label="Small" size="sm" [(ngModel)]="value" />
                    <cz-toggle-switch label="Medium" size="md" [(ngModel)]="value" />
                    <cz-toggle-switch label="Large" size="lg" [(ngModel)]="value" />
                </div>
                <app-code [code]="optionsCode" />
            </section>

            <section>
                <h2 id="states">{{ t().states }}</h2>
                <p [innerHTML]="t().statesDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-toggle-switch label="Disabled" [disabled]="true" [ngModel]="true" />
                    <cz-toggle-switch label="Readonly" [readonly]="true" [ngModel]="true" />
                    <cz-toggle-switch label="On/Off mapping" [trueValue]="'on'" [falseValue]="'off'" [(ngModel)]="mapped" />
                    <span class="cz-text-sm">Mapped value: {{ mapped() }}</span>
                </div>
                <app-code [code]="statesCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Label next to the switch.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Switch size.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Readonly state.</td></tr>
                            <tr><td><code>trueValue</code></td><td><code>any</code></td><td><code>true</code></td><td>Value when checked.</td></tr>
                            <tr><td><code>falseValue</code></td><td><code>any</code></td><td><code>false</code></td><td>Value when unchecked.</td></tr>
                            <tr><td><code>onChange</code></td><td><code>output&lt;any&gt;</code></td><td>-</td><td>Emitted on change.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ToggleSwitchDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TOGGLE_SWITCH_DOC_I18N[this.lang.currentLang()] || TOGGLE_SWITCH_DOC_I18N.es);

    readonly value = signal(true);
    readonly mapped = signal<'on' | 'off'>('off');

    importCode: Code = {
        typescript: `import { CzToggleSwitchComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-toggle-switch [(ngModel)]="value" ariaLabel="Basic switch" />`,
        typescript: `value = signal(true);`,
    };

    optionsCode: Code = {
        html: `<cz-toggle-switch label="Small" size="sm" [(ngModel)]="value" />
<cz-toggle-switch label="Medium" size="md" [(ngModel)]="value" />
<cz-toggle-switch label="Large" size="lg" [(ngModel)]="value" />`,
    };

    statesCode: Code = {
        html: `<cz-toggle-switch label="Disabled" [disabled]="true" [ngModel]="true" />
<cz-toggle-switch label="Readonly" [readonly]="true" [ngModel]="true" />
<cz-toggle-switch label="On/Off mapping" [trueValue]="'on'" [falseValue]="'off'" [(ngModel)]="mapped" />`,
    };
}
