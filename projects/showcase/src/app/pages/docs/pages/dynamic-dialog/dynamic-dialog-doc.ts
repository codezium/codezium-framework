import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import {
    CzButtonComponent,
    CzDynamicDialogRef,
    CzDynamicDialogService,
} from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { DYNAMIC_DIALOG_DOC_I18N } from './dynamic-dialog-doc.i18n';

@Component({
    selector: 'cz-dynamic-demo-content',
    imports: [CzButtonComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p>Hello {{ data() }}! This component was opened dynamically.</p>
        <div class="cz-flex cz-justify-end cz-mt-md">
            <cz-button label="Close" (onClick)="close()" />
        </div>
    `,
})
export class DynamicDemoContentComponent {
    data = input<string>('guest');
    ref = input<CzDynamicDialogRef | null>(null);

    close(): void {
        this.ref()?.close('closed from content');
    }
}

@Component({
    selector: 'cz-dynamic-dialog-doc-page',
    imports: [CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="dynamic-dialog">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Open dynamic dialog" (onClick)="open()" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="data">{{ t().data }}</h2>
                <p [innerHTML]="t().dataDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-button label="Open with data" severity="success" (onClick)="openWithData()" />
                    <span class="cz-text-sm">Result: {{ result() || '-' }}</span>
                </div>
                <app-code [code]="dataCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>API</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>cz-dynamic-dialog</code></td><td><code>component</code></td><td>Renders the active dynamic dialog.</td></tr>
                            <tr><td><code>open(component, config?)</code></td><td><code>service</code></td><td>Opens the dialog, returns a ref.</td></tr>
                            <tr><td><code>ref.close(result?)</code></td><td><code>ref</code></td><td>Closes the dialog.</td></tr>
                            <tr><td><code>service.onClose(id, cb)</code></td><td><code>service</code></td><td>Receives the close result.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class DynamicDialogDocPage {
    private readonly lang = inject(LanguageService);
    private readonly dialogs = inject(CzDynamicDialogService);

    readonly t = computed(() => DYNAMIC_DIALOG_DOC_I18N[this.lang.currentLang()] || DYNAMIC_DIALOG_DOC_I18N.es);
    readonly result = signal('');

    open(): void {
        const ref = this.dialogs.open(DynamicDemoContentComponent, { header: 'Dynamic dialog' });
        this.dialogs.onClose(ref.id, (result) => this.result.set(String(result ?? 'closed')));
    }

    openWithData(): void {
        const ref = this.dialogs.open(DynamicDemoContentComponent, {
            header: 'With data',
            data: 'Codezium',
        });
        this.dialogs.onClose(ref.id, (result) => this.result.set(String(result ?? 'closed')));
    }

    importCode: Code = {
        typescript: `import { CzDynamicDialogComponent, CzDynamicDialogService } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<!-- Once in the app root -->
<cz-dynamic-dialog />`,
        typescript: `private dialogs = inject(CzDynamicDialogService);

open() {
    this.dialogs.open(MyContentComponent, { header: 'Dynamic dialog' });
}`,
    };

    dataCode: Code = {
        typescript: `// The content component declares a \`data\` input
export class MyContentComponent {
    data = input<string>('');
}

// Open and receive the close result
const ref = this.dialogs.open(MyContentComponent, { data: 'Codezium' });
this.dialogs.onClose(ref.id, (result) => console.log(result));`,
    };
}
