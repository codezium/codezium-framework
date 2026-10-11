import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzBlockUiComponent, CzButtonComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { BLOCK_UI_DOC_I18N } from './block-ui-doc.i18n';

@Component({
    selector: 'cz-block-ui-doc-page',
    imports: [CzBlockUiComponent, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="block-ui">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md">
                    <cz-block-ui [(blocked)]="blocked" message="Saving changes...">
                        <div class="cz-p-lg cz-border cz-rounded-lg">
                            <p>This panel gets blocked while saving.</p>
                            <cz-button label="Save" (onClick)="block()" />
                        </div>
                    </cz-block-ui>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-block-ui [blocked]="true" message="Loading without spinner" [showSpinner]="false">
                        <div class="cz-p-lg cz-border cz-rounded-lg">
                            <p>Overlay without spinner.</p>
                        </div>
                    </cz-block-ui>
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
                            <tr><td><code>blocked</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Blocked state (two-way).</td></tr>
                            <tr><td><code>message</code></td><td><code>string</code></td><td><code>''</code></td><td>Message under the spinner.</td></tr>
                            <tr><td><code>showSpinner</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows the spinner.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class BlockUiDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => BLOCK_UI_DOC_I18N[this.lang.currentLang()] || BLOCK_UI_DOC_I18N.es);

    readonly blocked = signal(false);

    block(): void {
        this.blocked.set(true);
        setTimeout(() => this.blocked.set(false), 1500);
    }

    importCode: Code = {
        typescript: `import { CzBlockUiComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-block-ui [(blocked)]="blocked" message="Saving changes...">
    <p>This panel gets blocked while saving.</p>
    <cz-button label="Save" (onClick)="block()" />
</cz-block-ui>`,
        typescript: `blocked = signal(false);

block() {
    this.blocked.set(true);
    setTimeout(() => this.blocked.set(false), 1500);
}`,
    };

    optionsCode: Code = {
        html: `<cz-block-ui [blocked]="true" message="Loading..." [showSpinner]="false">
    <p>Overlay without spinner.</p>
</cz-block-ui>`,
    };
}
