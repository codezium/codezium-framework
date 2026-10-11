import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzButtonComponent, CzFocusTrapDirective, CzInputTextComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { FOCUS_TRAP_DOC_I18N } from './focus-trap-doc.i18n';

@Component({
    selector: 'cz-focus-trap-doc-page',
    imports: [CzFocusTrapDirective, CzButtonComponent, CzInputTextComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="focus-trap">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <div class="cz-p-lg cz-border cz-rounded-lg" [czFocusTrap]="true">
                        <div class="cz-flex cz-flex-col cz-gap-md">
                            <cz-input-text label="Name" labelPosition="float" />
                            <div class="cz-flex cz-gap-sm">
                                <cz-button label="Cancel" variant="text" severity="secondary" />
                                <cz-button label="Confirm" />
                            </div>
                        </div>
                    </div>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button [label]="enabled() ? 'Disable trap' : 'Enable trap'" severity="secondary" (onClick)="toggle()" />
                </div>
                <div class="cz-mb-md">
                    <div class="cz-p-lg cz-border cz-rounded-lg" [czFocusTrap]="enabled()">
                        <div class="cz-flex cz-gap-sm">
                            <cz-button label="First" />
                            <cz-button label="Second" />
                        </div>
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
                            <tr><td><code>czFocusTrap</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether the trap is active.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class FocusTrapDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => FOCUS_TRAP_DOC_I18N[this.lang.currentLang()] || FOCUS_TRAP_DOC_I18N.es);

    readonly enabled = signal(true);

    toggle(): void {
        this.enabled.update((v) => !v);
    }

    importCode: Code = {
        typescript: `import { CzFocusTrapDirective } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<div czFocusTrap>
    <cz-input-text label="Name" labelPosition="float" />
    <cz-button label="Cancel" variant="text" />
    <cz-button label="Confirm" />
</div>`,
    };

    optionsCode: Code = {
        html: `<div [czFocusTrap]="enabled()">
    <cz-button label="First" />
    <cz-button label="Second" />
</div>`,
        typescript: `enabled = signal(true);`,
    };
}
