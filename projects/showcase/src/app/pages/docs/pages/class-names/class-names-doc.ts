import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzButtonComponent, CzClassNamesDirective } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { CLASS_NAMES_DOC_I18N } from './class-names-doc.i18n';

@Component({
    selector: 'cz-class-names-doc-page',
    imports: [CzClassNamesDirective, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="class-names">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <div class="cz-p-md cz-border cz-rounded-lg" [czClassNames]="'cz-bg-primary-50'">
                        String: always cz-bg-primary-50
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg" [czClassNames]="['cz-bg-success-50', { 'cz-text-success': true }]">
                        Array: static + conditional
                    </div>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-gap-md cz-items-center cz-mb-md">
                    <cz-button label="Toggle active" (onClick)="toggle()" />
                    <div class="cz-p-md cz-border cz-rounded-lg" [czClassNames]="{ 'cz-bg-warning-50': active(), 'cz-border-warning': active() }">
                        Conditional record: {{ active() ? 'active' : 'inactive' }}
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
                            <tr><td><code>czClassNames</code></td><td><code>string | string[] | Record&lt;string, boolean&gt; | null</code></td><td><code>null</code></td><td>Classes to apply.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ClassNamesDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => CLASS_NAMES_DOC_I18N[this.lang.currentLang()] || CLASS_NAMES_DOC_I18N.es);

    readonly active = signal(true);

    toggle(): void {
        this.active.update((v) => !v);
    }

    importCode: Code = {
        typescript: `import { CzClassNamesDirective } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<div [czClassNames]="'cz-bg-primary-50'">String</div>
<div [czClassNames]="['cz-bg-success-50', { 'cz-text-success': true }]">Array</div>`,
    };

    optionsCode: Code = {
        html: `<div [czClassNames]="{ 'cz-bg-warning-50': active(), 'cz-border-warning': active() }">
    Conditional record
</div>`,
        typescript: `active = signal(true);`,
    };
}
