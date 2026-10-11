import { ChangeDetectionStrategy, Component, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import {
    CzButtonComponent,
    CzFileUploadComponent,
    CzFileUploadHandlerEvent,
    CzIconComponent,
    CzInputGroupAddonComponent,
    CzInputGroupComponent,
    CzMessageComponent,
    CzToastService,
} from 'codezium-ui';
import {
    LucideCloudUpload,
    LucideFile,
    LucidePlus,
    LucideTag,
    LucideUpload,
    LucideX,
} from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { FILE_UPLOAD_DOC_I18N } from './file-upload-doc.i18n';

@Component({
    selector: 'cz-file-upload-doc-page',
    imports: [
        CzFileUploadComponent,
        CzButtonComponent,
        CzInputGroupComponent,
        CzInputGroupAddonComponent,
        CzMessageComponent,
        CzIconComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="file-upload">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── ADVANCED ── -->
            <section>
                <h2 id="advanced">{{ t().advanced }}</h2>
                <p [innerHTML]="t().advancedDesc"></p>
                <div class="cz-mb-md">
                    <cz-file-upload #advancedFu [multiple]="true" accept="image/*" [maxFileSize]="1000000"
                        [customUpload]="true" (uploadHandler)="simulateUpload($event, advancedFu, true)" />
                </div>
                <app-code [code]="advancedCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-items-center cz-gap-md">
                    <cz-file-upload #basicFu mode="basic" [chooseLabel]="t().chooseFile" [multiple]="true"
                        accept="image/*" [maxFileSize]="1000000" [customUpload]="true"
                        (uploadHandler)="simulateUpload($event, basicFu, false)" />
                    <cz-button [label]="t().upload" severity="secondary" (onClick)="basicFu.upload()" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── AUTO ── -->
            <section>
                <h2 id="auto">{{ t().auto }}</h2>
                <p [innerHTML]="t().autoDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-file-upload #autoFu mode="basic" [chooseLabel]="t().browse" accept="image/*"
                        [maxFileSize]="1000000" [customUpload]="true" [auto]="true"
                        (uploadHandler)="simulateUpload($event, autoFu, false)" />
                </div>
                <app-code [code]="autoCode" />
            </section>

            <!-- ── CUSTOM UPLOAD ── -->
            <section>
                <h2 id="custom-upload">{{ t().customUpload }}</h2>
                <p [innerHTML]="t().customUploadDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-col cz-items-center cz-gap-lg">
                    <cz-file-upload mode="basic" [chooseLabel]="t().browse" [customUpload]="true" [auto]="true"
                        (uploadHandler)="onCustomUpload($event)" />
                    @if (imageSrc()) {
                        <img [src]="imageSrc()" alt="preview" class="cz-rounded-md"
                            style="max-width: 16rem; filter: grayscale(100%);" />
                    }
                </div>
                <app-code [code]="customUploadCode" />
            </section>

            <!-- ── DROPZONE ── -->
            <section>
                <h2 id="dropzone">{{ t().dropzone }}</h2>
                <p [innerHTML]="t().dropzoneDesc"></p>
                <div class="cz-mb-md">
                    <cz-file-upload #dropzoneFu [multiple]="true" accept="image/*" [maxFileSize]="1000000"
                        [customUpload]="true" [showUploadButton]="false" [showCancelButton]="false"
                        [contentTemplate]="dzContent" [emptyTemplate]="dzEmpty"
                        (uploadHandler)="simulateUpload($event, dropzoneFu, false)">
                        <ng-template #dzContent let-files let-removeFileCallback="removeFileCallback" let-messages="messages">
                            @if (messages?.length) {
                                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                                    @for (msg of messages; track $index) {
                                        <cz-message [severity]="msg.severity" [text]="msg.summary + ' — ' + msg.detail" />
                                    }
                                </div>
                            }
                            @if (files.length) {
                                <div class="cz-flex cz-flex-col cz-gap-md">
                                    <div class="cz-flex cz-items-center cz-justify-between">
                                        <span class="cz-text-sm cz-text-muted">{{ files.length }} {{ t().filesSelected }}</span>
                                        <div class="cz-flex cz-items-center cz-gap-sm">
                                            <cz-button [label]="t().upload" size="sm" variant="text"
                                                (onClick)="dropzoneFu.upload()" />
                                            <cz-button [label]="t().clearAll" size="sm" variant="text" severity="danger"
                                                (onClick)="dropzoneFu.clear()" />
                                        </div>
                                    </div>
                                    <div class="cz-flex cz-flex-col cz-gap-sm">
                                        @for (file of files; track file.name + file.size; let i = $index) {
                                            <div class="cz-flex cz-items-center cz-justify-between cz-p-sm cz-rounded-md"
                                                style="background: var(--cz-theme-surface-hover);">
                                                <div class="cz-flex cz-items-center cz-gap-sm">
                                                    <cz-icon [icon]="CloudUploadIcon" [size]="16" />
                                                    <div class="cz-flex cz-flex-col">
                                                        <span class="cz-text-sm cz-font-medium">{{ file.name }}</span>
                                                        <span class="cz-text-xs cz-text-muted">{{ dropzoneFu.formatSize(file.size) }}</span>
                                                    </div>
                                                </div>
                                                <cz-button [icon]="XIcon" [iconOnly]="true" size="sm" variant="text"
                                                    severity="secondary" [ariaLabel]="t().clearAll"
                                                    (onClick)="removeFileCallback($event, i)" />
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                        </ng-template>
                        <ng-template #dzEmpty>
                            <div class="cz-flex cz-flex-col cz-items-center cz-gap-sm cz-py-lg" style="cursor: pointer;"
                                (click)="dropzoneFu.choose()">
                                <cz-icon [icon]="CloudUploadIcon" [size]="40" />
                                <strong>{{ t().dropFiles }}</strong>
                                <span class="cz-text-sm cz-text-muted">{{ t().orClickBrowse }}</span>
                            </div>
                        </ng-template>
                    </cz-file-upload>
                </div>
                <app-code [code]="dropzoneCode" />
            </section>

            <!-- ── IMAGE PREVIEW ── -->
            <section>
                <h2 id="image-preview">{{ t().imagePreview }}</h2>
                <p [innerHTML]="t().imagePreviewDesc"></p>
                <div class="cz-mb-md">
                    <cz-file-upload #imageFu [multiple]="true" accept="image/*" [maxFileSize]="1000000"
                        [customUpload]="true" [showUploadButton]="false" [showCancelButton]="false"
                        [headerTemplate]="ipHeader" [contentTemplate]="ipContent" [emptyTemplate]="ipEmpty"
                        (uploadHandler)="simulateUpload($event, imageFu, false)">
                        <ng-template #ipHeader let-files let-chooseCallback="chooseCallback" let-uploadCallback="uploadCallback">
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <cz-button [label]="t().addImages" severity="secondary" variant="outlined" [icon]="PlusIcon"
                                    (onClick)="chooseCallback()" />
                                @if (files?.length > 0) {
                                    <cz-button [label]="t().uploadAll" [icon]="UploadIcon" (onClick)="uploadCallback()" />
                                }
                            </div>
                        </ng-template>
                        <ng-template #ipContent let-files let-removeFileCallback="removeFileCallback">
                            @if (files?.length > 0) {
                                <div class="cz-grid cz-grid-cols-2 cz-md:grid-cols-4 cz-gap-md">
                                    @for (file of files; track file.name; let i = $index) {
                                        <div class="cz-rounded-md cz-border" style="overflow: hidden;">
                                            <img [src]="imageFu.objectUrl(file)" [alt]="file.name"
                                                style="width: 100%; height: 8rem; object-fit: cover; display: block;" />
                                            <div class="cz-p-sm cz-flex cz-items-center cz-justify-between">
                                                <span class="cz-text-xs" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                                    {{ file.name }}
                                                </span>
                                                <button type="button" class="cz-file-upload-remove"
                                                    [attr.aria-label]="t().clearAll" (click)="removeFileCallback($event, i)">
                                                    <cz-icon [icon]="XIcon" [size]="14" />
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </ng-template>
                        <ng-template #ipEmpty>
                            <div class="cz-text-center cz-py-xl cz-text-muted">{{ t().noImages }}</div>
                        </ng-template>
                    </cz-file-upload>
                </div>
                <app-code [code]="imagePreviewCode" />
            </section>

            <!-- ── INPUT GROUP ── -->
            <section>
                <h2 id="input-group">{{ t().inputGroup }}</h2>
                <p [innerHTML]="t().inputGroupDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-col cz-gap-md" style="max-width: 28rem;">
                    <cz-input-group>
                        <cz-input-group-addon>
                            <cz-file-upload mode="basic" accept="image/*" [maxFileSize]="1000000"
                                [chooseLabel]="inputLabel()" [showUploadButton]="false" [showCancelButton]="false"
                                (onSelect)="updateInputLabel($event)" />
                        </cz-input-group-addon>
                    </cz-input-group>
                    <cz-input-group>
                        <cz-input-group-addon>
                            <cz-file-upload mode="basic" accept="image/*" [maxFileSize]="1000000"
                                [chooseLabel]="t().browse" [showUploadButton]="false" [showCancelButton]="false" />
                        </cz-input-group-addon>
                        <cz-input-group-addon>
                            <cz-icon [icon]="CloudUploadIcon" [size]="16" />
                        </cz-input-group-addon>
                    </cz-input-group>
                    <cz-input-group>
                        <cz-input-group-addon>
                            <cz-icon [icon]="TagIcon" [size]="16" />
                        </cz-input-group-addon>
                        <input type="text" class="cz-w-full cz-p-sm cz-border cz-bg-surface cz-text-primary"
                            [placeholder]="t().inputGroup" />
                        <cz-input-group-addon>
                            <cz-file-upload mode="basic" accept="image/*" [maxFileSize]="1000000"
                                [chooseLabel]="t().browse" [showUploadButton]="false" [showCancelButton]="false" />
                        </cz-input-group-addon>
                    </cz-input-group>
                </div>
                <app-code [code]="inputGroupCode" />
            </section>

            <!-- ── PREVIEW ── -->
            <section>
                <h2 id="preview">{{ t().preview }}</h2>
                <p [innerHTML]="t().previewDesc"></p>
                <div class="cz-mb-md" style="max-width: 28rem;">
                    <cz-file-upload #previewFu [multiple]="true" [maxFileSize]="5000000" [customUpload]="true"
                        [showUploadButton]="false" [showCancelButton]="false" [contentTemplate]="pvContent"
                        (uploadHandler)="simulateUpload($event, previewFu, true)">
                        <ng-template #pvContent let-files let-uploadedFiles="uploadedFiles"
                            let-removeFileCallback="removeFileCallback"
                            let-removeUploadedFileCallback="removeUploadedFileCallback">
                            <div class="cz-flex cz-flex-col cz-items-center cz-gap-xs cz-p-lg cz-cursor-pointer"
                                style="border: 2px dashed var(--cz-theme-border-color); border-radius: var(--cz-radius-md);"
                                (click)="previewFu.choose()">
                                <cz-icon [icon]="CloudUploadIcon" [size]="32" />
                                <strong>{{ t().dropFiles }}</strong>
                                <span class="cz-text-xs cz-text-muted">{{ t().upTo5Mb }}</span>
                            </div>
                            @if (uploadedFiles?.length > 0 || files?.length > 0) {
                                <div class="cz-flex cz-flex-col cz-gap-sm cz-mt-md">
                                    @for (file of uploadedFiles; track file.name; let i = $index) {
                                        <div class="cz-flex cz-items-center cz-gap-sm cz-p-sm cz-rounded-md"
                                            style="background: var(--cz-theme-surface-hover);">
                                            <cz-icon [icon]="FileIcon" [size]="16" />
                                            <div class="cz-flex-1" style="min-width: 0;">
                                                <div class="cz-text-sm" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                                    {{ file.name }}
                                                </div>
                                                <div class="cz-text-xs">
                                                    <span class="cz-text-muted">{{ previewFu.formatSize(file.size) }}</span>
                                                    <span> · </span>
                                                    <span style="color: var(--cz-color-success);">{{ t().completed }}</span>
                                                </div>
                                            </div>
                                            <cz-button [icon]="XIcon" [iconOnly]="true" size="sm" variant="text"
                                                severity="secondary" [ariaLabel]="t().clearAll"
                                                (onClick)="removeUploadedFileCallback(i)" />
                                        </div>
                                    }
                                    @for (file of files; track file.name; let i = $index) {
                                        <div class="cz-flex cz-items-center cz-gap-sm cz-p-sm cz-rounded-md"
                                            style="background: var(--cz-theme-surface-hover);">
                                            <cz-icon [icon]="FileIcon" [size]="16" />
                                            <div class="cz-flex-1" style="min-width: 0;">
                                                <div class="cz-text-sm" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                                    {{ file.name }}
                                                </div>
                                                <div class="cz-text-xs">
                                                    <span class="cz-text-muted">{{ previewFu.formatSize(file.size) }}</span>
                                                    <span> · </span>
                                                    <span style="color: var(--cz-color-primary);">{{ t().pending }}</span>
                                                </div>
                                            </div>
                                            <cz-button [icon]="XIcon" [iconOnly]="true" size="sm" variant="text"
                                                severity="secondary" [ariaLabel]="t().clearAll"
                                                (onClick)="removeFileCallback($event, i)" />
                                        </div>
                                    }
                                </div>
                            }
                            @if (files?.length > 0) {
                                <div class="cz-mt-md">
                                    <cz-button [label]="uploadLabelFor(files.length)" (onClick)="previewFu.upload()" />
                                </div>
                            }
                        </ng-template>
                    </cz-file-upload>
                </div>
                <app-code [code]="previewCode" />
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <p [innerHTML]="t().accessibilityDesc"></p>
                <ul>
                    <li [innerHTML]="t().a11yList"></li>
                    <li [innerHTML]="t().a11yKeyboard"></li>
                </ul>
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>mode</code></td><td><code>'advanced' | 'basic'</code></td><td><code>'advanced'</code></td><td>UI mode: header + dropzone or choose button only.</td></tr>
                            <tr><td><code>name</code></td><td><code>string</code></td><td><code>''</code></td><td>Name of the request parameter to identify the files at the backend.</td></tr>
                            <tr><td><code>url</code></td><td><code>string</code></td><td><code>''</code></td><td>Remote url to upload the files.</td></tr>
                            <tr><td><code>method</code></td><td><code>'post' | 'put'</code></td><td><code>'post'</code></td><td>HTTP method used for the default upload.</td></tr>
                            <tr><td><code>multiple / accept / disabled</code></td><td><code>boolean / string / boolean</code></td><td><code>false / '' / false</code></td><td>Multiple selection, accepted types and disabled state.</td></tr>
                            <tr><td><code>auto</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Uploads automatically after selection.</td></tr>
                            <tr><td><code>withCredentials</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Cross-site requests using credentials.</td></tr>
                            <tr><td><code>maxFileSize</code></td><td><code>number</code></td><td><code>0</code></td><td>Maximum file size in bytes (0 = unlimited).</td></tr>
                            <tr><td><code>fileLimit</code></td><td><code>number | null</code></td><td><code>null</code></td><td>Maximum number of files.</td></tr>
                            <tr><td><code>customUpload</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Uses a custom implementation through <code>uploadHandler</code>.</td></tr>
                            <tr><td><code>filesInput</code></td><td><code>File[]</code></td><td><code>[]</code></td><td>Preset files.</td></tr>
                            <tr><td><code>previewWidth</code></td><td><code>number</code></td><td><code>50</code></td><td>Width of the image thumbnail in pixels.</td></tr>
                            <tr><td><code>chooseLabel / uploadLabel / cancelLabel</code></td><td><code>string</code></td><td><code>'Choose' / 'Upload' / 'Cancel'</code></td><td>Button labels.</td></tr>
                            <tr><td><code>chooseIcon / uploadIcon / cancelIcon</code></td><td><code>LucideIconInput</code></td><td><code>—</code></td><td>Button icons.</td></tr>
                            <tr><td><code>showUploadButton / showCancelButton</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether to show the header action buttons.</td></tr>
                            <tr><td><code>invalidFile*MessageSummary/Detail</code></td><td><code>string</code></td><td><code>—</code></td><td>Validation messages (<code>&#123;0&#125;</code> = file name or limit).</td></tr>
                            <tr><td><code>fileTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Per file row template (<code>$implicit</code> file, <code>index</code>, <code>removeCallback</code>).</td></tr>
                            <tr><td><code>headerTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Header template (<code>files</code>, <code>uploadedFiles</code>, <code>chooseCallback</code>, <code>uploadCallback</code>, <code>clearCallback</code>).</td></tr>
                            <tr><td><code>contentTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Content template (<code>files</code>, <code>uploadedFiles</code>, <code>messages</code>, remove/choose/upload callbacks).</td></tr>
                            <tr><td><code>toolbarTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Replaces the default header buttons.</td></tr>
                            <tr><td><code>emptyTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom empty state.</td></tr>
                            <tr><td><code>chooseIconTemplate / fileLabelTemplate / uploadIconTemplate / cancelIconTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom icons and choose label.</td></tr>
                            <tr><td><code>onSelect</code></td><td><code>output&lt;CzFileUploadSelectEvent&gt;</code></td><td><code>—</code></td><td>Emitted when files are selected (<code>files</code>, <code>currentFiles</code>, <code>originalEvent</code>).</td></tr>
                            <tr><td><code>onRemove / onRemoveUploadedFile</code></td><td><code>output&lt;CzFileRemoveEvent&gt;</code></td><td><code>—</code></td><td>Emitted when a pending / uploaded file is removed.</td></tr>
                            <tr><td><code>onClear</code></td><td><code>output&lt;void&gt;</code></td><td><code>—</code></td><td>Emitted when the pending files are cleared.</td></tr>
                            <tr><td><code>onUpload / onProgress / onError</code></td><td><code>output</code></td><td><code>—</code></td><td>Default upload lifecycle events.</td></tr>
                            <tr><td><code>uploadHandler</code></td><td><code>output&lt;CzFileUploadHandlerEvent&gt;</code></td><td><code>—</code></td><td>Custom upload implementation.</td></tr>
                            <tr><td><code>onImageError</code></td><td><code>output&lt;Event&gt;</code></td><td><code>—</code></td><td>Emitted when a thumbnail fails to load.</td></tr>
                            <tr><td><code>choose()</code></td><td><code>method</code></td><td><code>—</code></td><td>Opens the file dialog.</td></tr>
                            <tr><td><code>upload()</code></td><td><code>method</code></td><td><code>—</code></td><td>Uploads the selected files.</td></tr>
                            <tr><td><code>clear()</code></td><td><code>method</code></td><td><code>—</code></td><td>Clears the pending files list.</td></tr>
                            <tr><td><code>remove(event, index) / removeUploadedFile(index)</code></td><td><code>method</code></td><td><code>—</code></td><td>Removes a single pending / uploaded file.</td></tr>
                            <tr><td><code>markUploaded(files?)</code></td><td><code>method</code></td><td><code>—</code></td><td>Moves pending files to the uploaded list (helper for custom uploads).</td></tr>
                            <tr><td><code>objectUrl(file) / formatSize(bytes)</code></td><td><code>method</code></td><td><code>—</code></td><td>Thumbnail object URL and size formatting helpers.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class FileUploadDocPage {
    private readonly lang = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => FILE_UPLOAD_DOC_I18N[this.lang.currentLang()] || FILE_UPLOAD_DOC_I18N.es);

    readonly CloudUploadIcon = LucideCloudUpload;
    readonly UploadIcon = LucideUpload;
    readonly PlusIcon = LucidePlus;
    readonly XIcon = LucideX;
    readonly FileIcon = LucideFile;
    readonly TagIcon = LucideTag;

    readonly uploading = signal(false);
    readonly imageSrc = signal<string | null>(null);
    readonly inputLabel = signal('Choose file');

    readonly advancedFu = viewChild<CzFileUploadComponent>('advancedFu');
    readonly basicFu = viewChild<CzFileUploadComponent>('basicFu');
    readonly autoFu = viewChild<CzFileUploadComponent>('autoFu');
    readonly dropzoneFu = viewChild<CzFileUploadComponent>('dropzoneFu');
    readonly imageFu = viewChild<CzFileUploadComponent>('imageFu');
    readonly previewFu = viewChild<CzFileUploadComponent>('previewFu');

    simulateUpload(event: CzFileUploadHandlerEvent, ref: CzFileUploadComponent | undefined, mark: boolean): void {
        this.uploading.set(true);

        setTimeout(() => {
            this.uploading.set(false);

            if (mark) {
                ref?.markUploaded(event.files);
            }

            this.toast.success(this.t().uploaded);
        }, 1200);
    }

    onCustomUpload(event: CzFileUploadHandlerEvent): void {
        const file = event.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            if (typeof loadEvent.target?.result === 'string') {
                this.imageSrc.set(loadEvent.target.result);
            }
        };
        reader.readAsDataURL(file);
    }

    uploadLabelFor(count: number): string {
        return count === 1 ? this.t().uploadOne : this.t().uploadNFiles.replace('{0}', String(count));
    }

    updateInputLabel(event: { currentFiles: File[] }): void {
        const files = event.currentFiles ?? [];
        if (files.length) {
            this.inputLabel.set(files.map(file => file.name).join(', '));
        }
    }

    importCode: Code = {
        typescript: `import { CzFileUploadComponent } from 'codezium-ui';`,
    };

    advancedCode: Code = {
        html: `<cz-file-upload
    [multiple]="true"
    accept="image/*"
    [maxFileSize]="1000000"
    [customUpload]="true"
    (uploadHandler)="onUpload($event)"
/>`,
        typescript: `// Default upload: set url + name and the component sends the files via XHR
// <cz-file-upload url="https://api.example.com/upload" name="files" (onUpload)="done()" />

onUpload(event: CzFileUploadHandlerEvent): void {
    const formData = new FormData();
    for (const file of event.files) formData.append('files', file);
    this.http.post('/api/upload', formData).subscribe(...);
}`,
    };

    basicCode: Code = {
        html: `<cz-file-upload #fu mode="basic" chooseLabel="Choose" [multiple]="true" accept="image/*"
    [maxFileSize]="1000000" (uploadHandler)="onUpload($event)" [customUpload]="true" />

<cz-button label="Upload" severity="secondary" (onClick)="fu.upload()" />`,
    };

    autoCode: Code = {
        html: `<cz-file-upload mode="basic" chooseLabel="Browse" accept="image/*" [maxFileSize]="1000000"
    [auto]="true" [customUpload]="true" (uploadHandler)="onUpload($event)" />`,
    };

    customUploadCode: Code = {
        html: `<cz-file-upload mode="basic" chooseLabel="Browse" [customUpload]="true" [auto]="true"
    (uploadHandler)="onFileSelect($event)" />

@if (imageSrc()) {
    <img [src]="imageSrc()" alt="preview" />
}`,
        typescript: `onFileSelect(event: CzFileUploadHandlerEvent): void {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => (this.imageSrc = e.target?.result as string);
    reader.readAsDataURL(file);
}`,
    };

    dropzoneCode: Code = {
        html: `<cz-file-upload #fu [multiple]="true" [customUpload]="true" [showUploadButton]="false"
    [showCancelButton]="false" (uploadHandler)="onUpload($event)">

    <ng-template #content let-files let-removeFileCallback="removeFileCallback" let-messages="messages">
        @for (msg of messages; track $index) {
            <cz-message [severity]="msg.severity" [text]="msg.summary" />
        }
        @for (file of files; track file.name; let i = $index) {
            <div class="file-row">
                {{ file.name }}
                <button (click)="removeFileCallback($event, i)">remove</button>
            </div>
        }
        <cz-button label="Upload" (onClick)="fu.upload()" />
        <cz-button label="Clear all" severity="danger" (onClick)="fu.clear()" />
    </ng-template>

    <ng-template #empty>
        <div (click)="fu.choose()">Drop files here or click to browse</div>
    </ng-template>
</cz-file-upload>`,
    };

    imagePreviewCode: Code = {
        html: `<cz-file-upload #fu [multiple]="true" accept="image/*" [customUpload]="true">

    <ng-template #header let-files let-chooseCallback="chooseCallback" let-uploadCallback="uploadCallback">
        <cz-button label="Add Images" (onClick)="chooseCallback()" />
        @if (files?.length > 0) {
            <cz-button label="Upload All" (onClick)="uploadCallback()" />
        }
    </ng-template>

    <ng-template #content let-files let-removeFileCallback="removeFileCallback">
        @for (file of files; track file.name; let i = $index) {
            <div class="thumb">
                <img [src]="fu.objectUrl(file)" [alt]="file.name" />
                <button (click)="removeFileCallback($event, i)">remove</button>
            </div>
        }
    </ng-template>
</cz-file-upload>`,
    };

    inputGroupCode: Code = {
        html: `<cz-input-group>
    <cz-input-group-addon>
        <cz-file-upload mode="basic" accept="image/*" [chooseLabel]="label()"
            (onSelect)="updateLabel($event)" />
    </cz-input-group-addon>
</cz-input-group>`,
        typescript: `updateLabel(event: CzFileUploadSelectEvent): void {
    const files = event.currentFiles ?? [];
    if (files.length) this.label.set(files.map(f => f.name).join(', '));
}`,
    };

    previewCode: Code = {
        html: `<cz-file-upload #fu [multiple]="true" [customUpload]="true"
    [showUploadButton]="false" [showCancelButton]="false" (uploadHandler)="onUpload($event)">

    <ng-template #content let-files let-uploadedFiles="uploadedFiles"
        let-removeFileCallback="removeFileCallback"
        let-removeUploadedFileCallback="removeUploadedFileCallback">
        <div (click)="fu.choose()">Drop files or click to browse</div>

        @for (file of uploadedFiles; track file.name; let i = $index) {
            <div>{{ file.name }} — Completed
                <button (click)="removeUploadedFileCallback(i)">remove</button>
            </div>
        }
        @for (file of files; track file.name; let i = $index) {
            <div>{{ file.name }} — Pending
                <button (click)="removeFileCallback($event, i)">remove</button>
            </div>
        }

        @if (files?.length > 0) {
            <cz-button [label]="'Upload ' + files.length + ' file(s)'" (onClick)="fu.upload()" />
        }
    </ng-template>
</cz-file-upload>`,
    };
}
