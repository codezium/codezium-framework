import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import {
    CzButtonComponent,
    CzDynamicDialogRef,
    CzDynamicDialogService,
} from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { DYNAMIC_DIALOG_SERVICE_DOC_I18N } from './dynamic-dialog-service-doc.i18n';

@Component({
    selector: 'cz-dynamic-service-demo-content',
    imports: [CzButtonComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p>Hello {{ data() }}! This component was opened through the service.</p>
        <div class="cz-flex cz-justify-end cz-mt-md">
            <cz-button label="Close" (onClick)="close()" />
        </div>
    `,
})
export class DynamicServiceDemoContentComponent {
    data = input<string>('guest');
    ref = input<CzDynamicDialogRef | null>(null);

    close(): void {
        this.ref()?.close('closed from content');
    }
}

@Component({
    selector: 'cz-dynamic-dialog-service-doc-page',
    imports: [CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="dynamic-dialog-service">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="usage">{{ t().usageTitle }}</h2>
                <p [innerHTML]="t().usageDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Open dynamic dialog" (onClick)="open()" />
                </div>
                <app-code [code]="usageCode" />
            </section>

            <section>
                <h2 id="result">{{ t().resultTitle }}</h2>
                <p [innerHTML]="t().resultDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-button label="Open and read result" severity="success" (onClick)="openWithResult()" />
                    <span class="cz-text-sm">Result: {{ result() || '-' }}</span>
                </div>
                <app-code [code]="resultCode" />
            </section>

            <section>
                <h2 id="methods">{{ t().methodsTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Method</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>open(component, config?)</code></td><td><code>(Type, CzDynamicDialogConfig?) → CzDynamicDialogRef</code></td><td>Opens a dialog rendering the given component.</td></tr>
                            <tr><td><code>close(id, result?)</code></td><td><code>(number, unknown?) → void</code></td><td>Closes the dialog with an optional result.</td></tr>
                            <tr><td><code>onClose(id, callback)</code></td><td><code>(number, (result) =&gt; void) → void</code></td><td>Registers a callback executed when the dialog closes.</td></tr>
                            <tr><td><code>ref.id</code></td><td><code>number</code></td><td>Identifier of the opened dialog.</td></tr>
                            <tr><td><code>ref.close(result?)</code></td><td><code>(unknown?) → void</code></td><td>Convenience close from the dynamic component.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 id="options">{{ t().configTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>header</code></td><td><code>string</code></td><td><code>''</code></td><td>Dialog title.</td></tr>
                            <tr><td><code>width</code></td><td><code>string</code></td><td><code>auto</code></td><td>Dialog width (any CSS value).</td></tr>
                            <tr><td><code>data</code></td><td><code>T</code></td><td><code>undefined</code></td><td>Data injected into the dynamic component <code>data</code> input.</td></tr>
                            <tr><td><code>closable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows the close button.</td></tr>
                            <tr><td><code>dismissableMask</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Closes on mask click.</td></tr>
                            <tr><td><code>closeOnEscape</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Closes when Escape is pressed.</td></tr>
                            <tr><td><code>draggable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Reposition by dragging the header.</td></tr>
                            <tr><td><code>resizable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Resize from the bottom-right corner.</td></tr>
                            <tr><td><code>maximizable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Full screen toggle.</td></tr>
                            <tr><td><code>breakpoints</code></td><td><code>Record&lt;string, string&gt; | null</code></td><td><code>null</code></td><td>Widths per breakpoint.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 id="host">{{ t().noteTitle }}</h2>
                <p [innerHTML]="t().noteDesc"></p>
                <app-code [code]="hostCode" />
            </section>
        </div>
    `,
})
export class DynamicDialogServiceDocPage {
    private readonly lang = inject(LanguageService);
    private readonly dynamicDialog = inject(CzDynamicDialogService);
    readonly t = computed(() => DYNAMIC_DIALOG_SERVICE_DOC_I18N[this.lang.currentLang()] || DYNAMIC_DIALOG_SERVICE_DOC_I18N.en);

    readonly result = signal<string | null>(null);

    open(): void {
        this.dynamicDialog.open(DynamicServiceDemoContentComponent, {
            header: 'Dynamic content',
            width: '28rem',
            data: 'Codezium',
        });
    }

    openWithResult(): void {
        const ref = this.dynamicDialog.open(DynamicServiceDemoContentComponent, {
            header: 'Dynamic content',
            width: '28rem',
            data: 'Codezium',
        });
        this.dynamicDialog.onClose(ref.id, value => this.result.set(String(value ?? '')));
    }

    importCode: Code = {
        typescript: `import { CzDynamicDialogService } from 'codezium-ui';`,
    };

    usageCode: Code = {
        typescript: `private readonly dynamicDialog = inject(CzDynamicDialogService);

this.dynamicDialog.open(MyContentComponent, {
    header: 'Dynamic content',
    width: '28rem',
    data: { id: 42 },
});`,
    };

    resultCode: Code = {
        typescript: `const ref = this.dynamicDialog.open(MyContentComponent, { data: 'Codezium' });

this.dynamicDialog.onClose(ref.id, (result) => {
    console.log('Dialog closed with', result);
});

// Inside the dynamic component
ref = input<CzDynamicDialogRef | null>(null);
this.ref()?.close('done');`,
    };

    hostCode: Code = {
        html: `<!-- Once, at the application root -->
<cz-dynamic-dialog />`,
    };
}
