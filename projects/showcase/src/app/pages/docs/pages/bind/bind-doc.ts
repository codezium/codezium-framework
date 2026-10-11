import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzBindDirective, CzButtonComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { BIND_DOC_I18N } from './bind-doc.i18n';

@Component({
    selector: 'cz-bind-doc-page',
    imports: [CzBindDirective, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="bind">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-gap-md cz-items-center cz-mb-md">
                    <button class="cz-btn cz-btn--primary" [czBind]="record()">Bound button</button>
                    <span class="cz-text-sm">aria-label: {{ record()?.['aria-label'] }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-gap-md cz-items-center cz-mb-md">
                    <cz-button label="Toggle binding" severity="secondary" (onClick)="toggle()" />
                    <button class="cz-btn cz-btn--dark" [czBind]="dynamic()">Dynamic</button>
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
                            <tr><td><code>czBind</code></td><td><code>Record&lt;string, unknown&gt; | null</code></td><td><code>null</code></td><td>Attributes to apply.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class BindDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => BIND_DOC_I18N[this.lang.currentLang()] || BIND_DOC_I18N.es);

    readonly record = signal<Record<string, unknown>>({
        'aria-label': 'Save changes',
        'data-role': 'primary',
    });

    readonly dynamic = signal<Record<string, unknown>>({ 'data-state': 'on' });

    toggle(): void {
        this.dynamic.update((record) =>
            record['data-state'] === 'on' ? { 'data-state': 'off', disabled: true } : { 'data-state': 'on' },
        );
    }

    importCode: Code = {
        typescript: `import { CzBindDirective } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<button [czBind]="record()">Bound button</button>`,
        typescript: `record = signal({
    'aria-label': 'Save changes',
    'data-role': 'primary',
});`,
    };

    optionsCode: Code = {
        html: `<button [czBind]="dynamic()">Dynamic</button>`,
        typescript: `toggle() {
    this.dynamic.update(record =>
        record['data-state'] === 'on'
            ? { 'data-state': 'off', disabled: true }
            : { 'data-state': 'on' },
    );
}`,
    };
}
