import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzInplaceComponent, CzInputTextComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { INPLACE_DOC_I18N } from './inplace-doc.i18n';

@Component({
    selector: 'cz-inplace-doc-page',
    imports: [CzInplaceComponent, CzInputTextComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="inplace">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    <cz-inplace [display]="name()" (onSave)="lastAction.set('saved')" (onCancel)="lastAction.set('cancelled')">
                        <cz-input-text label="Name" labelPosition="float" [ngModel]="draft()" (ngModelChange)="draft.set($event)" />
                    </cz-inplace>
                    <span class="cz-text-sm">Last action: {{ lastAction() || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    <cz-inplace [display]="name()" [(active)]="controlled">
                        <cz-input-text label="Controlled" labelPosition="float" />
                    </cz-inplace>
                    <span class="cz-text-sm">Active: {{ controlled() }}</span>
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
                            <tr><td><code>display</code></td><td><code>string</code></td><td><code>''</code></td><td>Text shown in view mode.</td></tr>
                            <tr><td><code>active</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Edit mode (two-way).</td></tr>
                            <tr><td><code>saveLabel</code> / <code>cancelLabel</code></td><td><code>string</code></td><td><code>'Save' / 'Cancel'</code></td><td>Button labels.</td></tr>
                            <tr><td><code>onSave</code> / <code>onCancel</code></td><td><code>output&lt;void&gt;</code></td><td>-</td><td>Action events.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class InplaceDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => INPLACE_DOC_I18N[this.lang.currentLang()] || INPLACE_DOC_I18N.es);

    readonly name = signal('Mike Tascon');
    readonly draft = signal('Mike Tascon');
    readonly lastAction = signal('');
    readonly controlled = signal(false);

    importCode: Code = {
        typescript: `import { CzInplaceComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-inplace [display]="name()" (onSave)="save()" (onCancel)="cancel()">
    <cz-input-text label="Name" labelPosition="float" [(ngModel)]="draft" />
</cz-inplace>`,
        typescript: `name = signal('Mike Tascon');
draft = signal('Mike Tascon');`,
    };

    optionsCode: Code = {
        html: `<cz-inplace [display]="name()" [(active)]="controlled">
    <cz-input-text label="Controlled" labelPosition="float" />
</cz-inplace>`,
        typescript: `controlled = signal(false);`,
    };
}
