import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzFileUploadComponent, CzFileUploadSelectEvent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { FILE_UPLOAD_DOC_I18N } from './file-upload-doc.i18n';

@Component({
    selector: 'cz-file-upload-doc-page',
    imports: [CzFileUploadComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="file-upload">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-file-upload (onSelect)="selected.set($event)" />
                    <span class="cz-text-sm">Selected: {{ names() || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-file-upload
                        [multiple]="true"
                        accept="image/*"
                        [maxFileSize]="2 * 1024 * 1024"
                        (onSelect)="selected.set($event)"
                    />
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
                            <tr><td><code>multiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Allows multiple files.</td></tr>
                            <tr><td><code>accept</code></td><td><code>string</code></td><td><code>''</code></td><td>Accepted types (native accept).</td></tr>
                            <tr><td><code>maxFileSize</code></td><td><code>number</code></td><td><code>0</code></td><td>Max size per file in bytes (0 = unlimited).</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>onSelect</code></td><td><code>output&lt;CzFileUploadSelectEvent&gt;</code></td><td>-</td><td>Emitted with the selected files.</td></tr>
                            <tr><td><code>onRemove</code></td><td><code>output&lt;File&gt;</code></td><td>-</td><td>Emitted when a file is removed.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class FileUploadDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => FILE_UPLOAD_DOC_I18N[this.lang.currentLang()] || FILE_UPLOAD_DOC_I18N.es);

    readonly selected = signal<CzFileUploadSelectEvent | null>(null);
    readonly names = computed(() => this.selected()?.files.map((f) => f.name).join(', ') ?? '');

    importCode: Code = {
        typescript: `import { CzFileUploadComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-file-upload (onSelect)="onSelect($event)" />`,
        typescript: `onSelect(event: CzFileUploadSelectEvent) {
    console.log(event.files);
}`,
    };

    optionsCode: Code = {
        html: `<cz-file-upload
    [multiple]="true"
    accept="image/*"
    [maxFileSize]="2 * 1024 * 1024"
    (onSelect)="onSelect($event)"
/>`,
    };
}
